import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, TrendingUp, X, BarChart2, PieChart } from 'lucide-react';
import styles from './Relatorios.module.css';

export default function Relatorios() {
  const { projects, boardsData } = useApp();
  const [selectedProject, setSelectedProject] = useState(null);

  const getProjectStats = (projectId) => {
    let aFazer = 0;
    let emProgresso = 0;
    let concluido = 0;
    const projectSprints = boardsData[projectId] || {};

    const sprintData = Object.entries(projectSprints).map(([id, board]) => {
      const c = board["concluido"]?.tarefas.length || 0;
      const p = board["em-progresso"]?.tarefas.length || 0;
      const f = board["a-fazer"]?.tarefas.length || 0;
      return { id, total: c + p + f, concluido: c };
    });

    Object.values(projectSprints).forEach(board => {
      aFazer += board["a-fazer"]?.tarefas.length || 0;
      emProgresso += board["em-progresso"]?.tarefas.length || 0;
      concluido += board["concluido"]?.tarefas.length || 0;
    });

    const total = aFazer + emProgresso + concluido;
    const entregaReal = concluido + (emProgresso * 0.25);
    const progressoPonderado = total === 0 ? 0 : Math.round((entregaReal / total) * 100);

    return { aFazer, emProgresso, concluido, total, progressoPonderado, sprintData };
  };

  return (
    <div className={styles.page}>
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className={styles.title}>Relatórios de Performance</h1>
          <p className={styles.subtitle}>Análise detalhada de produtividade por projeto</p>
        </div>
        <button className={styles.exportBtn}><Download size={18} /> Exportar PDF</button>
      </header>

      {/* Grid forçado via inline style para garantir funcionamento */}
      <div className={styles.reportGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {projects.map(p => {
          const stats = getProjectStats(p.id);
          return (
            <div key={p.id} className={styles.projectCard}>
              <div className={styles.cardHeader} style={{ borderLeft: `4px solid ${p.color || '#378ADD'}`, display: 'flex', justifyContent: 'space-between' }}>
                <div className={styles.projectInfo}>
                  <h2 className={styles.projectName}>{p.name}</h2>
                  <span className={styles.badge}>Ativo</span>
                </div>
                <div className={styles.mainScore}>
                  <span className={styles.scoreValue}>{stats.progressoPonderado}%</span>
                  <span className={styles.scoreLabel}>EFICIÊNCIA</span>
                </div>
              </div>

              <div className={styles.statsRow} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center' }}>
                <div className={styles.statItem}><span className={styles.statVal}>{stats.total}</span><span className={styles.statLab}>TAREFAS</span></div>
                <div className={styles.statItem}><span className={styles.statVal} style={{ color: '#1D9E75' }}>{stats.concluido}</span><span className={styles.statLab}>FIM</span></div>
                <div className={styles.statItem}><span className={styles.statVal} style={{ color: '#378ADD' }}>{stats.emProgresso}</span><span className={styles.statLab}>IN PROG</span></div>
                <div className={styles.statItem}><span className={styles.statVal} style={{ color: '#888780' }}>{stats.aFazer}</span><span className={styles.statLab}>TODO</span></div>
              </div>

              <div className={styles.progressFooter}>
                <div className={styles.progressInfo} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Progresso Ponderado (Peso 0.25)</span>
                  <button className={styles.detailsBtn} onClick={() => setSelectedProject({ ...p, stats })}>
                    <TrendingUp size={18} />
                  </button>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${stats.progressoPonderado}%`, background: p.color || '#378ADD' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedProject && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <header className={styles.modalHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ color: selectedProject.color }}>Análise: {selectedProject.name}</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedProject(null)}><X /></button>
            </header>
            <div className={styles.modalBody} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.modalChartCard}>
                <h3><BarChart2 size={16} /> Entrega por Sprint</h3>
                <div className={styles.miniChart} style={{ display: 'flex', alignItems: 'flex-end', height: '100px', justifyContent: 'space-around' }}>
                  {selectedProject.stats.sprintData.map(s => (
                    <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '12px', height: '60px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${(s.concluido / s.total) * 100 || 0}%`, background: selectedProject.color, borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '10px', marginTop: '4px' }}>S{s.id}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.modalChartCard}>
                <h3><PieChart size={16} /> Detalhes</h3>
                <div style={{ fontSize: '12px' }}>
                  <p>Concluído: <strong>{selectedProject.stats.concluido}</strong></p>
                  <p>Em Progresso: <strong>{selectedProject.stats.emProgresso}</strong></p>
                  <p>Pendente: <strong>{selectedProject.stats.aFazer}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}