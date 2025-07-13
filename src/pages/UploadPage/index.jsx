import React, { useEffect } from 'react'
import { supabase } from '../../api/supabaseCLient'
import { useSupabaseUpload } from '../../hooks/useSupabaseUpload'

export function UploadPage() {
  const {
    file,
    fileName,
    uploading,
    error,
    uploadedFileRecord,
    dispatch,
    uploadFileAndNotifyN8n,
  } = useSupabaseUpload()
  const user = supabase.auth.getUser() // Obter o usuário logado

  const handleFileChange = (e) => {
    dispatch({ type: 'SELECT_FILE', payload: e.target.files[0] })
  }

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser() // Garante que temos o user mais atualizado
    if (!file) {
      dispatch({
        type: 'UPLOAD_FAIL',
        payload: 'Por favor, selecione um arquivo para upload.',
      })
      return
    }
    if (!user) {
      dispatch({
        type: 'UPLOAD_FAIL',
        payload: 'Usuário não logado. Faça login novamente.',
      })
      return
    }

    const result = await uploadFileAndNotifyN8n(file, user.id)

    if (result) {
      console.log('Upload e notificação do n8n concluídos com sucesso!', result)
      // Opcional: exibir uma mensagem de sucesso ou redirecionar
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)', // Considerando espaço para um header/navbar futuro
        backgroundColor: '#f0f2f5',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '450px',
          textAlign: 'center',
        }}
      >
        <h1>Anexar Documento Contábil</h1>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          Envie imagens ou PDFs para o processamento da IA.
        </p>

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          style={{
            marginBottom: '20px',
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />

        {fileName && (
          <p style={{ marginBottom: '10px' }}>
            Arquivo selecionado: <strong>{fileName}</strong>
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading || !file}
          style={{
            padding: '12px 25px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: uploading || !file ? '#ccc' : '#28a745',
            color: '#fff',
            fontSize: '18px',
            cursor: uploading || !file ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          {uploading ? 'Enviando e Processando...' : 'Enviar para IA'}
        </button>

        {uploading && (
          <p style={{ marginTop: '15px', color: '#007bff' }}>
            Processamento em andamento...
          </p>
        )}
        {error && (
          <p style={{ color: 'red', marginTop: '15px' }}>Erro: {error}</p>
        )}
        {uploadedFileRecord && (
          <p style={{ color: 'green', marginTop: '15px' }}>
            Arquivo "{uploadedFileRecord.file_name}" enviado! A IA está
            trabalhando.
          </p>
        )}
      </div>
    </div>
  )
}
