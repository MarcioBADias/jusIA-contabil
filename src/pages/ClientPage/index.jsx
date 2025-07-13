import React from 'react'
import { useClientsData } from '../../hooks/useClientsData'
import { ClientCard } from '../../components/ClientCard'

export function ClientsPage() {
  const { clients, loading, error } = useClientsData()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <p>Carregando clientes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>Erro ao carregar clientes: {error}</p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '20px auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Meus Clientes
      </h1>

      {clients.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555' }}>
          Nenhum cliente cadastrado ainda. Faça upload de documentos para
          processar!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  )
}
