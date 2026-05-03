import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, Target, Briefcase, ListChecks, TrendingUp } from "lucide-react";
import styles from "./Dashboard.module.css";

// ── COMPONENTE DE KPI COM SUPORTE A ÍCONE NAS BADGES ────────────────
function KpiCard({ label, target, sufixo = "", delta, tipo, clean = false, icon: Icon }) {
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
        <div className={clean
          ? `${styles.kpiDeltaText} ${tipo === "up" ? styles.upText : styles.downText}`
          : `${styles.kpiDelta} ${tipo === "up" ? styles.up : styles.down}`
        }>
          {Icon && <Icon size={12} style={{ marginRight: '4px' }} />}
          {delta}
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTES AUXILIARES (DONUT E BARRA) ─────────────────────────
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

// ── PÁGINA PRINCIPAL DO DASHBOARD ──────────────────────────────────
export default function Dashboard() {
  const { projects, boardsData } = useApp();

  // Processamento de dados (Peso 0.25 para "Em progresso")
  const stats = projects.map(proj => {
    let progressoPonderado = 0;
    let totalTarefas = 0;
    const projectSprints = boardsData[proj.id] || {};

    Object.values(projectSprints).forEach(board => {
      const c = board["concluido"]?.tarefas.length || 0;
      const p = board["em-progresso"]?.tarefas.length || 0;
      const f = board["a-fazer"]?.tarefas.length || 0;
      progressoPonderado += c + (p * 0.25);
      totalTarefas += (c + p + f);
    });

    const pctFinal = totalTarefas === 0 ? 0 : Math.round((progressoPonderado / totalTarefas) * 100);

    return {
      id: proj.id,
      nome: proj.name,
      cor: proj.color || "#378ADD",
      pct: pctFinal,
      total: totalTarefas,
      progressoPonderado
    };
  });

  // KPI Cálculos
  const totalTasksGlobal = stats.reduce((acc, curr) => acc + curr.total, 0);
  const totalProgressoGlobal = stats.reduce((acc, curr) => acc + curr.progressoPonderado, 0);
  const taxaEntrega = totalTasksGlobal === 0 ? 0 : Math.round((totalProgressoGlobal / totalTasksGlobal) * 100);

  // NOVA LÓGICA: Projetos com 100% de progresso
  const projetosFinalizadosCount = stats.filter(s => s.pct === 100 && s.total > 0).length;

  const statusCounts = { "Concluído": 0, "Em progresso": 0, "A fazer": 0 };
  Object.values(boardsData).forEach(proj => {
    Object.values(proj).forEach(sprint => {
      statusCounts["Concluído"] += sprint["concluido"]?.tarefas.length || 0;
      statusCounts["Em progresso"] += sprint["em-progresso"]?.tarefas.length || 0;
      statusCounts["A fazer"] += sprint["a-fazer"]?.tarefas.length || 0;
    });
  });

  const statusDataReal = [
    { label: "Concluído", val: statusCounts["Concluído"], cor: "#1D9E75" },
    { label: "Em progresso", val: statusCounts["Em progresso"], cor: "#378ADD" },
    { label: "A fazer", val: statusCounts["A fazer"], cor: "#B4B2A9" },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Painel de Controle</h1>
        <p className={styles.subtitle}>Acompanhamento em tempo real da performance ágil</p>
      </header>

      <section className={styles.statsGrid}>
        {/* 1. PROJETOS */}
        <KpiCard
          label="PROJETOS"
          target={projects.length}
          delta="Ativos"
          tipo="up"
          icon={Briefcase}
        />

        {/* 2. TAREFAS */}
        <KpiCard
          label="TAREFAS"
          target={totalTasksGlobal}
          delta="Total"
          tipo="up"
          icon={ListChecks}
        />

        {/* 3. ENTREGAS (Renomeado e com badge "Finalizadas") */}
        <KpiCard
          label="ENTREGAS"
          target={Math.floor(totalProgressoGlobal)}
          delta="Finalizadas"
          tipo="up"
          icon={Target}
        />

        {/* 4. EFICIÊNCIA */}
        <KpiCard
          label="EFICIÊNCIA"
          target={taxaEntrega}
          sufixo="%"
          delta="Geral"
          tipo="up"
          icon={TrendingUp}
        />
      </section>

      <div className={styles.chartsGrid}>
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Progresso dos Projetos</h3>
          <div className={styles.progressSection}>
            {stats.length > 0 ? (
              stats.map((p) => <BarraProgresso key={p.id} {...p} nome={p.nome} />)
            ) : (
              <p className={styles.emptyText}>Sem dados para exibir.</p>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Distribuição de Status</h3>
          <DonutChart data={statusDataReal} />
        </section>
      </div>
    </div>
  );
}