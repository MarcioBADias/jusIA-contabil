import { useReducer, useCallback } from 'react'
import { authReducer, initialAuthState } from '../reducers/authReducer'
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
      return { data, error: null }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: error.message })
      return { data: null, error }
    }
  }, [])

  // Nova função para cadastro
  const signUp = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' }) // Reutilizamos o estado de "loading"
    try {
      // O Supabase automaticamente loga o usuário após o cadastro bem-sucedido
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.user })
      return { data, error: null }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: error.message })
      return { data: null, error }
    }
  }, [])

  const signOut = useCallback(async () => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      dispatch({ type: 'LOGOUT' })
      return { success: true, error: null }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: error.message })
      return { success: false, error }
    }
  }, [])

  return { ...state, signIn, signUp, signOut } // Adiciona signUp ao retorno do hook
}
