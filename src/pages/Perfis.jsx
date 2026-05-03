import React, { useState } from 'react';
import { Mail, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

export default function Perfis() {
    // Puxamos a lista global (allUsers) e a função de deletar do Contexto
    const { isAdmin, allUsers, deleteUser } = useApp();

    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({ nome: '', cargo: '', email: '' });

    function handleEditClick(user) {
        if (!isAdmin) return;
        setEditingUser(user);
        // Ajuste: usamos 'role' ou 'cargo' dependendo de como o dado foi salvo no registro
        setForm({
            nome: user.nome,
            cargo: user.role || user.cargo || 'Membro',
            email: user.email || `${user.user}@agilepro.com`
        });
        setOpen(true);
    }

    function handleSubmit(e) {
        e.preventDefault();
        // Nota: Para salvar edições permanentemente em allUsers, 
        // você precisaria de uma função 'updateUser' no AppContext.
        // Por enquanto, o foco é a visualização e exclusão.
        setOpen(false);
    }

    function handleDeleteUser() {
        if (!isAdmin || !editingUser) return;

        const confirmar = window.confirm(`Tem certeza que deseja remover ${editingUser.nome} da equipe?`);

        if (confirmar) {
            // Chamamos a função global que remove do localStorage
            deleteUser(editingUser.id);
            setOpen(false);
        }
    }

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a18', margin: 0 }}>Perfis da Equipe</h1>
                <p style={{ color: '#888780', marginTop: '5px' }}>
                    {isAdmin ? "Gerencie os membros e permissões do workspace." : "Visualize os membros ativos da equipe."}
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
            }}>
                {/* MAPEANDO A LISTA DINÂMICA DO CONTEXTO (allUsers) */}
                {allUsers.map((u) => (
                    <div
                        key={u.id}
                        onClick={() => handleEditClick(u)}
                        style={{
                            background: 'white', borderRadius: '16px', padding: '1.5rem',
                            border: '1px solid #f0f0ee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            textAlign: 'center', cursor: isAdmin ? 'pointer' : 'default',
                            position: 'relative', transition: 'transform 0.2s'
                        }}
                    >
                        {isAdmin && (
                            <div style={{ position: 'absolute', top: '15px', right: '15px', color: '#b4b2a9' }}>
                                <Edit2 size={14} />
                            </div>
                        )}

                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: u.cor?.fundo || '#CEDBF6',
                            color: u.cor?.texto || '#185FA5',
                            fontSize: '24px', fontWeight: '800',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                        }}>
                            {u.id}
                        </div>

                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{u.nome}</h3>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#378ADD', fontWeight: '600' }}>
                            {u.role || u.cargo || 'Membro'}
                        </p>

                        <div style={{ borderTop: '1px solid #f0f0ee', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888780', justifyContent: 'center' }}>
                                <Mail size={14} /> {u.email || `${u.user}@agilepro.com`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title="Gerenciar Usuário">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Nome Completo</label>
                        <input
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                            value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Cargo / Função</label>
                        <input
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                            value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>E-mail</label>
                        <input
                            type="email"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                        <button
                            type="button"
                            onClick={handleDeleteUser}
                            style={{
                                background: '#fee2e2', color: '#dc2626', border: 'none',
                                padding: '10px', borderRadius: '8px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600'
                            }}
                        >
                            <Trash2 size={16} /> Excluir Membro
                        </button>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                            <button type="submit" style={{ background: '#1a1a18', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                                Salvar
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}