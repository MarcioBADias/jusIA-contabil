import { useEffect, useReducer, useCallback } from 'react'
import { initialClientsState, clientsReducer } from '../reducers/clientsReducer' // Importação nomeada
import { supabase } from '../api/supabaseCLient'

export function useClientsData() {
  const [state, dispatch] = useReducer(clientsReducer, initialClientsState)

  const fetchClients = useCallback(async () => {
    dispatch({ type: 'FETCH_CLIENTS_START' })
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      dispatch({ type: 'FETCH_CLIENTS_SUCCESS', payload: data || [] })
    } catch (error) {
      console.error('Erro ao buscar clientes:', error.message)
      dispatch({ type: 'FETCH_CLIENTS_FAIL', payload: error.message })
    }
  }, [])

  useEffect(() => {
    fetchClients()

    const channel = supabase
      .channel('public:clients') // Nome do canal, geralmente 'public:nome_da_tabela'
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients' },
        (payload) => {
          console.log('Mudança no banco de dados:', payload)
          // Dependendo do evento, você pode atualizar o estado de forma mais granular
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_CLIENT', payload: payload.new })
          } else if (payload.eventType === 'UPDATE') {
            dispatch({ type: 'UPDATE_CLIENT', payload: payload.new })
          } else if (payload.eventType === 'DELETE') {
            dispatch({ type: 'REMOVE_CLIENT', payload: payload.old.id })
          }
        },
      )
      .subscribe() // Não esqueça de se inscrever!

    // Cleanup: Desinscreve ao desmontar o componente
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchClients]) // fetchClients está no array de dependências para o useCallback funcionar corretamente

  return { ...state, fetchClients } // Retorna o estado e a função para re-fetch (se necessário)
}
