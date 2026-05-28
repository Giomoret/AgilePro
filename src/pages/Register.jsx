import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Contact, ArrowLeft, AlertCircle, Loader } from 'lucide-react';

const API_URL = 'http://localhost:3001';

export default function Register() {
    const [form, setForm] = useState({ nome: '', email: '', pass: '', role: 'Dev' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { registerUser } = useApp();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: form.nome,
                    email: form.email,
                    senha: form.pass,
                    cargo: form.role === 'Scrum Master' || form.role === 'Product Owner' ? 'admin' : 'membro',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.erro || 'Erro ao realizar cadastro.');
                return;
            }

            alert('Cadastro realizado com sucesso! Você já pode fazer login.');
            navigate('/login');

        } catch (err) {
            setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#f0f2f5'
        }}>
            <form onSubmit={handleRegister} style={{
                background: 'white', padding: '2.5rem', borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: '#1a1a18', margin: 0, fontWeight: '800' }}>AgilePro</h2>
                    <p style={{ color: '#888780', fontSize: '14px', marginTop: '5px' }}>
                        Crie sua conta para acessar o workspace
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
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#444' }}>
                        Nome Completo
                    </label>
                    <div style={{ position: 'relative' }}>
                        <Contact size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
                        <input
                            type="text"
                            placeholder="Como quer ser chamado?"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none', boxSizing: 'border-box' }}
                            value={form.nome}
                            onChange={e => setForm({ ...form, nome: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#444' }}>
                        Email
                    </label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none', boxSizing: 'border-box' }}
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#444' }}>
                        Senha
                    </label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
                        <input
                            type="password"
                            placeholder="Crie uma senha forte"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none', boxSizing: 'border-box' }}
                            value={form.pass}
                            onChange={e => setForm({ ...form, pass: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#444' }}>
                        Cargo
                    </label>
                    <select
                        style={{ width: '100%', padding: '12px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none', background: 'white', boxSizing: 'border-box' }}
                        value={form.role}
                        onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                        <option value="Dev">Dev</option>
                        <option value="Scrum Master">Scrum Master</option>
                        <option value="Product Owner">Product Owner</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%', padding: '14px',
                        background: loading ? '#555' : '#1a1a18',
                        color: 'white', border: 'none', borderRadius: '10px',
                        fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s', marginBottom: '1.2rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    {loading ? <><Loader size={18} /> Cadastrando...</> : 'Finalizar Cadastro'}
                </button>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/login" style={{
                        color: '#888780', textDecoration: 'none', fontSize: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
                    }}>
                        <ArrowLeft size={16} /> Voltar para o Login
                    </Link>
                </div>
            </form>
        </div>
    );
}