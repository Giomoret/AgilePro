import { useState, useEffect } from "react";
import { Plus, Trash2, FolderKanban, Loader } from "lucide-react";
import { useApp } from '../context/AppContext';
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, DragOverlay, useDroppable
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./Sprints.module.css";

const prioridadeCor = {
  alta: { fundo: "#FCEBEB", texto: "#A32D2D" },
  media: { fundo: "#FAEEDA", texto: "#854F0B" },
  baixa: { fundo: "#EAF3DE", texto: "#3B6D11" },
};

const getInitialBoard = () => ({
  "a-fazer": { id: "a-fazer", titulo: "A fazer", cor: "#888780", tarefas: [] },
  "em-progresso": { id: "em-progresso", titulo: "Em progresso", cor: "#378ADD", tarefas: [] },
  "concluido": { id: "concluido", titulo: "Concluído", cor: "#1D9E75", tarefas: [] },
});

function TarefaCard({ tarefa, colunaId, onEdit, isAdmin, allUsers }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tarefa.id, disabled: !isAdmin });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition, opacity: isDragging ? 0.35 : 1,
    cursor: isAdmin ? 'grab' : 'pointer'
  };

  const prio = prioridadeCor[tarefa.prioridade] || prioridadeCor.media;

  return (
    <div ref={setNodeRef} style={style} className={styles.tarefaCard}
      {...attributes} {...(isAdmin ? listeners : {})}
      onClick={() => onEdit(tarefa, colunaId)}
    >
      <p className={styles.tarefaTitulo}>{tarefa.titulo}</p>
      {tarefa.data && (
        <span className={styles.tarefaData}>📅 {new Date(tarefa.data).toLocaleDateString('pt-BR')}</span>
      )}
      <div className={styles.tarefaRodape}>
        <span className={styles.badge} style={{ background: prio.fundo, color: prio.texto }}>
          {tarefa.prioridade}
        </span>
        <div className={styles.avatarsGroup}>
          {tarefa.responsaveis?.map((respId) => {
            const user = allUsers.find(u => String(u.id) === String(respId));
            return (
              <span key={respId} className={styles.avatar}
                style={{ background: user?.cor?.fundo || '#f1efe8', color: user?.cor?.texto || '#444' }}
                title={user?.nome || respId}
              >
                {user?.nome?.substring(0, 2).toUpperCase() || respId}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Coluna({ coluna, onEditTarefa, isAdmin, allUsers }) {
  const { setNodeRef } = useDroppable({ id: coluna.id });
  const ids = coluna.tarefas.map(t => t.id);

  return (
    <div className={styles.coluna}>
      <div className={styles.colunaHeader}>
        <span className={styles.colunaIndicador} style={{ background: coluna.cor }} />
        <h3 className={styles.colunaTitulo}>{coluna.titulo}</h3>
        <span className={styles.colunaContador}>{coluna.tarefas.length}</span>
      </div>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className={styles.colunaBody}>
          {coluna.tarefas.map(t => (
            <TarefaCard key={t.id} tarefa={t} colunaId={coluna.id}
              onEdit={onEditTarefa} isAdmin={isAdmin} allUsers={allUsers} />
          ))}
          {coluna.tarefas.length === 0 && <div className={styles.vazio}>Nenhuma tarefa</div>}
        </div>
      </SortableContext>
    </div>
  );
}

function CardFantasma({ tarefa }) {
  if (!tarefa) return null;
  const prio = prioridadeCor[tarefa.prioridade] || prioridadeCor.media;
  return (
    <div className={`${styles.tarefaCard} ${styles.fantasma}`}>
      <p className={styles.tarefaTitulo}>{tarefa.titulo}</p>
      <div className={styles.tarefaRodape}>
        <span className={styles.badge} style={{ background: prio.fundo, color: prio.texto }}>
          {tarefa.prioridade}
        </span>
      </div>
    </div>
  );
}

export default function Sprints() {
  const { projects, boardsData, setBoardsData, fetchTarefas, addTarefa, updateTarefa, deleteTarefa, syncBoardWithApi, isAdmin, allUsers } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSprint, setSelectedSprint] = useState("1");
  const [tarefaAtiva, setTarefaAtiva] = useState(null);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [loadingSalvar, setLoadingSalvar] = useState(false);

  const ordem = ["a-fazer", "em-progresso", "concluido"];
  const sprintsDisponiveis = ["1", "2", "3", "4"];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (projects?.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id.toString());
    }
  }, [projects, selectedProjectId]);

  // Busca tarefas do backend quando troca projeto ou sprint
  useEffect(() => {
    if (selectedProjectId && selectedSprint) {
      fetchTarefas(selectedProjectId, selectedSprint);
    }
  }, [selectedProjectId, selectedSprint]);

  if (!projects || projects.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <FolderKanban size={48} color="#b4b2a9" />
          <h2>Nenhum projeto encontrado</h2>
          <p>Crie um Projeto para gerenciar Sprints.</p>
        </div>
      </div>
    );
  }

  const currentBoard = boardsData[selectedProjectId]?.[selectedSprint] || getInitialBoard();

  function updateCurrentBoard(updater) {
    setBoardsData(prev => {
      const projBoards = prev[selectedProjectId] || {};
      const curr = projBoards[selectedSprint] || getInitialBoard();
      const updated = typeof updater === "function" ? updater(curr) : updater;
      return { ...prev, [selectedProjectId]: { ...projBoards, [selectedSprint]: updated } };
    });
  }

  function encontrarColuna(idEnviado, board) {
    if (board[idEnviado]) return board[idEnviado];
    return Object.values(board).find(col => col.tarefas.some(t => t.id === idEnviado));
  }

  function onDragStart({ active }) {
    if (!isAdmin) return;
    const col = encontrarColuna(active.id, currentBoard);
    setTarefaAtiva(col?.tarefas.find(t => t.id === active.id) || null);
  }

  function onDragOver({ active, over }) {
    if (!over || !isAdmin) return;
    updateCurrentBoard(prevBoard => {
      const origemCol = encontrarColuna(active.id, prevBoard);
      const destinoCol = encontrarColuna(over.id, prevBoard);
      if (!origemCol || !destinoCol || origemCol.id === destinoCol.id) return prevBoard;

      const activeItems = origemCol.tarefas;
      const overItems = destinoCol.tarefas;
      const activeIndex = activeItems.findIndex(t => t.id === active.id);
      const overIndex = overItems.findIndex(t => t.id === over.id);
      const newIndex = over.id === destinoCol.id ? overItems.length : (overIndex >= 0 ? overIndex : overItems.length);

      return {
        ...prevBoard,
        [origemCol.id]: { ...origemCol, tarefas: activeItems.filter(t => t.id !== active.id) },
        [destinoCol.id]: { ...destinoCol, tarefas: [...overItems.slice(0, newIndex), activeItems[activeIndex], ...overItems.slice(newIndex)] }
      };
    });
  }

  async function onDragEnd({ active, over }) {
    setTarefaAtiva(null);
    if (!over || !isAdmin) return;

    let finalBoard;
    updateCurrentBoard(prevBoard => {
      const col = encontrarColuna(active.id, prevBoard);
      if (!col) return prevBoard;
      const activeIndex = col.tarefas.findIndex(t => t.id === active.id);
      const overIndex = col.tarefas.findIndex(t => t.id === over.id);
      let result = prevBoard;
      if (activeIndex !== overIndex && overIndex !== -1) {
        result = { ...prevBoard, [col.id]: { ...col, tarefas: arrayMove(col.tarefas, activeIndex, overIndex) } };
      }
      finalBoard = result;
      return result;
    });

    // Sincroniza status com o backend após drag
    if (finalBoard) {
      await syncBoardWithApi(selectedProjectId, selectedSprint, finalBoard);
    }
  }

  function abrirNovaTarefa() {
    if (!isAdmin) return;
    setTarefaEditando({
      id: `new-${Date.now()}`, titulo: "", data: "",
      status: "a-fazer", prioridade: "media", responsaveis: [], notas: "", isNew: true
    });
  }

  function abrirEdicao(tarefa, colunaId) {
    setTarefaEditando({ ...tarefa, status: colunaId, responsaveis: tarefa.responsaveis || [], notas: tarefa.notas || "", isNew: false });
  }

  function alternarResponsavel(respId) {
    if (!isAdmin) return;
    const id = String(respId);
    setTarefaEditando(prev => ({
      ...prev,
      responsaveis: prev.responsaveis.includes(id)
        ? prev.responsaveis.filter(r => r !== id)
        : [...prev.responsaveis, id]
    }));
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    if (!isAdmin || !tarefaEditando.titulo.trim()) return;
    setLoadingSalvar(true);

    try {
      if (tarefaEditando.isNew) {
        await addTarefa(tarefaEditando, selectedProjectId, selectedSprint);
      } else {
        await updateTarefa(tarefaEditando, selectedProjectId, selectedSprint);
      }
      setTarefaEditando(null);
    } catch (err) {
      alert('Erro ao salvar tarefa: ' + err.message);
    } finally {
      setLoadingSalvar(false);
    }
  }

  async function deletarTarefa() {
    if (!isAdmin) return;
    setLoadingSalvar(true);
    try {
      await deleteTarefa(tarefaEditando.id, selectedProjectId, selectedSprint);
      setTarefaEditando(null);
    } catch (err) {
      alert('Erro ao deletar tarefa: ' + err.message);
    } finally {
      setLoadingSalvar(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.topControls}>
        <div className={styles.projectSelector}>
          <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className={styles.selectProject}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className={styles.sprintTabs}>
          {sprintsDisponiveis.map(sprintNum => (
            <button key={sprintNum}
              className={`${styles.sprintTab} ${selectedSprint === sprintNum ? styles.sprintTabActive : ''}`}
              onClick={() => setSelectedSprint(sprintNum)}
            >
              Sprint {sprintNum}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.titulo}>Quadro da Sprint</h2>
          <span className={styles.subtitulo}>
            {Object.values(currentBoard).reduce((s, c) => s + c.tarefas.length, 0)} tarefas cadastradas
          </span>
        </div>
        {isAdmin && (
          <button className={styles.addBtn} onClick={abrirNovaTarefa}>
            <Plus size={16} /> Nova Tarefa
          </button>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter}
        onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}
      >
        <div className={styles.board}>
          {ordem.map(id => (
            <Coluna key={id} coluna={currentBoard[id]} onEditTarefa={abrirEdicao} isAdmin={isAdmin} allUsers={allUsers} />
          ))}
        </div>
        <DragOverlay><CardFantasma tarefa={tarefaAtiva} /></DragOverlay>
      </DndContext>

      {tarefaEditando && (
        <div className={styles.modalOverlay} onClick={() => setTarefaEditando(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>
              {isAdmin ? (tarefaEditando.isNew ? "Criar Nova Tarefa" : "Editar Tarefa") : "Detalhes da Tarefa"}
            </h3>
            <form onSubmit={salvarEdicao} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Título:</label>
                <input disabled={!isAdmin} value={tarefaEditando.titulo}
                  onChange={e => setTarefaEditando({ ...tarefaEditando, titulo: e.target.value })} required />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Data limite:</label>
                  <input disabled={!isAdmin} type="date" value={tarefaEditando.data || ""}
                    onChange={e => setTarefaEditando({ ...tarefaEditando, data: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label>Status:</label>
                  <select disabled={!isAdmin} value={tarefaEditando.status}
                    onChange={e => setTarefaEditando({ ...tarefaEditando, status: e.target.value })}>
                    <option value="a-fazer">A fazer</option>
                    <option value="em-progresso">Em progresso</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Prioridade:</label>
                <select disabled={!isAdmin} value={tarefaEditando.prioridade}
                  onChange={e => setTarefaEditando({ ...tarefaEditando, prioridade: e.target.value })}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Responsáveis:</label>
                <div className={styles.assigneesContainer}>
                  {allUsers.map(u => {
                    const id = String(u.id);
                    const isSelected = tarefaEditando.responsaveis.includes(id);
                    return (
                      <button key={id} type="button" disabled={!isAdmin}
                        className={`${styles.assigneeToggle} ${isSelected ? styles.active : ''}`}
                        onClick={() => alternarResponsavel(id)}
                        style={{
                          background: isSelected ? '#378ADD' : 'transparent',
                          color: isSelected ? '#fff' : '#444',
                          border: '1px solid #ddd',
                        }}
                        title={u.nome}
                      >
                        {u.nome?.substring(0, 2).toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Bloco de notas:</label>
                <textarea disabled={!isAdmin} className={styles.textarea}
                  value={tarefaEditando.notas}
                  onChange={e => setTarefaEditando({ ...tarefaEditando, notas: e.target.value })}
                  placeholder={isAdmin ? "Adicione anotações..." : "Sem notas adicionais."} />
              </div>

              <div className={styles.modalActions}>
                {(!tarefaEditando.isNew && isAdmin) ? (
                  <button type="button" className={styles.btnDeletar} onClick={deletarTarefa} disabled={loadingSalvar}>
                    <Trash2 size={15} /> Deletar
                  </button>
                ) : <div />}

                <div className={styles.actionGroup}>
                  <button type="button" className={styles.btnCancelar} onClick={() => setTarefaEditando(null)}>
                    {isAdmin ? "Cancelar" : "Fechar"}
                  </button>
                  {isAdmin && (
                    <button type="submit" className={styles.btnSalvar} disabled={loadingSalvar}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {loadingSalvar ? <><Loader size={14} /> Salvando...</> : (tarefaEditando.isNew ? "Criar Tarefa" : "Salvar")}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
