import React, { useReducer } from 'react'

const clientCardReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_EXPAND':
      return { ...state, expanded: !state.expanded }
    default:
      return state
  }
}

export function ClientCard({ client }) {
  const [state, dispatch] = useReducer(clientCardReducer, { expanded: false })

  const renderExtractedData = (data) => {
    if (!data) return <p>Nenhum dado extraído disponível.</p>

    return (
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(data).map(([key, value]) => (
          <li key={key} style={{ marginBottom: '5px' }}>
            <strong>
              {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:
            </strong>{' '}
            {String(value)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        marginBottom: '15px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={() => dispatch({ type: 'TOGGLE_EXPAND' })}
        style={{
          padding: '15px 20px',
          backgroundColor: '#f9f9f9',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        <span>{client.name || `Cliente ID: ${client.id}`}</span>
        <span>{state.expanded ? '▼' : '►'}</span>
      </div>
      {state.expanded && (
        <div style={{ padding: '15px 20px', borderTop: '1px solid #eee' }}>
          <p>
            <strong>ID do Arquivo:</strong> {client.file_id}
          </p>
          <p>
            <strong>Nome do Arquivo Original:</strong>{' '}
            {client.file_name_original || 'N/A'}
          </p>{' '}
          {/* Adicione essa coluna na sua tabela 'clients' se precisar */}
          <p>
            <strong>Data de Cadastro:</strong>{' '}
            {new Date(client.created_at).toLocaleDateString()}
          </p>
          <h4
            style={{
              marginTop: '15px',
              marginBottom: '10px',
              color: '#007bff',
            }}
          >
            Dados Extraídos pela IA:
          </h4>
          {renderExtractedData(client.extracted_data)}
          {/* Se houver URL do arquivo original no Supabase, você pode linkar aqui */}
          {client.file_url && (
            <p style={{ marginTop: '10px' }}>
              <a
                href={client.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007bff', textDecoration: 'none' }}
              >
                Ver Documento Original
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
