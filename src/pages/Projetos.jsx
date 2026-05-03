import React, { useState } from 'react'
import { Users, Calendar, Plus, Edit2, Trash2, Search, Eye } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'

// Simulação dos usuários disponíveis na equipe
const usuariosDisponiveis = {
  JS: { nome: "João Silva", cor: { fundo: "#CEDBF6", texto: "#185FA5" } },
  AM: { nome: "Ana Maria", cor: { fundo: "#D1F0E5", texto: "#0F6E56" } },
  RB: { nome: "Rafael Costa", cor: { fundo: "#EDE0FB", texto: "#534AB7" } },
  TC: { nome: "Thiago Cruz", cor: { fundo: "#FAE8D0", texto: "#854F0B" } },
};

export default function Projetos() {
  const { projects, addProject, updateProject, deleteProject, isAdmin } = useApp()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    members: [],
    status: 'Ativo'
  })

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  function openNewProjectModal() {
    if (!isAdmin) return // Proteção extra
    setEditingProject(null)
    setForm({ name: '', description: '', members: [], status: 'Ativo' })
    setOpen(true)
  }

  function handleCardClick(project, e) {
    if (e) e.stopPropagation()
    // Independente de ser admin ou não, o modal abre. 
    // Mas o formulário será bloqueado dentro do modal se não for admin.
    setEditingProject(project)
    setForm({
      name: project.name,
      description: project.description || '',
      members: Array.isArray(project.members) ? project.members : [],
      status: project.status || 'Ativo'
    })
    setOpen(true)
  }

  function alternarMembro(membroId) {
    if (!isAdmin) return
    setForm((prev) => {
      const tem = prev.members.includes(membroId);
      return {
        ...prev,
        members: tem
          ? prev.members.filter((m) => m !== membroId)
          : [...prev.members, membroId]
      };
    });
  }

  function handleDeleteProject() {
    if (isAdmin && editingProject && deleteProject) {
      deleteProject(editingProject.id);
      setOpen(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!isAdmin || !form.name.trim()) return

    const dadosProjeto = {
      name: form.name.trim(),
      description: form.description.trim() || 'Projeto ágil',
      members: form.members,
      status: form.status,
      color: editingProject?.color || ['#378ADD', '#1D9E75', '#7C3AED', '#F59E0B'][Math.floor(Math.random() * 4)]
    }

    if (editingProject) {
      updateProject({ ...editingProject, ...dadosProjeto })
    } else {
      addProject(dadosProjeto)
    }
    setOpen(false)
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* CABEÇALHO */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a18', margin: 0 }}>Projetos</h1>
          <p style={{ color: '#888780', marginTop: '5px' }}>Gerencie todos os seus projetos ágeis</p>
        </div>

        {/* BOTÃO NOVO PROJETO: Só visível para Admin/PO */}
        {isAdmin && (
          <button
            onClick={openNewProjectModal}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff',
              border: '1px solid #e0e0de', padding: '10px 16px', borderRadius: '8px',
              fontWeight: '600', cursor: 'pointer'
            }}
          >
            <Plus size={20} /> Novo Projeto
          </button>
        )}
      </header>

      {/* BUSCA */}
      <div style={{ position: 'relative', marginBottom: '2rem', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
        <input
          type="text"
          placeholder="Buscar projetos..."
          style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* GRID DE CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {filtered.map(p => (
          <div
            key={p.id}
            onClick={(e) => handleCardClick(p, e)}
            style={{
              background: '#ffffff', borderRadius: '16px', overflow: 'hidden',
              border: '1px solid #f0f0ee', display: 'flex', flexDirection: 'column',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer'
            }}
          >
            <div style={{
              height: '60px',
              backgroundColor: p.color || '#378ADD',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 1.5rem'
            }}>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </span>
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '6px', borderRadius: '6px', color: 'white' }}>
                {isAdmin ? <Edit2 size={14} /> : <Eye size={14} />}
              </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '11px',
                  background: p.status === 'Concluído' ? '#eaf3de' : '#e3f2fd',
                  color: p.status === 'Concluído' ? '#3b6d11' : '#1976d2',
                  padding: '2px 8px', borderRadius: '4px', fontWeight: '700'
                }}>
                  {p.status || 'Ativo'}
                </span>
              </div>

              <p style={{ fontSize: '14px', color: '#5f5e5a', lineHeight: '1.5', marginBottom: '1.5rem', minHeight: '42px' }}>
                {p.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f0f0ee' }}>
                <div style={{ display: 'flex' }}>
                  {Array.isArray(p.members) && p.members.map((m, i) => (
                    <span key={i} style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: usuariosDisponiveis[m]?.cor.fundo || '#eee',
                      color: usuariosDisponiveis[m]?.cor.texto || '#666',
                      fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid white', marginLeft: i > 0 ? '-8px' : '0'
                    }}>
                      {m}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888780' }}>
                  <Calendar size={12} /> {p.createdAt || 'Maio 2026'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Campos desabilitados se não for admin */}
      <Modal open={open} onClose={() => setOpen(false)} title={isAdmin ? (editingProject ? "Editar Projeto" : "Novo Projeto") : "Detalhes do Projeto"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Nome do Projeto</label>
            <input
              disabled={!isAdmin}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: !isAdmin ? '#f9f9f9' : 'white' }}
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Membros da Equipe</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.keys(usuariosDisponiveis).map(key => (
                <button
                  key={key} type="button"
                  onClick={() => alternarMembro(key)}
                  disabled={!isAdmin}
                  style={{
                    padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', cursor: isAdmin ? 'pointer' : 'default',
                    background: form.members.includes(key) ? '#378ADD' : 'white',
                    color: form.members.includes(key) ? 'white' : '#333',
                    opacity: !isAdmin && !form.members.includes(key) ? 0.5 : 1
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Descrição</label>
            <textarea
              disabled={!isAdmin}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '80px', backgroundColor: !isAdmin ? '#f9f9f9' : 'white' }}
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            {editingProject && isAdmin && (
              <button
                type="button" onClick={handleDeleteProject}
                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            )}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {isAdmin ? "Cancelar" : "Fechar"}
              </button>
              {isAdmin && (
                <button type="submit" style={{ background: '#1a1a18', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                  {editingProject ? "Salvar" : "Criar"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}