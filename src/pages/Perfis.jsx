import React, { useState } from 'react';
import { Mail, Edit2, Trash2, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

export default function Perfis() {
  const { isAdmin, allUsers, updateUser, deleteUser } = useApp();

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ nome: '', cargo: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  function handleEditClick(user) {
    if (!isAdmin) return;
    setEditingUser(user);
    setErro('');
    setForm({
      nome: user.nome,
      cargo: user.role || user.cargo || 'membro',
      email: user.email || '',
    });
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAdmin || !editingUser) return;
    setLoading(true);
    setErro('');

    try {
      await updateUser(editingUser.id, {
        nome: form.nome,
        email: form.email,
        cargo: form.cargo === 'Scrum Master' || form.cargo === 'Product Owner' ? 'admin' : 'membro',
      });
      setOpen(false);
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser() {
    if (!isAdmin || !editingUser) return;
    const confirmar = window.confirm(`Tem certeza que deseja remover ${editingUser.nome} da equipe?`);
    if (!confirmar) return;

    setLoading(true);
    try {
      await deleteUser(editingUser.id);
      setOpen(false);
    } catch (err) {
      setErro(err.message || 'Erro ao deletar usuário.');
    } finally {
      setLoading(false);
    }
  }

  const coresDisponiveis = [
    { fundo: '#CEDBF6', texto: '#185FA5' },
    { fundo: '#D1F0E5', texto: '#0F6E56' },
    { fundo: '#EDE0FB', texto: '#534AB7' },
    { fundo: '#FAE8D0', texto: '#854F0B' },
    { fundo: '#FCE8E8', texto: '#A32D2D' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a18', margin: 0 }}>
          Perfis da Equipe
        </h1>
        <p style={{ color: '#888780', marginTop: '5px' }}>
          {isAdmin
            ? 'Gerencie os membros e permissões do workspace.'
            : 'Visualize os membros ativos da equipe.'}
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {allUsers.map((u, index) => {
          const cor = coresDisponiveis[index % coresDisponiveis.length];
          const iniciais = u.nome?.substring(0, 2).toUpperCase() || '??';

          return (
            <div
              key={u.id}
              onClick={() => handleEditClick(u)}
              style={{
                background: 'white', borderRadius: '16px', padding: '1.5rem',
                border: '1px solid #f0f0ee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                textAlign: 'center', cursor: isAdmin ? 'pointer' : 'default',
                position: 'relative', transition: 'transform 0.2s',
              }}
            >
              {isAdmin && (
                <div style={{ position: 'absolute', top: '15px', right: '15px', color: '#b4b2a9' }}>
                  <Edit2 size={14} />
                </div>
              )}

              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: cor.fundo, color: cor.texto,
                fontSize: '22px', fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                {iniciais}
              </div>

              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{u.nome}</h3>
              <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#378ADD', fontWeight: '600' }}>
                {u.role || u.cargo || 'Membro'}
              </p>

              <div style={{ borderTop: '1px solid #f0f0ee', paddingTop: '1rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '12px', color: '#888780', justifyContent: 'center',
                }}>
                  <Mail size={14} /> {u.email}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Gerenciar Usuário">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {erro && (
            <div style={{
              background: '#fee2e2', color: '#dc2626', padding: '10px',
              borderRadius: '8px', fontSize: '13px',
            }}>
              {erro}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
              Nome Completo
            </label>
            <input
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
              Cargo / Função
            </label>
            <select
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', boxSizing: 'border-box' }}
              value={form.cargo}
              onChange={e => setForm({ ...form, cargo: e.target.value })}
            >
              <option value="membro">Dev / Membro</option>
              <option value="Scrum Master">Scrum Master</option>
              <option value="Product Owner">Product Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
              E-mail
            </label>
            <input
              type="email"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
            <button
              type="button"
              onClick={handleDeleteUser}
              disabled={loading}
              style={{
                background: '#fee2e2', color: '#dc2626', border: 'none',
                padding: '10px', borderRadius: '8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600',
              }}
            >
              <Trash2 size={16} /> Excluir
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#555' : '#1a1a18', color: 'white',
                  border: 'none', padding: '10px 20px', borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {loading ? <><Loader size={14} /> Salvando...</> : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
