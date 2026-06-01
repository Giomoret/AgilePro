import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Download, TrendingUp, X, BarChart2, PieChart } from 'lucide-react';
import styles from './Relatorios.module.css';

const API_URL = 'http://localhost:3001';

// ─── Burndown Chart ────────────────────────────
function BurndownChart({ sprintData, cor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || sprintData.length === 0) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, right: 20, bottom: 30, left: 35 };
    const innerW = W - pad.left - pad.right;
    const innerH = H - pad.top - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    const maxTotal = Math.max(...sprintData.map(s => s.total), 1);
    const points = sprintData.map((s, i) => ({
      x: pad.left + (i / Math.max(sprintData.length - 1, 1)) * innerW,
      y: pad.top + ((maxTotal - s.concluido) / maxTotal) * innerH,
      ideal: pad.top + ((maxTotal - (maxTotal * (i / Math.max(sprintData.length - 1, 1)))) / maxTotal) * innerH,
    }));

    // Linha ideal (tracejada)
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.ideal) : ctx.lineTo(p.x, p.ideal));
    ctx.stroke();

    // Linha real
    ctx.setLineDash([]);
    ctx.strokeStyle = cor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Pontos
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = cor;
      ctx.fill();
    });

    // Labels eixo X
    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    sprintData.forEach((s, i) => {
      const x = pad.left + (i / Math.max(sprintData.length - 1, 1)) * innerW;
      ctx.fillText(`S${s.id}`, x, H - 8);
    });
  }, [sprintData, cor]);

  return <canvas ref={canvasRef} width={300} height={150} style={{ width: '100%' }} />;
}

export default function Relatorios() {
  const { projects, token } = useApp();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projetoStats, setProjetoStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!token || projects.length === 0) return;
    setLoading(true);

    const stats = {};

    for (const proj of projects) {
      let aFazer = 0, emProgresso = 0, concluido = 0;
      const sprintData = [];

      for (const sprint of ['1', '2', '3', '4']) {
        const res = await fetch(
          `${API_URL}/tarefas?projeto_id=${proj.id}&sprint=${sprint}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) continue;
        const tarefas = await res.json();

        let c = 0, p = 0, f = 0;
        tarefas.forEach(t => {
          if (t.status === 'concluido') c++;
          else if (t.status === 'em-progresso') p++;
          else f++;
        });

        if (c + p + f > 0) {
          sprintData.push({ id: sprint, total: c + p + f, concluido: c, emProgresso: p, aFazer: f });
        }

        aFazer += f; emProgresso += p; concluido += c;
      }

      const total = aFazer + emProgresso + concluido;
      const entregaReal = concluido + emProgresso * 0.25;
      const progressoPonderado = total === 0 ? 0 : Math.round((entregaReal / total) * 100);

      stats[proj.id] = { aFazer, emProgresso, concluido, total, progressoPonderado, sprintData };
    }

    setProjetoStats(stats);
    setLoading(false);
  }, [token, projects]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ─── Exportar CSV ──────────────────────────
  function exportarCSV() {
    const linhas = [['Projeto', 'Total', 'Concluído', 'Em Progresso', 'A Fazer', 'Eficiência (%)']];

    projects.forEach(p => {
      const s = projetoStats[p.id];
      if (s) linhas.push([p.name, s.total, s.concluido, s.emProgresso, s.aFazer, s.progressoPonderado]);
    });

    // Usa ponto e vírgula como separador (padrão Excel Brasil)
    // e adiciona BOM para encoding correto
    const csv = '\uFEFF' + linhas.map(l => l.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_agilepro_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className={styles.title}>Relatórios de Performance</h1>
          <p className={styles.subtitle}>Análise detalhada de produtividade por projeto</p>
        </div>
        <button className={styles.exportBtn} onClick={exportarCSV}>
          <Download size={18} /> Exportar CSV
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888780' }}>Carregando dados...</div>
      ) : (
        <div className={styles.reportGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {projects.map(p => {
            const stats = projetoStats[p.id] || { aFazer: 0, emProgresso: 0, concluido: 0, total: 0, progressoPonderado: 0, sprintData: [] };
            return (
              <div key={p.id} className={styles.projectCard}>
                <div className={styles.cardHeader} style={{ borderLeft: `4px solid ${p.color || '#378ADD'}`, display: 'flex', justifyContent: 'space-between' }}>
                  <div className={styles.projectInfo}>
                    <h2 className={styles.projectName}>{p.name}</h2>
                    <span className={styles.badge}>{p.status || 'Ativo'}</span>
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
                    <span>Progresso Ponderado</span>
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
      )}

      {/* MODAL COM BURNDOWN */}
      {selectedProject && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <header className={styles.modalHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: selectedProject.color, margin: 0 }}>Análise: {selectedProject.name}</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedProject(null)}><X /></button>
            </header>

            <div className={styles.modalBody} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Burndown Chart */}
              <div className={styles.modalChartCard}>
                <h3><BarChart2 size={16} /> Burndown por Sprint</h3>
                {selectedProject.stats.sprintData.length > 0 ? (
                  <BurndownChart sprintData={selectedProject.stats.sprintData} cor={selectedProject.color || '#378ADD'} />
                ) : (
                  <p style={{ color: '#888780', fontSize: '13px' }}>Sem dados de sprint.</p>
                )}
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '11px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-block', width: '20px', height: '2px', background: '#ddd', borderTop: '2px dashed #ddd' }} /> Ideal
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-block', width: '20px', height: '2px', background: selectedProject.color }} /> Real
                  </span>
                </div>
              </div>

              {/* Detalhes */}
              <div className={styles.modalChartCard}>
                <h3><PieChart size={16} /> Detalhes</h3>
                <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#eaf3de', borderRadius: '8px' }}>
                    <span>Concluído</span>
                    <strong style={{ color: '#1D9E75' }}>{selectedProject.stats.concluido}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#e3f2fd', borderRadius: '8px' }}>
                    <span>Em Progresso</span>
                    <strong style={{ color: '#378ADD' }}>{selectedProject.stats.emProgresso}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f1f0ee', borderRadius: '8px' }}>
                    <span>A Fazer</span>
                    <strong style={{ color: '#888780' }}>{selectedProject.stats.aFazer}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#1a1a18', borderRadius: '8px' }}>
                    <span style={{ color: 'white' }}>Eficiência</span>
                    <strong style={{ color: 'white' }}>{selectedProject.stats.progressoPonderado}%</strong>
                  </div>
                </div>

                {/* Exportar CSV do projeto */}
                <button
                  onClick={() => {
                    const linhas = [['Sprint', 'Total', 'Concluído', 'Em Progresso', 'A Fazer']];
                    selectedProject.stats.sprintData.forEach(s =>
                      linhas.push([`Sprint ${s.id}`, s.total, s.concluido, s.emProgresso, s.aFazer])
                    );
                    const csv = linhas.map(l => l.join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedProject.name}_sprints.csv`;
                    a.click();
                  }}
                  style={{
                    marginTop: '12px', width: '100%', padding: '8px',
                    background: 'none', border: '1px solid #e0e0de',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}
                >
                  <Download size={13} /> Exportar CSV deste projeto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}