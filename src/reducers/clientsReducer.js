export const initialClientsState = {
  clients: [],
  loading: true,
  error: null,
}

export function clientsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_CLIENTS_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_CLIENTS_SUCCESS':
      return { ...state, loading: false, clients: action.payload, error: null }
    case 'FETCH_CLIENTS_FAIL':
      return { ...state, loading: false, clients: [], error: action.payload }
    case 'ADD_CLIENT': // Para futuras atualizações em tempo real (realtime)
      return { ...state, clients: [...state.clients, action.payload] }
    case 'UPDATE_CLIENT': // Para futuras atualizações em tempo real
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === action.payload.id ? action.payload : client,
        ),
      }
    case 'REMOVE_CLIENT': // Para futuras atualizações em tempo real
      return {
        ...state,
        clients: state.clients.filter((client) => client.id !== action.payload),
      }
    default:
      return state
  }
}
