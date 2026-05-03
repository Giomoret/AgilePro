import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, UserPlus } from 'lucide-react';

export default function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Importamos allUsers e login do contexto atualizado
    const { allUsers, login } = useApp();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Validação estrita: busca o usuário exato na lista global
        const foundUser = allUsers.find(
            (u) => u.user === user && u.pass === password
        );

        if (foundUser) {
            // Simulação de Token JWT para a sessão
            const mockJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

            // Realiza o login com os dados reais encontrados
            login(foundUser, mockJWT);
            navigate('/dashboard');
        } else {
            // Barra qualquer tentativa que não esteja na lista allUsers
            setError('Usuário não cadastrado ou senha incorreta.');
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#f0f2f5'
        }}>
            <form onSubmit={handleLogin} style={{
                background: 'white', padding: '2.5rem', borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: '#1a1a18', margin: 0, fontWeight: '800' }}>AgilePro</h2>
                    <p style={{ color: '#888780', fontSize: '14px', marginTop: '5px' }}>
                        Entre com suas credenciais de acesso
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2', color: '#dc2626', padding: '12px',
                        borderRadius: '10px', marginBottom: '1.5rem', display: 'flex',
                        alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500'
                    }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#444' }}>Usuário</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
                        <input
                            type="text"
                            placeholder="admin, po ou seu usuário"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none', transition: 'border-color 0.2s' }}
                            value={user} onChange={e => setUser(e.target.value)} required
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#444' }}>Senha</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
                        <input
                            type="password"
                            placeholder="Sua senha"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none' }}
                            value={password} onChange={e => setPassword(e.target.value)} required
                        />
                    </div>
                </div>

                <button type="submit" style={{
                    width: '100%', padding: '14px', background: '#1a1a18', color: 'white',
                    border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer',
                    transition: 'all 0.2s', marginBottom: '1rem'
                }}>
                    Entrar no Sistema
                </button>

                <div style={{ textAlign: 'center', fontSize: '14px', color: '#555' }}>
                    Ainda não tem conta? <br />
                    <Link to="/register" style={{
                        color: '#378ADD',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '8px'
                    }}>
                        <UserPlus size={16} /> Cadastre-se agora
                    </Link>
                </div>
            </form>
        </div>
    );
}