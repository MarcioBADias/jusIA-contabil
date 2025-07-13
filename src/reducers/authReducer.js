export const initialAuthState = {
  user: null,
  loading: false,
  error: null,
}

export function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: null }
    case 'LOGIN_FAIL':
      return { ...state, user: null, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, loading: false, error: null }
    default:
      return state
  }
}
