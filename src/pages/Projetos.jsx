import React, { useState } from 'react'
import { Users, Calendar, Plus, Edit2, Trash2, Search, Eye, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'

export default function Projetos() {
  const { projects, addProject, updateProject, deleteProject, isAdmin, allUsers } = useApp()

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    name: '', description: '', members: [], status: 'Ativo',
    color: '#378ADD',
  })

  const filtered = projects.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  function openNewProjectModal() {
    if (!isAdmin) return
    setEditingProject(null)
    setErro('')
    setForm({ name: '', description: '', members: [], status: 'Ativo', color: '#378ADD' })
    setOpen(true)
  }

  function handleCardClick(project, e) {
    if (e) e.stopPropagation()
    setEditingProject(project)
    setErro('')
    setForm({
      name: project.name,
      description: project.description || '',
      members: Array.isArray(project.members) ? project.members.map(String) : [],
      status: project.status || 'Ativo',
      color: project.color || '#378ADD',
    })
    setOpen(true)
  }

  function alternarMembro(membroId) {
    if (!isAdmin) return
    const id = String(membroId)
    setForm(prev => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter(m => m !== id)
        : [...prev.members, id],
    }))
  }

  async function handleDeleteProject() {
    if (!isAdmin || !editingProject) return
    setLoading(true)
    try {
      await deleteProject(editingProject.id)
      setOpen(false)
    } catch (err) {
      setErro(err.message || 'Erro ao deletar projeto.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isAdmin || !form.name.trim()) return

    setLoading(true)
    setErro('')

    const dadosProjeto = {
      name: form.name.trim(),
      description: form.description.trim() || 'Projeto ágil',
      members: form.members.map(Number),
      status: form.status,
      color: form.color,
    }

    try {
      if (editingProject) {
        await updateProject({ ...editingProject, ...dadosProjeto })
      } else {
        await addProject(dadosProjeto)
      }
      setOpen(false)
    } catch (err) {
      setErro(err.message || 'Erro ao salvar projeto.')
    } finally {
      setLoading(false)
    }
  }

  const cores = ['#378ADD', '#1D9E75', '#7C3AED', '#F59E0B', '#534AB7', '#D85A30']

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a18', margin: 0 }}>Projetos</h1>
          <p style={{ color: '#888780', marginTop: '5px' }}>Gerencie todos os seus projetos ágeis</p>
        </div>
        {isAdmin && (
          <button onClick={openNewProjectModal} style={{
            display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff',
            border: '1px solid #e0e0de', padding: '10px 16px', borderRadius: '8px',
            fontWeight: '600', cursor: 'pointer',
          }}>
            <Plus size={20} /> Novo Projeto
          </button>
        )}
      </header>

      <div style={{ position: 'relative', marginBottom: '2rem', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#b4b2a9' }} />
        <input
          type="text"
          placeholder="Buscar projetos..."
          style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0de', borderRadius: '10px', outline: 'none', boxSizing: 'border-box' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888780' }}>
          {projects.length === 0 ? 'Nenhum projeto criado ainda.' : 'Nenhum projeto encontrado.'}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filtered.map(p => (
          <div
            key={p.id}
            onClick={e => handleCardClick(p, e)}
            style={{
              background: '#ffffff', borderRadius: '16px', overflow: 'hidden',
              border: '1px solid #f0f0ee', display: 'flex', flexDirection: 'column',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer',
            }}
          >
            <div style={{
              height: '60px', backgroundColor: p.color || '#378ADD',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem',
            }}>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.name}
              </span>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '6px', color: 'white' }}>
                {isAdmin ? <Edit2 size={14} /> : <Eye size={14} />}
              </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '11px',
                  background: p.status === 'Concluído' ? '#eaf3de' : '#e3f2fd',
                  color: p.status === 'Concluído' ? '#3b6d11' : '#1976d2',
                  padding: '2px 8px', borderRadius: '4px', fontWeight: '700',
                }}>
                  {p.status || 'Ativo'}
                </span>
              </div>

              <p style={{ fontSize: '14px', color: '#5f5e5a', lineHeight: '1.5', marginBottom: '1.5rem', minHeight: '42px' }}>
                {p.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f0f0ee' }}>
                <div style={{ display: 'flex' }}>
                  {Array.isArray(p.members) && p.members.slice(0, 4).map((mId, i) => {
                    const user = allUsers.find(u => String(u.id) === String(mId))
                    const iniciais = user?.nome?.substring(0, 2).toUpperCase() || '?'
                    return (
                      <span key={i} style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: '#CEDBF6', color: '#185FA5',
                        fontSize: '10px', fontWeight: '700',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid white', marginLeft: i > 0 ? '-8px' : '0',
                      }}>
                        {iniciais}
                      </span>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888780' }}>
                  <Calendar size={12} /> {p.createdAt || 'Maio 2026'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={isAdmin ? (editingProject ? 'Editar Projeto' : 'Novo Projeto') : 'Detalhes do Projeto'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px' }}>

          {erro && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '13px' }}>
              {erro}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Nome do Projeto</label>
            <input
              disabled={!isAdmin}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', backgroundColor: !isAdmin ? '#f9f9f9' : 'white' }}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Cor</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {cores.map(cor => (
                <button
                  key={cor} type="button"
                  onClick={() => isAdmin && setForm(f => ({ ...f, color: cor }))}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%', background: cor,
                    border: form.color === cor ? '3px solid #1a1a18' : '2px solid transparent',
                    cursor: isAdmin ? 'pointer' : 'default',
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Membros da Equipe</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {allUsers.map(u => {
                const id = String(u.id)
                const selecionado = form.members.includes(id)
                return (
                  <button
                    key={id} type="button"
                    onClick={() => alternarMembro(id)}
                    disabled={!isAdmin}
                    title={u.nome}
                    style={{
                      padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd',
                      cursor: isAdmin ? 'pointer' : 'default',
                      background: selecionado ? '#378ADD' : 'white',
                      color: selecionado ? 'white' : '#333',
                      fontSize: '13px', fontWeight: '600',
                    }}
                  >
                    {u.nome?.substring(0, 2).toUpperCase()}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Descrição</label>
            <textarea
              disabled={!isAdmin}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '80px', boxSizing: 'border-box', backgroundColor: !isAdmin ? '#f9f9f9' : 'white' }}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            {editingProject && isAdmin && (
              <button
                type="button" onClick={handleDeleteProject} disabled={loading}
                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            )}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {isAdmin ? 'Cancelar' : 'Fechar'}
              </button>
              {isAdmin && (
                <button
                  type="submit" disabled={loading}
                  style={{
                    background: loading ? '#555' : '#1a1a18', color: 'white',
                    border: 'none', padding: '10px 20px', borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {loading ? <><Loader size={14} /> Salvando...</> : (editingProject ? 'Salvar' : 'Criar')}
                </button>
              )}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
