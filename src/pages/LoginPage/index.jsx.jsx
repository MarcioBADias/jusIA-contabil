import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'

export function LoginPage() {
  const [email, setEmail] = useState('') // Estado local para os campos do formulário
  const [password, setPassword] = useState('') // Estado local para os campos do formulário
  const { user, loading, error, signIn } = useSupabaseAuth() // Use o hook personalizado de auth
  const navigate = useNavigate()

  // Efeito para redirecionar o usuário se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/upload') // Redireciona para a página de upload após o login
    }
  }, [user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault() // Evita o recarregamento da página
    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      // O erro já é tratado e armazenado no estado do hook, mas você pode adicionar feedback visual aqui
      console.error('Erro ao fazer login:', signInError)
      alert(`Erro ao fazer login: ${signInError}`) // Exemplo simples de feedback
    }
    // O redirecionamento é tratado no useEffect
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
        <h1>Login JusIA Contábil</h1>
        <form
          onSubmit={handleLogin}
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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
          Novo por aqui?{' '}
          <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>
            Registre-se
          </a>{' '}
          (funcionalidade futura).
        </p>
      </div>
    </div>
  )
}
