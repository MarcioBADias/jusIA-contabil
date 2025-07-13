import React, { useEffect, useReducer } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'

import { UploadPage } from './pages/UploadPage/index.jsx'
import { supabase } from './api/supabaseCLient'
import { LoginPage } from './pages/LoginPage/index.jsx'
import { ClientsPage } from './pages/ClientPage/index.jsx'

// Reducer para o estado global de autenticação (simplificado para App.jsx)
const authAppReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

const initialAuthAppState = {
  user: null,
  loading: true,
}

const ProtectedRoute = ({ children }) => {
  const [state, dispatch] = useReducer(authAppReducer, initialAuthAppState)
  const navigate = useNavigate()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        dispatch({ type: 'SET_USER', payload: session?.user || null })
      },
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'SET_USER', payload: session?.user || null })
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!state.loading && !state.user) {
      navigate('/login')
    }
  }, [state.loading, state.user, navigate])

  if (state.loading) {
    return <div>Carregando sessão...</div>
  }

  if (!state.user) {
    return null // ou um spinner, até o navigate redirecionar
  }

  return children
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />{' '}
        {/* Redireciona para upload por padrão */}
      </Routes>
    </Router>
  )
}
