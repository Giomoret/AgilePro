import { useEffect, useRef, useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, Target, Briefcase, ListChecks, TrendingUp } from "lucide-react";
import styles from "./Dashboard.module.css";

const API_URL = "http://localhost:3001";

function KpiCard({ label, target, sufixo = "", delta, tipo, icon: Icon }) {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = 16;
    const increment = target / (800 / step);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValor(target);
        clearInterval(timer);
      } else {
        setValor(Math.floor(current));
      }
    }, step);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <div className={styles.valueContainer}>
        <p className={styles.statValue}>{valor}{sufixo}</p>
        <div className={`${styles.kpiDelta} ${tipo === "up" ? styles.up : styles.down}`}>
          {Icon && <Icon size={12} style={{ marginRight: '4px' }} />}
          {delta}
        </div>
      </div>
    </div>
  );
}

function DonutChart({ data }) {
  const canvasRef = useRef(null);
  const total = data.reduce((s, d) => s + d.val, 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 55, cy = 55, r = 42, inner = 26;
    let angle = -Math.PI / 2;
    ctx.clearRect(0, 0, 110, 110);
    if (total === 0) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fillStyle = "#f0f0ee"; ctx.fill();
    } else {
      data.forEach((d) => {
        const slice = (d.val / total) * 2 * Math.PI;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.closePath(); ctx.fillStyle = d.cor; ctx.fill();
        angle += slice;
      });
    }
    ctx.beginPath(); ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff"; ctx.fill();
    ctx.fillStyle = "#2c2c2a"; ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(total, cx, cy);
  }, [data, total]);

  return (
    <div className={styles.donutWrap}>
      <canvas ref={canvasRef} width={110} height={110} />
      <ul className={styles.donutLegend}>
        {data.map((d) => (
          <li key={d.label} className={styles.legendItem}>
            <div className={styles.legendLeft}>
              <span className={styles.legendDot} style={{ background: d.cor }} />
              <span className={styles.legendLabel}>{d.label}</span>
            </div>
            <span className={styles.legendVal}>{d.val}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BarraProgresso({ nome, pct, cor }) {
  const [largura, setLargura] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setLargura(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className={styles.barraRow}>
      <div className={styles.barraInfo}>
        <span className={styles.barraLabel}>{nome}</span>
        <span className={styles.barraPct} style={{ color: cor }}>{pct}%</span>
      </div>
      <div className={styles.barraTrack}>
        <div className={styles.barraFill} style={{ width: `${largura}%`, background: cor }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { projects, token } = useApp();
  const [tarefasStats, setTarefasStats] = useState({
    total: 0,
    concluido: 0,
    emProgresso: 0,
    aFazer: 0,
  });
  const [projetoStats, setProjetoStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!token || projects.length === 0) return;
    setLoading(true);

    try {
      let totalGlobal = 0, concluidoGlobal = 0, emProgressoGlobal = 0, aFazerGlobal = 0;
      const statsProj = [];

      for (const proj of projects) {
        let concluido = 0, emProgresso = 0, aFazer = 0;

        // Busca tarefas de todas as sprints do projeto
        for (const sprint of ['1', '2', '3', '4']) {
          const res = await fetch(
            `${API_URL}/tarefas?projeto_id=${proj.id}&sprint=${sprint}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) continue;
          const tarefas = await res.json();
          tarefas.forEach(t => {
            if (t.status === 'concluido') concluido++;
            else if (t.status === 'em-progresso') emProgresso++;
            else aFazer++;
          });
        }

        const total = concluido + emProgresso + aFazer;
        const progressoPonderado = total === 0 ? 0 : concluido + (emProgresso * 0.25);
        const pct = total === 0 ? 0 : Math.round((progressoPonderado / total) * 100);

        statsProj.push({ id: proj.id, nome: proj.name, cor: proj.color || '#378ADD', pct, total });

        totalGlobal += total;
        concluidoGlobal += concluido;
        emProgressoGlobal += emProgresso;
        aFazerGlobal += aFazer;
      }

      setTarefasStats({ total: totalGlobal, concluido: concluidoGlobal, emProgresso: emProgressoGlobal, aFazer: aFazerGlobal });
      setProjetoStats(statsProj);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [token, projects]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const taxaEntrega = tarefasStats.total === 0 ? 0 :
    Math.round(((tarefasStats.concluido + tarefasStats.emProgresso * 0.25) / tarefasStats.total) * 100);

  const statusData = [
    { label: "Concluído", val: tarefasStats.concluido, cor: "#1D9E75" },
    { label: "Em progresso", val: tarefasStats.emProgresso, cor: "#378ADD" },
    { label: "A fazer", val: tarefasStats.aFazer, cor: "#B4B2A9" },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel de Controle</h1>
        <p className={styles.subtitle}>Acompanhamento em tempo real da performance ágil</p>
      </header>

      <section className={styles.statsGrid}>
        <KpiCard label="PROJETOS" target={projects.length} delta="Ativos" tipo="up" icon={Briefcase} />
        <KpiCard label="TAREFAS" target={tarefasStats.total} delta="Total" tipo="up" icon={ListChecks} />
        <KpiCard label="ENTREGAS" target={tarefasStats.concluido} delta="Finalizadas" tipo="up" icon={Target} />
        <KpiCard label="EFICIÊNCIA" target={taxaEntrega} sufixo="%" delta="Geral" tipo="up" icon={TrendingUp} />
      </section>

      <div className={styles.chartsGrid}>
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Progresso dos Projetos</h3>
          <div className={styles.progressSection}>
            {loading ? (
              <p className={styles.emptyText}>Carregando dados...</p>
            ) : projetoStats.length > 0 ? (
              projetoStats.map(p => <BarraProgresso key={p.id} nome={p.nome} pct={p.pct} cor={p.cor} />)
            ) : (
              <p className={styles.emptyText}>Sem dados para exibir.</p>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Distribuição de Status</h3>
          <DonutChart data={statusData} />
        </section>
      </div>
    </div>
  );
}