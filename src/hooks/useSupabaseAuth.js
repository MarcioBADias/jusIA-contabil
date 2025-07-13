import { useReducer, useCallback } from 'react'
import { authReducer, initialAuthState } from '../reducers/authReducer' // Importação nomeada
import { supabase } from '../api/supabaseCLient'

export function useSupabaseAuth() {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  const signIn = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user })
      return data
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: error.message })
      return { error }
    }
  }, [])

  const signOut = useCallback(async () => {
    dispatch({ type: 'LOGIN_START' }) // Usar START como um "loading" para logout também
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      dispatch({ type: 'LOGOUT' })
      return { success: true }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: error.message }) // Reusar FAIL para erros no logout
      return { error }
    }
  }, [])

  return { ...state, signIn, signOut }
}
