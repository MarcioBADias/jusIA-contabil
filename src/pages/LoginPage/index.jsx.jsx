import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const { user, loading, error, signIn, signUp } = useSupabaseAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/upload')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isRegistering) {
      // Lógica de Cadastro
      const { error: signUpError } = await signUp(email, password)
      if (signUpError) {
        console.error('Erro ao cadastrar:', signUpError.message)
        alert(`Erro ao cadastrar: ${signUpError.message}`)
      } else {
        alert('Cadastro realizado com sucesso! Você já está logado.')
        // O redirecionamento acontece via useEffect
      }
    } else {
      // Lógica de Login
      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        console.error('Erro ao fazer login:', signInError.message)
        alert(`Erro ao fazer login: ${signInError.message}`)
      }
      // O redirecionamento acontece via useEffect
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '350px',
          textAlign: 'center',
        }}
      >
        <h1>{isRegistering ? 'Cadastre-se' : 'Login'} JusIA Contábil</h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px',
            }}
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: '#fff',
              fontSize: '18px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading
              ? isRegistering
                ? 'Cadastrando...'
                : 'Entrando...'
              : isRegistering
                ? 'Cadastrar'
                : 'Entrar'}
          </button>
        </form>
        {error && (
          <p style={{ color: 'red', marginTop: '15px' }}>
            {error.message || error}
          </p>
        )}{' '}
        {/* Certifique-se que 'error' tem 'message' */}
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
          {isRegistering ? (
            <>
              Já tem uma conta?{' '}
              <a
                href="#"
                onClick={() => setIsRegistering(false)}
                style={{ color: '#007bff', textDecoration: 'none' }}
              >
                Faça Login
              </a>
            </>
          ) : (
            <>
              Novo por aqui?{' '}
              <a
                href="#"
                onClick={() => setIsRegistering(true)}
                style={{ color: '#007bff', textDecoration: 'none' }}
              >
                Cadastre-se
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
