import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Contact, ArrowLeft } from 'lucide-react';

export default function Register() {
    const [form, setForm] = useState({ nome: '', user: '', pass: '', role: 'Dev' });
    const { registerUser } = useApp();
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        // Chama a função global para salvar na lista 'allUsers'
        registerUser(form);

        alert('Cadastro realizado com sucesso! Você já pode fazer login.');
        navigate('/login');
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

                {/* ENTRADA: NOME */}
                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#444' }}>
                        Nome Completo
                    </label>
                    <div style={{ position: 'relative' }}>
                        <Contact size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
                        <input
                            type="text"
                            placeholder="Como quer ser chamado?"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none' }}
                            value={form.nome}
                            onChange={e => setForm({ ...form, nome: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* ENTRADA: USUÁRIO */}
                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#444' }}>
                        Usuário
                    </label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
                        <input
                            type="text"
                            placeholder="Seu nome de usuário (login)"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none' }}
                            value={form.user}
                            onChange={e => setForm({ ...form, user: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* ENTRADA: SENHA */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#444' }}>
                        Senha
                    </label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
                        <input
                            type="password"
                            placeholder="Crie uma senha forte"
                            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none' }}
                            value={form.pass}
                            onChange={e => setForm({ ...form, pass: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <button type="submit" style={{
                    width: '100%', padding: '14px', background: '#1a1a18', color: 'white',
                    border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer',
                    transition: 'all 0.2s', marginBottom: '1.2rem'
                }}>
                    Finalizar Cadastro
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