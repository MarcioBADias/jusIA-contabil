// src/hooks/useSupabaseUpload.js - Este código está bom como está.
import { useReducer, useCallback } from 'react'
import { supabase } from '../api/supabaseCLient'
import { initialUploadState, uploadReducer } from '../reducers/uploadReducer'

export function useSupabaseUpload() {
  const [state, dispatch] = useReducer(uploadReducer, initialUploadState)

  const uploadFileAndNotifyN8n = useCallback(async (file, userId) => {
    if (!file || !userId) {
      dispatch({
        type: 'UPLOAD_FAIL',
        payload: 'Arquivo ou ID do usuário ausente.',
      })
      return null
    }

    dispatch({ type: 'SET_UPLOADING', payload: true })
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 }) // Este agora será tratado no reducer

    try {
      const fileExtension = file.name.split('.').pop()
      const filePath = `${userId}/${Date.now()}_${file.name}`

      // --- 1. Upload do arquivo para o Supabase Storage ---
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('document-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error(
          'Erro ao fazer upload para o Supabase Storage:',
          uploadError,
        )
        throw new Error(
          `Erro ao salvar arquivo no storage: ${uploadError.message}`,
        )
      }

      const { data: publicUrlData } = supabase.storage
        .from('document-uploads')
        .getPublicUrl(filePath)

      const fileUrl = publicUrlData.publicUrl

      // --- 2. Salvar a URL e metadados no Supabase Database (tabela 'documents') ---
      const { data: fileRecord, error: dbError } = await supabase
        .from('documents') // Verifique se o nome da tabela é 'documents' ou 'files'
        .insert({
          user_id: userId,
          file_name: file.name,
          file_url: fileUrl,
          status: 'pending',
        })
        .select()
        .single()

      if (dbError) {
        console.error('Erro ao salvar registro do arquivo no DB:', dbError)
        throw new Error(
          `Erro ao salvar registro do arquivo: ${dbError.message}`,
        )
      }

      // --- 3. Enviar a URL e ID do arquivo para o webhook do n8n ---
      const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL

      if (!n8nWebhookUrl || n8nWebhookUrl.trim() === '') {
        throw new Error(
          'URL do Webhook do n8n não configurada no seu arquivo .env (VITE_N8N_WEBHOOK_URL). Por favor, verifique e reinicie o servidor Vite.',
        )
      }

      const webhookPayload = {
        file_url: fileRecord.file_url,
        file_id: fileRecord.id,
        user_id: userId,
        file_name: fileRecord.file_name,
      }

      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro ao notificar n8n:', response.status, errorText)
        throw new Error(
          `Falha ao notificar o sistema de IA (n8n). Status: ${response.status} - ${errorText}`,
        )
      }

      dispatch({ type: 'UPLOAD_SUCCESS', payload: fileRecord })
      return fileRecord
    } catch (error) {
      console.error('Erro completo no processo de upload:', error)
      dispatch({ type: 'UPLOAD_FAIL', payload: error.message }) // Este agora será tratado no reducer
      return null
    }
  }, [])

  return { ...state, dispatch, uploadFileAndNotifyN8n }
}
