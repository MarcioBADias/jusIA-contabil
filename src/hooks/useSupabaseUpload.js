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
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: 0 })

    try {
      const fileExtension = file.name.split('.').pop()
      const filePath = `${userId}/${Date.now()}_${file.name}`

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

      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
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

      const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
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
          `Falha ao notificar o sistema de IA (n8n). Status: ${response.status}`,
        )
      }

      dispatch({ type: 'UPLOAD_SUCCESS', payload: fileRecord })
      return fileRecord
    } catch (error) {
      console.error('Erro completo no processo de upload:', error)
      dispatch({ type: 'UPLOAD_FAIL', payload: error.message })
      return null
    }
  }, [])

  return { ...state, dispatch, uploadFileAndNotifyN8n }
}
