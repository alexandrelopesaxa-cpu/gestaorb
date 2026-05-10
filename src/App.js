/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
import { useState, useEffect, useRef } from "react";

const THEMES = {
  indigo: {
    primary: "#6366f1",
    primaryDark: "#4f46e5",
    secondary: "#8b5cf6",
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },
  emerald: {
    primary: "#10b981",
    primaryDark: "#059669",
    secondary: "#06b6d4",
    gradient: "linear-gradient(135deg,#10b981,#06b6d4)",
  },
  rose: {
    primary: "#f43f5e",
    primaryDark: "#e11d48",
    secondary: "#f97316",
    gradient: "linear-gradient(135deg,#f43f5e,#f97316)",
  },
  violet: {
    primary: "#8b5cf6",
    primaryDark: "#7c3aed",
    secondary: "#ec4899",
    gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)",
  },
  amber: {
    primary: "#f59e0b",
    primaryDark: "#d97706",
    secondary: "#ef4444",
    gradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
  },
  cyan: {
    primary: "#06b6d4",
    primaryDark: "#0284c7",
    secondary: "#6366f1",
    gradient: "linear-gradient(135deg,#06b6d4,#6366f1)",
  },
};

function makeColors(theme, dark) {
  const t = THEMES[theme] || THEMES.indigo;
  return {
    primary: t.primary,
    primaryDark: t.primaryDark,
    secondary: t.secondary,
    success: "#10b981",
    successLight: dark ? "#064e3b" : "#d1fae5",
    successDark: dark ? "#6ee7b7" : "#065f46",
    warning: "#f59e0b",
    warningLight: dark ? "#451a03" : "#fef3c7",
    warningDark: dark ? "#fbbf24" : "#92400e",
    danger: "#ef4444",
    dangerLight: dark ? "#450a0a" : "#fee2e2",
    dangerDark: dark ? "#fca5a5" : "#991b1b",
    info: "#3b82f6",
    infoLight: dark ? "#1e3a5f" : "#dbeafe",
    infoDark: dark ? "#93c5fd" : "#1e40af",
    purple: "#8b5cf6",
    purpleLight: dark ? "#2e1065" : "#ede9fe",
    purpleDark: dark ? "#c4b5fd" : "#5b21b6",
    cyan: "#06b6d4",
    bg: dark ? "#0f172a" : "#f1f5f9",
    card: dark ? "#1e293b" : "#ffffff",
    sidebar: dark ? "#020617" : "#0f172a",
    text: dark ? "#f1f5f9" : "#0f172a",
    muted: dark ? "#94a3b8" : "#64748b",
    border: dark ? "#334155" : "#e2e8f0",
    inputBg: dark ? "#0f172a" : "#f8fafc",
    gradientPrimary: t.gradient,
    gradientSidebar: dark
      ? "linear-gradient(180deg,#020617 0%,#0f0c29 100%)"
      : "linear-gradient(180deg,#0f172a 0%,#1e1b4b 100%)",
  };
}

const G = {
  success: "linear-gradient(135deg,#10b981,#059669)",
  danger: "linear-gradient(135deg,#ef4444,#dc2626)",
  warning: "linear-gradient(135deg,#f59e0b,#d97706)",
  info: "linear-gradient(135deg,#3b82f6,#2563eb)",
  purple: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  cyan: "linear-gradient(135deg,#06b6d4,#0284c7)",
  orange: "linear-gradient(135deg,#f97316,#ea580c)",
};
const shadow = {
  sm: "0 1px 3px rgba(0,0,0,0.06),0 4px 12px rgba(0,0,0,0.04)",
  md: "0 4px 12px rgba(0,0,0,0.06),0 12px 32px rgba(0,0,0,0.08)",
  lg: "0 8px 24px rgba(0,0,0,0.08),0 24px 56px rgba(0,0,0,0.12)",
};

// ── Limit logic: Claro/Box groups allow 6, others 5 ──────────
function getGroupLimit(groupName) {
  if (!groupName) return 5;
  const n = groupName.toLowerCase();
  if (n.includes("claro") || n.includes("box")) return 6;
  return 5;
}

const STYPE = {
  instalacao: {
    label: "Instalação",
    icon: "🔧",
    color: "#6366f1",
    light: "#ede9fe",
  },
  visita: {
    label: "Visita Técnica",
    icon: "🏠",
    color: "#f59e0b",
    light: "#fef3c7",
  },
  montagem: {
    label: "Montagem",
    icon: "🛠️",
    color: "#10b981",
    light: "#d1fae5",
  },
  manutencao: {
    label: "Manutenção",
    icon: "⚙️",
    color: "#3b82f6",
    light: "#dbeafe",
  },
  suporte: { label: "Suporte", icon: "💬", color: "#8b5cf6", light: "#ede9fe" },
};

// ── OS Status ─────────────────────────────────────────────────
const OS_STATUS = {
  agendado: {
    label: "Agendado",
    icon: "📅",
    bg: "#dbeafe",
    c: "#1e40af",
    dot: "#3b82f6",
  },
  manutencao: {
    label: "Em Manutenção",
    icon: "⚙️",
    bg: "#fef3c7",
    c: "#92400e",
    dot: "#f59e0b",
  },
  concluido: {
    label: "Concluído",
    icon: "✅",
    bg: "#d1fae5",
    c: "#065f46",
    dot: "#10b981",
  },
  entregue: {
    label: "Entregue",
    icon: "📦",
    bg: "#ede9fe",
    c: "#5b21b6",
    dot: "#8b5cf6",
  },
};
function OsStatusBadge({ status, C }) {
  const s = OS_STATUS[status] || OS_STATUS.agendado;
  return (
    <span
      style={{
        background: s.bg,
        color: s.c,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span style={{ fontSize: 12 }}>{s.icon}</span>
      {s.label}
    </span>
  );
}

function generateOsPDF(os) {
  const st = OS_STATUS[os.status] || OS_STATUS.agendado;
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>OS #${os.id}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:20px}.doc{background:#fff;max-width:600px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.12)}.header{background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 36px;color:#fff;display:flex;justify-content:space-between;align-items:flex-start}.brand{display:flex;align-items:center;gap:12px}.logo{width:50px;height:50px;background:rgba(255,255,255,.2);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:50px;text-align:center}.brand-name{font-size:20px;font-weight:800}.brand-sub{font-size:11px;opacity:.6;margin-top:2px}.os-num{text-align:right}.os-num .num{font-size:32px;font-weight:900;letter-spacing:-1px}.os-num .sub{font-size:11px;opacity:.5;margin-top:4px}.status-row{background:${st.bg};padding:12px 36px;display:flex;align-items:center;gap:10}.status-dot{width:10px;height:10px;border-radius:50%;background:${st.dot}}.status-text{font-size:13px;font-weight:800;color:${st.c}}.body{padding:28px 36px}.section{margin-bottom:24px}.section-title{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #f1f5f9}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{background:#f8fafc;border-radius:12px;padding:12px 14px}.field-label{font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}.field-value{font-size:13px;font-weight:700;color:#0f172a}.full{grid-column:1/-1}.desc-box{background:#f8fafc;border-radius:12px;padding:16px;border-left:3px solid #6366f1;font-size:13px;color:#334155;line-height:1.7}.obs-box{background:#fffbeb;border-radius:12px;padding:14px;border-left:3px solid #f59e0b;font-size:13px;color:#92400e;line-height:1.7}.footer{padding:18px 36px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#94a3b8}.print-btn{position:fixed;bottom:24px;right:24px;padding:14px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 8px 24px rgba(99,102,241,.45);font-family:inherit}@media print{.print-btn{display:none}body{background:#fff;padding:0}.doc{box-shadow:none;border-radius:0;max-width:100%}@page{margin:1cm}}</style></head>
  <body><div class="doc">
  <div class="header"><div class="brand"><div class="logo">📡</div><div><div class="brand-name">RB Sistema</div><div class="brand-sub">Revendas e Serviços</div></div></div><div class="os-num"><div class="num">OS #${os.id}</div><div class="sub">Ordem de Serviço</div></div></div>
  <div class="status-row"><div class="status-dot"></div><div class="status-text">${st.icon} ${st.label}</div></div>
  <div class="body">
  <div class="section"><div class="section-title">Dados do Cliente</div><div class="grid"><div class="field"><div class="field-label">Nome</div><div class="field-value">${os.clientName}</div></div>${os.phone ? `<div class="field"><div class="field-label">Telefone</div><div class="field-value">${os.phone}</div></div>` : ""}${os.cpf ? `<div class="field"><div class="field-label">CPF</div><div class="field-value">${os.cpf}</div></div>` : ""}</div></div>
  <div class="section"><div class="section-title">Equipamento</div><div class="grid"><div class="field full"><div class="field-label">Aparelho / Equipamento</div><div class="field-value">${os.equipment}</div></div></div><div class="desc-box" style="margin-top:10px">${os.problemDescription}</div></div>
  <div class="section"><div class="section-title">Informações do Serviço</div><div class="grid"><div class="field"><div class="field-label">Data Agendada</div><div class="field-value">${os.scheduledDate ? new Date(os.scheduledDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</div></div><div class="field"><div class="field-label">Valor Estimado</div><div class="field-value" style="color:#059669;font-size:16px">${os.estimatedValue ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(os.estimatedValue) : "A definir"}</div></div>${os.technician ? `<div class="field"><div class="field-label">Técnico</div><div class="field-value">${os.technician}</div></div>` : ""}</div></div>
  ${os.observations ? `<div class="section"><div class="section-title">Observações</div><div class="obs-box">${os.observations}</div></div>` : ""}
  </div>
  <div class="footer"><span>RB Sistema © ${new Date().getFullYear()}</span><span>Emitida em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span></div>
  </div><button class="print-btn" onclick="window.print()">🖨️ Imprimir PDF</button></body></html>`;
  dlFile(
    html,
    `OS_${os.id}_${os.clientName.replace(/\s+/g, "_")}.html`,
    "text/html;charset=utf-8",
  );
}

// ── OS Page ────────────────────────────────────────────────────
function OrdemServicoPage({ services, setServices, C, setPage }) {
  const [orders, setOrdersRaw] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [editOs, setEditOs] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [viewOs, setViewOs] = useState(null);
  // receives a pre-filled OS from Calendar
  const [highlightId, setHighlightId] = useState(null);

  const EMPTY_OS = {
    clientName: "",
    phone: "",
    cpf: "",
    equipment: "",
    problemDescription: "",
    scheduledDate: today(),
    estimatedValue: "",
    technician: "",
    observations: "",
    status: "agendado",
    linkedServiceId: "",
  };
  const [form, setForm] = useState(EMPTY_OS);

  // ── Read pending service passed from Calendar ────────────────
  useEffect(() => {
    if (!loaded) return;
    const svc = window.__pendingOsService;
    const linkedId = window.__pendingOsLinkedId;
    window.__pendingOsService = null;
    window.__pendingOsLinkedId = null;

    if (linkedId) {
      // already has OS — open it
      const existing = orders.find((o) => o.id === linkedId);
      if (existing) setViewOs(existing);
      return;
    }
    if (!svc) return;
    const t = STYPE[svc.type] || STYPE.suporte;
    setForm({
      ...EMPTY_OS,
      clientName: svc.clientName || "",
      phone: svc.phone || "",
      equipment: t.label,
      problemDescription: svc.notes || "",
      scheduledDate: svc.date || today(),
      linkedServiceId: String(svc.id),
      observations: `Gerada a partir do agendamento: ${t.icon} ${t.label} às ${svc.time || ""}${svc.address ? ` — ${svc.address}` : ""}`,
    });
    setEditOs(null);
    setShowForm(true);
  }, [loaded]);

  // storage key
  useEffect(() => {
    (async () => {
      const d = await storeGet("osOrders");
      if (d) {
        setOrdersRaw(d);
        window.__rbOsOrders = JSON.stringify(d);
      }
      setLoaded(true);
    })();
  }, []);
  const setOrders = (v) => {
    const n = typeof v === "function" ? v(orders) : v;
    setOrdersRaw(n);
    storeSet("osOrders", n);
    window.__rbOsOrders = JSON.stringify(n);
    storeSet("osOrders", n);
  };

  const nextId = () =>
    orders.length === 0 ? 1001 : Math.max(...orders.map((o) => o.id)) + 1;

  function saveOs() {
    if (!form.clientName.trim() || !form.equipment.trim())
      return alert("Nome do cliente e equipamento são obrigatórios.");
    const data = {
      ...form,
      estimatedValue: parseFloat(form.estimatedValue) || 0,
    };
    if (editOs) {
      setOrders((p) =>
        p.map((o) => (o.id === editOs.id ? { ...o, ...data } : o)),
      );
    } else {
      const newId = nextId();
      setOrders((p) => [...p, { ...data, id: newId, createdAt: today() }]);
    }
    setShowForm(false);
    setEditOs(null);
    // if came from calendar, navigate back to OS page
    if (setPage) setPage("ordemservico");
  }

  function openEdit(os) {
    setForm({ ...os, estimatedValue: String(os.estimatedValue || "") });
    setEditOs(os);
    setShowForm(true);
  }
  function openNew() {
    setForm(EMPTY_OS);
    setEditOs(null);
    setShowForm(true);
  }
  function del(id) {
    setConfirm({
      msg: "Excluir esta Ordem de Serviço?",
      onOk: () => {
        setOrders((p) => p.filter((o) => o.id !== id));
        setConfirm(null);
      },
    });
  }
  function updateStatus(id, status) {
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  // link with calendar services
  const calServices = services.filter(
    (s) =>
      s.type === "manutencao" ||
      s.type === "suporte" ||
      s.type === "instalacao",
  );

  const filtered = orders
    .filter((o) => {
      const q = search.toLowerCase();
      const match =
        !q ||
        o.clientName?.toLowerCase().includes(q) ||
        o.equipment?.toLowerCase().includes(q) ||
        String(o.id).includes(q) ||
        o.technician?.toLowerCase().includes(q);
      return match && (statusF === "todos" || o.status === statusF);
    })
    .sort((a, b) => b.id - a.id);

  const statCounts = Object.keys(OS_STATUS).reduce((acc, k) => {
    acc[k] = orders.filter((o) => o.status === k).length;
    return acc;
  }, {});
  const totalValue = orders.reduce((s, o) => s + (o.estimatedValue || 0), 0);
  const pendingValue = orders
    .filter((o) => o.status !== "entregue")
    .reduce((s, o) => s + (o.estimatedValue || 0), 0);

  if (!loaded)
    return (
      <div style={{ textAlign: "center", padding: 60, color: C.muted }}>
        Carregando...
      </div>
    );

  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
          C={C}
        />
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="Total de OS"
          value={orders.length}
          icon="📋"
          gradient={C.gradientPrimary}
          C={C}
        />
        <StatCard
          label="Em Manutenção"
          value={statCounts.manutencao}
          icon="⚙️"
          gradient={G.warning}
          C={C}
        />
        <StatCard
          label="Concluídas"
          value={statCounts.concluido}
          icon="✅"
          gradient={G.success}
          C={C}
        />
        <StatCard
          label="Entregues"
          value={statCounts.entregue}
          icon="📦"
          gradient={G.purple}
          C={C}
        />
        <StatCard
          label="Receita Estimada"
          value={fmtMoney(totalValue)}
          icon="💰"
          gradient={G.cyan}
          C={C}
        />
      </div>

      {/* Kanban quick overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {Object.entries(OS_STATUS).map(([k, v]) => {
          const kOrders = orders.filter((o) => o.status === k).slice(0, 3);
          return (
            <Card key={k} C={C} style={{ border: `1.5px solid ${v.dot}22` }}>
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>{v.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                  {v.label}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    background: v.bg,
                    color: v.c,
                    borderRadius: 20,
                    padding: "1px 9px",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {statCounts[k]}
                </span>
              </div>
              <div style={{ padding: "10px 12px", minHeight: 80 }}>
                {kOrders.length === 0 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      textAlign: "center",
                      padding: "12px 0",
                    }}
                  >
                    Vazio
                  </div>
                )}
                {kOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setViewOs(o)}
                    style={{
                      background: C.inputBg,
                      borderRadius: 10,
                      padding: "8px 10px",
                      marginBottom: 6,
                      cursor: "pointer",
                      border: `1px solid ${C.border}`,
                      transition: "all .15s",
                    }}
                    className="rb-card"
                  >
                    <div
                      style={{ fontSize: 11, fontWeight: 800, color: v.dot }}
                    >
                      OS #{o.id}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.text,
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {o.clientName}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: C.muted,
                        marginTop: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {o.equipment}
                    </div>
                  </div>
                ))}
                {orders.filter((o) => o.status === k).length > 3 && (
                  <div
                    style={{
                      fontSize: 10,
                      color: C.muted,
                      textAlign: "center",
                      paddingTop: 4,
                    }}
                  >
                    +{orders.filter((o) => o.status === k).length - 3} mais
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters + Table */}
      <Card C={C}>
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar OS, cliente, equipamento..."
              C={C}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              background: C.inputBg,
              borderRadius: 10,
              padding: 4,
              border: `1px solid ${C.border}`,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setStatusF("todos")}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                background:
                  statusF === "todos" ? C.gradientPrimary : "transparent",
                color: statusF === "todos" ? "#fff" : C.muted,
              }}
            >
              Todos
            </button>
            {Object.entries(OS_STATUS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setStatusF(k)}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  background: statusF === k ? C.gradientPrimary : "transparent",
                  color: statusF === k ? "#fff" : C.muted,
                  whiteSpace: "nowrap",
                }}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>
          <Btn size="sm" onClick={openNew} C={C}>
            + Nova OS
          </Btn>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}
          >
            <thead>
              <tr style={{ background: C.inputBg }}>
                {[
                  "#OS",
                  "Cliente",
                  "Equipamento",
                  "Data Agendada",
                  "Valor Est.",
                  "Técnico",
                  "Status",
                  "Ações",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.muted,
                      borderBottom: `1px solid ${C.border}`,
                      textTransform: "uppercase",
                      letterSpacing: ".04em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon="📋"
                      title="Nenhuma OS encontrada"
                      subtitle="Crie uma nova ordem de serviço para começar."
                      C={C}
                      action={
                        <Btn size="sm" onClick={openNew} C={C}>
                          + Nova OS
                        </Btn>
                      }
                    />
                  </td>
                </tr>
              )}
              {filtered.map((os) => (
                <tr
                  key={os.id}
                  className="rb-row"
                  style={{ borderBottom: `1px solid ${C.border}` }}
                >
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{
                        background: C.gradientPrimary,
                        color: "#fff",
                        borderRadius: 8,
                        padding: "3px 10px",
                        fontSize: 12,
                        fontWeight: 800,
                        display: "inline-block",
                      }}
                    >
                      #{os.id}
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{ fontSize: 14, fontWeight: 700, color: C.text }}
                    >
                      {os.clientName}
                    </div>
                    {os.phone && (
                      <div
                        style={{ fontSize: 11, color: C.muted, marginTop: 1 }}
                      >
                        {os.phone}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: C.text }}
                    >
                      {os.equipment}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.muted,
                        marginTop: 1,
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {os.problemDescription}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: 13,
                      color: C.muted,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {os.scheduledDate
                      ? new Date(
                          os.scheduledDate + "T00:00:00",
                        ).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: 14,
                      fontWeight: 800,
                      color: C.successDark,
                    }}
                  >
                    {os.estimatedValue > 0 ? (
                      fmtMoney(os.estimatedValue)
                    ) : (
                      <span style={{ color: C.muted, fontSize: 12 }}>
                        A definir
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: 13,
                      color: C.muted,
                    }}
                  >
                    {os.technician || "—"}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <OsStatusBadge status={os.status} C={C} />
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {/* Status quick-change */}
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <select
                          value={os.status}
                          onChange={(e) => updateStatus(os.id, e.target.value)}
                          className="rb-input"
                          style={{
                            padding: "5px 8px",
                            border: `1px solid ${C.border}`,
                            borderRadius: 8,
                            fontSize: 11,
                            background: C.inputBg,
                            color: C.text,
                            outline: "none",
                            fontFamily: "inherit",
                            cursor: "pointer",
                          }}
                        >
                          {Object.entries(OS_STATUS).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v.icon} {v.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => setViewOs(os)}
                        className="rb-btn"
                        style={{
                          background: C.infoLight,
                          color: C.infoDark,
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 9px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => generateOsPDF(os)}
                        className="rb-btn"
                        style={{
                          background: C.purpleLight,
                          color: C.purpleDark,
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 9px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        🖨️
                      </button>
                      <button
                        onClick={() => openEdit(os)}
                        className="rb-btn"
                        style={{
                          background: C.warningLight,
                          color: C.warningDark,
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 9px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => del(os.id)}
                        className="rb-btn"
                        style={{
                          background: C.dangerLight,
                          color: C.dangerDark,
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 9px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* OS Form Modal */}
      {showForm && (
        <Modal
          title={
            editOs ? `✏️ Editar OS #${editOs.id}` : "📋 Nova Ordem de Serviço"
          }
          onClose={() => {
            setShowForm(false);
            setEditOs(null);
          }}
          C={C}
          maxWidth={640}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <Field
                label="Nome do Cliente *"
                value={form.clientName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, clientName: e.target.value }))
                }
                C={C}
                placeholder="Nome completo"
              />
            </div>
            <Field
              label="Telefone"
              mask="phone"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              C={C}
              placeholder="(63) 99999-0000"
            />
            <Field
              label="CPF"
              mask="cpf"
              value={form.cpf}
              onChange={(e) => setForm((p) => ({ ...p, cpf: e.target.value }))}
              C={C}
              placeholder="000.000.000-00"
            />
            <div style={{ gridColumn: "1/-1" }}>
              <Field
                label="Aparelho / Equipamento *"
                value={form.equipment}
                onChange={(e) =>
                  setForm((p) => ({ ...p, equipment: e.target.value }))
                }
                C={C}
                placeholder="Ex: TV LG 55', Receptor, Notebook..."
              />
            </div>
            <div style={{ gridColumn: "1/-1", marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                Descrição do Problema *
              </label>
              <textarea
                value={form.problemDescription}
                onChange={(e) =>
                  setForm((p) => ({ ...p, problemDescription: e.target.value }))
                }
                rows={3}
                className="rb-input"
                placeholder="Descreva o defeito ou serviço a ser realizado..."
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  background: C.inputBg,
                  color: C.text,
                }}
              />
            </div>
            <Field
              label="Data Agendada"
              type="date"
              value={form.scheduledDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, scheduledDate: e.target.value }))
              }
              C={C}
            />
            <Field
              label="Valor Estimado (R$)"
              value={form.estimatedValue}
              onChange={(e) =>
                setForm((p) => ({ ...p, estimatedValue: e.target.value }))
              }
              C={C}
              placeholder="0,00"
            />
            <Field
              label="Técnico Responsável"
              value={form.technician}
              onChange={(e) =>
                setForm((p) => ({ ...p, technician: e.target.value }))
              }
              C={C}
              placeholder="Nome do técnico"
            />
            <Dropdown
              label="Status"
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
              options={Object.entries(OS_STATUS).map(([k, v]) => ({
                value: k,
                label: `${v.icon} ${v.label}`,
              }))}
              C={C}
            />
            {/* Link to calendar service */}
            {calServices.length > 0 && (
              <div style={{ gridColumn: "1/-1", marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                  }}
                >
                  Vincular Agendamento (opcional)
                </label>
                <select
                  value={form.linkedServiceId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, linkedServiceId: e.target.value }))
                  }
                  className="rb-input"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 10,
                    fontSize: 13,
                    background: C.inputBg,
                    color: C.text,
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                >
                  <option value="">Sem vínculo</option>
                  {calServices.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.date} — {s.clientName} —{" "}
                      {(STYPE[s.type] || STYPE.suporte).label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ gridColumn: "1/-1", marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                Observações
              </label>
              <textarea
                value={form.observations || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, observations: e.target.value }))
                }
                rows={2}
                className="rb-input"
                placeholder="Observações adicionais..."
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  background: C.inputBg,
                  color: C.text,
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditOs(null);
              }}
              C={C}
            >
              Cancelar
            </Btn>
            <Btn onClick={saveOs} C={C}>
              💾 Salvar OS
            </Btn>
          </div>
        </Modal>
      )}

      {/* OS Detail View */}
      {viewOs && (
        <Modal
          title={`📋 OS #${viewOs.id}`}
          onClose={() => setViewOs(null)}
          C={C}
          maxWidth={580}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <OsStatusBadge status={viewOs.status} C={C} />
            <div style={{ display: "flex", gap: 8 }}>
              <Btn
                size="sm"
                variant="export"
                onClick={() => generateOsPDF(viewOs)}
                C={C}
              >
                🖨️ PDF
              </Btn>
              <Btn
                size="sm"
                onClick={() => {
                  setViewOs(null);
                  openEdit(viewOs);
                }}
                C={C}
              >
                ✏️ Editar
              </Btn>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              ["👤 Cliente", viewOs.clientName],
              ["📱 Telefone", viewOs.phone || "—"],
              ["🪪 CPF", viewOs.cpf || "—"],
              ["🔧 Técnico", viewOs.technician || "—"],
              [
                "📅 Agendado",
                viewOs.scheduledDate
                  ? new Date(
                      viewOs.scheduledDate + "T00:00:00",
                    ).toLocaleDateString("pt-BR")
                  : "—",
              ],
              [
                "💰 Valor Est.",
                viewOs.estimatedValue > 0
                  ? fmtMoney(viewOs.estimatedValue)
                  : "A definir",
              ],
            ].map(([l, v], i) => (
              <div
                key={i}
                style={{
                  background: C.inputBg,
                  borderRadius: 12,
                  padding: "12px 14px",
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    marginBottom: 3,
                  }}
                >
                  {l}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              🖥️ Equipamento
            </div>
            <div
              style={{
                background: C.inputBg,
                borderRadius: 12,
                padding: "12px 14px",
                border: `1px solid ${C.border}`,
                fontWeight: 700,
                color: C.text,
              }}
            >
              {viewOs.equipment}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              🔍 Descrição do Problema
            </div>
            <div
              style={{
                background: C.infoLight,
                borderRadius: 12,
                padding: "14px 16px",
                color: C.infoDark,
                fontSize: 13,
                lineHeight: 1.7,
                borderLeft: `3px solid ${C.info}`,
              }}
            >
              {viewOs.problemDescription}
            </div>
          </div>
          {viewOs.observations && (
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.muted,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                📝 Observações
              </div>
              <div
                style={{
                  background: C.warningLight,
                  borderRadius: 12,
                  padding: "14px 16px",
                  color: C.warningDark,
                  fontSize: 13,
                  lineHeight: 1.7,
                  borderLeft: `3px solid ${C.warning}`,
                }}
              >
                {viewOs.observations}
              </div>
            </div>
          )}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Alterar Status
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(OS_STATUS).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => {
                    setOrders((p) =>
                      p.map((o) =>
                        o.id === viewOs.id ? { ...o, status: k } : o,
                      ),
                    );
                    setViewOs((p) => ({ ...p, status: k }));
                  }}
                  className="rb-btn"
                  style={{
                    padding: "8px 14px",
                    border: `1.5px solid ${viewOs.status === k ? v.dot : "transparent"}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    background: viewOs.status === k ? v.bg : "transparent",
                    color: viewOs.status === k ? v.c : C.muted,
                  }}
                >
                  {v.icon} {v.label}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
const SSTAT = {
  agendado: { bg: "#dbeafe", c: "#1e40af", label: "Agendado" },
  concluido: { bg: "#d1fae5", c: "#065f46", label: "Concluído" },
  cancelado: { bg: "#fee2e2", c: "#991b1b", label: "Cancelado" },
  emandamento: { bg: "#fef3c7", c: "#92400e", label: "Em andamento" },
};
const WD = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const ADMINS = [
  {
    email: "alexandrelopesaxa@gmail.com",
    password: "admin123",
    name: "Alexandre",
  },
  { email: "bonfimpereirab@gmail.com", password: "admin123", name: "Bonfim" },
  { email: "evaldorodrigues@gmail.com", password: "admin123", name: "Evaldo" },
];
const MONTHS = [];
for (let y = 2026; y <= 2027; y++)
  for (let m = 1; m <= 12; m++)
    MONTHS.push(`${y}-${String(m).padStart(2, "0")}`);
const fmtMoney = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v || 0,
  );
const HIDDEN_VAL = "R$ ••••••";
function maskVal(v, hide) {
  return hide ? HIDDEN_VAL : fmtMoney(v);
}
const fmtMonth = (m) => (m ? `${m.split("-")[1]}/${m.split("-")[0]}` : "");
const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const today = () => new Date().toISOString().split("T")[0];
const p2 = (n) => String(n).padStart(2, "0");
const maskCPF = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};
const maskPhone = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d.length <= 10
    ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim()
    : d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
};
const maskDay = (v) => v.replace(/\D/g, "").slice(0, 2);
const padDay = (v) => (v ? String(v).padStart(2, "0") : "");

async function storeGet(k) {
  try {
    const r = await window.storage.get(k, true);
    return r ? JSON.parse(r.value) : null;
  } catch {
    return null;
  }
}
async function storeSet(k, v) {
  try {
    await window.storage.set(k, JSON.stringify(v), true);
  } catch (e) {
    console.error(e);
  }
}

function dlFile(content, name, mime) {
  const b = new Blob([content], { type: mime }),
    u = URL.createObjectURL(b),
    a = document.createElement("a");
  a.style.display = "none";
  a.href = u;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(u);
  }, 300);
}
function toCSV(h, rows) {
  return (
    "\uFEFF" +
    [h, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";"),
      )
      .join("\n")
  );
}

function exportPDF(title, subtitle, headers, rows, summaryItems = []) {
  const summaryHtml = summaryItems.length
    ? `<div class="summary">${summaryItems.map((s) => `<div class="sum-card"><div class="sum-val">${s.value}</div><div class="sum-label">${s.label}</div></div>`).join("")}</div>`
    : "";
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${title}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;background:#fff;padding:32px}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;padding-bottom:14px;border-bottom:2px solid #6366f1}.brand{display:flex;align-items:center;gap:10px}.brand-icon{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;text-align:center;line-height:42px}.brand h1{font-size:18px;font-weight:800;color:#0f172a}.brand p{font-size:11px;color:#64748b;margin-top:2px}.meta{text-align:right;font-size:11px;color:#64748b}.meta strong{display:block;font-size:14px;font-weight:800;color:#0f172a;margin-bottom:3px}.summary{display:flex;gap:12px;margin-bottom:18px;flex-wrap:wrap}.sum-card{flex:1;min-width:120px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center}.sum-val{font-size:18px;font-weight:800;color:#6366f1}.sum-label{font-size:9px;color:#64748b;margin-top:3px;text-transform:uppercase;letter-spacing:.05em;font-weight:600}table{width:100%;border-collapse:collapse;font-size:11.5px}thead tr{background:#6366f1}thead th{padding:10px 11px;text-align:left;color:#fff;font-weight:700;font-size:9.5px;text-transform:uppercase;letter-spacing:.06em}tbody tr:nth-child(even){background:#f8fafc}tbody tr:hover{background:#eef2ff}td{padding:9px 11px;border-bottom:1px solid #e2e8f0;color:#334155;vertical-align:middle}td:first-child{font-weight:600;color:#0f172a}.badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700}.pago{background:#d1fae5;color:#065f46}.pendente{background:#fef3c7;color:#92400e}.atrasado{background:#fee2e2;color:#991b1b}.parcial{background:#dbeafe;color:#1e40af}.footer{margin-top:22px;padding-top:12px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:9px;color:#94a3b8}.print-btn{position:fixed;bottom:24px;right:24px;padding:14px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 8px 24px rgba(99,102,241,.45);font-family:inherit;z-index:999}.print-hint{position:fixed;bottom:80px;right:24px;background:#0f172a;color:#fff;padding:8px 14px;border-radius:10px;font-size:12px;font-family:inherit;opacity:.8}@media print{.print-btn,.print-hint{display:none}@page{margin:1.4cm}body{padding:0}}</style></head><body>
  <div class="header"><div class="brand"><div class="brand-icon">📡</div><div><h1>RB Sistema</h1><p>Gestão Integrada de Clientes</p></div></div><div class="meta"><strong>${title}</strong><span>${subtitle}</span><br/><span>Emitido em ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span></div></div>
  ${summaryHtml}
  <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("")}</tbody></table>
  <div class="footer"><span>RB Sistema © ${new Date().getFullYear()}</span><span>Total: <strong>${rows.length} registro(s)</strong></span></div>
  <div class="print-hint">Pressione Ctrl+P para imprimir / salvar PDF</div>
  <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
  </body></html>`;
  dlFile(
    html,
    `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.html`,
    "text/html;charset=utf-8",
  );
}

function exportOiCsv(cls, m) {
  dlFile(
    toCSV(
      ["Nome", "CAID", "CPF", "Tel", "Venc", "Valor", "Cartão", "Status"],
      cls.map((c) => [
        c.name,
        c.caid,
        c.cpf,
        c.phone,
        `Dia ${c.dueDate}`,
        fmtMoney(c.monthlyValue),
        c.card,
        getPayStatus(c, m) || "pendente",
      ]),
    ),
    `OiTV_${m}.csv`,
    "text/csv;charset=utf-8;",
  );
}
function exportSalesCsv(sales) {
  dlFile(
    toCSV(
      ["Data", "Cliente", "Produto", "Valor", "Pgto"],
      sales.map((s) => [
        s.date,
        s.clientName,
        s.product,
        fmtMoney(s.value),
        s.payment,
      ]),
    ),
    "Vendas.csv",
    "text/csv;charset=utf-8;",
  );
}
function exportFinCsv(oi, sales, m) {
  dlFile(
    toCSV(
      ["Origem", "Nome", "Valor", "Status"],
      [
        ...oi.map((c) => [
          "OI TV",
          c.name,
          fmtMoney(c.monthlyValue),
          getPayStatus(c, m) || "pendente",
        ]),
        ...sales.map((s) => ["RB", s.clientName, fmtMoney(s.value), "pago"]),
      ],
    ),
    `Financeiro_${m}.csv`,
    "text/csv;charset=utf-8;",
  );
}
function exportBackup(oi, gr, rb, pr, sa, sv, de) {
  dlFile(
    JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        oiClients: oi,
        groups: gr,
        rbClients: rb,
        products: pr,
        sales: sa,
        services: sv,
        despesas: de,
      },
      null,
      2,
    ),
    `RBSistema_${new Date().toISOString().slice(0, 10)}.json`,
    "application/json",
  );
}

function generateReceipt(client, month, payObj) {
  const receiptNum = `RB${Date.now().toString().slice(-8)}`;
  const isPago = payObj.status === "pago";
  const isParcial = payObj.status === "parcial";
  const statusLabel = isPago ? "PAGO" : "PARCIAL";
  const statusEmoji = isPago ? "✅" : "🔵";
  const headerGrad = isPago
    ? "linear-gradient(135deg,#10b981,#059669)"
    : "linear-gradient(135deg,#3b82f6,#2563eb)";
  const amountBg = isPago
    ? "linear-gradient(135deg,#f0fdf4,#dcfce7)"
    : "linear-gradient(135deg,#eff6ff,#dbeafe)";
  const amountBorder = isPago ? "#86efac" : "#93c5fd";
  const amountLabelC = isPago ? "#16a34a" : "#1d4ed8";
  const amountValueC = isPago ? "#15803d" : "#1e40af";
  const payDate = payObj.date
    ? new Date(payObj.date + "T00:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
  const emitDate =
    new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) +
    " às " +
    new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const [year, mon] = month.split("-").map(Number);
  const dueFmt = `${String(client.dueDate || 1).padStart(2, "0")}/${String(mon).padStart(2, "0")}/${year}`;
  const remaining =
    payObj.remaining ||
    Math.max(0, (client.monthlyValue || 0) - (payObj.paid || 0));
  const parcialHtml =
    isParcial && remaining > 0
      ? `<div style="margin:18px 0 0;padding:14px 18px;background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1.5px solid #fed7aa;border-radius:14px;display:flex;justify-content:space-between;align-items:center;"><span style="font-size:12px;color:#c2410c;font-weight:700;">⚠️ Saldo Restante</span><span style="font-size:16px;font-weight:900;color:#c2410c;">${fmtMoney(remaining)}</span></div>`
      : "";
  const notesHtml = payObj.notes
    ? `<div style="margin-top:14px;padding:12px 14px;background:#f8fafc;border-radius:12px;border-left:3px solid #6366f1;"><span style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Observação</span><p style="margin:4px 0 0;font-size:13px;color:#475569;font-style:italic;">${payObj.notes}</p></div>`
    : "";
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Comprovante ${receiptNum}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:20px}.receipt{background:#fff;max-width:460px;width:100%;border-radius:22px;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.12)}.header{background:${headerGrad};padding:32px 28px;text-align:center;color:#fff}.logo{width:60px;height:60px;background:rgba(255,255,255,.2);border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 14px;line-height:60px}.brand{font-size:18px;font-weight:800;letter-spacing:-.3px}.brand-sub{font-size:11px;opacity:.65;margin-top:3px}.status-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.22);border:1.5px solid rgba(255,255,255,.35);border-radius:99px;padding:7px 18px;font-size:13px;font-weight:800;margin-top:18px;letter-spacing:.04em}.body{padding:28px 28px 0}.receipt-num{text-align:center;color:#94a3b8;font-size:10.5px;margin-bottom:22px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.amount-box{background:${amountBg};border:2px solid ${amountBorder};border-radius:18px;padding:22px;text-align:center;margin-bottom:22px}.amount-label{font-size:10px;color:${amountLabelC};font-weight:800;text-transform:uppercase;letter-spacing:.08em}.amount-value{font-size:38px;font-weight:900;color:${amountValueC};margin-top:6px;letter-spacing:-1px}.fields{background:#f8fafc;border-radius:14px;padding:6px 18px;margin-bottom:14px}.field{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid #f1f5f9}.field:last-child{border-bottom:none}.field-label{font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.field-value{font-size:13px;color:#0f172a;font-weight:700;text-align:right;max-width:60%}.footer-wrap{padding:20px 28px 0}.footer-msg{text-align:center;padding:14px;background:#f8fafc;border-radius:12px;font-size:11.5px;color:#64748b;line-height:1.7}.print-btn{display:block;width:100%;margin-top:24px;padding:16px;background:${headerGrad};color:#fff;border:none;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;letter-spacing:.02em}@media print{.print-btn{display:none}body{background:#fff;padding:0}.receipt{box-shadow:none;border-radius:0;max-width:100%}@page{margin:.8cm}}</style></head>
  <body><div class="receipt"><div class="header"><div class="logo">📡</div><div class="brand">RB Sistema</div><div class="brand-sub">Comprovante de Pagamento</div><div class="status-badge">${statusEmoji} ${statusLabel}</div></div>
  <div class="body"><div class="receipt-num">Nº ${receiptNum} · Emitido em ${emitDate}</div><div class="amount-box"><div class="amount-label">Valor Pago</div><div class="amount-value">${fmtMoney(payObj.paid || 0)}</div></div>
  <div class="fields"><div class="field"><span class="field-label">Cliente</span><span class="field-value">${client.name}</span></div>${client.cpf ? `<div class="field"><span class="field-label">CPF</span><span class="field-value">${client.cpf}</span></div>` : ""}<div class="field"><span class="field-label">Referência</span><span class="field-value">${fmtMonth(month)}</span></div><div class="field"><span class="field-label">Vencimento</span><span class="field-value">${dueFmt}</span></div><div class="field"><span class="field-label">Data do Pagamento</span><span class="field-value">${payDate}</span></div><div class="field"><span class="field-label">Mensalidade</span><span class="field-value">${fmtMoney(client.monthlyValue || 0)}</span></div></div>
  ${parcialHtml}${notesHtml}</div><div class="footer-wrap"><div class="footer-msg">✅ Comprovante registrado no <strong>RB Sistema</strong>.</div></div>
  <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button></div></body></html>`;
  dlFile(
    html,
    `Comprovante_${client.name.replace(/\s+/g, "_")}_${month}.html`,
    "text/html;charset=utf-8",
  );
}

function getPayStatus(client, month) {
  const p = client.payments?.[month];
  if (p) {
    const st = typeof p === "string" ? p : p.status || "pendente";
    if (st === "pago" || st === "parcial") return st;
  }
  const [year, mon] = month.split("-").map(Number);
  const dueDay = parseInt(client.dueDate) || 1;
  const dueDate = new Date(year, mon - 1, dueDay);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now > dueDate ? "atrasado" : "pendente";
}
function getPayObj(client, month) {
  const p = client.payments?.[month];
  if (!p) return null;
  if (typeof p === "string")
    return {
      status: p,
      paid: p === "pago" ? client.monthlyValue : 0,
      date: "",
      remaining: p === "pago" ? 0 : client.monthlyValue,
    };
  return p;
}
function sendCobranca(c, month) {
  const ph = (c.phone || "").replace(/\D/g, "");
  if (!ph) {
    alert("Telefone não cadastrado!");
    return;
  }
  const msg = encodeURIComponent(
    `Olá, *${c.name}*! 👋\n\nSua mensalidade OI TV de *${fmtMonth(month)}* no valor de *${fmtMoney(c.monthlyValue)}* está em aberto.\n\nPor favor, pague até o dia *${c.dueDate}*.\n\nObrigado! 😊`,
  );
  window.open(`https://wa.me/55${ph}?text=${msg}`, "_blank");
}

// ── PIT DOG AVATAR ─────────────────────────────────────────────
function PitAvatar({ size = 36, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.55,
        ...style,
      }}
    >
      🐱
    </div>
  );
}

// ── PIT CHAT ────────────────────────────────────────────────────
function PitChat({
  oiClients,
  filterMonth,
  C,
  onSendCobranca,
  services,
  setServices,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const chatRef = useRef(null);

  const atrasados = oiClients.filter(
    (c) => getPayStatus(c, filterMonth) === "atrasado",
  );
  const totalDebito = atrasados.reduce((s, c) => s + c.monthlyValue, 0);

  // ── Service alerts ────────────────────────────────────────
  const todayStr = today();
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();
  const svcsToday = services.filter(
    (s) => s.date === todayStr && s.status === "agendado",
  );
  const svcsTomorrow = services.filter(
    (s) => s.date === tomorrowStr && s.status === "agendado",
  );
  const totalAlerts = atrasados.length + svcsToday.length + svcsTomorrow.length;

  const [alertQueue, setAlertQueue] = useState([]);
  const [alertIndex, setAlertIndex] = useState(0);
  const [dismissedCount, setDismissedCount] = useState(0);
  const [alertsSeen, setAlertsSeen] = useState(false);

  // Build a unified queue: {type:"cobranca"|"svcToday"|"svcTomorrow", payload}
  function buildQueue() {
    const q = [];
    atrasados.forEach((c) => q.push({ type: "cobranca", payload: c }));
    svcsToday.forEach((s) => q.push({ type: "svcToday", payload: s }));
    svcsTomorrow.forEach((s) => q.push({ type: "svcTomorrow", payload: s }));
    return q;
  }

  function getAlertMsg(item) {
    const t = STYPE[item.payload.type] || STYPE.suporte;
    if (item.type === "cobranca") {
      const c = item.payload;
      return {
        text: `⚠️ O cliente **${c.name}** está em atraso desde o dia ${c.dueDate} (${fmtMoney(c.monthlyValue)}). Deseja realizar a cobrança agora?`,
        alertClient: c,
      };
    }
    if (item.type === "svcToday") {
      const s = item.payload;
      return {
        text: `☀️ Check-up do dia! O serviço de **${t.label}** para **${s.clientName}** está agendado para **hoje às ${s.time}**.\n\nO serviço já foi realizado?`,
        checkService: s,
        checkType: "today",
      };
    }
    if (item.type === "svcTomorrow") {
      const s = item.payload;
      return {
        text: `📅 Aviso prévio! Você tem um serviço de **${t.label}** para **${s.clientName}** amanhã às **${s.time}**${s.address ? ` em ${s.address}` : ""}.\n\nGostaria de confirmar o agendamento?`,
        checkService: s,
        checkType: "tomorrow",
      };
    }
  }

  useEffect(() => {
    if (open) {
      setAlertsSeen(true);
    }
    if (open && msgs.length === 0) {
      const queue = buildQueue();
      setAlertQueue(queue);
      setAlertIndex(0);
      setTimeout(() => {
        if (queue.length === 0) {
          setMsgs([
            {
              role: "pit",
              text: `Miau! 🐱 Olá! Sou o **BELLO**, seu assistente virtual!\n\n✅ Tudo em ordem — nenhum atraso e nenhum serviço pendente hoje!\n\nDigite *"ajuda"* para ver o que posso fazer por você. 🐾`,
            },
          ]);
        } else {
          const summary = [];
          if (atrasados.length > 0)
            summary.push(`🔴 ${atrasados.length} cliente(s) em atraso`);
          if (svcsToday.length > 0)
            summary.push(`☀️ ${svcsToday.length} serviço(s) para hoje`);
          if (svcsTomorrow.length > 0)
            summary.push(`📅 ${svcsTomorrow.length} serviço(s) para amanhã`);
          const intro = {
            role: "pit",
            text: `Miau! 🐱 Olá! Tenho **${queue.length} alerta(s)** para você:\n\n${summary.join("\n")}\n\nVamos revisar um por um! 👇`,
          };
          const first = getAlertMsg(queue[0]);
          setMsgs([intro, { role: "pit", ...first }]);
        }
      }, 400);
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  function advanceAlertQueue(currentIdx) {
    const queue = alertQueue;
    const next = currentIdx + 1;
    if (next < queue.length) {
      setAlertIndex(next);
      const item = queue[next];
      const msg = getAlertMsg(item);
      setTimeout(() => setMsgs((p) => [...p, { role: "pit", ...msg }]), 500);
    } else {
      setTimeout(
        () =>
          setMsgs((p) => [
            ...p,
            {
              role: "pit",
              text: `✅ Todos os alertas foram revisados! Há mais alguma coisa em que posso ajudar? 🐾`,
            },
          ]),
        400,
      );
    }
  }

  function markServiceDone(svc, idx) {
    setServices((p) =>
      p.map((s) => (s.id === svc.id ? { ...s, status: "concluido" } : s)),
    );
    setMsgs((p) => [...p, { role: "user", text: "Sim, foi realizado" }]);
    setTimeout(() => {
      setMsgs((p) => [
        ...p,
        {
          role: "pit",
          text: `✅ Ótimo! Serviço de **${(STYPE[svc.type] || STYPE.suporte).label}** para **${svc.clientName}** marcado como **Concluído** automaticamente! 🎉`,
        },
      ]);
      advanceAlertQueue(idx);
    }, 600);
  }

  function skipService(svc, idx, label) {
    setMsgs((p) => [...p, { role: "user", text: label }]);
    setTimeout(() => {
      setMsgs((p) => [
        ...p,
        { role: "pit", text: `Anotado! Registrei para acompanhar depois. 📝` },
      ]);
      advanceAlertQueue(idx);
    }, 500);
  }

  function handleAlertYes(client, idx) {
    setMsgs((p) => [...p, { role: "user", text: "Sim, cobrar agora" }]);
    setTimeout(() => {
      const ph = (client.phone || "").replace(/\D/g, "");
      const preview = `Olá, *${client.name}*! 👋\n\nSua mensalidade OI TV de *${fmtMonth(filterMonth)}* no valor de *${fmtMoney(client.monthlyValue)}* está em atraso desde o dia *${client.dueDate}*.\n\nPor favor, regularize o quanto antes. Qualquer dúvida, estou à disposição! 😊`;
      setMsgs((p) => [
        ...p,
        {
          role: "pit",
          text: `Perfeito! Aqui está o texto de cobrança para **${client.name}**:`,
          cobrancaPreview: { client, text: preview, phone: ph },
        },
      ]);
      advanceAlertQueue(idx);
    }, 700);
  }

  function handleAlertNo(client, idx) {
    setMsgs((p) => [...p, { role: "user", text: "Não agora" }]);
    setTimeout(() => {
      setMsgs((p) => [
        ...p,
        { role: "pit", text: `Tudo bem! Vou registrar para depois. 📝` },
      ]);
      advanceAlertQueue(idx);
    }, 500);
  }

  function pitRespond(text) {
    const q = text.toLowerCase().trim();

    // ── Greetings & small talk ─────────────────────────────
    if (/^(oi|olá|ola|e aí|eai|hey|hello|hi)/.test(q)) {
      const hr = new Date().getHours();
      const saudacao =
        hr < 12 ? "Bom dia" : hr < 18 ? "Boa tarde" : "Boa noite";
      return `${saudacao}! 🐾 Aqui é o **BELLO**, seu assistente de gestão da RB!\n\nEstou monitorando seus clientes, cobranças e agendamentos em tempo real. Como posso te ajudar agora?`;
    }
    if (/bom dia/.test(q))
      return `Bom dia! ☀️ BELLO na área!\n\n${atrasados.length > 0 ? `Já identifiquei **${atrasados.length} cliente(s) em atraso** esperando cobrança.` : "Tudo tranquilo hoje — nenhum cliente em atraso! 🎉"}\n\nQuer revisar os alertas ou precisa de outra coisa?`;
    if (/boa tarde/.test(q))
      return `Boa tarde! 🌤️ BELLO por aqui!\n\nAlguma dúvida sobre cobranças, serviços ou clientes? É só falar!`;
    if (/boa noite/.test(q))
      return `Boa noite! 🌙 BELLO ainda de plantão!\n\nAntes de encerrar o dia, lembre-se de fazer um **backup** dos dados. Posso te ajudar com mais alguma coisa?`;
    if (
      /como (você|vc|tu) (está|ta|tá|tás|vai)/.test(q) ||
      /tudo bem|tudo bom|como vai/.test(q)
    )
      return `Estou funcionando a todo vapor! 🐱⚡\n\nMonitorando ${oiClients.length} cliente(s) OI TV, ${services.filter((s) => s.status === "agendado").length} serviço(s) agendado(s) e ${atrasados.length} alerta(s) de atraso.\n\nVocê, como está? Algo em que posso ajudar?`;
    if (
      /quem (é|eh) você|o que (é|eh) você|me fale sobre você|quem é o bello/.test(
        q,
      )
    )
      return `Sou o **BELLO** 🐱, assistente virtual da **RB Revendas e Serviços**!\n\nFui criado para:\n\n📺 Monitorar **clientes OI TV** e cobranças\n📅 Gerenciar **agendamentos** de serviços\n💰 Alertar sobre **atrasos** e inadimplências\n💬 Preparar textos de cobrança para **WhatsApp**\n\nSou ágil, prestativo e estou sempre de olho no negócio! Miau! 🐾`;
    if (/obrigad|valeu|thanks|thank you/.test(q))
      return `Disponha! 🐾 Qualquer coisa é só chamar. Estou aqui para deixar sua gestão mais fácil!`;
    if (/tchau|até|xau|flw|fui/.test(q))
      return `Até logo! 👋 Bons negócios hoje. Se precisar de mim, é só abrir o chat. Miau! 🐱`;
    if (/legal|ótimo|show|perfeito|boa|excelente|massa/.test(q))
      return `Fico feliz em ajudar! 😄 Tem mais alguma coisa que posso fazer por você?`;

    // ── Business commands ──────────────────────────────────
    if (q.includes("cobrar todos") || q.includes("cobrar tudo")) {
      if (atrasados.length === 0)
        return `Nenhum cliente em atraso no momento! ✅ Todos estão em dia este mês. 🎉`;
      return `_bulk_:Preparando cobranças para **${atrasados.length} cliente(s) em atraso**:`;
    }
    if (
      q.includes("listar") ||
      q.includes("quem está") ||
      q.includes("quem ta") ||
      q.includes("atrasado")
    ) {
      if (atrasados.length === 0)
        return "🎉 Nenhum cliente em atraso! Todos estão em dia este mês.";
      return `Clientes **em atraso** em ${fmtMonth(filterMonth)}:\n\n${atrasados.map((c, i) => `**${i + 1}. ${c.name}** — ${fmtMoney(c.monthlyValue)} — venceu dia ${c.dueDate}`).join("\n")}`;
    }
    if (
      q.includes("total") ||
      q.includes("quanto") ||
      q.includes("valor em aberto")
    ) {
      return `Total em atraso: **${fmtMoney(totalDebito)}** em ${fmtMonth(filterMonth)} (${atrasados.length} cliente(s)). 💰`;
    }
    if (
      q.includes("serviço") ||
      q.includes("agendamento") ||
      q.includes("hoje")
    ) {
      if (svcsToday.length === 0 && svcsTomorrow.length === 0)
        return `Nenhum serviço agendado para hoje ou amanhã. 📅\n\nSua agenda está livre!`;
      const parts = [];
      if (svcsToday.length > 0)
        parts.push(
          `**Hoje:** ${svcsToday.map((s) => `${(STYPE[s.type] || STYPE.suporte).icon} ${s.clientName} às ${s.time}`).join(", ")}`,
        );
      if (svcsTomorrow.length > 0)
        parts.push(
          `**Amanhã:** ${svcsTomorrow.map((s) => `${(STYPE[s.type] || STYPE.suporte).icon} ${s.clientName} às ${s.time}`).join(", ")}`,
        );
      return `📅 Agenda de serviços:\n\n${parts.join("\n")}`;
    }
    if (q.includes("backup")) {
      return `Para fazer o backup dos seus dados, clique no botão **🛡️ Backup** no canto superior direito da tela. Ele salva tudo em um arquivo .json que você pode restaurar a qualquer momento!`;
    }
    if (
      q.includes("ajuda") ||
      q.includes("help") ||
      q.includes("o que você faz") ||
      q.includes("o que vc faz") ||
      q.includes("comandos")
    ) {
      return `Veja o que posso fazer por você:\n\n🔴 *"listar atrasados"* — quem está em atraso\n💬 *"cobrar todos"* — preparar cobranças em massa\n💰 *"total"* — valor total em aberto\n📅 *"serviços hoje"* — agenda do dia\n👤 *"cobrar [nome]"* — cobrança individual\n🛡️ *"backup"* — instruções de backup\n\nOu pergunte qualquer coisa sobre o negócio! 🐾`;
    }

    // ── Cobrar by name ─────────────────────────────────────
    const nameQuery = q.replace(/cobrar\s*/i, "").trim();
    if (nameQuery.length > 2) {
      const match = atrasados.find((c) =>
        c.name.toLowerCase().includes(nameQuery),
      );
      if (match) return `_single_:${match.id}`;
    }

    // ── Fallback ───────────────────────────────────────────
    return `Hmm, não entendi bem essa. 🐶\n\nTente:\n• *"listar atrasados"*\n• *"cobrar todos"*\n• *"serviços hoje"*\n• *"ajuda"* para ver todos os comandos`;
  }

  function sendMsg() {
    const txt = input.trim();
    if (!txt) return;
    setMsgs((p) => [...p, { role: "user", text: txt }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const resp = pitRespond(txt);
      setTyping(false);
      if (resp.startsWith("_bulk_:")) {
        const label = resp.replace("_bulk_:", "");
        setMsgs((p) => [
          ...p,
          { role: "pit", text: label, actionCobrar: atrasados },
        ]);
      } else if (resp.startsWith("_single_:")) {
        const cid = parseInt(resp.replace("_single_:", ""));
        const c = atrasados.find((x) => x.id === cid);
        if (c) {
          const ph = (c.phone || "").replace(/\D/g, "");
          const preview = `Olá, *${c.name}*! 👋\n\nSua mensalidade OI TV de *${fmtMonth(filterMonth)}* no valor de *${fmtMoney(c.monthlyValue)}* está em atraso desde o dia *${c.dueDate}*.\n\nPor favor, regularize o quanto antes! 😊`;
          setMsgs((p) => [
            ...p,
            {
              role: "pit",
              text: `Texto de cobrança para **${c.name}**:`,
              cobrancaPreview: { client: c, text: preview, phone: ph },
            },
          ]);
        }
      } else {
        setMsgs((p) => [...p, { role: "pit", text: resp }]);
      }
    }, 900);
  }

  function renderText(t) {
    return t.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return (
        <span key={i}>
          {parts.map((p, j) => {
            if (p.startsWith("**") && p.endsWith("**"))
              return <strong key={j}>{p.slice(2, -2)}</strong>;
            if (p.startsWith("*") && p.endsWith("*"))
              return (
                <em key={j} style={{ fontStyle: "normal", fontWeight: 600 }}>
                  {p.slice(1, -1)}
                </em>
              );
            return p;
          })}
          {i < t.split("\n").length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <>
      {/* Floating button */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background:
              atrasados.length > 0
                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                : "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow:
              atrasados.length > 0
                ? "0 4px 14px rgba(239,68,68,.5)"
                : "0 4px 14px rgba(99,102,241,.4)",
            position: "relative",
            flexShrink: 0,
          }}
          title="BELLO — Assistente de Cobranças"
        >
          🐱
          {!alertsSeen && atrasados.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#ef4444",
                border: "2px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {totalAlerts}
            </span>
          )}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div
          ref={chatRef}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 380,
            maxHeight: 520,
            background: C.card,
            borderRadius: 24,
            boxShadow: "0 20px 60px rgba(0,0,0,.22)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: `1.5px solid ${C.border}`,
            animation: "slideUp 0.25s",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg,#1e1b4b,#312e81)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <PitAvatar
              size={40}
              style={{ border: "2px solid rgba(255,255,255,0.3)" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: 14 }}>
                BELLO 🐾
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>
                Assistente Virtual · {totalAlerts} alerta(s)
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,.1)",
                border: "none",
                borderRadius: "50%",
                width: 28,
                height: 28,
                cursor: "pointer",
                color: "#fff",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>{" "}
          </div>

          {/* Alert banner */}
          {totalAlerts > 0 && (
            <div
              style={{
                background:
                  atrasados.length > 0
                    ? "linear-gradient(135deg,#fee2e2,#fecaca)"
                    : "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderBottom: `1px solid ${atrasados.length > 0 ? "#fca5a5" : "#93c5fd"}`,
                flexWrap: "wrap",
              }}
            >
              {atrasados.length > 0 && (
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: "#991b1b" }}
                >
                  🔴 {atrasados.length} em atraso
                </span>
              )}
              {svcsToday.length > 0 && (
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: "#1e40af" }}
                >
                  ☀️ {svcsToday.length} serviço(s) hoje
                </span>
              )}
              {svcsTomorrow.length > 0 && (
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: "#1e40af" }}
                >
                  📅 {svcsTomorrow.length} serviço(s) amanhã
                </span>
              )}
            </div>
          )}

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 0,
              maxHeight: 300,
            }}
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-end",
                  flexDirection: m.role === "pit" ? "row" : "row-reverse",
                }}
              >
                {m.role === "pit" && <PitAvatar size={28} />}
                <div style={{ maxWidth: "80%" }}>
                  <div
                    style={{
                      background:
                        m.role === "pit"
                          ? C.inputBg
                          : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      color: m.role === "pit" ? C.text : "#fff",
                      borderRadius:
                        m.role === "pit"
                          ? "4px 16px 16px 16px"
                          : "16px 4px 16px 16px",
                      padding: "10px 14px",
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      border:
                        m.role === "pit" ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    {renderText(m.text)}
                  </div>
                  {/* Alert: single client cobrança */}
                  {m.alertClient && (
                    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                      <button
                        onClick={() =>
                          handleAlertYes(m.alertClient, alertIndex)
                        }
                        style={{
                          flex: 1,
                          background: "linear-gradient(135deg,#25d366,#128c7e)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        ✅ Sim, cobrar
                      </button>
                      <button
                        onClick={() => handleAlertNo(m.alertClient, alertIndex)}
                        style={{
                          flex: 1,
                          background: C.inputBg,
                          color: C.muted,
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        ⏭ Pular
                      </button>
                    </div>
                  )}
                  {/* Alert: service today check-up */}
                  {m.checkService && m.checkType === "today" && (
                    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                      <button
                        onClick={() =>
                          markServiceDone(m.checkService, alertIndex)
                        }
                        style={{
                          flex: 1,
                          background: "linear-gradient(135deg,#10b981,#059669)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        ✅ Sim, concluído
                      </button>
                      <button
                        onClick={() =>
                          skipService(m.checkService, alertIndex, "Ainda não")
                        }
                        style={{
                          flex: 1,
                          background: C.inputBg,
                          color: C.muted,
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        ⏳ Ainda não
                      </button>
                    </div>
                  )}
                  {/* Alert: service tomorrow reminder */}
                  {m.checkService && m.checkType === "tomorrow" && (
                    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                      <button
                        onClick={() =>
                          skipService(m.checkService, alertIndex, "Confirmado!")
                        }
                        style={{
                          flex: 1,
                          background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        📅 Confirmado!
                      </button>
                      <button
                        onClick={() =>
                          skipService(
                            m.checkService,
                            alertIndex,
                            "Vou verificar",
                          )
                        }
                        style={{
                          flex: 1,
                          background: C.inputBg,
                          color: C.muted,
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        🔍 Vou verificar
                      </button>
                    </div>
                  )}
                  {/* Cobrança preview */}
                  {m.cobrancaPreview && (
                    <div
                      style={{
                        marginTop: 10,
                        background: "#f0fdf4",
                        border: "1px solid #86efac",
                        borderRadius: 12,
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: "#166534",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        📋 Texto de Cobrança
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#15803d",
                          lineHeight: 1.7,
                          whiteSpace: "pre-line",
                          fontFamily: "monospace",
                          background: "#fff",
                          borderRadius: 8,
                          padding: "10px 12px",
                          border: "1px solid #bbf7d0",
                        }}
                      >
                        {m.cobrancaPreview.text}
                      </div>
                      {m.cobrancaPreview.phone && (
                        <button
                          onClick={() =>
                            onSendCobranca(m.cobrancaPreview.client)
                          }
                          style={{
                            marginTop: 8,
                            width: "100%",
                            background:
                              "linear-gradient(135deg,#25d366,#128c7e)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: "8px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          <span>💬</span> Enviar via WhatsApp
                        </button>
                      )}
                      {!m.cobrancaPreview.phone && (
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 11,
                            color: "#92400e",
                            background: "#fef3c7",
                            borderRadius: 8,
                            padding: "6px 10px",
                          }}
                        >
                          ⚠️ Telefone não cadastrado — envio manual necessário.
                        </div>
                      )}
                    </div>
                  )}
                  {/* Bulk cobrar */}
                  {m.actionCobrar && (
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      {m.actionCobrar.slice(0, 5).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => onSendCobranca(c)}
                          style={{
                            background:
                              "linear-gradient(135deg,#25d366,#128c7e)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: "6px 12px",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            textAlign: "left",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span>💬</span> Cobrar {c.name.split(" ")[0]} via
                          WhatsApp
                        </button>
                      ))}
                      {m.actionCobrar.length > 5 && (
                        <div
                          style={{
                            fontSize: 11,
                            color: C.muted,
                            paddingLeft: 4,
                          }}
                        >
                          +{m.actionCobrar.length - 5} mais — vá à página OI TV
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <PitAvatar size={28} />
                <div
                  style={{
                    background: C.inputBg,
                    borderRadius: "4px 16px 16px 16px",
                    padding: "10px 14px",
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.muted,
                        display: "inline-block",
                        animation: `pulse 1.2s ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: C.card,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMsg();
              }}
              placeholder="Pergunte ao Pit..."
              style={{
                flex: 1,
                padding: "9px 13px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 20,
                fontSize: 12.5,
                fontFamily: "inherit",
                background: C.inputBg,
                color: C.text,
                outline: "none",
              }}
            />
            <button
              onClick={sendMsg}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
          <div style={{ padding: "6px 14px 10px", textAlign: "center" }}>
            <span style={{ fontSize: 10, color: C.muted }}>
              🐾 BELLO — Assistente RB Sistema
            </span>
          </div>
        </div>
      )}
    </>
  );
}

// ── Global Styles ──────────────────────────────────────────────
function GlobalStyles({ C, dark }) {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Inter','Segoe UI',system-ui,sans-serif;background:${C.bg};color:${C.text};-webkit-font-smoothing:antialiased;transition:background 0.3s,color 0.3s}
      ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${dark ? "#475569" : "#cbd5e1"};border-radius:99px}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
      @keyframes popIn{0%{transform:scale(.92);opacity:0}60%{transform:scale(1.02)}100%{transform:scale(1);opacity:1}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      @keyframes loginCardIn{0%{opacity:0;transform:translateY(40px) scale(.96)}100%{opacity:1;transform:none}}
      .rb-btn{transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1)!important}
      .rb-btn:hover{transform:translateY(-1px)!important}
      .rb-btn:active{transform:scale(0.97)!important}
      .rb-card{transition:all 0.25s ease!important}
      .rb-row:hover td{background:${dark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.04)"}!important}
      .rb-input:focus{border-color:${C.primary}!important;box-shadow:0 0 0 3px ${C.primary}22!important;outline:none!important}
      .nav-item{transition:all 0.18s ease!important}
      .nav-item:hover{background:rgba(255,255,255,0.08)!important}
      .cal-cell{transition:all .15s ease!important;cursor:pointer!important}
      .cal-cell:hover{background:${dark ? "rgba(99,102,241,0.12)" : "#eef2ff"}!important}
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, [C, dark]);
  return null;
}

function useBtn(C) {
  return {
    primary: {
      background: C.gradientPrimary,
      color: "#fff",
      border: "none",
      boxShadow: `0 4px 16px ${C.primary}44`,
    },
    secondary: {
      background: C.card,
      color: C.text,
      border: `1.5px solid ${C.border}`,
    },
    danger: { background: G.danger, color: "#fff", border: "none" },
    success: { background: G.success, color: "#fff", border: "none" },
    warning: { background: G.warning, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: C.muted, border: "none" },
    whatsapp: {
      background: "linear-gradient(135deg,#25d366,#128c7e)",
      color: "#fff",
      border: "none",
    },
    export: { background: G.purple, color: "#fff", border: "none" },
    backup: { background: G.orange, color: "#fff", border: "none" },
    restore: { background: G.success, color: "#fff", border: "none" },
    outline: {
      background: "transparent",
      color: C.primary,
      border: `1.5px solid ${C.primary}`,
    },
    info: { background: G.info, color: "#fff", border: "none" },
  };
}

function Btn({
  children,
  variant = "primary",
  onClick,
  fullWidth,
  size = "md",
  style = {},
  C,
}) {
  const variants = useBtn(C);
  const v = variants[variant] || variants.primary;
  const sz = {
    sm: { padding: "6px 14px", fontSize: 12 },
    md: { padding: "10px 20px", fontSize: 14 },
    lg: { padding: "14px 28px", fontSize: 15 },
  };
  return (
    <button
      className="rb-btn"
      onClick={onClick}
      style={{
        ...sz[size],
        ...v,
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 600,
        fontFamily: "inherit",
        width: fullWidth ? "100%" : undefined,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, mask, onChange, onBlur, hint, C, ...props }) {
  function handleChange(e) {
    let val = e.target.value;
    if (mask === "cpf") val = maskCPF(val);
    else if (mask === "phone") val = maskPhone(val);
    else if (mask === "day") val = maskDay(val);
    if (onChange) onChange({ ...e, target: { ...e.target, value: val } });
  }
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        className="rb-input"
        onChange={handleChange}
        onBlur={onBlur}
        style={{
          width: "100%",
          padding: "11px 14px",
          border: `1.5px solid ${C.border}`,
          borderRadius: 10,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          background: C.inputBg,
          color: C.text,
          fontFamily: "inherit",
          transition: "all 0.2s",
          ...(props.style || {}),
        }}
      />
      {hint && (
        <p style={{ margin: "5px 0 0", fontSize: 12, color: C.muted }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Dropdown({ label, options, C, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
          }}
        >
          {label}
        </label>
      )}
      <select
        {...props}
        className="rb-input"
        style={{
          width: "100%",
          padding: "11px 14px",
          border: `1.5px solid ${C.border}`,
          borderRadius: 10,
          fontSize: 14,
          background: C.inputBg,
          color: C.text,
          outline: "none",
          fontFamily: "inherit",
          ...(props.style || {}),
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Card({ children, style = {}, C }) {
  return (
    <div
      className="rb-card"
      style={{
        background: C.card,
        borderRadius: 20,
        boxShadow: shadow.sm,
        border: `1px solid ${C.border}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, action, icon, C }) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.gradientPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <h3
            style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}
          >
            {title}
          </h3>
          {subtitle && (
            <p style={{ margin: "2px 0 0", fontSize: 12, color: C.muted }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function StatCard({ label, value, icon, gradient, C }) {
  return (
    <div
      className="rb-card"
      style={{
        background: gradient || C.gradientPrimary,
        borderRadius: 20,
        padding: "22px 24px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -16,
          top: -16,
          fontSize: 80,
          opacity: 0.12,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>
        {value}
      </div>
      <div
        style={{ fontSize: 12, opacity: 0.85, marginTop: 4, fontWeight: 500 }}
      >
        {label}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, maxWidth = 580, C }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: C.card,
          borderRadius: 24,
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: shadow.lg,
          animation: "slideUp 0.22s",
        }}
      >
        <div
          style={{
            padding: "22px 28px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${C.border}`,
            position: "sticky",
            top: 0,
            background: C.card,
            zIndex: 1,
            borderRadius: "24px 24px 0 0",
          }}
        >
          <h3
            style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}
          >
            {title}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: C.inputBg,
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                cursor: "pointer",
                fontSize: 18,
                color: C.muted,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          )}
        </div>
        <div style={{ padding: 28 }}>{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ msg, onOk, onCancel, C }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.7)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: C.card,
          borderRadius: 24,
          padding: "36px 40px",
          maxWidth: 360,
          width: "100%",
          textAlign: "center",
          boxShadow: shadow.lg,
          animation: "popIn 0.25s",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: C.dangerLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            margin: "0 auto 16px",
          }}
        >
          ⚠️
        </div>
        <h3
          style={{
            margin: "0 0 10px",
            fontSize: 17,
            fontWeight: 700,
            color: C.text,
          }}
        >
          Confirmar exclusão
        </h3>
        <p
          style={{
            margin: "0 0 28px",
            color: C.muted,
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          {msg}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn variant="secondary" onClick={onCancel} C={C}>
            Cancelar
          </Btn>
          <Btn variant="danger" onClick={onOk} C={C}>
            🗑️ Excluir
          </Btn>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, C }) {
  const map = {
    pago: {
      bg: C.successLight,
      c: C.successDark,
      dot: "#10b981",
      label: "Pago",
    },
    parcial: {
      bg: C.infoLight,
      c: C.infoDark,
      dot: "#3b82f6",
      label: "Parcial",
    },
    pendente: {
      bg: C.warningLight,
      c: C.warningDark,
      dot: "#f59e0b",
      label: "Pendente",
    },
    atrasado: {
      bg: C.dangerLight,
      c: C.dangerDark,
      dot: "#ef4444",
      label: "Atrasado",
    },
  };
  const s = map[status] || map.pendente;
  return (
    <span
      style={{
        background: s.bg,
        color: s.c,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span
        style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }}
      />
      {s.label}
    </span>
  );
}

function ProgBar({ pct, color }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div
      style={{
        background: "#e2e8f0",
        borderRadius: 99,
        height: 7,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${w}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width 1.1s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      />
    </div>
  );
}

function EmptyState({
  icon = "📭",
  title = "Nenhum registro",
  subtitle = "",
  action,
  C,
}) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.4 }}>{icon}</div>
      <h4
        style={{
          margin: "0 0 8px",
          fontSize: 16,
          fontWeight: 600,
          color: C.muted,
        }}
      >
        {title}
      </h4>
      {subtitle && (
        <p style={{ margin: "0 0 20px", fontSize: 14, color: C.muted }}>
          {subtitle}
        </p>
      )}
      {action}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder = "Buscar...", C }) {
  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 13,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 15,
          color: C.muted,
          pointerEvents: "none",
        }}
      >
        🔍
      </span>
      <input
        className="rb-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: "10px 14px 10px 38px",
          border: `1.5px solid ${C.border}`,
          borderRadius: 10,
          fontSize: 14,
          background: C.inputBg,
          color: C.text,
          fontFamily: "inherit",
          outline: "none",
          width: "100%",
        }}
      />
    </div>
  );
}

function PaymentModal({ client, month, onSave, onClose, C }) {
  const existing = getPayObj(client, month);
  const [paid, setPaid] = useState(String(existing?.paid ?? ""));
  const [date, setDate] = useState(existing?.date || today());
  const [notes, setNotes] = useState(existing?.notes || "");
  const paidNum = parseFloat(paid) || 0;
  const totalValue = client.monthlyValue || 0;
  const remaining = Math.max(0, totalValue - paidNum);
  const paidPct =
    totalValue > 0
      ? Math.min(100, Math.round((paidNum / totalValue) * 100))
      : 0;
  const status =
    paidNum <= 0 ? "pendente" : paidNum >= totalValue ? "pago" : "parcial";
  return (
    <Modal
      title="💳 Registrar Pagamento"
      onClose={onClose}
      maxWidth={500}
      C={C}
    >
      <div
        style={{
          background: C.inputBg,
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: `1px solid ${C.border}`,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
            {client.name}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            Vencimento: dia {client.dueDate} · {fmtMonth(month)}
          </div>
        </div>
        <StatusBadge status={status} C={C} />
      </div>
      <Field
        label={`Valor Pago (Total: ${fmtMoney(totalValue)})`}
        type="number"
        placeholder="0,00"
        value={paid}
        onChange={(e) => setPaid(e.target.value)}
        C={C}
      />
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>
            Progresso
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>
            {paidPct}%
          </span>
        </div>
        <div
          style={{
            background: C.border,
            borderRadius: 99,
            height: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${paidPct}%`,
              height: "100%",
              background: status === "pago" ? G.success : C.gradientPrimary,
              borderRadius: 99,
              transition: "width 0.6s",
            }}
          />
        </div>
      </div>
      {remaining === 0 && paidNum > 0 && (
        <div
          style={{
            padding: "10px 14px",
            background: C.successLight,
            borderRadius: 10,
            marginBottom: 14,
            fontSize: 13,
            color: C.successDark,
            fontWeight: 700,
          }}
        >
          ✅ Quitado!
        </div>
      )}
      {remaining > 0 && paidNum > 0 && (
        <div
          style={{
            padding: "10px 14px",
            background: C.dangerLight,
            borderRadius: 10,
            marginBottom: 14,
            fontSize: 13,
            color: C.dangerDark,
            fontWeight: 600,
          }}
        >
          ⚠️ Restante: {fmtMoney(remaining)}
        </div>
      )}
      <Field
        label="Data do Pagamento"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        C={C}
      />
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
          }}
        >
          Observações
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="rb-input"
          style={{
            width: "100%",
            padding: "11px 14px",
            border: `1.5px solid ${C.border}`,
            borderRadius: 10,
            fontSize: 13,
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: "inherit",
            background: C.inputBg,
            color: C.text,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose} C={C}>
          Cancelar
        </Btn>
        <Btn
          variant="success"
          onClick={() =>
            onSave({ status, paid: paidNum, remaining, date, notes })
          }
          C={C}
        >
          ✅ Salvar
        </Btn>
      </div>
    </Modal>
  );
}

// ── Login ──────────────────────────────────────────────────────
function SatelliteSVG() {
  return (
    <svg
      viewBox="0 0 340 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        maxWidth: 340,
        filter: "drop-shadow(0 20px 60px rgba(168,85,247,0.5))",
      }}
    >
      {/* glow base */}
      <ellipse cx="170" cy="340" rx="90" ry="16" fill="rgba(168,85,247,0.25)" />
      {/* pedestal */}
      <rect x="148" y="290" width="44" height="50" rx="6" fill="url(#ped)" />
      <rect x="130" y="336" width="80" height="16" rx="5" fill="url(#ped2)" />
      {/* mast */}
      <rect x="163" y="170" width="14" height="128" rx="5" fill="url(#mast)" />
      {/* dish back structure */}
      <ellipse
        cx="170"
        cy="150"
        rx="130"
        ry="20"
        fill="rgba(139,92,246,0.12)"
        transform="rotate(-18 170 150)"
      />
      {/* dish ribs */}
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((a, i) => (
        <line
          key={i}
          x1="170"
          y1="148"
          x2={170 + 118 * Math.cos(((a - 18) * Math.PI) / 180)}
          y2={148 + 40 * Math.sin(((a - 18) * Math.PI) / 180)}
          stroke="rgba(192,132,252,0.35)"
          strokeWidth="1.2"
        />
      ))}
      {/* main dish */}
      <ellipse
        cx="170"
        cy="148"
        rx="128"
        ry="46"
        fill="url(#dish)"
        transform="rotate(-10 170 148)"
      />
      <ellipse
        cx="170"
        cy="148"
        rx="128"
        ry="46"
        fill="none"
        stroke="rgba(216,180,254,0.6)"
        strokeWidth="1.5"
        transform="rotate(-10 170 148)"
      />
      {/* dish inner rings */}
      <ellipse
        cx="170"
        cy="148"
        rx="96"
        ry="34"
        fill="none"
        stroke="rgba(216,180,254,0.25)"
        strokeWidth="1"
        transform="rotate(-10 170 148)"
      />
      <ellipse
        cx="170"
        cy="148"
        rx="64"
        ry="22"
        fill="none"
        stroke="rgba(216,180,254,0.2)"
        strokeWidth="1"
        transform="rotate(-10 170 148)"
      />
      {/* dish shine */}
      <ellipse
        cx="148"
        cy="138"
        rx="36"
        ry="12"
        fill="rgba(255,255,255,0.12)"
        transform="rotate(-10 148 138)"
      />
      {/* feed arm */}
      <line
        x1="170"
        y1="148"
        x2="225"
        y2="95"
        stroke="rgba(192,132,252,0.7)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="170"
        y1="148"
        x2="115"
        y2="95"
        stroke="rgba(192,132,252,0.7)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="170"
        y1="148"
        x2="170"
        y2="78"
        stroke="rgba(192,132,252,0.8)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* feed horn */}
      <circle
        cx="170"
        cy="72"
        r="10"
        fill="url(#horn)"
        stroke="rgba(216,180,254,0.8)"
        strokeWidth="1.5"
      />
      <circle cx="170" cy="72" r="5" fill="rgba(255,255,255,0.4)" />
      {/* signal waves */}
      <path
        d="M185 55 Q200 45 185 35"
        stroke="rgba(216,180,254,0.6)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M193 50 Q215 38 193 26"
        stroke="rgba(216,180,254,0.4)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M155 55 Q140 45 155 35"
        stroke="rgba(216,180,254,0.6)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M147 50 Q125 38 147 26"
        stroke="rgba(216,180,254,0.4)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* KU-BAND label */}
      <text
        x="170"
        y="162"
        textAnchor="middle"
        fill="rgba(216,180,254,0.9)"
        fontSize="11"
        fontWeight="700"
        fontFamily="Inter,sans-serif"
        letterSpacing="2"
      >
        KU-BAND
      </text>
      <defs>
        <linearGradient
          id="dish"
          x1="60"
          y1="120"
          x2="300"
          y2="185"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient
          id="mast"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient
          id="ped"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient
          id="ped2"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <radialGradient id="horn" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Animated Stars ────────────────────────────────────────────
function StarField({ count = 120 }) {
  const stars = useRef([]);
  if (stars.current.length === 0) {
    for (let i = 0; i < count; i++) {
      stars.current.push({
        x: Math.random() * 100,
        y: Math.random() * 60,
        r: Math.random() * 1.6 + 0.3,
        delay: Math.random() * 4,
        dur: Math.random() * 3 + 2,
      });
    }
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {stars.current.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: "50%",
            background: "#fff",
            opacity: 0,
            animation: `starTwinkle ${s.dur}s ${s.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

// ── Mountain / Forest SVG ─────────────────────────────────────
function NightSceneSVG() {
  return (
    <svg
      viewBox="0 0 800 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "auto",
        pointerEvents: "none",
      }}
    >
      {/* distant mountains */}
      <polygon
        points="0,260 80,120 160,200 280,80 400,160 520,60 640,140 720,100 800,160 800,260"
        fill="rgba(80,30,160,0.45)"
      />
      {/* mid mountains */}
      <polygon
        points="0,260 60,170 150,230 250,140 360,200 460,120 560,180 660,130 760,170 800,150 800,260"
        fill="rgba(60,20,130,0.6)"
      />
      {/* trees layer 1 (far) */}
      {[
        20, 70, 120, 170, 220, 270, 320, 370, 420, 470, 520, 570, 620, 670, 720,
        760,
      ].map((x, i) => (
        <g
          key={`tf${i}`}
          transform={`translate(${x},${160 + Math.sin(i) * 12})`}
        >
          <polygon points="-8,0 0,-36 8,0" fill="rgba(30,10,80,0.7)" />
          <polygon
            points="-5,0 0,-20 5,0"
            transform="translate(0,10)"
            fill="rgba(30,10,80,0.55)"
          />
        </g>
      ))}
      {/* trees layer 2 (near, dark) */}
      {[
        0, 35, 75, 115, 155, 200, 245, 290, 335, 380, 425, 465, 510, 555, 600,
        645, 690, 735, 775,
      ].map((x, i) => (
        <g
          key={`tn${i}`}
          transform={`translate(${x},${200 + Math.cos(i * 1.3) * 8})`}
        >
          <polygon points="-10,0 0,-52 10,0" fill="rgba(15,5,50,0.95)" />
          <polygon
            points="-6,0 0,-28 6,0"
            transform="translate(0,14)"
            fill="rgba(10,3,40,0.9)"
          />
          <rect x="-2.5" y="0" width="5" height="14" fill="rgba(10,3,40,0.9)" />
        </g>
      ))}
      {/* ground */}
      <rect x="0" y="230" width="800" height="30" fill="rgba(10,3,40,0.98)" />
    </svg>
  );
}

// ── Floating Clouds ───────────────────────────────────────────
function FloatingCloud({
  x,
  y,
  scale = 1,
  opacity = 0.35,
  dur = 18,
  delay = 0,
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `scale(${scale})`,
        opacity,
        animation: `cloudDrift ${dur}s ${delay}s infinite ease-in-out alternate`,
        pointerEvents: "none",
      }}
    >
      <svg viewBox="0 0 120 60" width="120" height="60" fill="none">
        <ellipse cx="60" cy="40" rx="50" ry="22" fill="rgba(99,102,241,0.5)" />
        <ellipse cx="45" cy="32" rx="28" ry="18" fill="rgba(99,102,241,0.55)" />
        <ellipse cx="75" cy="30" rx="22" ry="15" fill="rgba(99,102,241,0.5)" />
        <ellipse cx="60" cy="28" rx="18" ry="14" fill="rgba(139,92,246,0.45)" />
      </svg>
    </div>
  );
}

// ── Moon ──────────────────────────────────────────────────────
function Moon() {
  return (
    <div
      style={{
        position: "absolute",
        top: "6%",
        right: "8%",
        pointerEvents: "none",
        animation: "moonGlow 4s ease-in-out infinite alternate",
      }}
    >
      <svg viewBox="0 0 80 80" width="80" height="80">
        <circle cx="40" cy="40" r="38" fill="rgba(99,102,241,0.18)" />
        <circle cx="40" cy="40" r="28" fill="rgba(148,130,240,0.25)" />
        <circle cx="40" cy="40" r="20" fill="rgba(196,181,253,0.35)" />
        <path
          d="M42 18 Q62 38 42 58 Q70 55 70 38 Q70 20 42 18Z"
          fill="rgba(200,185,255,0.55)"
        />
      </svg>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────
function LoginAvatar({ shake }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: 12,
        animation: shake ? "avatarShake 0.4s ease" : "none",
      }}
    >
      <div
        style={{
          width: 160,
          filter: "drop-shadow(0 8px 28px rgba(139,92,246,0.55))",
        }}
      >
        <SatelliteSVG />
      </div>
    </div>
  );
}

// ── PIXEL ART CANVAS BACKGROUND ───────────────────────────────
function PixelScene() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let raf,
      t = 0;
    // pixel size
    const P = 3;
    // scene dimensions in pixels
    const W = Math.floor(cv.width / P);
    const H = Math.floor(cv.height / P);

    function px(x, y, r, g, b, a = 255) {
      if (x < 0 || y < 0 || x >= W || y >= H) return;
      ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
      ctx.fillRect(x * P, y * P, P, P);
    }
    function rect(x, y, w, h, r, g, b, a = 255) {
      for (let i = x; i < x + w; i++)
        for (let j = y; j < y + h; j++) px(i, j, r, g, b, a);
    }
    function line(x1, y1, x2, y2, r, g, b) {
      let dx = Math.abs(x2 - x1),
        dy = Math.abs(y2 - y1);
      let sx = x1 < x2 ? 1 : -1,
        sy = y1 < y2 ? 1 : -1,
        err = dx - dy;
      while (true) {
        px(x1, y1, r, g, b);
        if (x1 === x2 && y1 === y2) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x1 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y1 += sy;
        }
      }
    }

    function flicker(base, amp, t, freq = 0.03) {
      return Math.floor(base + Math.sin(t * freq) * amp);
    }

    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height);

      // ── SKY ─────────────────────────────────────────
      for (let y = 0; y < H * 0.6; y++) {
        const m = y / (H * 0.6);
        const r = Math.floor(10 + m * 20);
        const g = Math.floor(5 + m * 10);
        const b = Math.floor(40 + m * 50);
        rect(0, y, W, 1, r, g, b);
      }

      // ── STARS ──────────────────────────────────────
      const stars = [
        [8, 3],
        [22, 7],
        [35, 2],
        [50, 8],
        [65, 4],
        [80, 6],
        [95, 3],
        [110, 9],
        [125, 5],
        [140, 2],
        [155, 7],
        [170, 4],
        [185, 9],
        [200, 3],
        [215, 6],
        [12, 14],
        [45, 12],
        [78, 16],
        [112, 11],
        [148, 15],
        [182, 13],
        [210, 10],
        [30, 18],
        [90, 17],
        [160, 14],
        [5, 20],
        [55, 22],
        [100, 19],
        [175, 21],
      ];
      stars.forEach(([sx, sy], i) => {
        const blink = Math.sin(t * 0.04 + i * 1.3);
        if (blink > 0.1) {
          const br = Math.floor(180 + blink * 75);
          px(sx, sy, br, br, br + 20);
        }
      });

      // ── MOON ───────────────────────────────────────
      const mx = W - 28,
        my = 10;
      // moon glow
      const mg = Math.floor(180 + Math.sin(t * 0.02) * 20);
      for (let dy = -7; dy <= 7; dy++)
        for (let dx = -7; dx <= 7; dx++) {
          const d = dx * dx + dy * dy;
          if (d <= 49 && d > 25) {
            const a = Math.floor(30 * (1 - (d - 25) / 24));
            px(mx + dx, my + dy, 120, 100, mg, a);
          }
        }
      // crescent
      [
        [0, -4],
        [1, -4],
        [-1, -4],
        [2, -3],
        [-2, -3],
        [3, -2],
        [3, -1],
        [3, 0],
        [3, 1],
        [2, 2],
        [1, 3],
        [0, 3],
        [-1, 3],
        [-2, 2],
        [-3, 1],
        [-3, 0],
        [-3, -1],
        [-2, -2],
      ].forEach(([dx, dy]) => px(mx + dx, my + dy, 220, 210, 240));
      // inner dark (crescent shape)
      [
        [-1, -2],
        [0, -2],
        [1, -2],
        [-1, -1],
        [0, -1],
        [1, -1],
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ].forEach(([dx, dy]) => px(mx + dx, my + dy, 15, 8, 45));

      // ── CITY SKYLINE (back) ─────────────────────────
      const buildings = [
        { x: 130, y: 28, w: 12, h: 18 },
        { x: 144, y: 22, w: 8, h: 24 },
        { x: 154, y: 30, w: 10, h: 16 },
        { x: 166, y: 25, w: 14, h: 21 },
        { x: 182, y: 31, w: 9, h: 15 },
        { x: 193, y: 26, w: 11, h: 20 },
        { x: 206, y: 32, w: 8, h: 14 },
        { x: 216, y: 28, w: 12, h: 18 },
      ];
      buildings.forEach((b) => {
        rect(b.x, b.y, b.w, b.h, 25, 15, 55);
        // windows
        for (let wy = b.y + 2; wy < b.y + b.h - 2; wy += 3)
          for (let wx = b.x + 1; wx < b.x + b.w - 1; wx += 3) {
            const won = Math.sin(t * 0.01 + wx * 1.7 + wy * 2.3) > 0.2;
            if (won) px(wx, wy, 255, 210, 120);
          }
      });

      // ── GROUND ──────────────────────────────────────
      const groundY = Math.floor(H * 0.58);
      for (let y = groundY; y < H; y++) {
        const m = (y - groundY) / (H - groundY);
        const r = Math.floor(15 + m * 10);
        const g = Math.floor(8 + m * 5);
        const b = Math.floor(35 + m * 20);
        rect(0, y, W, 1, r, g, b);
      }

      // ── HOUSE BACK ─────────────────────────────────
      const hx = 8,
        hy = groundY - 30,
        hw = 85,
        hh = 30;
      rect(hx, hy, hw, hh, 55, 35, 95);
      // roof
      for (let row = 0; row < 12; row++) {
        const rw = hw - row * 2;
        rect(hx + row, hy - 12 + row, rw, 2, 40, 25, 70);
        rect(hx + row, hy - 12 + row, rw, 1, 60, 40, 90);
      }
      // tiles on roof
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < Math.floor((hw - row * 2) / 6); col++) {
          const tx = hx + row + col * 6;
          const ty = hy - 12 + row * 2;
          px(tx, ty, 35, 20, 60);
          px(tx + 3, ty, 35, 20, 60);
        }
      }
      // door
      rect(hx + 35, hy + 14, 14, 16, 35, 20, 60);
      rect(hx + 36, hy + 15, 12, 14, 45, 28, 70);
      px(hx + 47, hy + 22, 220, 180, 100);

      // ── LIVING ROOM WINDOW ─────────────────────────
      const wx = hx + 6,
        wy = hy + 5,
        ww = 22,
        wh = 16;
      // lamp warm glow bleeding through
      const lampGlow = Math.floor(80 + Math.sin(t * 0.025) * 8);
      rect(wx - 1, wy - 1, ww + 2, wh + 2, 30, 18, 55); // frame
      rect(wx, wy, ww, wh, lampGlow, Math.floor(lampGlow * 0.6), 20); // warm interior
      // curtains
      rect(wx, wy, 4, wh, 70, 40, 100);
      rect(wx + ww - 4, wy, 4, wh, 70, 40, 100);
      // window cross
      line(wx + ww / 2, wy, wx + ww / 2, wy + wh, 50, 30, 75);
      line(wx, wy + wh / 2, wx + ww, wy + wh / 2, 50, 30, 75);

      // ── TV GLOW INSIDE ─────────────────────────────
      const tvBr = Math.floor(30 + Math.sin(t * 0.04) * 15);
      for (let dy = 0; dy < 8; dy++)
        for (let dx = 0; dx < 12; dx++) {
          px(
            wx + 5 + dx,
            wy + 4 + dy,
            tvBr,
            Math.floor(tvBr * 0.8),
            Math.floor(tvBr * 1.5),
            180,
          );
        }

      // ── SIDE WALL (exterior) ───────────────────────
      const sx = hx + hw,
        sy = hy + 5,
        sw = 18,
        sh = hh - 5;
      rect(sx, sy, sw, sh, 40, 25, 70);
      // brick texture
      for (let br = 0; br < 4; br++)
        for (let bc = 0; bc < 3; bc++) {
          px(sx + 1 + bc * 6 + (br % 2) * 3, sy + 2 + br * 5, 30, 18, 55);
        }

      // ── SATELLITE DISH ─────────────────────────────
      const dx2 = hx + hw + 4,
        dy2 = hy - 2;
      // mast
      rect(dx2 + 4, dy2, 2, 12, 60, 45, 80);
      // dish body (oval)
      [
        [0, 4],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6],
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
        [2, 5],
        [2, 6],
        [2, 7],
        [3, 0],
        [3, 1],
        [3, 2],
        [3, 3],
        [3, 4],
        [3, 5],
        [3, 6],
        [3, 7],
        [3, 8],
        [4, 1],
        [4, 2],
        [4, 3],
        [4, 4],
        [4, 5],
        [4, 6],
        [4, 7],
        [5, 2],
        [5, 3],
        [5, 4],
        [5, 5],
        [5, 6],
        [6, 3],
        [6, 4],
        [6, 5],
      ].forEach(([ddx, ddy]) => {
        const shade = Math.floor(160 + Math.sin(t * 0.03 + ddx * 0.5) * 10);
        px(dx2 + ddx, dy2 - 8 + ddy, shade, shade - 10, shade + 15);
      });
      // dish shine
      [
        [2, 2],
        [2, 3],
        [3, 1],
        [3, 2],
      ].forEach(([ddx, ddy]) => px(dx2 + ddx, dy2 - 8 + ddy, 220, 215, 240));
      // LNB arm
      line(dx2 + 3, dy2 - 4, dx2 + 8, dy2 - 9, 80, 60, 100);
      rect(dx2 + 7, dy2 - 10, 2, 2, 100, 80, 120);
      // BANDA KU label pixels (tiny text effect)
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ].forEach(([lx, ly]) =>
        px(dx2 + 1 + lx, dy2 - 5 + ly, 200, 190, 220, 180),
      );

      // ── TREE ───────────────────────────────────────
      const tx = W - 22,
        tree_y = groundY - 2;
      // trunk
      rect(tx + 4, tree_y - 8, 3, 8, 45, 28, 15);
      // foliage layers
      [
        [3, -18, 8, 6],
        [1, -14, 10, 6],
        [0, -9, 12, 5],
      ].forEach(([ox, oy, fw, fh]) => {
        for (let fy = 0; fy < fh; fy++)
          for (let fxx = 0; fxx < fw; fxx++) {
            const shade = 20 + Math.floor(Math.sin(t * 0.015 + fxx + fy) * 5);
            px(tx + ox + fxx, tree_y + oy + fy, shade, 50 + shade, shade * 0.5);
          }
      });

      // ── WALL / FENCE ───────────────────────────────
      const fenceY = groundY + 8;
      rect(hx + hw + sw, fenceY, W - hx - hw - sw - 15, 3, 35, 22, 55);
      // stone texture
      for (let s = 0; s < 6; s++) px(hx + hw + sw + s * 8, fenceY, 25, 15, 45);

      // ── LANTERN ────────────────────────────────────
      const lx = hx + hw + sw + 5,
        ly = fenceY - 6;
      rect(lx, ly, 3, 6, 50, 35, 70);
      // lamp glow
      const lg2 = flicker(180, 25, t, 0.06);
      for (let gy = -3; gy <= 3; gy++)
        for (let gx = -3; gx <= 3; gx++) {
          const d = Math.abs(gx) + Math.abs(gy);
          if (d <= 3) {
            const a = Math.floor(120 * (1 - d / 4));
            px(lx + 1 + gx, ly + 3 + gy, lg2, Math.floor(lg2 * 0.75), 30, a);
          }
        }
      px(lx + 1, ly + 2, 240, 200, 80);
      px(lx + 1, ly + 3, 255, 220, 100);

      // ── GROUND PLANTS ──────────────────────────────
      [
        [hx + 2, groundY],
        [hx + hw + sw + 12, groundY - 1],
        [hx + hw - 5, groundY + 1],
      ].forEach(([px2, py2], i) => {
        const sway = Math.floor(Math.sin(t * 0.02 + i * 2) * 1.5);
        [
          [0, 0],
          [1, -2 + sway],
          [2, -4 + sway],
          [0, -3 + sway],
          [-1, -2],
        ].forEach(([sx, sy]) => px(px2 + sx, py2 + sy, 20, 60, 20));
      });

      // ── COUCH SILHOUETTES (through window) ─────────
      // family as dark pixel shapes inside warm window
      // sofa
      for (let si = 0; si < 12; si++) px(wx + 2 + si, wy + 11, 40, 20, 8);
      for (let si = 0; si < 12; si++) px(wx + 2 + si, wy + 10, 55, 30, 12);
      // heads
      [
        [3, 7],
        [6, 6],
        [9, 7],
        [12, 7],
      ].forEach(([hpx, hpy]) => {
        rect(wx + hpx, wy + hpy, 2, 2, 50, 28, 15);
      });

      // ── PATH / STONES ──────────────────────────────
      [
        [hx + 35, groundY + 2],
        [hx + 40, groundY + 4],
        [hx + 45, groundY + 3],
        [hx + 50, groundY + 5],
      ].forEach(([spx, spy]) => {
        rect(spx, spy, 4, 2, 50, 35, 65);
        px(spx + 1, spy, 60, 45, 75);
      });

      // ── OVERLAY SCANLINES ──────────────────────────
      for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x++)
          ((ctx.fillStyle = "rgba(0,0,0,0.08)"),
            ctx.fillRect(x * P, y * P, P, P));
      }

      t++;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={720}
      height={450}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        imageRendering: "pixelated",
        zIndex: 0,
      }}
    />
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(""),
    [pass, setPass] = useState(""),
    [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false),
    [failed, setFailed] = useState(false),
    [focusedField, setFocusedField] = useState(null);
  const [shake, setShake] = useState(false),
    [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  async function handleLogin() {
    setFailed(false);
    if (!email || !pass) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    const ok = onLogin(email, pass);
    setLoading(false);
    if (!ok) {
      setFailed(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  const inputStyle = (field) => ({
    width: "100%",
    padding: "13px 18px 13px 46px",
    border: `1.5px solid ${focusedField === field ? "rgba(167,139,250,0.9)" : "rgba(167,139,250,0.25)"}`,
    borderRadius: 12,
    fontSize: 14,
    background:
      focusedField === field ? "rgba(255,255,255,0.10)" : "rgba(15,8,50,0.55)",
    color: "#f3e8ff",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.3s",
    boxShadow:
      focusedField === field ? "0 0 0 3px rgba(167,139,250,0.2)" : "none",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter',system-ui,sans-serif",
        position: "relative",
        overflow: "hidden",
        background: "#050310",
      }}
    >
      {/* ── Pixel Art Canvas BG ── */}
      <PixelScene />

      {/* ── Gradient overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(180deg,rgba(5,3,16,0.25) 0%,rgba(10,5,35,0.45) 60%,rgba(5,3,16,0.80) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── CRT scanline vignette ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.7)",
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 4px)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes formSlideIn{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
        @keyframes avatarShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes floatIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes pixelGlow{0%,100%{box-shadow:0 0 0 2px rgba(99,102,241,0.4),0 0 20px rgba(99,102,241,0.2)}50%{box-shadow:0 0 0 2px rgba(167,139,250,0.8),0 0 32px rgba(139,92,246,0.4)}}
        @keyframes tvBlink{0%,95%,100%{opacity:1}96%,99%{opacity:0.7}}
        @keyframes signalBar{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}
        @keyframes titlePixel{0%{letter-spacing:.3em;opacity:0}100%{letter-spacing:.15em;opacity:1}}
      `}</style>

      {/* ── PIXEL HUD CORNERS ── */}
      {[
        { t: 16, l: 16, r: "auto", b: "auto" },
        { t: 16, l: "auto", r: 16, b: "auto" },
        { t: "auto", l: 16, r: "auto", b: 16 },
        { t: "auto", l: "auto", r: 16, b: 16 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            zIndex: 3,
            ...pos,
            width: 24,
            height: 24,
            pointerEvents: "none",
            borderTop: i < 2 ? "2px solid rgba(139,92,246,0.5)" : "none",
            borderBottom: i >= 2 ? "2px solid rgba(139,92,246,0.5)" : "none",
            borderLeft: i % 2 === 0 ? "2px solid rgba(139,92,246,0.5)" : "none",
            borderRight:
              i % 2 === 1 ? "2px solid rgba(139,92,246,0.5)" : "none",
          }}
        />
      ))}

      {/* ── Login Card ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 400,
          margin: "0 20px",
          animation: entered
            ? "formSlideIn 0.55s cubic-bezier(0.34,1.1,0.64,1) both"
            : "none",
        }}
      >
        {/* pixel border glow */}
        <div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: 26,
            background:
              "linear-gradient(135deg,rgba(99,102,241,0.5),rgba(139,92,246,0.3),rgba(99,102,241,0.5))",
            zIndex: -1,
            animation: "pixelGlow 3s ease-in-out infinite",
          }}
        />

        <div
          style={{
            background: "rgba(8,4,28,0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(99,102,241,0.35)",
            borderRadius: 24,
            padding: "32px 36px 28px",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.8), inset 0 1px 0 rgba(167,139,250,0.12)",
            imageRendering: "pixelated",
          }}
        >
          {/* TV signal bars — pixel style */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              marginBottom: 16,
            }}
          >
            {[0.5, 0.7, 1, 0.8, 0.6].map((h, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 14,
                  background: `rgba(99,102,241,${0.3 + h * 0.5})`,
                  borderRadius: 1,
                  transformOrigin: "bottom",
                  animation: `signalBar ${0.8 + i * 0.15}s ${i * 0.1}s ease-in-out infinite`,
                }}
              />
            ))}
            <span
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                color: "rgba(167,139,250,0.5)",
                marginLeft: 6,
                alignSelf: "flex-end",
                letterSpacing: 2,
              }}
            >
              CONECTADO
            </span>
          </div>

          {/* Avatar */}
          <LoginAvatar shake={shake} />

          {/* Title — pixel font style */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: 22,
                fontWeight: 900,
                color: "#e9d5ff",
                letterSpacing: ".15em",
                fontFamily: "monospace",
                animation: "titlePixel 0.6s ease both",
                textShadow: "0 0 20px rgba(139,92,246,0.6)",
              }}
            >
              RB SISTEMA
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 1,
                  background: "rgba(139,92,246,0.4)",
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: "rgba(167,139,250,0.5)",
                  fontWeight: 700,
                  letterSpacing: ".18em",
                  fontFamily: "monospace",
                }}
              >
                REVENDAS & SERVIÇOS
              </span>
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 1,
                  background: "rgba(139,92,246,0.4)",
                }}
              />
            </div>
          </div>

          {/* Error */}
          {failed && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.35)",
                borderRadius: 10,
                fontSize: 12,
                color: "#fca5a5",
                fontWeight: 700,
                textAlign: "center",
                fontFamily: "monospace",
                letterSpacing: ".05em",
                animation: "floatIn 0.3s",
              }}
            >
              ⚠ ACESSO NEGADO — credenciais inválidas
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 14,
                  pointerEvents: "none",
                  opacity: 0.5,
                }}
              >
                👤
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="EMAIL"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={inputStyle("email")}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 14,
                  pointerEvents: "none",
                  opacity: 0.5,
                }}
              >
                🔒
              </span>
              <input
                type={showPass ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onFocus={() => setFocusedField("pass")}
                onBlur={() => setFocusedField(null)}
                placeholder="SENHA"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{ ...inputStyle("pass"), paddingRight: 46 }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "rgba(167,139,250,0.5)",
                  padding: 4,
                  lineHeight: 1,
                  transition: "color .2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(167,139,250,0.5)")
                }
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background =
                  "linear-gradient(135deg,#4f46e5,#7c3aed)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg,#6366f1,#8b5cf6)";
              e.currentTarget.style.transform = "none";
            }}
            style={{
              width: "100%",
              padding: "13px",
              background: loading
                ? "rgba(99,102,241,0.3)"
                : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff",
              border: "1px solid rgba(139,92,246,0.5)",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              fontFamily: "monospace",
              boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.45)",
              transition: "all .2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              letterSpacing: ".12em",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin .7s linear infinite",
                  }}
                />
                AUTENTICANDO...
              </>
            ) : (
              "▶ ENTRAR"
            )}
          </button>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 18,
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: "rgba(139,92,246,0.35)",
                fontFamily: "monospace",
                letterSpacing: ".1em",
              }}
            >
              v2.3 · ADMIN
            </span>
            <span
              style={{
                fontSize: 9,
                color: "rgba(139,92,246,0.35)",
                fontFamily: "monospace",
                letterSpacing: ".08em",
              }}
            >
              📡 BANDA KU
            </span>
          </div>
        </div>

        {/* pixel bracket corners on card */}
        {[
          { top: -1, left: -1 },
          { top: -1, right: -1 },
          { bottom: -1, left: -1 },
          { bottom: -1, right: -1 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 12,
              height: 12,
              zIndex: 11,
              borderTop: i < 2 ? "2px solid #a78bfa" : "none",
              borderBottom: i >= 2 ? "2px solid #a78bfa" : "none",
              borderLeft: i % 2 === 0 ? "2px solid #a78bfa" : "none",
              borderRight: i % 2 === 1 ? "2px solid #a78bfa" : "none",
              borderRadius:
                i === 0
                  ? "4px 0 0 0"
                  : i === 1
                    ? "0 4px 0 0"
                    : i === 2
                      ? "0 0 0 4px"
                      : "0 0 4px 0",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RestorePrompt({ onRestore, onSkip }) {
  const [msg, setMsg] = useState(null);
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (!d.version) throw new Error("Arquivo inválido.");
        onRestore(d);
        setMsg({ ok: true, text: "✅ Restaurado!" });
        setTimeout(() => onSkip(), 1400);
      } catch (err) {
        setMsg({ ok: false, text: `❌ ${err.message}` });
      }
      e.target.value = "";
    };
    r.readAsText(file, "utf-8");
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#0f172a,#1e1b4b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 28,
          padding: 48,
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: G.success,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            margin: "0 auto 20px",
          }}
        >
          🛡️
        </div>
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          Restaurar Backup?
        </h2>
        <p
          style={{
            margin: "0 0 32px",
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
          }}
        >
          Carregar dados de um backup anterior?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label
            style={{
              padding: 14,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "block",
            }}
          >
            📂 Selecionar Backup (.json)
            <input
              type="file"
              accept=".json"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </label>
          <button
            onClick={onSkip}
            style={{
              padding: 13,
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Continuar sem restaurar
          </button>
        </div>
        {msg && (
          <div
            style={{
              marginTop: 20,
              padding: "12px 16px",
              borderRadius: 12,
              background: msg.ok
                ? "rgba(16,185,129,0.2)"
                : "rgba(239,68,68,0.2)",
              color: msg.ok ? "#6ee7b7" : "#fca5a5",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cartesian Chart ────────────────────────────────────────────
function calcDailyChartData(month, oiClients, salesList, despList) {
  const [year, mon] = month.split("-").map(Number);
  const dim = new Date(year, mon, 0).getDate();
  return Array.from({ length: dim }, (_, i) => {
    const day = i + 1;
    const dateStr = `${month}-${String(day).padStart(2, "0")}`;
    let fat = 0;
    oiClients.forEach((c) => {
      if (!c || !c.payments) return;
      Object.values(c.payments).forEach((p) => {
        const po =
          typeof p === "string"
            ? { status: p, paid: p === "pago" ? c.monthlyValue : 0, date: "" }
            : p;
        if (!po || po.date !== dateStr) return;
        if (po.status === "pago" || po.status === "parcial")
          fat += po.paid || 0;
      });
    });
    salesList.forEach((s) => {
      if (s.date === dateStr) fat += s.value;
    });
    let desp = 0;
    despList.forEach((d) => {
      if (d.date === dateStr) desp += d.value;
    });
    return {
      dateStr,
      day,
      faturamento: fat,
      despesas: desp,
      lucro: fat - desp,
    };
  });
}

function CartesianChart({ oiClients, sales, despesas, filterMonth, C }) {
  const [viewMonth, setViewMonth] = useState(filterMonth || currentMonth());
  const [hovered, setHovered] = useState(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, [viewMonth]);
  useEffect(() => {
    if (filterMonth) setViewMonth(filterMonth);
  }, [filterMonth]);

  const safeDesp = Array.isArray(despesas) ? despesas : [];
  const safeSales = Array.isArray(sales) ? sales : [];
  const data = calcDailyChartData(viewMonth, oiClients, safeSales, safeDesp);
  // only show days that have any value OR keep all days but compress display
  const todayStr = today();

  const allVals = data.flatMap((d) => [
    d.faturamento,
    d.despesas,
    Math.abs(d.lucro),
  ]);
  const maxV = Math.max(...allVals, 1);
  const totalFat = data.reduce((s, d) => s + d.faturamento, 0);
  const totalDesp = data.reduce((s, d) => s + d.despesas, 0);
  const totalLucro = data.reduce((s, d) => s + d.lucro, 0);

  // days with any payment
  const activeDays = data.filter((d) => d.faturamento > 0 || d.despesas > 0);

  const W = 620,
    H = 230,
    PL = 60,
    PR = 16,
    PT = 20,
    PB = 40;
  const cW = W - PL - PR,
    cH = H - PT - PB;
  const n = data.length;
  const xStep = n > 1 ? cW / (n - 1) : cW;
  const yScale = (v) => Math.max(0, (v / maxV) * cH);

  function pathSmooth(key) {
    const pts = data.map((d, i) => ({
      x: PL + i * xStep,
      y: PT + cH - yScale(Math.max(0, key === "lucro" ? d.lucro : d[key])),
    }));
    if (pts.length < 2) return "";
    let p = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cp1x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * 0.4;
      const cp2x = pts[i].x - (pts[i].x - pts[i - 1].x) * 0.4;
      p += ` C ${cp1x} ${pts[i - 1].y} ${cp2x} ${pts[i].y} ${pts[i].x} ${pts[i].y}`;
    }
    return p;
  }
  function areaPath(key) {
    const sm = pathSmooth(key);
    if (!sm) return "";
    const lastX = PL + (n - 1) * xStep;
    return `${sm} L ${lastX} ${PT + cH} L ${PL} ${PT + cH} Z`;
  }

  const SERIES = [
    { key: "faturamento", label: "Faturamento", color: "#6366f1", dash: false },
    { key: "despesas", label: "Despesas", color: "#ef4444", dash: false },
    { key: "lucro", label: "Lucro", color: "#10b981", dash: true },
  ];
  const yTicks = 4;
  // show every ~5th day label to avoid crowding
  const showLabel = (i) =>
    n <= 10 || i === 0 || i === n - 1 || (i + 1) % 5 === 0;

  return (
    <Card C={C} style={{ marginBottom: 20 }}>
      <div
        style={{
          padding: "18px 24px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.gradientPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            📊
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: C.text,
              }}
            >
              📈 Registro Diário — Faturamento · Despesas · Lucro
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: C.muted }}>
              Pagamentos registrados por data em{" "}
              {MESES[parseInt(viewMonth.split("-")[1]) - 1]}{" "}
              {viewMonth.split("-")[0]}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {activeDays.length > 0 && (
            <span
              style={{
                background: C.successLight,
                color: C.successDark,
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              ✅ {activeDays.length} dia(s) com lançamento
            </span>
          )}
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(e.target.value)}
            className="rb-input"
            style={{
              padding: "7px 12px",
              border: `1.5px solid ${C.border}`,
              borderRadius: 10,
              fontSize: 13,
              background: C.inputBg,
              color: C.text,
              outline: "none",
              fontFamily: "inherit",
            }}
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {fmtMonth(m)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ padding: "16px 24px 12px" }}>
        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 18,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          {SERIES.map((s) => (
            <div
              key={s.key}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <svg width="28" height="12">
                <line
                  x1="0"
                  y1="6"
                  x2="28"
                  y2="6"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeDasharray={s.dash ? "5,3" : "none"}
                />
                <circle cx="14" cy="6" r="3.5" fill={s.color} />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {maxV === 1 ? (
          <div
            style={{ padding: "40px 0", textAlign: "center", color: C.muted }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Nenhum pagamento registrado em {fmtMonth(viewMonth)}
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Registre pagamentos com a data correta para visualizar aqui.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <svg
              width="100%"
              viewBox={`0 0 ${W} ${H}`}
              style={{ fontFamily: "inherit", minWidth: 480, display: "block" }}
            >
              <defs>
                {SERIES.map((s) => (
                  <linearGradient
                    key={s.key}
                    id={`dgrad_${s.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {/* Grid */}
              {Array.from({ length: yTicks + 1 }).map((_, i) => {
                const y = PT + cH - (i / yTicks) * cH;
                const val = (i / yTicks) * maxV;
                return (
                  <g key={i}>
                    <line
                      x1={PL}
                      y1={y}
                      x2={W - PR}
                      y2={y}
                      stroke={C.border}
                      strokeWidth="1"
                      strokeDasharray="3,4"
                    />
                    <text
                      x={PL - 6}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="9"
                      fill={C.muted}
                    >
                      {val >= 1000
                        ? `R${(val / 1000).toFixed(1)}k`
                        : `R${Math.round(val)}`}
                    </text>
                  </g>
                );
              })}
              <line
                x1={PL}
                y1={PT + cH}
                x2={W - PR}
                y2={PT + cH}
                stroke={C.border}
                strokeWidth="1.5"
              />
              <line
                x1={PL}
                y1={PT}
                x2={PL}
                y2={PT + cH}
                stroke={C.border}
                strokeWidth="1.5"
              />

              {/* X labels (day numbers) */}
              {data.map((d, i) => {
                if (!showLabel(i)) return null;
                const x = PL + i * xStep;
                const isToday = d.dateStr === todayStr;
                return (
                  <text
                    key={i}
                    x={x}
                    y={H - 6}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isToday ? C.primary : C.muted}
                    fontWeight={isToday ? "700" : "400"}
                  >
                    {String(d.day).padStart(2, "0")}
                  </text>
                );
              })}

              {/* Today marker */}
              {data.map((d, i) => {
                if (d.dateStr !== todayStr) return null;
                const x = PL + i * xStep;
                return (
                  <line
                    key="today"
                    x1={x}
                    y1={PT}
                    x2={x}
                    y2={PT + cH}
                    stroke={C.primary}
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                    opacity="0.5"
                  />
                );
              })}

              {/* Area fills */}
              {animated &&
                SERIES.map((s) => (
                  <path
                    key={s.key}
                    d={areaPath(s.key)}
                    fill={`url(#dgrad_${s.key})`}
                  />
                ))}

              {/* Lines */}
              {animated &&
                SERIES.map((s) => (
                  <path
                    key={s.key}
                    d={pathSmooth(s.key)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2.5"
                    strokeDasharray={s.dash ? "6,3" : "none"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}

              {/* Dots + hover — only show on days with values */}
              {data.map((d, i) => {
                const x = PL + i * xStep;
                const isHov = hovered === i;
                const hasVal = d.faturamento > 0 || d.despesas > 0;
                return (
                  <g key={i}>
                    {isHov && (
                      <line
                        x1={x}
                        y1={PT}
                        x2={x}
                        y2={PT + cH}
                        stroke={C.primary}
                        strokeWidth="1"
                        strokeDasharray="3,3"
                        opacity="0.4"
                      />
                    )}
                    {SERIES.map((s) => {
                      const val = s.key === "lucro" ? d.lucro : d[s.key];
                      if (!isHov && !hasVal) return null;
                      const y = PT + cH - yScale(Math.max(0, val));
                      return (
                        <circle
                          key={s.key}
                          cx={x}
                          cy={y}
                          r={isHov ? 5 : hasVal ? 3 : 1.5}
                          fill={s.color}
                          stroke={C.card}
                          strokeWidth={isHov ? 2 : 1}
                          opacity={hasVal ? 1 : 0.3}
                          style={{ transition: "r 0.15s" }}
                        />
                      );
                    })}
                    {/* hit area */}
                    <rect
                      x={Math.max(PL, x - xStep / 2)}
                      y={PT}
                      width={xStep}
                      height={cH}
                      fill="transparent"
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: "crosshair" }}
                    />
                    {/* Tooltip */}
                    {isHov &&
                      (() => {
                        const tw = 128,
                          th = 76;
                        const tx = Math.min(x + 10, W - tw - 4);
                        const ty = PT + 4;
                        return (
                          <g>
                            <rect
                              x={tx}
                              y={ty}
                              width={tw}
                              height={th}
                              rx="8"
                              fill={C.card}
                              stroke={C.border}
                              strokeWidth="1"
                              filter="drop-shadow(0 2px 8px rgba(0,0,0,0.14))"
                            />
                            <text
                              x={tx + 10}
                              y={ty + 15}
                              fontSize="9.5"
                              fontWeight="800"
                              fill={C.primary}
                            >
                              {new Date(
                                d.dateStr + "T00:00:00",
                              ).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                              })}
                              {d.dateStr === todayStr ? " (hoje)" : ""}
                            </text>
                            {SERIES.map((s, si) => {
                              const val =
                                s.key === "lucro" ? d.lucro : d[s.key];
                              return (
                                <text
                                  key={s.key}
                                  x={tx + 10}
                                  y={ty + 28 + si * 16}
                                  fontSize="9"
                                  fill={s.color}
                                  fontWeight="700"
                                >
                                  {s.label}: {fmtMoney(val)}
                                </text>
                              );
                            })}
                          </g>
                        );
                      })()}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
            marginTop: 14,
          }}
        >
          {SERIES.map((s) => {
            const total =
              s.key === "faturamento"
                ? totalFat
                : s.key === "despesas"
                  ? totalDesp
                  : totalLucro;
            return (
              <div
                key={s.key}
                style={{
                  background: C.inputBg,
                  borderRadius: 12,
                  padding: "10px 14px",
                  border: `1.5px solid ${s.color}22`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: s.color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: C.muted,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label} acumulado
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: s.color,
                      marginTop: 1,
                    }}
                  >
                    {fmtMoney(total)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment day list */}
        {activeDays.length > 0 && (
          <div
            style={{
              marginTop: 14,
              padding: "12px 16px",
              background: C.inputBg,
              borderRadius: 14,
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              📅 Dias com lançamento
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {activeDays.map((d) => (
                <div
                  key={d.dateStr}
                  style={{
                    background:
                      d.faturamento > 0 ? C.successLight : C.dangerLight,
                    borderRadius: 10,
                    padding: "5px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    border: `1px solid ${d.faturamento > 0 ? C.success : C.danger}22`,
                  }}
                  onMouseEnter={() => setHovered(d.day - 1)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      color: d.faturamento > 0 ? C.successDark : C.dangerDark,
                    }}
                  >
                    {String(d.day).padStart(2, "0")}
                  </div>
                  {d.faturamento > 0 && (
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: C.successDark,
                      }}
                    >
                      {fmtMoney(d.faturamento)}
                    </div>
                  )}
                  {d.despesas > 0 && (
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: C.dangerDark,
                      }}
                    >
                      -{fmtMoney(d.despesas)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Dashboard ──────────────────────────────────────────────────
function DashboardPage({
  oiClients,
  groups,
  rbClients,
  sales,
  services,
  despesas,
  filterMonth,
  setFilterMonth,
  totalRecMes,
  totalPendMes,
  setPage,
  userName,
  C,
  hideValues,
}) {
  const pagoC = oiClients.filter(
    (c) => getPayStatus(c, filterMonth) === "pago",
  ).length;
  const parcialC = oiClients.filter(
    (c) => getPayStatus(c, filterMonth) === "parcial",
  ).length;
  const pendC = oiClients.filter(
    (c) => getPayStatus(c, filterMonth) === "pendente",
  ).length;
  const atrasC = oiClients.filter(
    (c) => getPayStatus(c, filterMonth) === "atrasado",
  ).length;
  const total = oiClients.length || 1;
  const salesTotal = sales
    .filter((s) => s.date && s.date.startsWith(filterMonth))
    .reduce((s, v) => s + v.value, 0);
  const todayStr = today();
  const todayServices = services.filter(
    (s) => s.date === todayStr && s.status === "agendado",
  );
  const upcomingServices = services
    .filter((s) => s.date >= todayStr && s.status === "agendado")
    .sort(
      (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
    )
    .slice(0, 4);
  const chartMonths = MONTHS.slice(0, 12);
  const monthVals = chartMonths.map((m) =>
    oiClients.reduce(
      (s, c) => s + (getPayStatus(c, m) === "pago" ? c.monthlyValue : 0),
      0,
    ),
  );
  const maxVal = Math.max(...monthVals, 1);
  const [barH, setBarH] = useState(monthVals.map(() => 0));
  useEffect(() => {
    const t = setTimeout(
      () => setBarH(monthVals.map((v) => Math.round((v / maxVal) * 100))),
      200,
    );
    return () => clearTimeout(t);
  }, [filterMonth, oiClients.length]);
  const statCards = [
    {
      label: "Clientes OI TV",
      value: oiClients.length,
      icon: "📺",
      gradient: C.gradientPrimary,
      nav: "oitv",
    },
    {
      label: "Recebido no Mês",
      value: maskVal(totalRecMes, hideValues),
      icon: "💰",
      gradient: G.success,
      nav: "financeiro",
    },
    {
      label: "Pendente",
      value: maskVal(totalPendMes, hideValues),
      icon: "⏳",
      gradient: G.warning,
      nav: "oitv",
    },
    {
      label: "Grupos OI TV",
      value: groups.length,
      icon: "👥",
      gradient: G.cyan,
      nav: "grupos",
    },
    {
      label: "Serviços Hoje",
      value: todayServices.length,
      icon: "📅",
      gradient: G.orange,
      nav: "calendario",
    },
  ];
  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      <Card
        style={{
          background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
          marginBottom: 24,
          overflow: "hidden",
          position: "relative",
        }}
        C={C}
      >
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.15)",
          }}
        />
        <div
          style={{
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            position: "relative",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Bem-vindo de volta 👋
            </p>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: 26,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {userName}
            </h2>
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              {[
                { l: "Pagos", v: pagoC, c: "#34d399" },
                { l: "Parcial", v: parcialC, c: "#60a5fa" },
                { l: "Pendentes", v: pendC, c: "#fbbf24" },
                { l: "Atrasados", v: atrasC, c: "#f87171" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: s.c,
                    }}
                  />
                  <span
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}
                  >
                    <strong style={{ color: s.c }}>{s.v}</strong> {s.l}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{
              padding: "9px 14px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 10,
              fontSize: 14,
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              cursor: "pointer",
              outline: "none",
              fontFamily: "inherit",
            }}
          >
            {MONTHS.map((m) => (
              <option
                key={m}
                value={m}
                style={{ color: "#000", background: "#fff" }}
              >
                {fmtMonth(m)}
              </option>
            ))}
          </select>
        </div>
      </Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {statCards.map((c, i) => (
          <div
            key={i}
            onClick={() => setPage(c.nav)}
            style={{ cursor: "pointer" }}
            className="rb-card"
          >
            <StatCard {...c} C={C} />
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <Card C={C}>
          <CardHeader title="Faturamento OI TV — 2026" icon="📈" C={C} />
          <div
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              height: 200,
            }}
          >
            {chartMonths.map((m, i) => {
              const isActive = m === filterMonth;
              return (
                <div
                  key={m}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 140,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${barH[i]}%`,
                        background: isActive ? C.gradientPrimary : C.border,
                        borderRadius: "6px 6px 0 0",
                        minHeight: barH[i] > 0 ? 4 : 0,
                        transition: "height 0.9s cubic-bezier(0.34,1.2,0.64,1)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 8,
                      color: isActive ? C.primary : C.muted,
                      fontWeight: isActive ? 700 : 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.split("-")[1]}/{m.split("-")[0].slice(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card C={C}>
          <CardHeader
            title="Status"
            subtitle={fmtMonth(filterMonth)}
            icon="📊"
            C={C}
          />
          <div style={{ padding: 24 }}>
            {[
              {
                label: "Pagos",
                count: pagoC,
                pct: Math.round((pagoC / total) * 100),
                color: G.success,
              },
              {
                label: "Pendentes",
                count: pendC,
                pct: Math.round((pendC / total) * 100),
                color: G.warning,
              },
              {
                label: "Atrasados",
                count: atrasC,
                pct: Math.round((atrasC / total) * 100),
                color: G.danger,
              },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 500, color: C.muted }}
                  >
                    {s.label}
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: C.text }}
                  >
                    {s.count}{" "}
                    <span style={{ color: C.muted, fontWeight: 400 }}>
                      ({s.pct}%)
                    </span>
                  </span>
                </div>
                <ProgBar pct={s.pct} color={s.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* ── Plano Cartesiano — Despesas / Lucro / Faturamento ── */}
      <CartesianChart
        oiClients={oiClients}
        sales={sales}
        despesas={despesas}
        C={C}
        filterMonth={filterMonth}
      />

      {upcomingServices.length > 0 && (
        <Card C={C}>
          <CardHeader
            title="📅 Próximos Serviços Agendados"
            icon="🔧"
            C={C}
            action={
              <Btn size="sm" onClick={() => setPage("calendario")} C={C}>
                Ver calendário
              </Btn>
            }
          />
          <div
            style={{
              padding: 20,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: 12,
            }}
          >
            {upcomingServices.map((s) => {
              const t = STYPE[s.type] || STYPE.suporte;
              return (
                <div
                  key={s.id}
                  style={{
                    background: t.light,
                    borderRadius: 14,
                    padding: "14px 16px",
                    border: `1px solid ${t.color}30`,
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                    {s.clientName}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    {t.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: t.color,
                      marginTop: 8,
                    }}
                  >
                    {new Date(s.date + "T00:00:00").toLocaleDateString(
                      "pt-BR",
                      { weekday: "short", day: "numeric", month: "short" },
                    )}{" "}
                    · {s.time}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Calendar ───────────────────────────────────────────────────
function CalendarPage({
  services,
  setServices,
  oiClients,
  C,
  onCreateOs,
  osOrders = [],
  setPage,
}) {
  const now = new Date();
  const [vy, setVy] = useState(now.getFullYear()),
    [vm, setVm] = useState(now.getMonth() + 1);
  const [view, setView] = useState("month"),
    [selDay, setSelDay] = useState(null);
  const [showForm, setShowForm] = useState(false),
    [editSvc, setEditSvc] = useState(null),
    [confirm, setConfirm] = useState(null);
  const [filterType, setFilterType] = useState("todos"),
    [search, setSearch] = useState("");
  const EMPTY_SVC = {
    type: "instalacao",
    clientName: "",
    phone: "",
    address: "",
    date: today(),
    time: "09:00",
    notes: "",
    status: "agendado",
    value: "",
  };
  const [form, setForm] = useState(EMPTY_SVC);
  const dim = new Date(vy, vm, 0).getDate();
  const fwd = new Date(vy, vm - 1, 1).getDay();
  const [wkStart, setWkStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  });
  const wkDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(wkStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  function prevM() {
    if (vm === 1) {
      setVm(12);
      setVy((y) => y - 1);
    } else setVm((m) => m - 1);
  }
  function nextM() {
    if (vm === 12) {
      setVm(1);
      setVy((y) => y + 1);
    } else setVm((m) => m + 1);
  }
  function saveSvc() {
    if (!form.clientName.trim()) return alert("Nome do cliente obrigatório");
    if (editSvc)
      setServices((p) =>
        p.map((s) =>
          s.id === editSvc.id
            ? { ...s, ...form, value: parseFloat(form.value) || 0 }
            : s,
        ),
      );
    else
      setServices((p) => [
        ...p,
        { ...form, id: Date.now(), value: parseFloat(form.value) || 0 },
      ]);
    setShowForm(false);
    setEditSvc(null);
  }
  function handleCreateOs(svc) {
    const linked = osOrders.find(
      (o) => String(o.linkedServiceId) === String(svc.id),
    );
    // store the service to prefill in OS page
    window.__pendingOsService = linked ? null : svc;
    window.__pendingOsLinkedId = linked ? linked.id : null;
    setPage("ordemservico");
  }
  function openNew(dateStr) {
    setForm({ ...EMPTY_SVC, date: dateStr || today() });
    setEditSvc(null);
    setShowForm(true);
  }
  function openEdit(svc) {
    setForm({ ...svc, value: String(svc.value || "") });
    setEditSvc(svc);
    setShowForm(true);
  }
  function del(id) {
    setConfirm({
      msg: "Excluir este serviço agendado?",
      onOk: () => {
        setServices((p) => p.filter((s) => s.id !== id));
        setConfirm(null);
      },
    });
  }
  function getDateStr(day) {
    return `${vy}-${p2(vm)}-${p2(day)}`;
  }
  function getDaySvcs(dateStr) {
    return services.filter(
      (s) =>
        s.date === dateStr && (filterType === "todos" || s.type === filterType),
    );
  }
  const allSvcs = services
    .filter((s) => {
      const q = search.toLowerCase();
      return (
        (!q ||
          s.clientName?.toLowerCase().includes(q) ||
          s.address?.toLowerCase().includes(q)) &&
        (filterType === "todos" || s.type === filterType)
      );
    })
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time),
    );
  const selDateStr = selDay ? getDateStr(selDay) : null;
  const selSvcs = selDateStr ? getDaySvcs(selDateStr) : [];
  const isCurrentMonth = vy === now.getFullYear() && vm === now.getMonth() + 1;
  const todayStr2 = today();
  const byType = Object.fromEntries(
    Object.keys(STYPE).map((k) => [
      k,
      services.filter((s) => s.type === k).length,
    ]),
  );
  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
          C={C}
        />
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="Total"
          value={services.length}
          icon="📋"
          gradient={C.gradientPrimary}
          C={C}
        />
        <StatCard
          label="Agendados"
          value={services.filter((s) => s.status === "agendado").length}
          icon="📅"
          gradient={G.info}
          C={C}
        />
        <StatCard
          label="Concluídos"
          value={services.filter((s) => s.status === "concluido").length}
          icon="✅"
          gradient={G.success}
          C={C}
        />
        <StatCard
          label="Hoje"
          value={getDaySvcs(todayStr2).length}
          icon="☀️"
          gradient={G.orange}
          C={C}
        />
      </div>
      <Card C={C} style={{ marginBottom: 16 }}>
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {view === "month" && (
              <>
                <button
                  onClick={prevM}
                  style={{
                    background: C.inputBg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    fontSize: 16,
                    color: C.text,
                  }}
                >
                  ‹
                </button>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 800,
                    minWidth: 200,
                    textAlign: "center",
                    color: C.text,
                  }}
                >
                  {MESES[vm - 1]} {vy}
                </h2>
                <button
                  onClick={nextM}
                  style={{
                    background: C.inputBg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    fontSize: 16,
                    color: C.text,
                  }}
                >
                  ›
                </button>
              </>
            )}
            {view === "week" && (
              <>
                <button
                  onClick={() =>
                    setWkStart((d) => {
                      const n = new Date(d);
                      n.setDate(n.getDate() - 7);
                      return n;
                    })
                  }
                  style={{
                    background: C.inputBg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    fontSize: 16,
                    color: C.text,
                  }}
                >
                  ‹
                </button>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    minWidth: 220,
                    textAlign: "center",
                    color: C.text,
                  }}
                >
                  {wkDays[0].toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  –{" "}
                  {wkDays[6].toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </h2>
                <button
                  onClick={() =>
                    setWkStart((d) => {
                      const n = new Date(d);
                      n.setDate(n.getDate() + 7);
                      return n;
                    })
                  }
                  style={{
                    background: C.inputBg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    fontSize: 16,
                    color: C.text,
                  }}
                >
                  ›
                </button>
              </>
            )}
            {view === "list" && (
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: C.text,
                }}
              >
                📋 Lista
              </h2>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rb-input"
              style={{
                padding: "8px 12px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                fontSize: 13,
                background: C.inputBg,
                color: C.text,
                outline: "none",
                fontFamily: "inherit",
              }}
            >
              <option value="todos">Todos</option>
              {Object.entries(STYPE).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.icon} {v.label}
                </option>
              ))}
            </select>
            <div
              style={{
                display: "flex",
                gap: 3,
                background: C.inputBg,
                borderRadius: 10,
                padding: 4,
                border: `1px solid ${C.border}`,
              }}
            >
              {[
                { k: "month", l: "📅 Mês" },
                { k: "week", l: "📆 Sem." },
                { k: "list", l: "📋 Lista" },
              ].map((v) => (
                <button
                  key={v.k}
                  onClick={() => setView(v.k)}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    background:
                      view === v.k ? C.gradientPrimary : "transparent",
                    color: view === v.k ? "#fff" : C.muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {v.l}
                </button>
              ))}
            </div>
            <Btn
              size="sm"
              onClick={() => openNew(selDateStr || todayStr2)}
              C={C}
            >
              + Novo
            </Btn>
          </div>
        </div>
      </Card>
      {view === "month" && (
        <div style={{ display: "flex", gap: 18 }}>
          <Card C={C} style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {WD.map((w) => (
                <div
                  key={w}
                  style={{
                    padding: "10px 6px",
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.muted,
                    textTransform: "uppercase",
                  }}
                >
                  {w}
                </div>
              ))}
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}
            >
              {Array.from({ length: fwd }).map((_, i) => (
                <div
                  key={`e${i}`}
                  style={{
                    minHeight: 90,
                    borderRight: `1px solid ${C.border}`,
                    borderBottom: `1px solid ${C.border}`,
                    background: C.inputBg + "80",
                  }}
                />
              ))}
              {Array.from({ length: dim }).map((_, i) => {
                const day = i + 1;
                const ds = getDateStr(day);
                const daySvcs = getDaySvcs(ds);
                const isToday = isCurrentMonth && day === now.getDate();
                const isSel = selDay === day;
                const osOrds = (
                  window.__rbOsOrders ? JSON.parse(window.__rbOsOrders) : []
                ).filter((o) =>
                  daySvcs.some(
                    (s) => String(o.linkedServiceId) === String(s.id),
                  ),
                );
                return (
                  <div
                    key={day}
                    className="cal-cell"
                    onClick={() => setSelDay((p) => (p === day ? null : day))}
                    style={{
                      minHeight: 90,
                      borderRight: `1px solid ${C.border}`,
                      borderBottom: `1px solid ${C.border}`,
                      padding: "7px 8px",
                      background: isSel ? `${C.primary}0e` : C.card,
                      borderLeft: isSel
                        ? `3px solid ${C.primary}`
                        : "3px solid transparent",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: isToday ? C.gradientPrimary : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: isToday ? 800 : 400,
                          color: isToday ? "#fff" : isSel ? C.primary : C.text,
                        }}
                      >
                        {day}
                      </span>
                    </div>
                    {daySvcs.slice(0, 3).map((s) => {
                      const t = STYPE[s.type] || STYPE.suporte;
                      const hasOs = osOrds.some(
                        (o) => String(o.linkedServiceId) === String(s.id),
                      );
                      return (
                        <div
                          key={s.id}
                          style={{
                            background: t.light,
                            borderRadius: 5,
                            padding: "2px 5px",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            marginBottom: 2,
                          }}
                        >
                          <span style={{ fontSize: 9 }}>{t.icon}</span>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              color: t.color,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 52,
                            }}
                          >
                            {s.clientName.split(" ")[0]}
                          </span>
                          {hasOs && (
                            <span
                              title="OS vinculada"
                              style={{
                                fontSize: 8,
                                background: "#6366f1",
                                color: "#fff",
                                borderRadius: 4,
                                padding: "0 3px",
                                fontWeight: 800,
                                flexShrink: 0,
                              }}
                            >
                              OS
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {daySvcs.length > 3 && (
                      <span
                        style={{ fontSize: 9, color: C.muted, paddingLeft: 4 }}
                      >
                        +{daySvcs.length - 3}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
          {selDay && (
            <div
              style={{ width: 290, flexShrink: 0, animation: "slideUp 0.2s" }}
            >
              <Card
                C={C}
                style={{
                  position: "sticky",
                  top: 80,
                  maxHeight: "calc(100vh - 100px)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: `1px solid ${C.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 800,
                      color: C.text,
                    }}
                  >
                    Dia {p2(selDay)} — {selSvcs.length} serviço(s)
                  </h3>
                  <button
                    onClick={() => setSelDay(null)}
                    style={{
                      background: C.inputBg,
                      border: "none",
                      borderRadius: "50%",
                      width: 26,
                      height: 26,
                      cursor: "pointer",
                      fontSize: 14,
                      color: C.muted,
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ padding: 12, overflowY: "auto", flex: 1 }}>
                  {selSvcs.length === 0 ? (
                    <EmptyState
                      icon="📭"
                      title="Nenhum serviço"
                      C={C}
                      action={
                        <Btn
                          size="sm"
                          onClick={() => openNew(selDateStr)}
                          C={C}
                        >
                          + Agendar
                        </Btn>
                      }
                    />
                  ) : (
                    selSvcs.map((s) => {
                      const t = STYPE[s.type] || STYPE.suporte;
                      const st = SSTAT[s.status] || SSTAT.agendado;
                      return (
                        <div
                          key={s.id}
                          style={{
                            background: t.light,
                            borderRadius: 12,
                            padding: "12px 14px",
                            marginBottom: 10,
                            border: `1px solid ${t.color}25`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: C.text,
                                }}
                              >
                                {t.icon} {s.clientName}
                              </div>
                              <div style={{ fontSize: 11, color: C.muted }}>
                                {t.label} · {s.time}
                              </div>
                              {s.address && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: C.muted,
                                    marginTop: 2,
                                  }}
                                >
                                  📍 {s.address}
                                </div>
                              )}
                            </div>
                            <div
                              style={{ display: "flex", gap: 3, flexShrink: 0 }}
                            >
                              <button
                                onClick={() => openEdit(s)}
                                className="rb-btn"
                                style={{
                                  background: "rgba(255,255,255,0.8)",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "4px 6px",
                                  cursor: "pointer",
                                  fontSize: 11,
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => del(s.id)}
                                className="rb-btn"
                                style={{
                                  background: "rgba(255,255,255,0.8)",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "4px 6px",
                                  cursor: "pointer",
                                  fontSize: 11,
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: 8,
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                background: st.bg,
                                color: st.c,
                                padding: "2px 8px",
                                borderRadius: 20,
                                fontSize: 9,
                                fontWeight: 700,
                              }}
                            >
                              {st.label}
                            </span>
                            {(() => {
                              const linked = osOrders.find(
                                (o) =>
                                  String(o.linkedServiceId) === String(s.id),
                              );
                              return (
                                <button
                                  onClick={() => handleCreateOs(s)}
                                  style={{
                                    background: linked
                                      ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                                      : "linear-gradient(135deg,#f59e0b,#d97706)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "3px 9px",
                                    fontSize: 9,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  📋 {linked ? `OS #${linked.id}` : "Criar OS"}
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <Btn
                    size="sm"
                    fullWidth
                    onClick={() => openNew(selDateStr)}
                    C={C}
                    style={{ marginTop: 4 }}
                  >
                    + Novo Serviço
                  </Btn>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
      {view === "list" && (
        <Card C={C}>
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar..."
              C={C}
            />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 720,
              }}
            >
              <thead>
                <tr style={{ background: C.inputBg }}>
                  {[
                    "Tipo",
                    "Cliente",
                    "Data",
                    "Hora",
                    "Endereço",
                    "Valor",
                    "Status",
                    "Ações",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 16px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.muted,
                        borderBottom: `1px solid ${C.border}`,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSvcs.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState
                        icon="📅"
                        title="Nenhum serviço"
                        C={C}
                        action={
                          <Btn
                            size="sm"
                            onClick={() => openNew(todayStr2)}
                            C={C}
                          >
                            + Agendar
                          </Btn>
                        }
                      />
                    </td>
                  </tr>
                )}
                {allSvcs.map((s) => {
                  const t = STYPE[s.type] || STYPE.suporte;
                  const st = SSTAT[s.status] || SSTAT.agendado;
                  return (
                    <tr
                      key={s.id}
                      className="rb-row"
                      style={{ borderBottom: `1px solid ${C.border}` }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: t.light,
                            color: t.color,
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.icon} {t.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: C.text,
                          }}
                        >
                          {s.clientName}
                        </div>
                        {s.phone && (
                          <div style={{ fontSize: 11, color: C.muted }}>
                            {s.phone}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.text,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(s.date + "T00:00:00").toLocaleDateString(
                          "pt-BR",
                          {
                            weekday: "short",
                            day: "2-digit",
                            month: "2-digit",
                          },
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        {s.time}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          color: C.muted,
                          maxWidth: 140,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.address || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.successDark,
                        }}
                      >
                        {s.value > 0 ? fmtMoney(s.value) : "—"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: st.bg,
                            color: st.c,
                            padding: "3px 9px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            onClick={() => openEdit(s)}
                            className="rb-btn"
                            style={{
                              background: C.warningLight,
                              color: C.warningDark,
                              border: "none",
                              borderRadius: 8,
                              padding: "6px 9px",
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => del(s.id)}
                            className="rb-btn"
                            style={{
                              background: C.dangerLight,
                              color: C.dangerDark,
                              border: "none",
                              borderRadius: 8,
                              padding: "6px 9px",
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            🗑️
                          </button>
                          {(() => {
                            const linked = osOrders.find(
                              (o) => String(o.linkedServiceId) === String(s.id),
                            );
                            return (
                              <button
                                onClick={() => handleCreateOs(s)}
                                style={{
                                  background: linked
                                    ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                                    : "linear-gradient(135deg,#f59e0b,#d97706)",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 8,
                                  padding: "6px 10px",
                                  fontSize: 11,
                                  fontWeight: 800,
                                  cursor: "pointer",
                                  fontFamily: "inherit",
                                }}
                              >
                                📋 {linked ? `OS #${linked.id}` : "Criar OS"}
                              </button>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {showForm && (
        <Modal
          title={editSvc ? "✏️ Editar Serviço" : "📅 Novo Serviço"}
          onClose={() => {
            setShowForm(false);
            setEditSvc(null);
          }}
          C={C}
          maxWidth={560}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <Dropdown
              label="Tipo"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              C={C}
              options={Object.entries(STYPE).map(([k, v]) => ({
                value: k,
                label: `${v.icon} ${v.label}`,
              }))}
            />
            <Dropdown
              label="Status"
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
              C={C}
              options={Object.entries(SSTAT).map(([k, v]) => ({
                value: k,
                label: v.label,
              }))}
            />
            <Field
              label="Data"
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              C={C}
            />
            <Field
              label="Horário"
              type="time"
              value={form.time}
              onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
              C={C}
            />
          </div>
          <Field
            label="Nome do Cliente *"
            value={form.clientName}
            onChange={(e) =>
              setForm((p) => ({ ...p, clientName: e.target.value }))
            }
            C={C}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <Field
              label="Telefone"
              mask="phone"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              C={C}
              placeholder="(63) 99999-0000"
            />
            <Field
              label="Valor (R$)"
              value={form.value}
              onChange={(e) =>
                setForm((p) => ({ ...p, value: e.target.value }))
              }
              C={C}
            />
          </div>
          <Field
            label="Endereço"
            value={form.address}
            onChange={(e) =>
              setForm((p) => ({ ...p, address: e.target.value }))
            }
            C={C}
          />
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
              }}
            >
              Observações
            </label>
            <textarea
              value={form.notes || ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              rows={3}
              className="rb-input"
              style={{
                width: "100%",
                padding: "11px 14px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                fontSize: 13,
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit",
                background: C.inputBg,
                color: C.text,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditSvc(null);
              }}
              C={C}
            >
              Cancelar
            </Btn>
            <Btn onClick={saveSvc} C={C}>
              💾 Salvar
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Client Form Modal ──────────────────────────────────────────
const EMPTY_CLIENT = {
  name: "",
  cpf: "",
  phone: "",
  address: "",
  dueDate: "",
  monthlyValue: "",
  caid: "",
  card: "",
  notes: "",
  groupId: "",
};
function ClientFormModal({ client, groups, onSave, onClose, title, C }) {
  const [form, setForm] = useState(
    client
      ? {
          ...client,
          monthlyValue: String(client.monthlyValue || ""),
          groupId: String(client.groupId || ""),
        }
      : EMPTY_CLIENT,
  );
  function save() {
    if (!form.name) return alert("Nome obrigatório");
    onSave({
      ...form,
      monthlyValue: parseFloat(form.monthlyValue) || 0,
      groupId: parseInt(form.groupId) || null,
    });
  }
  return (
    <Modal
      title={title || (client ? "Editar Cliente" : "Novo Cliente OI TV")}
      onClose={onClose}
      C={C}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0 16px",
        }}
      >
        <Field
          label="Nome Completo *"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          C={C}
        />
        <Field
          label="CPF"
          mask="cpf"
          value={form.cpf}
          onChange={(e) => setForm((p) => ({ ...p, cpf: e.target.value }))}
          placeholder="000.000.000-00"
          C={C}
        />
        <Field
          label="Telefone"
          mask="phone"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="(63) 99999-0000"
          C={C}
        />
        <Field
          label="Dia de Vencimento"
          mask="day"
          value={form.dueDate}
          onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
          onBlur={(e) =>
            setForm((p) => ({ ...p, dueDate: padDay(e.target.value) }))
          }
          placeholder="01"
          C={C}
        />
        <Field
          label="Valor Mensal (R$)"
          value={form.monthlyValue}
          onChange={(e) =>
            setForm((p) => ({ ...p, monthlyValue: e.target.value }))
          }
          placeholder="89.90"
          C={C}
        />
        <Field
          label="CAID"
          value={form.caid}
          onChange={(e) => setForm((p) => ({ ...p, caid: e.target.value }))}
          C={C}
        />
        <Field
          label="Cartão"
          value={form.card}
          onChange={(e) => setForm((p) => ({ ...p, card: e.target.value }))}
          C={C}
        />
        <Dropdown
          label="Grupo"
          value={form.groupId}
          onChange={(e) => setForm((p) => ({ ...p, groupId: e.target.value }))}
          options={[
            { value: "", label: "Sem grupo" },
            ...groups.map((g) => ({
              value: String(g.id),
              label: g.responsible,
            })),
          ]}
          C={C}
        />
      </div>
      <Field
        label="Endereço"
        value={form.address}
        onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
        C={C}
      />
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
          }}
        >
          Observações
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={2}
          className="rb-input"
          style={{
            width: "100%",
            padding: "11px 14px",
            border: `1.5px solid ${C.border}`,
            borderRadius: 10,
            fontSize: 13,
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: "inherit",
            background: C.inputBg,
            color: C.text,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose} C={C}>
          Cancelar
        </Btn>
        <Btn onClick={save} C={C}>
          💾 Salvar
        </Btn>
      </div>
    </Modal>
  );
}

// ── OI TV ──────────────────────────────────────────────────────
function OiTvPage({
  clients,
  setClients,
  groups,
  filterMonth,
  setFilterMonth,
  C,
  hideValues,
}) {
  const [editClient, setEditClient] = useState(null),
    [showNew, setShowNew] = useState(false),
    [payClient, setPayClient] = useState(null),
    [histClient, setHistClient] = useState(null),
    [search, setSearch] = useState(""),
    [statusF, setStatusF] = useState("todos"),
    [confirm, setConfirm] = useState(null);
  const groupMap = {};
  groups.forEach((g) => {
    groupMap[g.id] = g.responsible;
  });
  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const match =
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.cpf?.includes(q) ||
      c.phone?.includes(q) ||
      c.caid?.toLowerCase().includes(q);
    const st = getPayStatus(c, filterMonth);
    const isActive = groups.some((g) => String(g.id) === String(c.groupId));
    if (!match) return false;
    if (statusF === "todos") return true;
    if (statusF === "inativo") return !isActive;
    return isActive && st === statusF;
  });
  function saveNew(data) {
    setClients((p) => [...p, { ...data, id: Date.now(), payments: {} }]);
    setShowNew(false);
  }
  function saveEdit(data) {
    setClients((p) =>
      p.map((c) => (c.id === editClient.id ? { ...c, ...data } : c)),
    );
    setEditClient(null);
  }
  function del(id) {
    setConfirm({
      msg: "Excluir este cliente OI TV?",
      onOk: () => {
        setClients((p) => p.filter((c) => c.id !== id));
        setConfirm(null);
      },
    });
  }
  function savePay(cid, payObj) {
    setClients((p) =>
      p.map((c) =>
        c.id === cid
          ? { ...c, payments: { ...c.payments, [filterMonth]: payObj } }
          : c,
      ),
    );
    setPayClient(null);
  }
  const totalRec = filtered.reduce(
    (s, c) =>
      s + (getPayStatus(c, filterMonth) === "pago" ? c.monthlyValue : 0),
    0,
  );
  const totalPend = filtered.reduce(
    (s, c) =>
      s + (getPayStatus(c, filterMonth) !== "pago" ? c.monthlyValue : 0),
    0,
  );
  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
          C={C}
        />
      )}
      {showNew && (
        <ClientFormModal
          groups={groups}
          onSave={saveNew}
          onClose={() => setShowNew(false)}
          C={C}
        />
      )}
      {editClient && (
        <ClientFormModal
          client={editClient}
          groups={groups}
          onSave={saveEdit}
          onClose={() => setEditClient(null)}
          C={C}
        />
      )}
      {payClient && (
        <PaymentModal
          client={payClient}
          month={filterMonth}
          onSave={(obj) => savePay(payClient.id, obj)}
          onClose={() => setPayClient(null)}
          C={C}
        />
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="Recebido"
          value={maskVal(totalRec, hideValues)}
          icon="✅"
          gradient={G.success}
          C={C}
        />
        <StatCard
          label="Pendente/Atrasado"
          value={maskVal(totalPend, hideValues)}
          icon="⚠️"
          gradient={G.danger}
          C={C}
        />
      </div>
      <Card C={C}>
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar..."
              C={C}
            />
          </div>
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            className="rb-input"
            style={{
              padding: "10px 14px",
              border: `1.5px solid ${C.border}`,
              borderRadius: 10,
              fontSize: 14,
              background: C.inputBg,
              color: C.text,
              outline: "none",
              fontFamily: "inherit",
            }}
          >
            {[
              "todos",
              "pago",
              "parcial",
              "pendente",
              "atrasado",
              "inativo",
            ].map((s) => (
              <option key={s} value={s}>
                {s === "inativo"
                  ? "🟤 Inativo"
                  : s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="rb-input"
            style={{
              padding: "10px 14px",
              border: `1.5px solid ${C.border}`,
              borderRadius: 10,
              fontSize: 14,
              background: C.inputBg,
              color: C.text,
              outline: "none",
              fontFamily: "inherit",
            }}
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {fmtMonth(m)}
              </option>
            ))}
          </select>
          <Btn
            variant="export"
            size="sm"
            onClick={() => exportOiCsv(filtered, filterMonth)}
            C={C}
          >
            ⬇️ CSV
          </Btn>
          <Btn size="sm" onClick={() => setShowNew(true)} C={C}>
            + Novo
          </Btn>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}
          >
            <thead>
              <tr style={{ background: C.inputBg }}>
                {[
                  "Cliente",
                  "CAID",
                  "CPF",
                  "Telefone",
                  "Venc.",
                  "Valor",
                  "Status",
                  "Grupo",
                  "Ações",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.muted,
                      borderBottom: `1px solid ${C.border}`,
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      icon="🔍"
                      title="Nenhum cliente encontrado"
                      C={C}
                    />
                  </td>
                </tr>
              )}
              {filtered.map((c) => {
                const st = getPayStatus(c, filterMonth);
                return (
                  <tr
                    key={c.id}
                    className="rb-row"
                    style={{ borderBottom: `1px solid ${C.border}` }}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div
                        style={{ fontWeight: 600, fontSize: 14, color: C.text }}
                      >
                        {c.name}
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      {c.caid ? (
                        <span
                          style={{
                            background: C.purpleLight,
                            color: C.purpleDark,
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {c.caid}
                        </span>
                      ) : (
                        <span style={{ color: C.muted }}>—</span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 13,
                        color: C.muted,
                      }}
                    >
                      {c.cpf || "—"}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 13,
                        color: C.muted,
                      }}
                    >
                      {c.phone || "—"}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 13,
                        color: C.muted,
                      }}
                    >
                      Dia {c.dueDate}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontWeight: 700,
                        fontSize: 14,
                        color: C.text,
                      }}
                    >
                      {maskVal(c.monthlyValue, hideValues)}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      {groups.some(
                        (g) => String(g.id) === String(c.groupId),
                      ) ? (
                        <StatusBadge status={st} C={C} />
                      ) : (
                        <span
                          style={{
                            background: "#6B3A1F22",
                            color: "#6B3A1F",
                            border: "1.5px solid #8B5A2B55",
                            padding: "3px 12px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#8B5A2B",
                              flexShrink: 0,
                            }}
                          />
                          Inativo
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 13,
                        color: C.muted,
                      }}
                    >
                      {groupMap[c.groupId] || "—"}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        {[
                          {
                            icon: "💳",
                            bg: C.successLight,
                            c: C.successDark,
                            fn: () => setPayClient(c),
                          },
                          {
                            icon: "🧾",
                            bg: C.purpleLight,
                            c: C.purpleDark,
                            fn: () => {
                              const po = getPayObj(c, filterMonth);
                              po && po.paid > 0
                                ? generateReceipt(c, filterMonth, po)
                                : alert("Sem pagamento registrado.");
                            },
                          },
                          {
                            icon: "📋",
                            bg: C.infoLight,
                            c: C.infoDark,
                            fn: () => setHistClient(c),
                          },
                          {
                            icon: "💬",
                            bg: "#dcfce7",
                            c: "#166534",
                            fn: () => sendCobranca(c, filterMonth),
                          },
                          {
                            icon: "✏️",
                            bg: C.warningLight,
                            c: C.warningDark,
                            fn: () => setEditClient(c),
                          },
                          {
                            icon: "🗑️",
                            bg: C.dangerLight,
                            c: C.dangerDark,
                            fn: () => del(c.id),
                          },
                        ].map((btn, j) => (
                          <button
                            key={j}
                            onClick={btn.fn}
                            className="rb-btn"
                            style={{
                              background: btn.bg,
                              color: btn.c,
                              border: "none",
                              borderRadius: 8,
                              padding: "6px 9px",
                              fontSize: 12,
                              cursor: "pointer",
                            }}
                          >
                            {btn.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {histClient && (
        <Modal
          title={`Histórico — ${histClient.name}`}
          onClose={() => setHistClient(null)}
          C={C}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {[
              ["CPF", histClient.cpf],
              ["Telefone", histClient.phone],
              ["CAID", histClient.caid],
              ["Cartão", histClient.card],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  background: C.inputBg,
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: 3,
                  }}
                >
                  {k}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  {v || "—"}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            {MONTHS.map((m) => {
              const st = getPayStatus(histClient, m);
              const po = getPayObj(histClient, m);
              return (
                <div
                  key={m}
                  style={{
                    padding: "10px 14px",
                    background: C.inputBg,
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 500, color: C.text }}
                  >
                    {fmtMonth(m)}
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {po?.paid > 0 && (
                      <span
                        style={{ fontSize: 12, color: C.info, fontWeight: 600 }}
                      >
                        {fmtMoney(po.paid)}
                      </span>
                    )}
                    <StatusBadge status={st} C={C} />
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Groups ─────────────────────────────────────────────────────
function GroupsPage({
  groups,
  setGroups,
  clients,
  setClients,
  filterMonth,
  despesas,
  setDespesas,
  C,
  hideValues,
}) {
  const [form, setForm] = useState({
    responsible: "",
    cpf: "",
    contract: "",
    motherName: "",
    birthDate: "",
    notes: "",
    investedValue: "",
    settled: false,
  });
  const [editId, setEditId] = useState(null),
    [showModal, setShowModal] = useState(false),
    [expanded, setExpanded] = useState(null),
    [search, setSearch] = useState(""),
    [confirm, setConfirm] = useState(null);
  const [editClient, setEditClient] = useState(null),
    [payClient, setPayClient] = useState(null),
    [showNewCli, setShowNewCli] = useState(null),
    [clientConfirm, setClientConfirm] = useState(null);
  const [groupPayModal, setGroupPayModal] = useState(null),
    [gpVal, setGpVal] = useState(""),
    [gpDate, setGpDate] = useState(today()),
    [gpNotes, setGpNotes] = useState("");
  const EMPTY_GROUP = {
    responsible: "",
    cpf: "",
    contract: "",
    motherName: "",
    birthDate: "",
    notes: "",
    investedValue: "",
    settled: false,
  };
  function save() {
    if (!form.responsible) return alert("Nome obrigatório");
    const data = {
      ...form,
      investedValue: parseFloat(form.investedValue) || 0,
    };
    if (editId)
      setGroups((p) => p.map((g) => (g.id === editId ? { ...g, ...data } : g)));
    else setGroups((p) => [...p, { ...data, id: Date.now() }]);
    setShowModal(false);
    setEditId(null);
  }
  function openEdit(e, g) {
    e.stopPropagation();
    setForm({
      ...g,
      investedValue: String(g.investedValue || ""),
      settled: g.settled || false,
    });
    setEditId(g.id);
    setShowModal(true);
  }
  function del(e, id) {
    e.stopPropagation();
    setConfirm({
      msg: "Excluir este grupo?",
      onOk: () => {
        setGroups((p) => p.filter((g) => g.id !== id));
        setConfirm(null);
        if (expanded === id) setExpanded(null);
      },
    });
  }
  function saveGroupPay(gId, value, date, notes) {
    const group = groups.find((x) => x.id === gId);
    const old = group?.groupPayment;
    // update group
    setGroups((p) =>
      p.map((x) =>
        x.id === gId ? { ...x, groupPayment: { value, date, notes } } : x,
      ),
    );
    // sync despesa: remove old entry for this group+month, add new
    const despMonth = date.slice(0, 7);
    const despKey = `grupo_${gId}`;
    setDespesas((p) => {
      const sem = p.filter(
        (d) => d._groupKey !== despKey || d.month !== despMonth,
      );
      return [
        ...sem,
        {
          id:
            old?.(
              p.find((d) => d._groupKey === despKey && d.month === despMonth)
                ?.id,
            ) || Date.now(),
          _groupKey: despKey,
          description: `Pagamento do grupo — ${group?.responsible || "Grupo"}`,
          supplier: group?.responsible || "Grupo OI TV",
          category: "fornecedor",
          paymentMethod: "pix",
          value,
          date,
          month: despMonth,
          notes: notes || `Ref.: ${fmtMonth(despMonth)} — Grupo OI TV`,
        },
      ];
    });
    setGroupPayModal(null);
  }
  function savePay(cid, payObj) {
    setClients((p) =>
      p.map((c) =>
        c.id === cid
          ? { ...c, payments: { ...c.payments, [filterMonth]: payObj } }
          : c,
      ),
    );
    setPayClient(null);
  }
  const filtered = groups.filter(
    (g) =>
      !search ||
      g.responsible?.toLowerCase().includes(search.toLowerCase()) ||
      g.contract?.includes(search),
  );
  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
          C={C}
        />
      )}
      {clientConfirm && (
        <ConfirmDialog
          msg={clientConfirm.msg}
          onOk={clientConfirm.onOk}
          onCancel={() => setClientConfirm(null)}
          C={C}
        />
      )}
      {showNewCli !== null && (
        <ClientFormModal
          groups={groups}
          onSave={(d) => {
            setClients((p) => [
              ...p,
              { ...d, id: Date.now(), payments: {}, groupId: showNewCli },
            ]);
            setShowNewCli(null);
          }}
          onClose={() => setShowNewCli(null)}
          title="Novo Cliente no Grupo"
          C={C}
        />
      )}
      {editClient && (
        <ClientFormModal
          client={editClient}
          groups={groups}
          onSave={(d) => {
            setClients((p) =>
              p.map((c) => (c.id === editClient.id ? { ...c, ...d } : c)),
            );
            setEditClient(null);
          }}
          onClose={() => setEditClient(null)}
          C={C}
        />
      )}
      {payClient && (
        <PaymentModal
          client={payClient}
          month={filterMonth}
          onSave={(obj) => savePay(payClient.id, obj)}
          onClose={() => setPayClient(null)}
          C={C}
        />
      )}
      {groupPayModal && (
        <Modal
          title="💰 Pagamento do Grupo"
          onClose={() => setGroupPayModal(null)}
          maxWidth={420}
          C={C}
        >
          <Field
            label="Valor Recebido (R$)"
            type="number"
            value={gpVal}
            onChange={(e) => setGpVal(e.target.value)}
            C={C}
          />
          <Field
            label="Data"
            type="date"
            value={gpDate}
            onChange={(e) => setGpDate(e.target.value)}
            C={C}
          />
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
              }}
            >
              Observação
            </label>
            <textarea
              value={gpNotes}
              onChange={(e) => setGpNotes(e.target.value)}
              rows={3}
              className="rb-input"
              style={{
                width: "100%",
                padding: "11px 14px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                fontSize: 13,
                boxSizing: "border-box",
                fontFamily: "inherit",
                background: C.inputBg,
                color: C.text,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn
              variant="secondary"
              onClick={() => setGroupPayModal(null)}
              C={C}
            >
              Cancelar
            </Btn>
            <Btn
              variant="success"
              onClick={() =>
                saveGroupPay(
                  groupPayModal.id,
                  parseFloat(gpVal) || 0,
                  gpDate,
                  gpNotes,
                )
              }
              C={C}
            >
              ✅ Confirmar
            </Btn>
          </div>
        </Modal>
      )}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar grupo..."
            C={C}
          />
        </div>
        <Btn
          onClick={() => {
            setForm(EMPTY_GROUP);
            setEditId(null);
            setShowModal(true);
          }}
          C={C}
        >
          + Novo Grupo
        </Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <Card C={C}>
            <EmptyState title="Nenhum grupo cadastrado" C={C} />
          </Card>
        )}
        {filtered.map((g) => {
          const gc = clients.filter((c) => String(c.groupId) === String(g.id));
          const isOpen = expanded === g.id;
          // ── dynamic limit based on group name ─────────────────
          const limit = getGroupLimit(g.responsible);
          const isSpecialGroup = limit > 5;
          const totalInvest = gc.reduce((s, c) => s + c.monthlyValue, 0);
          const totalPago = gc.reduce(
            (s, c) =>
              s +
              (getPayStatus(c, filterMonth) === "pago" ? c.monthlyValue : 0),
            0,
          );
          const totalParcial = gc.reduce((s, c) => {
            const po = getPayObj(c, filterMonth);
            return (
              s +
              (po && po.paid && getPayStatus(c, filterMonth) === "parcial"
                ? po.paid
                : 0)
            );
          }, 0);
          const totalPend = totalInvest - totalPago - totalParcial;
          const pctPago =
            totalInvest > 0
              ? Math.min(
                  100,
                  Math.round(((totalPago + totalParcial) / totalInvest) * 100),
                )
              : 0;
          return (
            <div
              key={g.id}
              style={{
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: isOpen ? shadow.md : shadow.sm,
                border: `2px solid ${isOpen ? C.primary : isSpecialGroup ? "#f59e0b" : C.border}`,
                background: C.card,
                transition: "all 0.3s",
              }}
            >
              <div
                onClick={() => setExpanded((p) => (p === g.id ? null : g.id))}
                style={{
                  padding: "18px 24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: isOpen
                    ? "linear-gradient(135deg,#0f172a,#1e1b4b)"
                    : "transparent",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    transition: "transform 0.3s",
                    transform: isOpen ? "rotate(90deg)" : "none",
                    color: isOpen ? "rgba(255,255,255,0.5)" : C.muted,
                  }}
                >
                  ▶
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: isOpen
                      ? "rgba(255,255,255,0.1)"
                      : isSpecialGroup
                        ? "linear-gradient(135deg,#f59e0b,#d97706)"
                        : C.gradientPrimary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {isSpecialGroup ? "⭐" : "👥"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 700,
                        color: isOpen ? "#fff" : C.text,
                      }}
                    >
                      {g.responsible}
                    </h3>
                    {/* ── Pago badge ── */}
                    {g.groupPayment && g.groupPayment.value > 0 && (
                      <span
                        style={{
                          background: "linear-gradient(135deg,#10b981,#059669)",
                          color: "#fff",
                          borderRadius: 20,
                          padding: "2px 10px",
                          fontSize: 10,
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        ✅ Pago
                      </span>
                    )}
                    {/* ── Claro/Box badge ── */}
                    {isSpecialGroup && (
                      <span
                        style={{
                          background: "linear-gradient(135deg,#f59e0b,#d97706)",
                          color: "#fff",
                          borderRadius: 20,
                          padding: "2px 10px",
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      >
                        {g.responsible.toLowerCase().includes("claro")
                          ? "☎️ CLARO"
                          : "📺 BOX"}{" "}
                        · até {limit}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 3 }}>
                    <span
                      style={{
                        fontSize: 12,
                        color: isOpen ? "rgba(255,255,255,0.4)" : C.muted,
                      }}
                    >
                      Contrato: {g.contract || "—"}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: isOpen ? "rgba(255,255,255,0.4)" : C.muted,
                      }}
                    >
                      {gc.length}/{limit} clientes
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: isOpen ? "#34d399" : C.successDark,
                      }}
                    >
                      {maskVal(totalPago + totalParcial, hideValues)}
                    </div>
                    {totalPend > 0 && (
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: isOpen ? "#f87171" : C.dangerDark,
                        }}
                      >
                        {hideValues ? HIDDEN_VAL : `-${fmtMoney(totalPend)}`}
                      </div>
                    )}
                  </div>
                  <div
                    style={{ display: "flex", gap: 6 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => openEdit(e, g)}
                      className="rb-btn"
                      style={{
                        background: isOpen
                          ? "rgba(255,255,255,0.12)"
                          : C.warningLight,
                        color: isOpen ? "#fff" : C.warningDark,
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 10px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => del(e, g.id)}
                      className="rb-btn"
                      style={{
                        background: isOpen
                          ? "rgba(255,255,255,0.12)"
                          : C.dangerLight,
                        color: isOpen ? "#fff" : C.dangerDark,
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 10px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: 24, animation: "slideUp 0.22s" }}>
                  {/* Info */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                      gap: 10,
                      marginBottom: 18,
                    }}
                  >
                    {[
                      { icon: "👤", label: "CPF", value: g.cpf || "—" },
                      {
                        icon: "👩",
                        label: "Nome da Mãe",
                        value: g.motherName || "—",
                      },
                      {
                        icon: "🎂",
                        label: "Nascimento",
                        value: g.birthDate
                          ? new Date(
                              g.birthDate + "T00:00:00",
                            ).toLocaleDateString("pt-BR")
                          : "—",
                      },
                      {
                        icon: "📄",
                        label: "Contrato",
                        value: g.contract || "—",
                      },
                    ].map((d, i) => (
                      <div
                        key={i}
                        style={{
                          background: C.inputBg,
                          borderRadius: 12,
                          padding: "10px 14px",
                          border: `1px solid ${C.border}`,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span style={{ fontSize: 18, flexShrink: 0 }}>
                          {d.icon}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: C.muted,
                              textTransform: "uppercase",
                              marginBottom: 2,
                            }}
                          >
                            {d.label}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.text,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {d.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Limit badge */}
                  {isSpecialGroup && (
                    <div
                      style={{
                        marginBottom: 14,
                        padding: "10px 16px",
                        background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                        borderRadius: 12,
                        border: "1.5px solid #fcd34d",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>⭐</span>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: "#92400e",
                          }}
                        >
                          Grupo Especial — Capacidade Ampliada
                        </div>
                        <div style={{ fontSize: 11, color: "#a16207" }}>
                          Este grupo (
                          {g.responsible.toLowerCase().includes("claro")
                            ? "Claro"
                            : "Box"}
                          ) permite até <strong>{limit} clientes</strong>{" "}
                          (padrão: 5)
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.muted,
                        }}
                      >
                        Progresso
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: pctPago === 100 ? C.success : C.warning,
                        }}
                      >
                        {pctPago}%
                      </span>
                    </div>
                    <ProgBar
                      pct={pctPago}
                      color={pctPago === 100 ? G.success : G.warning}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                    {[
                      {
                        l: "Total",
                        v: totalInvest,
                        bg: C.purpleLight,
                        tc: C.purpleDark,
                        icon: "💼",
                      },
                      {
                        l: "Recebido",
                        v: totalPago + totalParcial,
                        bg: C.successLight,
                        tc: C.successDark,
                        icon: "✅",
                      },
                      {
                        l: "Pendente",
                        v: Math.max(0, totalPend),
                        bg: totalPend > 0 ? C.dangerLight : C.successLight,
                        tc: totalPend > 0 ? C.dangerDark : C.successDark,
                        icon: totalPend > 0 ? "⏳" : "🎉",
                      },
                    ].map((card, i) => (
                      <div
                        key={i}
                        style={{
                          background: card.bg,
                          borderRadius: 14,
                          padding: "14px 16px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: 18, marginBottom: 4 }}>
                          {card.icon}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: card.tc,
                          }}
                        >
                          {maskVal(card.v, hideValues)}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: card.tc,
                            marginTop: 2,
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {card.l}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Group payment */}
                  <div
                    style={{
                      background: C.inputBg,
                      borderRadius: 14,
                      padding: "16px 18px",
                      marginBottom: 20,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.muted,
                        textTransform: "uppercase",
                        marginBottom: 12,
                      }}
                    >
                      💰 Pagamento do Grupo
                    </div>
                    {g.groupPayment ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <div>
                          {" "}
                          <div
                            style={{
                              fontSize: 22,
                              fontWeight: 900,
                              color: C.successDark,
                            }}
                          >
                            {maskVal(g.groupPayment.value || 0, hideValues)}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: C.muted,
                              marginTop: 3,
                            }}
                          >
                            📅{" "}
                            {new Date(
                              g.groupPayment.date + "T00:00:00",
                            ).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setGpVal(String(g.groupPayment.value));
                              setGpDate(g.groupPayment.date);
                              setGpNotes(g.groupPayment.notes || "");
                              setGroupPayModal(g);
                            }}
                            C={C}
                          >
                            ✏️
                          </Btn>
                          <Btn
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setGroups((p) =>
                                p.map((x) =>
                                  x.id === g.id
                                    ? { ...x, groupPayment: null }
                                    : x,
                                ),
                              );
                              const despMonth = g.groupPayment.date?.slice(
                                0,
                                7,
                              );
                              const despKey = `grupo_${g.id}`;
                              setDespesas((p) =>
                                p.filter(
                                  (d) =>
                                    !(
                                      d._groupKey === despKey &&
                                      d.month === despMonth
                                    ),
                                ),
                              );
                            }}
                            C={C}
                          >
                            🗑️
                          </Btn>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <span style={{ fontSize: 13, color: C.muted }}>
                          Nenhum pagamento.
                        </span>
                        <Btn
                          variant="success"
                          size="sm"
                          onClick={() => {
                            setGpVal("");
                            setGpDate(today());
                            setGroupPayModal(g);
                          }}
                          C={C}
                        >
                          💰 Pagar
                        </Btn>
                      </div>
                    )}
                  </div>
                  {/* Clients list */}
                  <div
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 14,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 16px",
                        background: C.inputBg,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: C.muted,
                          textTransform: "uppercase",
                        }}
                      >
                        Clientes ({gc.length}/{limit})
                        {isSpecialGroup && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 10,
                              background:
                                "linear-gradient(135deg,#f59e0b,#d97706)",
                              color: "#fff",
                              borderRadius: 20,
                              padding: "1px 7px",
                              fontWeight: 800,
                            }}
                          >
                            ⭐ Especial
                          </span>
                        )}
                      </span>
                      {gc.length < limit && (
                        <button
                          onClick={() => setShowNewCli(g.id)}
                          style={{
                            background: C.gradientPrimary,
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "5px 12px",
                            fontSize: 12,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          + Cliente
                        </button>
                      )}
                    </div>
                    {/* Capacity bar */}
                    <div
                      style={{
                        padding: "8px 16px",
                        background: C.inputBg + "80",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: C.muted,
                            fontWeight: 600,
                          }}
                        >
                          Capacidade utilizada
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color:
                              gc.length >= limit
                                ? C.dangerDark
                                : gc.length >= limit - 1
                                  ? C.warningDark
                                  : C.successDark,
                          }}
                        >
                          {gc.length}/{limit}
                        </span>
                      </div>
                      <div
                        style={{
                          background: C.border,
                          borderRadius: 99,
                          height: 5,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, (gc.length / limit) * 100)}%`,
                            height: "100%",
                            background:
                              gc.length >= limit
                                ? G.danger
                                : gc.length >= limit - 1
                                  ? G.warning
                                  : G.success,
                            borderRadius: 99,
                            transition: "width 0.6s",
                          }}
                        />
                      </div>
                      {gc.length >= limit && (
                        <div
                          style={{
                            fontSize: 10,
                            color: C.dangerDark,
                            fontWeight: 700,
                            marginTop: 4,
                          }}
                        >
                          ⛔ Grupo cheio ({limit}/{limit})
                        </div>
                      )}
                    </div>
                    {gc.length === 0 ? (
                      <EmptyState
                        icon="👤"
                        title="Sem clientes"
                        C={C}
                        action={
                          <Btn
                            size="sm"
                            onClick={() => setShowNewCli(g.id)}
                            C={C}
                          >
                            + Adicionar
                          </Btn>
                        }
                      />
                    ) : (
                      gc.map((c, i) => {
                        const st = getPayStatus(c, filterMonth);
                        return (
                          <div
                            key={c.id}
                            className="rb-row"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "12px 16px",
                              borderBottom:
                                i < gc.length - 1
                                  ? `1px solid ${C.border}`
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background:
                                  st === "pago"
                                    ? C.successLight
                                    : st === "parcial"
                                      ? C.infoLight
                                      : C.dangerLight,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                                flexShrink: 0,
                              }}
                            >
                              {st === "pago"
                                ? "✅"
                                : st === "parcial"
                                  ? "🔵"
                                  : "⏳"}
                            </div>
                            <div
                              style={{ flex: 1, minWidth: 0, marginLeft: 12 }}
                            >
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: C.text,
                                }}
                              >
                                {c.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: C.muted,
                                  marginTop: 1,
                                }}
                              >
                                Dia {c.dueDate} · {c.phone || "sem tel"}
                                {c.caid ? ` · CAID: ${c.caid}` : ""}
                              </div>
                            </div>
                            <div
                              style={{ textAlign: "right", marginRight: 12 }}
                            >
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: C.text,
                                }}
                              >
                                {maskVal(c.monthlyValue, hideValues)}
                              </div>
                              <StatusBadge status={st} C={C} />
                            </div>
                            <div style={{ display: "flex", gap: 5 }}>
                              {[
                                {
                                  icon: "💳",
                                  bg: C.successLight,
                                  c: C.successDark,
                                  fn: () => setPayClient(c),
                                },
                                {
                                  icon: "✏️",
                                  bg: C.warningLight,
                                  c: C.warningDark,
                                  fn: () => setEditClient(c),
                                },
                                {
                                  icon: "🗑️",
                                  bg: C.dangerLight,
                                  c: C.dangerDark,
                                  fn: () =>
                                    setClientConfirm({
                                      msg: "Remover cliente do grupo? Ele continuará cadastrado na aba OI TV como Inativo.",
                                      onOk: () => {
                                        setClients((p) =>
                                          p.map((x) =>
                                            x.id === c.id
                                              ? { ...x, groupId: null }
                                              : x,
                                          ),
                                        );
                                        setClientConfirm(null);
                                      },
                                    }),
                                },
                              ].map((btn, j) => (
                                <button
                                  key={j}
                                  onClick={btn.fn}
                                  className="rb-btn"
                                  style={{
                                    background: btn.bg,
                                    color: btn.c,
                                    border: "none",
                                    borderRadius: 8,
                                    padding: "6px 8px",
                                    fontSize: 12,
                                    cursor: "pointer",
                                  }}
                                >
                                  {btn.icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showModal && (
        <Modal
          title={editId ? "Editar Grupo" : "Novo Grupo"}
          onClose={() => setShowModal(false)}
          C={C}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <Field
                label="Nome do Responsável *"
                value={form.responsible}
                onChange={(e) =>
                  setForm((p) => ({ ...p, responsible: e.target.value }))
                }
                C={C}
              />
              {/* Preview de limite */}
              {form.responsible && (
                <div
                  style={{
                    marginTop: -10,
                    marginBottom: 14,
                    padding: "8px 12px",
                    borderRadius: 10,
                    background:
                      getGroupLimit(form.responsible) > 5
                        ? "linear-gradient(135deg,#fef3c7,#fde68a)"
                        : C.inputBg,
                    border: `1px solid ${getGroupLimit(form.responsible) > 5 ? "#fcd34d" : C.border}`,
                    fontSize: 12,
                    fontWeight: 600,
                    color:
                      getGroupLimit(form.responsible) > 5 ? "#92400e" : C.muted,
                  }}
                >
                  {getGroupLimit(form.responsible) > 5
                    ? `⭐ Grupo especial detectado — limite: ${getGroupLimit(form.responsible)} clientes`
                    : `👥 Limite padrão: 5 clientes`}
                </div>
              )}
            </div>
            <Field
              label="CPF"
              mask="cpf"
              value={form.cpf}
              onChange={(e) => setForm((p) => ({ ...p, cpf: e.target.value }))}
              placeholder="000.000.000-00"
              C={C}
            />
            <Field
              label="Nº do Contrato"
              value={form.contract}
              onChange={(e) =>
                setForm((p) => ({ ...p, contract: e.target.value }))
              }
              C={C}
            />
            <Field
              label="Nome da Mãe"
              value={form.motherName}
              onChange={(e) =>
                setForm((p) => ({ ...p, motherName: e.target.value }))
              }
              C={C}
            />
            <Field
              label="Data de Nascimento"
              type="date"
              value={form.birthDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, birthDate: e.target.value }))
              }
              C={C}
            />
            <Field
              label="Valor Investido (R$)"
              value={form.investedValue}
              onChange={(e) =>
                setForm((p) => ({ ...p, investedValue: e.target.value }))
              }
              C={C}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
              cursor: "pointer",
            }}
            onClick={() => setForm((p) => ({ ...p, settled: !p.settled }))}
          >
            <div
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: form.settled ? C.success : C.border,
                position: "relative",
                transition: "background 0.25s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: form.settled ? 23 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  transition: "left 0.25s",
                }}
              />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}>
              Acerto realizado
            </span>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
              }}
            >
              Observações
            </label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              rows={2}
              className="rb-input"
              style={{
                width: "100%",
                padding: "11px 14px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                fontSize: 13,
                boxSizing: "border-box",
                fontFamily: "inherit",
                background: C.inputBg,
                color: C.text,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)} C={C}>
              Cancelar
            </Btn>
            <Btn onClick={save} C={C}>
              💾 Salvar
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ESTOQUE ────────────────────────────────────────────────────
const ESTOQUE_CAT = {
  receptor: { label: "Receptor", icon: "📡", color: "#6366f1" },
  antena: { label: "Antena", icon: "🔭", color: "#f59e0b" },
  cabo: { label: "Cabo", icon: "🔌", color: "#10b981" },
  lnb: { label: "LNB/Lente", icon: "🔬", color: "#8b5cf6" },
  controle: { label: "Controle", icon: "🎮", color: "#3b82f6" },
  conector: { label: "Conector", icon: "🔩", color: "#06b6d4" },
  fonte: { label: "Fonte", icon: "⚡", color: "#ef4444" },
  ferramenta: { label: "Ferramenta", icon: "🔧", color: "#f97316" },
  tv: { label: "TV", icon: "📺", color: "#0ea5e9" },
  celular: { label: "Celular", icon: "📱", color: "#a855f7" },
  caixasom: { label: "Caixa de Som", icon: "🔊", color: "#ec4899" },
  ventilador: { label: "Ventilador", icon: "🌀", color: "#14b8a6" },
  eletrodomestico: { label: "Eletrodoméstico", icon: "🏠", color: "#84cc16" },
  outro: { label: "Outro", icon: "📦", color: "#64748b" },
};

const EMPTY_ITEM = {
  name: "",
  category: "receptor",
  brand: "",
  model: "",
  qty: "",
  minQty: "",
  costPrice: "",
  salePrice: "",
  supplier: "",
  location: "",
  notes: "",
};
const EMPTY_MOV = {
  type: "entrada",
  qty: "",
  reason: "",
  date: today(),
  notes: "",
};

function EstoquePage({ products, setProducts, C, hideValues }) {
  const [tab, setTab] = useState("itens");
  const [search, setSearch] = useState("");
  const [catF, setCatF] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [confirm, setConfirm] = useState(null);
  const [movModal, setMovModal] = useState(null); // {item}
  const [movForm, setMovForm] = useState(EMPTY_MOV);
  const [movHistory, setMovHistory] = useState([]); // all movements
  const [viewItem, setViewItem] = useState(null);

  // load movements from products extra field
  const allMovs = products.flatMap((p) =>
    (p.movements || []).map((m) => ({ ...m, itemId: p.id, itemName: p.name })),
  );

  function saveItem() {
    if (!form.name.trim()) return alert("Nome do item é obrigatório.");
    const data = {
      ...form,
      qty: parseInt(form.qty) || 0,
      minQty: parseInt(form.minQty) || 0,
      costPrice: parseFloat(form.costPrice) || 0,
      salePrice: parseFloat(form.salePrice) || 0,
    };
    if (editItem) {
      setProducts((p) =>
        p.map((x) => (x.id === editItem.id ? { ...x, ...data } : x)),
      );
    } else {
      setProducts((p) => [
        ...p,
        { ...data, id: Date.now(), createdAt: today(), movements: [] },
      ]);
    }
    setShowForm(false);
    setEditItem(null);
  }

  function openEdit(item) {
    setForm({
      ...item,
      qty: String(item.qty || ""),
      minQty: String(item.minQty || ""),
      costPrice: String(item.costPrice || ""),
      salePrice: String(item.salePrice || ""),
    });
    setEditItem(item);
    setShowForm(true);
  }
  function openNew() {
    setForm(EMPTY_ITEM);
    setEditItem(null);
    setShowForm(true);
  }
  function del(id) {
    setConfirm({
      msg: "Excluir este item do estoque?",
      onOk: () => {
        setProducts((p) => p.filter((x) => x.id !== id));
        setConfirm(null);
      },
    });
  }

  function saveMov() {
    const n = parseInt(movForm.qty);
    if (!n || n <= 0) return alert("Quantidade inválida.");
    const item = movModal;
    const delta = movForm.type === "entrada" ? n : -n;
    const newQty = Math.max(0, (item.qty || 0) + delta);
    const mov = {
      id: Date.now(),
      type: movForm.type,
      qty: n,
      reason: movForm.reason,
      date: movForm.date,
      notes: movForm.notes,
      qtyAfter: newQty,
    };
    setProducts((p) =>
      p.map((x) =>
        x.id === item.id
          ? { ...x, qty: newQty, movements: [...(x.movements || []), mov] }
          : x,
      ),
    );
    setMovModal(null);
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.model?.toLowerCase().includes(q) ||
        p.supplier?.toLowerCase().includes(q)) &&
      (catF === "todos" || p.category === catF)
    );
  });

  const low = products.filter(
    (p) => (p.qty || 0) <= (p.minQty || 0) && p.minQty > 0,
  );
  const totalItens = products.reduce((s, p) => s + (p.qty || 0), 0);
  const totalValorCusto = products.reduce(
    (s, p) => s + (p.qty || 0) * (p.costPrice || 0),
    0,
  );
  const totalValorVenda = products.reduce(
    (s, p) => s + (p.qty || 0) * (p.salePrice || 0),
    0,
  );
  const lucroEstimado = totalValorVenda - totalValorCusto;

  const byCategory = Object.keys(ESTOQUE_CAT).reduce((acc, k) => {
    acc[k] = products.filter((p) => p.category === k).length;
    return acc;
  }, {});

  const TABS = [
    { k: "itens", l: "📦 Itens", n: products.length },
    { k: "movimentos", l: "🔄 Movimentos", n: allMovs.length },
    { k: "alertas", l: "⚠️ Alertas", n: low.length },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
          C={C}
        />
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="Itens Cadastrados"
          value={products.length}
          icon="📋"
          gradient={C.gradientPrimary}
          C={C}
        />
        <StatCard
          label="Unidades em Estoque"
          value={totalItens}
          icon="📦"
          gradient={G.info}
          C={C}
        />
        <StatCard
          label="Valor de Custo"
          value={maskVal(totalValorCusto, hideValues)}
          icon="💸"
          gradient={G.warning}
          C={C}
        />
        <StatCard
          label="Valor de Venda"
          value={maskVal(totalValorVenda, hideValues)}
          icon="💰"
          gradient={G.success}
          C={C}
        />
        <StatCard
          label="Margem Estimada"
          value={maskVal(lucroEstimado, hideValues)}
          icon="📈"
          gradient={lucroEstimado >= 0 ? G.success : G.danger}
          C={C}
        />
        <StatCard
          label="Itens em Falta"
          value={low.length}
          icon="⚠️"
          gradient={low.length > 0 ? G.danger : G.success}
          C={C}
        />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: C.card,
          borderRadius: 14,
          padding: 6,
          marginBottom: 20,
          boxShadow: shadow.sm,
          border: `1px solid ${C.border}`,
          flexWrap: "wrap",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            style={{
              flex: 1,
              minWidth: 120,
              padding: "9px 14px",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: tab === t.k ? C.gradientPrimary : "transparent",
              color: tab === t.k ? "#fff" : C.muted,
            }}
          >
            {t.l}
            <span
              style={{
                background: tab === t.k ? "rgba(255,255,255,.2)" : C.inputBg,
                color: tab === t.k ? "#fff" : C.primary,
                borderRadius: 20,
                padding: "1px 8px",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {t.n}
            </span>
          </button>
        ))}
      </div>

      {/* ── ITENS ── */}
      {tab === "itens" && (
        <>
          {/* Category pills */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setCatF("todos")}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1.5px solid ${catF === "todos" ? C.primary : C.border}`,
                background: catF === "todos" ? C.primary : "transparent",
                color: catF === "todos" ? "#fff" : C.muted,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Todos ({products.length})
            </button>
            {Object.entries(ESTOQUE_CAT).map(
              ([k, v]) =>
                byCategory[k] > 0 && (
                  <button
                    key={k}
                    onClick={() => setCatF(k)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: `1.5px solid ${catF === k ? v.color : C.border}`,
                      background: catF === k ? v.color : "transparent",
                      color: catF === k ? "#fff" : C.muted,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {v.icon} {v.label}{" "}
                    <span style={{ opacity: 0.7 }}>({byCategory[k]})</span>
                  </button>
                ),
            )}
          </div>

          <Card C={C}>
            <div
              style={{
                padding: "18px 24px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Buscar por nome, marca, modelo..."
                  C={C}
                />
              </div>
              <Btn
                variant="export"
                size="sm"
                onClick={() =>
                  exportPDF(
                    "Relatório_de_Estoque",
                    `Emitido em ${new Date().toLocaleDateString("pt-BR")}`,
                    [
                      "Item",
                      "Categoria",
                      "Marca",
                      "Modelo",
                      "Qtd.",
                      "Mín.",
                      "Custo Unit.",
                      "Venda Unit.",
                      "Valor Total",
                    ],
                    filtered.map((p) => {
                      const dc = ESTOQUE_CAT[p.category] || ESTOQUE_CAT.outro;
                      return [
                        p.name,
                        `${dc.icon} ${dc.label}`,
                        p.brand || "—",
                        p.model || "—",
                        String(p.qty || 0),
                        String(p.minQty || 0),
                        fmtMoney(p.costPrice || 0),
                        fmtMoney(p.salePrice || 0),
                        fmtMoney((p.qty || 0) * (p.salePrice || 0)),
                      ];
                    }),
                    [],
                  )
                }
                C={C}
              >
                🖨️ PDF
              </Btn>
              <Btn size="sm" onClick={openNew} C={C}>
                + Novo Item
              </Btn>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 900,
                }}
              >
                <thead>
                  <tr style={{ background: C.inputBg }}>
                    {[
                      "Item",
                      "Categoria",
                      "Marca / Modelo",
                      "Qtd.",
                      "Mín.",
                      "Custo",
                      "Venda",
                      "Margem",
                      "Local",
                      "Ações",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.muted,
                          borderBottom: `1px solid ${C.border}`,
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10}>
                        <EmptyState
                          icon="📦"
                          title="Nenhum item cadastrado"
                          subtitle="Adicione produtos ao seu estoque."
                          C={C}
                          action={
                            <Btn size="sm" onClick={openNew} C={C}>
                              + Cadastrar Item
                            </Btn>
                          }
                        />
                      </td>
                    </tr>
                  )}
                  {filtered.map((item) => {
                    const dc = ESTOQUE_CAT[item.category] || ESTOQUE_CAT.outro;
                    const qty = item.qty || 0;
                    const minQty = item.minQty || 0;
                    const isLow = minQty > 0 && qty <= minQty;
                    const isOut = qty === 0;
                    const margin =
                      item.costPrice > 0
                        ? Math.round(
                            ((item.salePrice - item.costPrice) /
                              item.costPrice) *
                              100,
                          )
                        : 0;
                    return (
                      <tr
                        key={item.id}
                        className="rb-row"
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          background: isOut
                            ? `${C.dangerLight}44`
                            : isLow
                              ? `${C.warningLight}44`
                              : "transparent",
                        }}
                      >
                        <td style={{ padding: "13px 16px" }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: C.text,
                            }}
                          >
                            {item.name}
                          </div>
                          {item.notes && (
                            <div
                              style={{
                                fontSize: 10,
                                color: C.muted,
                                marginTop: 1,
                                maxWidth: 120,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.notes}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <span
                            style={{
                              background: `${dc.color}18`,
                              color: dc.color,
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {dc.icon} {dc.label}
                          </span>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.text,
                            }}
                          >
                            {item.brand || "—"}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted }}>
                            {item.model || ""}
                          </div>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 18,
                                fontWeight: 900,
                                color: isOut
                                  ? C.dangerDark
                                  : isLow
                                    ? C.warningDark
                                    : C.successDark,
                              }}
                            >
                              {qty}
                            </span>
                            {isOut && (
                              <span
                                style={{
                                  background: C.dangerLight,
                                  color: C.dangerDark,
                                  borderRadius: 20,
                                  padding: "1px 7px",
                                  fontSize: 9,
                                  fontWeight: 800,
                                }}
                              >
                                ZERADO
                              </span>
                            )}
                            {!isOut && isLow && (
                              <span
                                style={{
                                  background: C.warningLight,
                                  color: C.warningDark,
                                  borderRadius: 20,
                                  padding: "1px 7px",
                                  fontSize: 9,
                                  fontWeight: 800,
                                }}
                              >
                                BAIXO
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "13px 16px",
                            fontSize: 13,
                            color: C.muted,
                          }}
                        >
                          {minQty || "—"}
                        </td>
                        <td
                          style={{
                            padding: "13px 16px",
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.text,
                          }}
                        >
                          {hideValues
                            ? HIDDEN_VAL
                            : item.costPrice > 0
                              ? fmtMoney(item.costPrice)
                              : "—"}
                        </td>
                        <td
                          style={{
                            padding: "13px 16px",
                            fontSize: 13,
                            fontWeight: 700,
                            color: C.successDark,
                          }}
                        >
                          {hideValues
                            ? HIDDEN_VAL
                            : item.salePrice > 0
                              ? fmtMoney(item.salePrice)
                              : "—"}
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          {margin > 0 ? (
                            <span
                              style={{
                                background:
                                  margin >= 30
                                    ? C.successLight
                                    : C.warningLight,
                                color:
                                  margin >= 30 ? C.successDark : C.warningDark,
                                borderRadius: 20,
                                padding: "3px 9px",
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              {margin}%
                            </span>
                          ) : (
                            <span style={{ color: C.muted, fontSize: 12 }}>
                              —
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "13px 16px",
                            fontSize: 12,
                            color: C.muted,
                            maxWidth: 100,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.location || "—"}
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: 5,
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              onClick={() => {
                                setMovForm({ ...EMPTY_MOV, type: "entrada" });
                                setMovModal(item);
                              }}
                              className="rb-btn"
                              style={{
                                background: C.successLight,
                                color: C.successDark,
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 9px",
                                fontSize: 12,
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                              title="Entrada"
                            >
                              ⬆️
                            </button>
                            <button
                              onClick={() => {
                                setMovForm({ ...EMPTY_MOV, type: "saida" });
                                setMovModal(item);
                              }}
                              className="rb-btn"
                              style={{
                                background: C.dangerLight,
                                color: C.dangerDark,
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 9px",
                                fontSize: 12,
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                              title="Saída"
                            >
                              ⬇️
                            </button>
                            <button
                              onClick={() => setViewItem(item)}
                              className="rb-btn"
                              style={{
                                background: C.infoLight,
                                color: C.infoDark,
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 9px",
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => openEdit(item)}
                              className="rb-btn"
                              style={{
                                background: C.warningLight,
                                color: C.warningDark,
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 9px",
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => del(item.id)}
                              className="rb-btn"
                              style={{
                                background: C.dangerLight,
                                color: C.dangerDark,
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 9px",
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ── MOVIMENTOS ── */}
      {tab === "movimentos" && (
        <Card C={C}>
          <CardHeader
            title="🔄 Histórico de Movimentos"
            subtitle="Entradas e saídas de estoque"
            icon="📋"
            C={C}
          />
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 700,
              }}
            >
              <thead>
                <tr style={{ background: C.inputBg }}>
                  {[
                    "Data",
                    "Item",
                    "Tipo",
                    "Qtd.",
                    "Motivo",
                    "Saldo Após",
                    "Obs.",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.muted,
                        borderBottom: `1px solid ${C.border}`,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allMovs.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        icon="🔄"
                        title="Nenhum movimento registrado"
                        C={C}
                      />
                    </td>
                  </tr>
                )}
                {[...allMovs]
                  .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
                  .map((m) => (
                    <tr
                      key={m.id}
                      className="rb-row"
                      style={{ borderBottom: `1px solid ${C.border}` }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.muted,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(m.date + "T00:00:00").toLocaleDateString(
                          "pt-BR",
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 600,
                          color: C.text,
                        }}
                      >
                        {m.itemName}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background:
                              m.type === "entrada"
                                ? C.successLight
                                : C.dangerLight,
                            color:
                              m.type === "entrada"
                                ? C.successDark
                                : C.dangerDark,
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          {m.type === "entrada" ? "⬆️ Entrada" : "⬇️ Saída"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 15,
                          fontWeight: 900,
                          color:
                            m.type === "entrada" ? C.successDark : C.dangerDark,
                        }}
                      >
                        {m.type === "entrada" ? "+" : "-"}
                        {m.qty}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        {m.reason || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 14,
                          fontWeight: 800,
                          color: C.text,
                        }}
                      >
                        {m.qtyAfter ?? ""}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          color: C.muted,
                          maxWidth: 140,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.notes || "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── ALERTAS ── */}
      {tab === "alertas" && (
        <>
          {low.length === 0 ? (
            <Card C={C}>
              <EmptyState
                icon="✅"
                title="Estoque OK!"
                subtitle="Nenhum item abaixo do estoque mínimo."
                C={C}
              />
            </Card>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                gap: 14,
              }}
            >
              {low.map((item) => {
                const dc = ESTOQUE_CAT[item.category] || ESTOQUE_CAT.outro;
                const isOut = (item.qty || 0) === 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: C.card,
                      borderRadius: 18,
                      padding: "18px 20px",
                      border: `2px solid ${isOut ? C.danger : C.warning}`,
                      boxShadow: shadow.sm,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: isOut ? C.dangerLight : C.warningLight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          flexShrink: 0,
                        }}
                      >
                        {dc.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: C.text,
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{ fontSize: 11, color: C.muted, marginTop: 2 }}
                        >
                          {dc.label}
                          {item.brand ? ` · ${item.brand}` : ""}
                        </div>
                      </div>
                      <span
                        style={{
                          background: isOut ? C.dangerLight : C.warningLight,
                          color: isOut ? C.dangerDark : C.warningDark,
                          borderRadius: 20,
                          padding: "3px 10px",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {isOut ? "ZERADO" : "BAIXO"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        marginBottom: 14,
                      }}
                    >
                      {[
                        {
                          l: "Em estoque",
                          v: String(item.qty || 0),
                          c: isOut ? C.dangerDark : C.warningDark,
                        },
                        {
                          l: "Mínimo",
                          v: String(item.minQty || 0),
                          c: C.muted,
                        },
                      ].map((d, i) => (
                        <div
                          key={i}
                          style={{
                            background: C.inputBg,
                            borderRadius: 10,
                            padding: "8px 12px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              color: C.muted,
                              textTransform: "uppercase",
                              marginBottom: 2,
                            }}
                          >
                            {d.l}
                          </div>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: 900,
                              color: d.c,
                            }}
                          >
                            {d.v}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Btn
                      fullWidth
                      size="sm"
                      variant="success"
                      onClick={() => {
                        setMovForm({ ...EMPTY_MOV, type: "entrada" });
                        setMovModal(item);
                        setTab("itens");
                      }}
                      C={C}
                    >
                      ⬆️ Registrar Entrada
                    </Btn>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Movimentação Modal ── */}
      {movModal && (
        <Modal
          title={`${movForm.type === "entrada" ? "⬆️ Entrada" : "⬇️ Saída"} — ${movModal.name}`}
          onClose={() => setMovModal(null)}
          maxWidth={440}
          C={C}
        >
          <div
            style={{
              background:
                movForm.type === "entrada" ? C.successLight : C.dangerLight,
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color:
                    movForm.type === "entrada" ? C.successDark : C.dangerDark,
                }}
              >
                Saldo atual
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color:
                    movForm.type === "entrada" ? C.successDark : C.dangerDark,
                }}
              >
                {movModal.qty || 0} un.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 11,
                  color:
                    movForm.type === "entrada" ? C.successDark : C.dangerDark,
                  fontWeight: 600,
                }}
              >
                Após movimentação
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color:
                    movForm.type === "entrada" ? C.successDark : C.dangerDark,
                }}
              >
                {movForm.type === "entrada"
                  ? (movModal.qty || 0) + (parseInt(movForm.qty) || 0)
                  : Math.max(
                      0,
                      (movModal.qty || 0) - (parseInt(movForm.qty) || 0),
                    )}{" "}
                un.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { v: "entrada", l: "⬆️ Entrada" },
              { v: "saida", l: "⬇️ Saída" },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setMovForm((p) => ({ ...p, type: t.v }))}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: `2px solid ${movForm.type === t.v ? (t.v === "entrada" ? C.success : C.danger) : C.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  background:
                    movForm.type === t.v
                      ? t.v === "entrada"
                        ? C.successLight
                        : C.dangerLight
                      : "transparent",
                  color:
                    movForm.type === t.v
                      ? t.v === "entrada"
                        ? C.successDark
                        : C.dangerDark
                      : C.muted,
                }}
              >
                {t.l}
              </button>
            ))}
          </div>
          <Field
            label="Quantidade *"
            type="number"
            value={movForm.qty}
            onChange={(e) => setMovForm((p) => ({ ...p, qty: e.target.value }))}
            C={C}
            placeholder="0"
          />
          <Field
            label="Motivo"
            value={movForm.reason}
            onChange={(e) =>
              setMovForm((p) => ({ ...p, reason: e.target.value }))
            }
            C={C}
            placeholder="Ex: Compra, Venda, Uso em serviço..."
          />
          <Field
            label="Data"
            type="date"
            value={movForm.date}
            onChange={(e) =>
              setMovForm((p) => ({ ...p, date: e.target.value }))
            }
            C={C}
          />
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
              }}
            >
              Observações
            </label>
            <textarea
              value={movForm.notes}
              onChange={(e) =>
                setMovForm((p) => ({ ...p, notes: e.target.value }))
              }
              rows={2}
              className="rb-input"
              style={{
                width: "100%",
                padding: "11px 14px",
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                fontSize: 13,
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit",
                background: C.inputBg,
                color: C.text,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setMovModal(null)} C={C}>
              Cancelar
            </Btn>
            <Btn
              variant={movForm.type === "entrada" ? "success" : "danger"}
              onClick={saveMov}
              C={C}
            >
              💾 Confirmar
            </Btn>
          </div>
        </Modal>
      )}

      {/* ── Item Detail Modal ── */}
      {viewItem &&
        (() => {
          const item = products.find((p) => p.id === viewItem.id) || viewItem;
          const dc = ESTOQUE_CAT[item.category] || ESTOQUE_CAT.outro;
          const movs = (item.movements || []).slice().reverse();
          const margin =
            item.costPrice > 0
              ? Math.round(
                  ((item.salePrice - item.costPrice) / item.costPrice) * 100,
                )
              : 0;
          return (
            <Modal
              title={`📦 ${item.name}`}
              onClose={() => setViewItem(null)}
              maxWidth={560}
              C={C}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                {[
                  ["Categoria", `${dc.icon} ${dc.label}`],
                  ["Marca", item.brand || "—"],
                  ["Modelo", item.model || "—"],
                  ["Local", item.location || "—"],
                  ["Fornecedor", item.supplier || "—"],
                  ["Mín. Estoque", String(item.minQty || 0)],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    style={{
                      background: C.inputBg,
                      borderRadius: 12,
                      padding: "10px 14px",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.muted,
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, color: C.text }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    background:
                      item.qty <= item.minQty && item.minQty > 0
                        ? C.dangerLight
                        : C.successLight,
                    borderRadius: 14,
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      color:
                        item.qty <= item.minQty && item.minQty > 0
                          ? C.dangerDark
                          : C.successDark,
                    }}
                  >
                    {item.qty || 0}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color:
                        item.qty <= item.minQty && item.minQty > 0
                          ? C.dangerDark
                          : C.successDark,
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    Em Estoque
                  </div>
                </div>
                <div
                  style={{
                    background: C.inputBg,
                    borderRadius: 14,
                    padding: "14px",
                    textAlign: "center",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.text }}>
                    {fmtMoney(item.costPrice || 0)}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.muted,
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    Custo Unit.
                  </div>
                </div>
                <div
                  style={{
                    background: C.successLight,
                    borderRadius: 14,
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: C.successDark,
                    }}
                  >
                    {fmtMoney(item.salePrice || 0)}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.successDark,
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    Venda Unit.
                  </div>
                </div>
              </div>
              {margin > 0 && (
                <div
                  style={{
                    background: C.purpleLight,
                    borderRadius: 12,
                    padding: "10px 16px",
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.purpleDark,
                    }}
                  >
                    Margem de Lucro
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: C.purpleDark,
                    }}
                  >
                    {margin}%
                  </span>
                </div>
              )}
              {item.notes && (
                <div
                  style={{
                    background: C.infoLight,
                    borderRadius: 12,
                    padding: "12px 16px",
                    marginBottom: 16,
                    borderLeft: `3px solid ${C.info}`,
                    fontSize: 13,
                    color: C.infoDark,
                  }}
                >
                  {item.notes}
                </div>
              )}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.muted,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Últimos Movimentos
              </div>
              {movs.length === 0 ? (
                <div
                  style={{
                    color: C.muted,
                    fontSize: 13,
                    textAlign: "center",
                    padding: "16px 0",
                  }}
                >
                  Nenhum movimento registrado.
                </div>
              ) : (
                movs.slice(0, 6).map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "9px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span style={{ fontSize: 16 }}>
                        {m.type === "entrada" ? "⬆️" : "⬇️"}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.text,
                          }}
                        >
                          {m.reason || "Sem motivo"}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted }}>
                          {new Date(m.date + "T00:00:00").toLocaleDateString(
                            "pt-BR",
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 900,
                          color:
                            m.type === "entrada" ? C.successDark : C.dangerDark,
                        }}
                      >
                        {m.type === "entrada" ? "+" : "-"}
                        {m.qty}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>
                        Saldo: {m.qtyAfter}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <Btn
                  fullWidth
                  variant="success"
                  size="sm"
                  onClick={() => {
                    setMovForm({ ...EMPTY_MOV, type: "entrada" });
                    setMovModal(item);
                    setViewItem(null);
                  }}
                  C={C}
                >
                  ⬆️ Entrada
                </Btn>
                <Btn
                  fullWidth
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setMovForm({ ...EMPTY_MOV, type: "saida" });
                    setMovModal(item);
                    setViewItem(null);
                  }}
                  C={C}
                >
                  ⬇️ Saída
                </Btn>
                <Btn
                  fullWidth
                  size="sm"
                  onClick={() => {
                    openEdit(item);
                    setViewItem(null);
                  }}
                  C={C}
                >
                  ✏️ Editar
                </Btn>
              </div>
            </Modal>
          );
        })()}

      {/* ── Item Form Modal ── */}
      {showForm && (
        <Modal
          title={editItem ? "✏️ Editar Item" : "📦 Novo Item de Estoque"}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }}
          C={C}
          maxWidth={620}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <Field
                label="Nome do Item *"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                C={C}
                placeholder="Ex: Receptor Azamerica S2020, Cabo RG6 50m..."
              />
            </div>
            <Dropdown
              label="Categoria"
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              options={Object.entries(ESTOQUE_CAT).map(([k, v]) => ({
                value: k,
                label: `${v.icon} ${v.label}`,
              }))}
              C={C}
            />
            <Field
              label="Marca"
              value={form.brand}
              onChange={(e) =>
                setForm((p) => ({ ...p, brand: e.target.value }))
              }
              C={C}
              placeholder="Ex: Azamerica, Intelbras..."
            />
            <Field
              label="Modelo"
              value={form.model}
              onChange={(e) =>
                setForm((p) => ({ ...p, model: e.target.value }))
              }
              C={C}
              placeholder="Ex: S2020, S1007+"
            />
            <Field
              label="Fornecedor / Distribuidora"
              value={form.supplier}
              onChange={(e) =>
                setForm((p) => ({ ...p, supplier: e.target.value }))
              }
              C={C}
              placeholder="Ex: Distribuidora XYZ"
            />
            <Field
              label="Localização"
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              C={C}
              placeholder="Ex: Prateleira A3, Caixa 2..."
            />
            <Field
              label="Qtd. Atual"
              type="number"
              value={form.qty}
              onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))}
              C={C}
              placeholder="0"
            />
            <Field
              label="Qtd. Mínima (alerta)"
              type="number"
              value={form.minQty}
              onChange={(e) =>
                setForm((p) => ({ ...p, minQty: e.target.value }))
              }
              C={C}
              placeholder="0"
            />
            <Field
              label="Preço de Custo (R$)"
              type="number"
              value={form.costPrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, costPrice: e.target.value }))
              }
              C={C}
              placeholder="0,00"
            />
            <Field
              label="Preço de Venda (R$)"
              type="number"
              value={form.salePrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, salePrice: e.target.value }))
              }
              C={C}
              placeholder="0,00"
            />
            {form.costPrice > 0 && form.salePrice > 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  marginBottom: 12,
                  padding: "10px 14px",
                  background: C.purpleLight,
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: C.purpleDark }}
                >
                  Margem estimada
                </span>
                <span
                  style={{ fontSize: 15, fontWeight: 900, color: C.purpleDark }}
                >
                  {Math.round(
                    ((parseFloat(form.salePrice) - parseFloat(form.costPrice)) /
                      parseFloat(form.costPrice)) *
                      100,
                  )}
                  %
                </span>
              </div>
            )}
            <div style={{ gridColumn: "1/-1", marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                Observações
              </label>
              <textarea
                value={form.notes || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                rows={2}
                className="rb-input"
                placeholder="Informações adicionais, garantia, código de referência..."
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  background: C.inputBg,
                  color: C.text,
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditItem(null);
              }}
              C={C}
            >
              Cancelar
            </Btn>
            <Btn onClick={saveItem} C={C}>
              💾 Salvar Item
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Despesas ───────────────────────────────────────────────────
const DESP_CAT = {
  aluguel: { label: "Aluguel", icon: "🏠", color: "#6366f1" },
  pecas: { label: "Peças", icon: "🔩", color: "#f59e0b" },
  combustivel: { label: "Combustível", icon: "⛽", color: "#ef4444" },
  fornecedor: { label: "Fornecedor", icon: "🏭", color: "#8b5cf6" },
  servico: { label: "Serviço Externo", icon: "🔧", color: "#10b981" },
  salario: { label: "Salário", icon: "👷", color: "#3b82f6" },
  imposto: { label: "Imposto/Taxa", icon: "📄", color: "#64748b" },
  outro: { label: "Outro", icon: "📦", color: "#06b6d4" },
};
const DESP_PAY = {
  pix: "PIX",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
  boleto: "Boleto",
  transferencia: "Transferência",
};
const EMPTY_DESP = {
  description: "",
  category: "pecas",
  supplier: "",
  paymentMethod: "pix",
  value: "",
  date: today(),
  month: "",
  notes: "",
};

function FinanceiroPage({
  oiClients,
  sales,
  services,
  despesas,
  setDespesas,
  filterMonth,
  setFilterMonth,
  C,
  hideValues,
}) {
  const [tab, setTab] = useState("resumo");
  const [showDespForm, setShowDespForm] = useState(false);
  const [editDesp, setEditDesp] = useState(null);
  const [dForm, setDForm] = useState(EMPTY_DESP);
  const [dSearch, setDSearch] = useState("");
  const [dCatF, setDCatF] = useState("todos");
  const [confirmD, setConfirmD] = useState(null);

  function saveDesp() {
    if (!dForm.description.trim() || !dForm.supplier.trim())
      return alert("Descrição e fornecedor/empresa são obrigatórios.");
    const data = {
      ...dForm,
      value: parseFloat(dForm.value) || 0,
      month: dForm.date.slice(0, 7),
    };
    if (editDesp)
      setDespesas((p) =>
        p.map((d) => (d.id === editDesp.id ? { ...d, ...data } : d)),
      );
    else setDespesas((p) => [...p, { ...data, id: Date.now() }]);
    setShowDespForm(false);
    setEditDesp(null);
  }
  function openEditD(d) {
    setDForm({ ...d, value: String(d.value || "") });
    setEditDesp(d);
    setShowDespForm(true);
  }
  function openNewD() {
    setDForm({ ...EMPTY_DESP, date: today() });
    setEditDesp(null);
    setShowDespForm(true);
  }

  // month filter for despesas
  const despMonth = despesas.filter((d) => d.month === filterMonth);
  const despFiltered = despMonth
    .filter((d) => {
      const q = dSearch.toLowerCase();
      return (
        (!q ||
          d.description?.toLowerCase().includes(q) ||
          d.supplier?.toLowerCase().includes(q)) &&
        (dCatF === "todos" || d.category === dCatF)
      );
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // totals
  const rec = oiClients.reduce(
    (s, c) =>
      s + (getPayStatus(c, filterMonth) === "pago" ? c.monthlyValue : 0),
    0,
  );
  const parcial = oiClients.reduce((s, c) => {
    const po = getPayObj(c, filterMonth);
    return (
      s + (getPayStatus(c, filterMonth) === "parcial" && po?.paid ? po.paid : 0)
    );
  }, 0);
  const pend = oiClients.reduce(
    (s, c) =>
      s + (getPayStatus(c, filterMonth) === "pendente" ? c.monthlyValue : 0),
    0,
  );
  const atras = oiClients.reduce(
    (s, c) =>
      s + (getPayStatus(c, filterMonth) === "atrasado" ? c.monthlyValue : 0),
    0,
  );
  const totalV = sales.reduce((s, v) => s + v.value, 0);
  const totalSvcV = services.reduce((s, v) => s + (v.value || 0), 0);
  const totalReceita = rec + parcial + totalV + totalSvcV;
  const totalDespMonth = despMonth.reduce((s, d) => s + d.value, 0);
  const lucro = totalReceita - totalDespMonth;
  const byPay = {};
  sales.forEach((s) => {
    byPay[s.payment] = (byPay[s.payment] || 0) + s.value;
  });
  const byCat = {};
  despMonth.forEach((d) => {
    byCat[d.category] = (byCat[d.category] || 0) + d.value;
  });

  const TABS = [
    { k: "resumo", l: "📊 Resumo" },
    { k: "despesas", l: "💸 Despesas" },
    { k: "oitv", l: "📺 OI TV" },
    { k: "rb", l: "🛒 RB Vendas" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      {confirmD && (
        <ConfirmDialog
          msg={confirmD.msg}
          onOk={confirmD.onOk}
          onCancel={() => setConfirmD(null)}
          C={C}
        />
      )}

      {/* Header bar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="rb-input"
          style={{
            padding: "9px 14px",
            border: `1.5px solid ${C.border}`,
            borderRadius: 10,
            fontSize: 14,
            background: C.inputBg,
            color: C.text,
            outline: "none",
            fontFamily: "inherit",
          }}
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {fmtMonth(m)}
            </option>
          ))}
        </select>
        <Btn
          variant="export"
          size="sm"
          onClick={() => exportFinCsv(oiClients, sales, filterMonth)}
          C={C}
        >
          ⬇️ CSV
        </Btn>
        <div style={{ marginLeft: "auto" }}>
          <Btn size="sm" onClick={openNewD} variant="danger" C={C}>
            + Despesa
          </Btn>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: C.card,
          borderRadius: 14,
          padding: 6,
          marginBottom: 20,
          boxShadow: shadow.sm,
          border: `1px solid ${C.border}`,
          flexWrap: "wrap",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            style={{
              flex: 1,
              minWidth: 100,
              padding: "9px 14px",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              background: tab === t.k ? C.gradientPrimary : "transparent",
              color: tab === t.k ? "#fff" : C.muted,
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* ── RESUMO ── */}
      {tab === "resumo" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <StatCard
              label="Receita Total"
              value={maskVal(totalReceita, hideValues)}
              icon="💰"
              gradient={G.success}
              C={C}
            />
            <StatCard
              label="Total Despesas"
              value={maskVal(totalDespMonth, hideValues)}
              icon="💸"
              gradient={G.danger}
              C={C}
            />
            <StatCard
              label={lucro >= 0 ? "Lucro Líquido" : "Prejuízo"}
              value={maskVal(Math.abs(lucro), hideValues)}
              icon={lucro >= 0 ? "📈" : "📉"}
              gradient={lucro >= 0 ? G.success : G.danger}
              C={C}
            />
            <StatCard
              label="OI TV Recebido"
              value={maskVal(rec + parcial, hideValues)}
              icon="📺"
              gradient={C.gradientPrimary}
              C={C}
            />
            <StatCard
              label="Pendente/Atrasado"
              value={maskVal(pend + atras, hideValues)}
              icon="⏳"
              gradient={G.warning}
              C={C}
            />
            <StatCard
              label="Vendas RB"
              value={maskVal(totalV, hideValues)}
              icon="🛒"
              gradient={G.purple}
              C={C}
            />
          </div>

          {/* Lucro visual */}
          <Card C={C} style={{ marginBottom: 20 }}>
            <div style={{ padding: "24px 28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 700,
                    color: C.text,
                  }}
                >
                  📊 Balanço — {fmtMonth(filterMonth)}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: lucro >= 0 ? C.successLight : C.dangerLight,
                    borderRadius: 12,
                    padding: "8px 16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: lucro >= 0 ? C.successDark : C.dangerDark,
                    }}
                  >
                    {lucro >= 0 ? "✅ Saldo positivo" : "⚠️ Saldo negativo"}
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: lucro >= 0 ? C.successDark : C.dangerDark,
                    }}
                  >
                    {maskVal(lucro, hideValues)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  height: 32,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: C.border,
                }}
              >
                {totalReceita > 0 && (
                  <div
                    style={{
                      width: `${Math.min(100, Math.round((totalReceita / Math.max(totalReceita, totalDespMonth)) * 100))}%`,
                      background: G.success,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#fff",
                      transition: "width 0.8s",
                    }}
                  >
                    {totalReceita > totalDespMonth * 0.3 &&
                      fmtMoney(totalReceita)}
                  </div>
                )}
                {totalDespMonth > 0 && (
                  <div
                    style={{
                      flex: 1,
                      background: G.danger,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    -{fmtMoney(totalDespMonth)}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: C.muted,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: "#10b981",
                      display: "inline-block",
                    }}
                  />
                  Receita
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: C.muted,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: "#ef4444",
                      display: "inline-block",
                    }}
                  />
                  Despesas
                </span>
              </div>
            </div>
          </Card>

          {/* Despesas por categoria */}
          {Object.keys(byCat).length > 0 && (
            <Card C={C}>
              <CardHeader title="Despesas por Categoria" icon="📂" C={C} />
              <div
                style={{
                  padding: "20px 24px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                  gap: 12,
                }}
              >
                {Object.entries(byCat)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, val]) => {
                    const dc = DESP_CAT[cat] || DESP_CAT.outro;
                    const pct =
                      totalDespMonth > 0
                        ? Math.round((val / totalDespMonth) * 100)
                        : 0;
                    return (
                      <div
                        key={cat}
                        style={{
                          background: C.inputBg,
                          borderRadius: 14,
                          padding: "14px 16px",
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ fontSize: 20 }}>{dc.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: C.text,
                              }}
                            >
                              {dc.label}
                            </div>
                            <div style={{ fontSize: 11, color: C.muted }}>
                              {pct}% do total
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color: C.dangerDark,
                            }}
                          >
                            {fmtMoney(val)}
                          </div>
                        </div>
                        <ProgBar pct={pct} color={dc.color} />
                      </div>
                    );
                  })}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ── DESPESAS ── */}
      {tab === "despesas" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <StatCard
              label="Total Despesas"
              value={fmtMoney(totalDespMonth)}
              icon="💸"
              gradient={G.danger}
              C={C}
            />
            <StatCard
              label="Qtd. Lançamentos"
              value={despMonth.length}
              icon="📋"
              gradient={C.gradientPrimary}
              C={C}
            />
            {Object.entries(byCat)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 2)
              .map(([cat, val]) => {
                const dc = DESP_CAT[cat] || DESP_CAT.outro;
                return (
                  <StatCard
                    key={cat}
                    label={dc.label}
                    value={fmtMoney(val)}
                    icon={dc.icon}
                    gradient={G.warning}
                    C={C}
                  />
                );
              })}
          </div>

          <Card C={C}>
            <div
              style={{
                padding: "18px 24px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <SearchInput
                  value={dSearch}
                  onChange={setDSearch}
                  placeholder="Buscar por descrição ou fornecedor..."
                  C={C}
                />
              </div>
              <select
                value={dCatF}
                onChange={(e) => setDCatF(e.target.value)}
                className="rb-input"
                style={{
                  padding: "10px 14px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  background: C.inputBg,
                  color: C.text,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              >
                <option value="todos">Todas categorias</option>
                {Object.entries(DESP_CAT).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.icon} {v.label}
                  </option>
                ))}
              </select>
              <Btn
                size="sm"
                variant="export"
                onClick={() =>
                  exportPDF(
                    "Relatório_de_Despesas",
                    `Referência: ${fmtMonth(filterMonth)}`,
                    [
                      "Data",
                      "Categoria",
                      "Descrição",
                      "Fornecedor",
                      "Forma Pgto",
                      "Valor",
                      "Obs.",
                    ],
                    despFiltered.map((d) => {
                      const dc = DESP_CAT[d.category] || DESP_CAT.outro;
                      return [
                        new Date(d.date + "T00:00:00").toLocaleDateString(
                          "pt-BR",
                        ),
                        `${dc.icon} ${dc.label}`,
                        d.description,
                        d.supplier,
                        DESP_PAY[d.paymentMethod] || d.paymentMethod,
                        fmtMoney(d.value),
                        d.notes || "—",
                      ];
                    }),
                    Object.entries(byCat)
                      .sort((a, b) => b[1] - a[1])
                      .map(([k, v]) => {
                        const dc = DESP_CAT[k] || DESP_CAT.outro;
                        return {
                          label: `${dc.icon} ${dc.label}`,
                          value: fmtMoney(v),
                        };
                      })
                      .concat([
                        {
                          label: "Total Geral",
                          value: fmtMoney(totalDespMonth),
                        },
                      ]),
                  )
                }
                C={C}
              >
                🖨️ PDF
              </Btn>
              <Btn size="sm" variant="danger" onClick={openNewD} C={C}>
                + Nova Despesa
              </Btn>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 760,
                }}
              >
                <thead>
                  <tr style={{ background: C.inputBg }}>
                    {[
                      "Data",
                      "Categoria",
                      "Descrição",
                      "Fornecedor / Empresa",
                      "Forma Pgto",
                      "Valor",
                      "Obs.",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.muted,
                          borderBottom: `1px solid ${C.border}`,
                          textTransform: "uppercase",
                          letterSpacing: ".04em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {despFiltered.length === 0 && (
                    <tr>
                      <td colSpan={8}>
                        <EmptyState
                          icon="💸"
                          title="Nenhuma despesa neste mês"
                          subtitle="Registre seus gastos para controlar o financeiro."
                          C={C}
                          action={
                            <Btn
                              size="sm"
                              variant="danger"
                              onClick={openNewD}
                              C={C}
                            >
                              + Registrar Despesa
                            </Btn>
                          }
                        />
                      </td>
                    </tr>
                  )}
                  {despFiltered.map((d) => {
                    const dc = DESP_CAT[d.category] || DESP_CAT.outro;
                    return (
                      <tr
                        key={d.id}
                        className="rb-row"
                        style={{ borderBottom: `1px solid ${C.border}` }}
                      >
                        <td
                          style={{
                            padding: "13px 16px",
                            fontSize: 13,
                            color: C.muted,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(d.date + "T00:00:00").toLocaleDateString(
                            "pt-BR",
                          )}
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <span
                            style={{
                              background: `${dc.color}18`,
                              color: dc.color,
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {dc.icon} {dc.label}
                          </span>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: C.text,
                            }}
                          >
                            {d.description}
                          </div>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.text,
                            }}
                          >
                            {d.supplier}
                          </div>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <span
                            style={{
                              background: C.infoLight,
                              color: C.infoDark,
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {DESP_PAY[d.paymentMethod] || d.paymentMethod}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "13px 16px",
                            fontSize: 15,
                            fontWeight: 900,
                            color: C.dangerDark,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fmtMoney(d.value)}
                        </td>
                        <td
                          style={{
                            padding: "13px 16px",
                            fontSize: 12,
                            color: C.muted,
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.notes || "—"}
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button
                              onClick={() => openEditD(d)}
                              className="rb-btn"
                              style={{
                                background: C.warningLight,
                                color: C.warningDark,
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 9px",
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() =>
                                setConfirmD({
                                  msg: "Excluir esta despesa?",
                                  onOk: () => {
                                    setDespesas((p) =>
                                      p.filter((x) => x.id !== d.id),
                                    );
                                    setConfirmD(null);
                                  },
                                })
                              }
                              className="rb-btn"
                              style={{
                                background: C.dangerLight,
                                color: C.dangerDark,
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 9px",
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {despFiltered.length > 0 && (
                  <tfoot>
                    <tr style={{ background: C.inputBg }}>
                      <td
                        colSpan={5}
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.muted,
                        }}
                      >
                        Total do mês ({despFiltered.length} lançamento
                        {despFiltered.length !== 1 ? "s" : ""})
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 16,
                          fontWeight: 900,
                          color: C.dangerDark,
                        }}
                      >
                        {fmtMoney(
                          despFiltered.reduce((s, d) => s + d.value, 0),
                        )}
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ── OI TV ── */}
      {tab === "oitv" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}
        >
          <Card C={C}>
            <CardHeader
              title={`OI TV — ${fmtMonth(filterMonth)}`}
              icon="📺"
              C={C}
            />
            <div style={{ padding: 24, maxHeight: 480, overflowY: "auto" }}>
              {oiClients.map((c) => {
                const st = getPayStatus(c, filterMonth);
                return (
                  <div
                    key={c.id}
                    className="rb-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "11px 0",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div>
                      <div
                        style={{ fontSize: 14, fontWeight: 600, color: C.text }}
                      >
                        {c.name}
                      </div>
                      {c.caid && (
                        <div
                          style={{ fontSize: 11, color: C.muted, marginTop: 1 }}
                        >
                          CAID: {c.caid}
                        </div>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{ fontSize: 13, fontWeight: 700, color: C.text }}
                      >
                        {fmtMoney(c.monthlyValue)}
                      </span>
                      <StatusBadge status={st} C={C} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card C={C}>
            <CardHeader title="Resumo OI TV" icon="📊" C={C} />
            <div style={{ padding: 24 }}>
              {[
                { l: "Recebido", v: rec, c: C.successDark, bg: C.successLight },
                { l: "Parcial", v: parcial, c: C.infoDark, bg: C.infoLight },
                {
                  l: "Pendente",
                  v: pend,
                  c: C.warningDark,
                  bg: C.warningLight,
                },
                { l: "Atrasado", v: atras, c: C.dangerDark, bg: C.dangerLight },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 14px",
                    borderRadius: 12,
                    marginBottom: 8,
                    background: row.bg,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: row.c }}>
                    {row.l}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: row.c }}>
                    {maskVal(row.v, hideValues)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── RB ── */}
      {tab === "rb" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}
        >
          <Card C={C}>
            <CardHeader title="Vendas RB" icon="🛒" C={C} />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.inputBg }}>
                    {["Data", "Cliente", "Produto", "Valor", "Pagamento"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontSize: 11,
                            fontWeight: 700,
                            color: C.muted,
                            borderBottom: `1px solid ${C.border}`,
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState icon="💳" title="Nenhuma venda" C={C} />
                      </td>
                    </tr>
                  )}
                  {sales.map((s) => (
                    <tr
                      key={s.id}
                      className="rb-row"
                      style={{ borderBottom: `1px solid ${C.border}` }}
                    >
                      <td
                        style={{
                          padding: "13px 16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        {new Date(s.date + "T00:00:00").toLocaleDateString(
                          "pt-BR",
                        )}
                      </td>
                      <td
                        style={{
                          padding: "13px 16px",
                          fontWeight: 600,
                          color: C.text,
                        }}
                      >
                        {s.clientName}
                      </td>
                      <td
                        style={{
                          padding: "13px 16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        {s.product}
                      </td>
                      <td
                        style={{
                          padding: "13px 16px",
                          fontSize: 14,
                          fontWeight: 700,
                          color: C.successDark,
                        }}
                      >
                        {fmtMoney(s.value)}
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <span
                          style={{
                            background: C.infoLight,
                            color: C.infoDark,
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {s.payment.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card C={C}>
            <CardHeader title="Formas de Pgto" icon="💳" C={C} />
            <div style={{ padding: 24 }}>
              {Object.entries(byPay).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: C.muted,
                    }}
                  >
                    {k}
                  </span>
                  <span
                    style={{ fontSize: 15, fontWeight: 800, color: C.text }}
                  >
                    {fmtMoney(v)}
                  </span>
                </div>
              ))}
              {Object.keys(byPay).length === 0 && (
                <p style={{ color: C.muted, fontSize: 14 }}>Nenhuma venda.</p>
              )}
              <div
                style={{
                  marginTop: 14,
                  padding: 16,
                  borderRadius: 14,
                  background: C.successLight,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 700, color: C.successDark }}>
                  TOTAL
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: C.successDark,
                  }}
                >
                  {fmtMoney(totalV)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Despesa Form Modal ── */}
      {showDespForm && (
        <Modal
          title={editDesp ? "✏️ Editar Despesa" : "💸 Nova Despesa"}
          onClose={() => {
            setShowDespForm(false);
            setEditDesp(null);
          }}
          C={C}
          maxWidth={560}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <Field
                label="Descrição / Motivo *"
                value={dForm.description}
                onChange={(e) =>
                  setDForm((p) => ({ ...p, description: e.target.value }))
                }
                C={C}
                placeholder="Ex: Compra de cabo HDMI, Aluguel de setembro..."
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <Field
                label="Fornecedor / Empresa / Pessoa *"
                value={dForm.supplier}
                onChange={(e) =>
                  setDForm((p) => ({ ...p, supplier: e.target.value }))
                }
                C={C}
                placeholder="Ex: Mercado Livre, João Eletricista, Locadora XYZ..."
              />
            </div>
            <Dropdown
              label="Categoria"
              value={dForm.category}
              onChange={(e) =>
                setDForm((p) => ({ ...p, category: e.target.value }))
              }
              options={Object.entries(DESP_CAT).map(([k, v]) => ({
                value: k,
                label: `${v.icon} ${v.label}`,
              }))}
              C={C}
            />
            <Dropdown
              label="Forma de Pagamento"
              value={dForm.paymentMethod}
              onChange={(e) =>
                setDForm((p) => ({ ...p, paymentMethod: e.target.value }))
              }
              options={Object.entries(DESP_PAY).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
              C={C}
            />
            <Field
              label="Valor (R$) *"
              type="number"
              value={dForm.value}
              onChange={(e) =>
                setDForm((p) => ({ ...p, value: e.target.value }))
              }
              C={C}
              placeholder="0,00"
            />
            <Field
              label="Data *"
              type="date"
              value={dForm.date}
              onChange={(e) =>
                setDForm((p) => ({ ...p, date: e.target.value }))
              }
              C={C}
            />
            <div style={{ gridColumn: "1/-1", marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                Observações (opcional)
              </label>
              <textarea
                value={dForm.notes || ""}
                onChange={(e) =>
                  setDForm((p) => ({ ...p, notes: e.target.value }))
                }
                rows={2}
                className="rb-input"
                placeholder="Ex: NF 1234, garantia de 6 meses, parcelado em 3x..."
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  background: C.inputBg,
                  color: C.text,
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn
              variant="secondary"
              onClick={() => {
                setShowDespForm(false);
                setEditDesp(null);
              }}
              C={C}
            >
              Cancelar
            </Btn>
            <Btn variant="danger" onClick={saveDesp} C={C}>
              💾 Salvar Despesa
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Promissória ────────────────────────────────────────────────
const PROM_STATUS = {
  aberta: {
    label: "Em Aberto",
    icon: "📋",
    bg: "#dbeafe",
    c: "#1e40af",
    dot: "#3b82f6",
  },
  parcial: {
    label: "Pago Parcial",
    icon: "🔵",
    bg: "#ede9fe",
    c: "#5b21b6",
    dot: "#8b5cf6",
  },
  quitada: {
    label: "Quitada",
    icon: "✅",
    bg: "#d1fae5",
    c: "#065f46",
    dot: "#10b981",
  },
  vencida: {
    label: "Vencida",
    icon: "⚠️",
    bg: "#fee2e2",
    c: "#991b1b",
    dot: "#ef4444",
  },
  cancelada: {
    label: "Cancelada",
    icon: "❌",
    bg: "#f1f5f9",
    c: "#64748b",
    dot: "#94a3b8",
  },
};

const PROM_PAY = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
  boleto: "Boleto",
  transferencia: "Transferência",
};

const PROM_AQCAT = {
  tv: { label: "TV", icon: "📺", color: "#0ea5e9" },
  celular: { label: "Celular", icon: "📱", color: "#a855f7" },
  climatizacao: { label: "Climatização", icon: "❄️", color: "#06b6d4" },
  eletrodomestico: { label: "Eletrodoméstico", icon: "🏠", color: "#84cc16" },
  antena: { label: "Antena", icon: "🔭", color: "#f59e0b" },
  receptor: { label: "Receptor", icon: "📡", color: "#6366f1" },
  servico: { label: "Serviço", icon: "🔧", color: "#10b981" },
  outros: { label: "Outros", icon: "📦", color: "#64748b" },
};

function getPromStatus(p) {
  if (p.status === "cancelada") return "cancelada";
  if (p.status === "quitada") return "quitada";
  const paid =
    p.parcelas?.filter((x) => x.pago).reduce((s, x) => s + x.valor, 0) || 0;
  const total = p.valor || 0;
  const today2 = today();
  const vencidas =
    p.parcelas?.filter((x) => !x.pago && x.vencimento < today2) || [];
  if (paid >= total && total > 0) return "quitada";
  if (paid > 0) return "parcial";
  if (vencidas.length > 0) return "vencida";
  return "aberta";
}

function generatePromPDF(prom) {
  const st = PROM_STATUS[getPromStatus(prom)] || PROM_STATUS.aberta;
  const totalPago =
    prom.parcelas?.filter((x) => x.pago).reduce((s, x) => s + x.valor, 0) || 0;
  const restante = Math.max(0, (prom.valor || 0) - totalPago);
  const pctPago =
    prom.valor > 0
      ? Math.min(100, Math.round((totalPago / prom.valor) * 100))
      : 0;
  const parcsPagas = prom.parcelas?.filter((x) => x.pago).length || 0;
  const today2 = new Date().toISOString().split("T")[0];

  // build month label from vencimento date
  const mesLabel = (dt) => {
    if (!dt) return "—";
    const d = new Date(dt + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const parcsHTML =
    prom.parcelas
      ?.map((p, i) => {
        const isVenc = !p.pago && p.vencimento < today2;
        const rowBg = p.pago ? "#f0fdf4" : isVenc ? "#fff1f2" : "#ffffff";
        const statusBg = p.pago ? "#d1fae5" : isVenc ? "#fee2e2" : "#fef3c7";
        const statusC = p.pago ? "#065f46" : isVenc ? "#991b1b" : "#92400e";
        const statusLabel = p.pago
          ? "✅ Pago"
          : isVenc
            ? "⚠️ Vencida"
            : "⏳ Pendente";
        return `<tr style="border-bottom:1px solid #f1f5f9;background:${rowBg}">
      <td style="padding:11px 14px">
        <div style="font-weight:800;color:#0f172a;font-size:13px">${i + 1}ª Parcela</div>
        <div style="font-size:10px;color:#94a3b8;margin-top:2px;text-transform:capitalize">${mesLabel(p.vencimento)}</div>
      </td>
      <td style="padding:11px 14px;color:#475569;font-size:12px">
        <div style="font-weight:700">Venc: ${new Date(p.vencimento + "T00:00:00").toLocaleDateString("pt-BR")}</div>
        ${p.dataPago ? `<div style="font-size:10px;color:#059669;margin-top:2px">Pago em: ${new Date(p.dataPago + "T00:00:00").toLocaleDateString("pt-BR")}</div>` : ""}
      </td>
      <td style="padding:11px 14px;font-weight:900;color:#0f172a;font-size:14px">${fmtMoney(p.valor)}</td>
      <td style="padding:11px 14px">
        <span style="background:${statusBg};color:${statusC};padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap">${statusLabel}</span>
      </td>
    </tr>`;
      })
      .join("") || "";

  // progress bar html
  const progressBar = `
    <div style="margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em">Progresso de Pagamento</span>
        <span style="font-size:12px;font-weight:800;color:${pctPago === 100 ? "#059669" : "#6366f1"}">${pctPago}% • ${parcsPagas}/${prom.numParcelas || 1} parcelas</span>
      </div>
      <div style="height:12px;background:#e2e8f0;border-radius:99px;overflow:hidden">
        <div style="width:${pctPago}%;height:100%;background:${pctPago === 100 ? "linear-gradient(90deg,#10b981,#059669)" : "linear-gradient(90deg,#6366f1,#8b5cf6)"};border-radius:99px"></div>
      </div>
    </div>`;

  // summary row
  const summaryRow = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px">
      <div style="background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-radius:14px;padding:16px;text-align:center">
        <div style="font-size:9px;color:#7c3aed;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Valor Total</div>
        <div style="font-size:20px;font-weight:900;color:#6d28d9">${fmtMoney(prom.valor)}</div>
      </div>
      <div style="background:linear-gradient(135deg,#d1fae5,#a7f3d0);border-radius:14px;padding:16px;text-align:center">
        <div style="font-size:9px;color:#065f46;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Total Pago</div>
        <div style="font-size:20px;font-weight:900;color:#059669">${fmtMoney(totalPago)}</div>
      </div>
      <div style="background:${restante > 0 ? "linear-gradient(135deg,#fee2e2,#fecaca)" : "linear-gradient(135deg,#d1fae5,#a7f3d0)"};border-radius:14px;padding:16px;text-align:center">
        <div style="font-size:9px;color:${restante > 0 ? "#991b1b" : "#065f46"};font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Restante</div>
        <div style="font-size:20px;font-weight:900;color:${restante > 0 ? "#dc2626" : "#059669"}">${fmtMoney(restante)}</div>
      </div>
    </div>`;

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Promissória #${String(prom.id).slice(-4).padStart(4, "0")} — ${prom.clientName}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;display:flex;justify-content:center;padding:28px 16px;min-height:100vh}
    .doc{background:#fff;max-width:680px;width:100%;border-radius:24px;overflow:hidden;box-shadow:0 16px 56px rgba(0,0,0,.13)}
    .header{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:32px 36px;color:#fff;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
    .brand{display:flex;align-items:center;gap:14px}
    .brand-icon{width:52px;height:52px;background:rgba(255,255,255,.18);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;flex-shrink:0}
    .brand-name{font-size:20px;font-weight:800;letter-spacing:-.3px}
    .brand-sub{font-size:11px;opacity:.55;margin-top:3px}
    .prom-badge{text-align:right}
    .prom-num{font-size:34px;font-weight:900;letter-spacing:-1px;line-height:1}
    .prom-label{font-size:10px;opacity:.5;margin-top:5px;letter-spacing:.12em;text-transform:uppercase}
    .status-bar{padding:12px 36px;display:flex;align-items:center;gap:10px;border-bottom:2px solid ${st.dot}22;background:${st.bg}}
    .status-dot{width:10px;height:10px;border-radius:50%;background:${st.dot};flex-shrink:0}
    .status-label{font-size:13px;font-weight:800;color:${st.c}}
    .emit-date{margin-left:auto;font-size:11px;color:${st.c};opacity:.7}
    .body{padding:32px 36px}
    .section{margin-bottom:26px}
    .section-title{font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #f1f5f9;display:flex;align-items:center;gap:6px}
    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .field{background:#f8fafc;border-radius:12px;padding:12px 14px;border:1px solid #f1f5f9}
    .field-label{font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
    .field-value{font-size:13px;font-weight:700;color:#0f172a}
    .desc-box{background:#f8fafc;border-radius:14px;padding:16px 18px;border-left:4px solid #6366f1;font-size:13px;color:#334155;line-height:1.8}
    table{width:100%;border-collapse:collapse}
    thead tr{background:linear-gradient(135deg,#6366f1,#8b5cf6)}
    thead th{padding:11px 14px;color:#fff;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;text-align:left}
    tbody tr:last-child td{border-bottom:none}
    tfoot tr{background:#f8fafc}
    tfoot td{padding:11px 14px;font-size:12px;font-weight:700;color:#475569;border-top:2px solid #e2e8f0}
    .watermark{position:fixed;bottom:50%;right:50%;transform:translate(50%,50%) rotate(-30deg);font-size:80px;opacity:.03;font-weight:900;color:#6366f1;pointer-events:none;z-index:0}
    .signature-area{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:8px}
    .sig-line{border-top:1.5px solid #cbd5e1;padding-top:8px;text-align:center;font-size:10px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
    .footer{padding:16px 36px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;font-size:9.5px;color:#94a3b8;background:#fafafa}
    .print-btn{position:fixed;bottom:24px;right:24px;padding:14px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:14px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 8px 24px rgba(99,102,241,.45);z-index:999}
    @media print{.print-btn{display:none}body{background:#fff;padding:0}.doc{box-shadow:none;border-radius:0;max-width:100%}@page{margin:1.2cm;size:A4}}
  </style></head>
  <body>
  <div class="watermark">PROMISSÓRIA</div>
  <div class="doc">
    <!-- HEADER -->
    <div class="header">
      <div class="brand">
        <div class="brand-icon">📡</div>
        <div>
          <div class="brand-name">RB Sistema</div>
          <div class="brand-sub">Revendas e Serviços</div>
        </div>
      </div>
      <div class="prom-badge">
        <div class="prom-num">Nº ${String(prom.id).slice(-4).padStart(4, "0")}</div>
        <div class="prom-label">Promissória</div>
      </div>
    </div>

    <!-- STATUS BAR -->
    <div class="status-bar">
      <div class="status-dot"></div>
      <div class="status-label">${st.icon} ${st.label}</div>
      <div class="emit-date">Emissão: ${prom.emissao ? new Date(prom.emissao + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</div>
    </div>

    <div class="body">

      <!-- DEVEDOR -->
      <div class="section">
        <div class="section-title">👤 Dados do Devedor</div>
        <div class="grid-2">
          <div class="field"><div class="field-label">Nome Completo</div><div class="field-value">${prom.clientName}</div></div>
          <div class="field"><div class="field-label">CPF</div><div class="field-value">${prom.cpf || "—"}</div></div>
          <div class="field"><div class="field-label">Telefone</div><div class="field-value">${prom.phone || "—"}</div></div>
          <div class="field"><div class="field-label">Endereço</div><div class="field-value">${prom.address || "—"}</div></div>
        </div>
      </div>

      <!-- RESUMO FINANCEIRO -->
      <div class="section">
        <div class="section-title">💰 Resumo Financeiro</div>
        ${summaryRow}
        ${progressBar}
        <div class="grid-3">
          <div class="field"><div class="field-label">Nº de Parcelas</div><div class="field-value">${prom.numParcelas || 1}x</div></div>
          <div class="field"><div class="field-label">Valor por Parcela</div><div class="field-value">${fmtMoney((prom.valor || 0) / (prom.numParcelas || 1))}</div></div>
          <div class="field"><div class="field-label">Vencimento Final</div><div class="field-value">${prom.vencimento ? new Date(prom.vencimento + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</div></div>
          <div class="field"><div class="field-label">Forma de Pagamento</div><div class="field-value">${PROM_PAY[prom.paymentMethod] || prom.paymentMethod || "—"}</div></div>
          <div class="field"><div class="field-label">Parcelas Pagas</div><div class="field-value" style="color:#059669">${parcsPagas} de ${prom.numParcelas || 1}</div></div>
          <div class="field"><div class="field-label">Parcelas Pendentes</div><div class="field-value" style="color:${(prom.numParcelas || 1) - parcsPagas > 0 ? "#dc2626" : "#059669"}">${(prom.numParcelas || 1) - parcsPagas}</div></div>
        </div>
      </div>

      <!-- DESCRIÇÃO -->
      ${prom.descricao ? `<div class="section"><div class="section-title">📝 Descrição / Motivo</div><div class="desc-box">${prom.descricao}</div></div>` : ""}

      <!-- TABELA DE PARCELAS -->
      <div class="section">
        <div class="section-title">📅 Detalhamento Mensal de Parcelas</div>
        <table>
          <thead>
            <tr>
              <th>Parcela / Mês</th>
              <th>Datas</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${parcsHTML}</tbody>
          <tfoot>
            <tr>
              <td colspan="2">Total Geral (${prom.numParcelas || 1} parcela${(prom.numParcelas || 1) > 1 ? "s" : ""})</td>
              <td style="font-size:14px;font-weight:900;color:#0f172a">${fmtMoney(prom.valor)}</td>
              <td style="color:#059669">${fmtMoney(totalPago)} recebido</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- ASSINATURAS -->
      <div class="section" style="margin-top:32px">
        <div class="section-title">✍️ Assinaturas</div>
        <div class="signature-area">
          <div class="sig-line">Assinatura do Devedor<br><span style="font-weight:400;font-size:9px;opacity:.7">${prom.clientName}</span></div>
          <div class="sig-line">Assinatura do Credor<br><span style="font-weight:400;font-size:9px;opacity:.7">RB Sistema</span></div>
        </div>
      </div>

    </div><!-- /body -->

    <div class="footer">
      <span>📡 RB Sistema · Revendas e Serviços © ${new Date().getFullYear()}</span>
      <span>Documento emitido em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
    </div>
  </div>
  <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
  </body></html>`;
  dlFile(
    html,
    `Promissoria_${prom.clientName.replace(/\s+/g, "_")}_${String(prom.id).slice(-4).padStart(4, "0")}.html`,
    "text/html;charset=utf-8",
  );
}

function PayParcModal({ payParc, onClose, onConfirm, C }) {
  const [dataPago, setDataPago] = useState(today());
  const parc = payParc.prom.parcelas[payParc.idx];
  return (
    <Modal
      title="✅ Confirmar Pagamento de Parcela"
      onClose={onClose}
      maxWidth={400}
      C={C}
    >
      <div
        style={{
          background: C.successLight,
          borderRadius: 14,
          padding: "16px 18px",
          marginBottom: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: C.successDark, fontWeight: 700 }}>
            Valor da parcela
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: C.successDark }}>
            {fmtMoney(parc.valor)}
          </div>
        </div>
        <span style={{ fontSize: 30 }}>💰</span>
      </div>
      <Field
        label="Data do Pagamento"
        type="date"
        value={dataPago}
        onChange={(e) => setDataPago(e.target.value)}
        C={C}
      />
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        <Btn variant="secondary" onClick={onClose} C={C}>
          Cancelar
        </Btn>
        <Btn
          variant="success"
          onClick={() => onConfirm(payParc.prom.id, payParc.idx, dataPago)}
          C={C}
        >
          ✅ Confirmar Pago
        </Btn>
      </div>
    </Modal>
  );
}

function PromissoriaPage({ C, hideValues }) {
  const [proms, setPromsRaw] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [editProm, setEditProm] = useState(null);
  const [viewProm, setViewProm] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [payParc, setPayParc] = useState(null); // {prom, idx}

  const EMPTY = {
    clientName: "",
    cpf: "",
    phone: "",
    address: "",
    valor: "",
    numParcelas: "1",
    emissao: today(),
    primeiroVenc: "",
    vencimento: "",
    descricao: "",
    paymentMethod: "pix",
    status: "aberta",
    parcelas: [],
    aqCategoria: "",
    aqMarca: "",
    aqModelo: "",
  };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    (async () => {
      const d = await storeGet("promissorias");
      if (d) setPromsRaw(d);
      setLoaded(true);
    })();
  }, []);
  const setProms = (v) => {
    const n = typeof v === "function" ? v(proms) : v;
    setPromsRaw(n);
    storeSet("promissorias", n);
  };

  function buildParcelas(valor, num, primeiroVenc) {
    const n = parseInt(num) || 1;
    const v = (parseFloat(valor) || 0) / n;
    const base = new Date((primeiroVenc || today()) + "T00:00:00");
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(base);
      d.setMonth(d.getMonth() + i);
      const dt = d.toISOString().split("T")[0];
      return {
        id: Date.now() + i,
        vencimento: dt,
        valor: Math.round(v * 100) / 100,
        pago: false,
        dataPago: null,
      };
    });
  }

  // compute last vencimento from primeiroVenc + numParcelas
  function calcUltimoVenc(primeiroVenc, num) {
    if (!primeiroVenc) return "";
    const n = parseInt(num) || 1;
    const d = new Date(primeiroVenc + "T00:00:00");
    d.setMonth(d.getMonth() + (n - 1));
    return d.toISOString().split("T")[0];
  }

  function saveForm() {
    if (!form.clientName.trim() || !form.valor)
      return alert("Nome e valor são obrigatórios.");
    const parcelas = buildParcelas(
      form.valor,
      form.numParcelas,
      form.primeiroVenc,
    );
    const ultimoVenc = calcUltimoVenc(form.primeiroVenc, form.numParcelas);
    const data = {
      ...form,
      valor: parseFloat(form.valor) || 0,
      numParcelas: parseInt(form.numParcelas) || 1,
      parcelas,
      vencimento: ultimoVenc,
    };
    if (editProm) {
      setProms((p) =>
        p.map((x) =>
          x.id === editProm.id ? { ...x, ...data, parcelas: x.parcelas } : x,
        ),
      );
    } else {
      setProms((p) => [...p, { ...data, id: Date.now(), criadoEm: today() }]);
    }
    setShowForm(false);
    setEditProm(null);
  }

  function openEdit(prom) {
    setForm({
      ...prom,
      valor: String(prom.valor),
      numParcelas: String(prom.numParcelas || 1),
    });
    setEditProm(prom);
    setShowForm(true);
  }
  function openNew() {
    setForm(EMPTY);
    setEditProm(null);
    setShowForm(true);
  }
  function del(id) {
    setConfirm({
      msg: "Excluir esta promissória?",
      onOk: () => {
        setProms((p) => p.filter((x) => x.id !== id));
        setConfirm(null);
      },
    });
  }

  function toggleParcela(promId, idx, dataPago) {
    setProms((p) =>
      p.map((x) => {
        if (x.id !== promId) return x;
        const parc = [...x.parcelas];
        parc[idx] = {
          ...parc[idx],
          pago: !parc[idx].pago,
          dataPago: !parc[idx].pago ? dataPago || today() : null,
        };
        const allPaid = parc.every((p) => p.pago);
        return {
          ...x,
          parcelas: parc,
          status: allPaid
            ? "quitada"
            : x.status === "cancelada"
              ? "cancelada"
              : "aberta",
        };
      }),
    );
    if (viewProm)
      setViewProm((p) => {
        if (!p || p.id !== promId) return p;
        const parc = [...p.parcelas];
        parc[idx] = {
          ...parc[idx],
          pago: !parc[idx].pago,
          dataPago: !parc[idx].pago ? dataPago || today() : null,
        };
        return { ...p, parcelas: parc };
      });
    setPayParc(null);
  }

  function markStatus(promId, status) {
    setProms((p) => p.map((x) => (x.id === promId ? { ...x, status } : x)));
    setViewProm((p) => (p && p.id === promId ? { ...p, status } : p));
  }

  const filtered = proms
    .filter((p) => {
      const q = search.toLowerCase();
      const match =
        !q ||
        p.clientName?.toLowerCase().includes(q) ||
        p.cpf?.includes(q) ||
        p.phone?.includes(q) ||
        String(p.id).slice(-4).includes(q);
      const st = getPromStatus(p);
      return match && (statusF === "todos" || st === statusF);
    })
    .sort((a, b) => b.id - a.id);

  const totalAberta = proms.reduce(
    (s, p) =>
      getPromStatus(p) === "aberta" ||
      getPromStatus(p) === "vencida" ||
      getPromStatus(p) === "parcial"
        ? s +
          (p.valor || 0) -
          (p.parcelas?.filter((x) => x.pago).reduce((a, x) => a + x.valor, 0) ||
            0)
        : s,
    0,
  );
  const totalQuitada = proms.reduce(
    (s, p) =>
      s +
      (p.parcelas?.filter((x) => x.pago).reduce((a, x) => a + x.valor, 0) || 0),
    0,
  );
  const totalVencida = proms.filter(
    (p) => getPromStatus(p) === "vencida",
  ).length;
  const totalValor = proms.reduce((s, p) => s + (p.valor || 0), 0);

  const stCounts = Object.keys(PROM_STATUS).reduce((acc, k) => {
    acc[k] = proms.filter((p) => getPromStatus(p) === k).length;
    return acc;
  }, {});

  if (!loaded)
    return (
      <div style={{ textAlign: "center", padding: 60, color: C.muted }}>
        Carregando...
      </div>
    );

  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
          C={C}
        />
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="Total Cadastradas"
          value={proms.length}
          icon="📜"
          gradient={C.gradientPrimary}
          C={C}
        />
        <StatCard
          label="Em Aberto / Parcial"
          value={maskVal(totalAberta, hideValues)}
          icon="💸"
          gradient={G.warning}
          C={C}
        />
        <StatCard
          label="Total Recebido"
          value={maskVal(totalQuitada, hideValues)}
          icon="✅"
          gradient={G.success}
          C={C}
        />
        <StatCard
          label="Vencidas"
          value={totalVencida}
          icon="⚠️"
          gradient={totalVencida > 0 ? G.danger : G.success}
          C={C}
        />
        <StatCard
          label="Valor Total"
          value={maskVal(totalValor, hideValues)}
          icon="💰"
          gradient={G.purple}
          C={C}
        />
      </div>

      {/* Kanban mini */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {Object.entries(PROM_STATUS).map(([k, v]) => (
          <div
            key={k}
            onClick={() => setStatusF(statusF === k ? "todos" : k)}
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "14px 16px",
              border: `2px solid ${statusF === k ? v.dot : C.border}`,
              cursor: "pointer",
              transition: "all .2s",
              boxShadow: shadow.sm,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 18 }}>{v.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                {v.label}
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: v.dot }}>
              {stCounts[k] || 0}
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 99,
                background: C.border,
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${proms.length > 0 ? Math.round(((stCounts[k] || 0) / proms.length) * 100) : 0}%`,
                  height: "100%",
                  background: v.dot,
                  borderRadius: 99,
                  transition: "width .8s",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main table */}
      <Card C={C}>
        {/* Toolbar */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 180 }}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar por nome, CPF, número..."
              C={C}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 3,
              background: C.inputBg,
              borderRadius: 10,
              padding: 4,
              border: `1px solid ${C.border}`,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setStatusF("todos")}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                background:
                  statusF === "todos" ? C.gradientPrimary : "transparent",
                color: statusF === "todos" ? "#fff" : C.muted,
              }}
            >
              Todos
            </button>
            {Object.entries(PROM_STATUS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setStatusF(k)}
                style={{
                  padding: "6px 10px",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  background: statusF === k ? C.gradientPrimary : "transparent",
                  color: statusF === k ? "#fff" : C.muted,
                  whiteSpace: "nowrap",
                }}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>
          <Btn
            variant="export"
            size="sm"
            onClick={() =>
              exportPDF(
                "Promissórias",
                `Emitido em ${new Date().toLocaleDateString("pt-BR")}`,
                [
                  "Nº",
                  "Cliente",
                  "CPF",
                  "Emissão",
                  "Vencimento",
                  "Valor",
                  "Pago",
                  "Restante",
                  "Status",
                ],
                filtered.map((p) => {
                  const paid =
                    p.parcelas
                      ?.filter((x) => x.pago)
                      .reduce((s, x) => s + x.valor, 0) || 0;
                  return [
                    `#${String(p.id).slice(-4).padStart(4, "0")}`,
                    p.clientName,
                    p.cpf || "—",
                    p.emissao
                      ? new Date(p.emissao + "T00:00:00").toLocaleDateString(
                          "pt-BR",
                        )
                      : "—",
                    p.vencimento
                      ? new Date(p.vencimento + "T00:00:00").toLocaleDateString(
                          "pt-BR",
                        )
                      : "—",
                    fmtMoney(p.valor),
                    fmtMoney(paid),
                    fmtMoney(Math.max(0, p.valor - paid)),
                    PROM_STATUS[getPromStatus(p)]?.label || "—",
                  ];
                }),
                [],
              )
            }
            C={C}
          >
            🖨️ PDF
          </Btn>
          <Btn size="sm" onClick={openNew} C={C}>
            + Nova
          </Btn>
        </div>

        {/* Table — desktop */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}
          >
            <thead>
              <tr style={{ background: C.inputBg }}>
                {[
                  "Nº",
                  "Devedor",
                  "Vencimento",
                  "Parcelas",
                  "Valor Total",
                  "Pago",
                  "Restante",
                  "Status",
                  "Ações",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 14px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.muted,
                      borderBottom: `1px solid ${C.border}`,
                      textTransform: "uppercase",
                      letterSpacing: ".04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      icon="📜"
                      title="Nenhuma promissória encontrada"
                      subtitle="Cadastre promissórias para acompanhar suas cobranças."
                      C={C}
                      action={
                        <Btn size="sm" onClick={openNew} C={C}>
                          + Nova Promissória
                        </Btn>
                      }
                    />
                  </td>
                </tr>
              )}
              {filtered.map((prom) => {
                const st = getPromStatus(prom);
                const sv = PROM_STATUS[st] || PROM_STATUS.aberta;
                const paid =
                  prom.parcelas
                    ?.filter((x) => x.pago)
                    .reduce((s, x) => s + x.valor, 0) || 0;
                const restante = Math.max(0, (prom.valor || 0) - paid);
                const pctPago =
                  prom.valor > 0
                    ? Math.min(100, Math.round((paid / prom.valor) * 100))
                    : 0;
                const parcPagas =
                  prom.parcelas?.filter((x) => x.pago).length || 0;
                return (
                  <tr
                    key={prom.id}
                    className="rb-row"
                    style={{ borderBottom: `1px solid ${C.border}` }}
                  >
                    <td style={{ padding: "13px 14px" }}>
                      <div
                        style={{
                          background: C.gradientPrimary,
                          color: "#fff",
                          borderRadius: 8,
                          padding: "3px 10px",
                          fontSize: 12,
                          fontWeight: 800,
                          display: "inline-block",
                          whiteSpace: "nowrap",
                        }}
                      >
                        #{String(prom.id).slice(-4).padStart(4, "0")}
                      </div>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <div
                        style={{ fontSize: 14, fontWeight: 700, color: C.text }}
                      >
                        {prom.clientName}
                      </div>
                      {prom.cpf && (
                        <div
                          style={{ fontSize: 11, color: C.muted, marginTop: 1 }}
                        >
                          {prom.cpf}
                        </div>
                      )}
                      {prom.phone && (
                        <div style={{ fontSize: 11, color: C.muted }}>
                          {prom.phone}
                        </div>
                      )}
                      {prom.aqCategoria ? (
                        <div
                          style={{
                            marginTop: 5,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            background: `${(PROM_AQCAT[prom.aqCategoria] || PROM_AQCAT.outros).color}15`,
                            borderRadius: 20,
                            padding: "2px 9px",
                            border: `1px solid ${(PROM_AQCAT[prom.aqCategoria] || PROM_AQCAT.outros).color}30`,
                          }}
                        >
                          <span style={{ fontSize: 10 }}>
                            {
                              (
                                PROM_AQCAT[prom.aqCategoria] ||
                                PROM_AQCAT.outros
                              ).icon
                            }
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: (
                                PROM_AQCAT[prom.aqCategoria] ||
                                PROM_AQCAT.outros
                              ).color,
                            }}
                          >
                            {
                              (
                                PROM_AQCAT[prom.aqCategoria] ||
                                PROM_AQCAT.outros
                              ).label
                            }
                            {prom.aqMarca ? ` · ${prom.aqMarca}` : ""}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td
                      style={{
                        padding: "13px 14px",
                        fontSize: 13,
                        color: C.muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {prom.vencimento
                        ? new Date(
                            prom.vencimento + "T00:00:00",
                          ).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <div
                        style={{ fontSize: 12, fontWeight: 700, color: C.text }}
                      >
                        {parcPagas}/{prom.numParcelas || 1}
                      </div>
                      <div
                        style={{
                          width: 60,
                          height: 5,
                          background: C.border,
                          borderRadius: 99,
                          marginTop: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pctPago}%`,
                            height: "100%",
                            background:
                              st === "quitada" ? G.success : C.gradientPrimary,
                            borderRadius: 99,
                            transition: "width .6s",
                          }}
                        />
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "13px 14px",
                        fontSize: 14,
                        fontWeight: 800,
                        color: C.text,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {hideValues ? HIDDEN_VAL : fmtMoney(prom.valor)}
                    </td>
                    <td
                      style={{
                        padding: "13px 14px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.successDark,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {hideValues ? HIDDEN_VAL : fmtMoney(paid)}
                    </td>
                    <td
                      style={{
                        padding: "13px 14px",
                        fontSize: 13,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        color: restante > 0 ? C.dangerDark : C.successDark,
                      }}
                    >
                      {hideValues ? HIDDEN_VAL : fmtMoney(restante)}
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <span
                        style={{
                          background: sv.bg,
                          color: sv.c,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: sv.dot,
                            flexShrink: 0,
                          }}
                        />
                        {sv.label}
                      </span>
                    </td>
                    <td style={{ padding: "13px 14px" }}>
                      <div
                        style={{ display: "flex", gap: 5, flexWrap: "wrap" }}
                      >
                        <button
                          onClick={() => setViewProm(prom)}
                          className="rb-btn"
                          style={{
                            background: C.infoLight,
                            color: C.infoDark,
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 9px",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                          title="Detalhar"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => generatePromPDF(prom)}
                          className="rb-btn"
                          style={{
                            background: C.purpleLight,
                            color: C.purpleDark,
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 9px",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                          title="PDF"
                        >
                          🖨️
                        </button>
                        <button
                          onClick={() => {
                            const ph = (prom.phone || "").replace(/\D/g, "");
                            if (!ph) return alert("Telefone não cadastrado!");
                            const msg = encodeURIComponent(
                              `Olá, *${prom.clientName}*! 👋\n\nSua promissória Nº ${String(prom.id).slice(-4).padStart(4, "0")} no valor de *${fmtMoney(prom.valor)}* está em aberto.\n\nPor favor, entre em contato para regularizar.\n\nObrigado! 🙏`,
                            );
                            window.open(
                              `https://wa.me/55${ph}?text=${msg}`,
                              "_blank",
                            );
                          }}
                          className="rb-btn"
                          style={{
                            background: "#dcfce7",
                            color: "#166534",
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 9px",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                          title="WhatsApp"
                        >
                          💬
                        </button>
                        <button
                          onClick={() => openEdit(prom)}
                          className="rb-btn"
                          style={{
                            background: C.warningLight,
                            color: C.warningDark,
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 9px",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => del(prom.id)}
                          className="rb-btn"
                          style={{
                            background: C.dangerLight,
                            color: C.dangerDark,
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 9px",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Form Modal ── */}
      {showForm && (
        <Modal
          title={
            editProm
              ? `✏️ Editar Promissória #${String(editProm.id).slice(-4).padStart(4, "0")}`
              : "📜 Nova Promissória"
          }
          onClose={() => {
            setShowForm(false);
            setEditProm(null);
          }}
          C={C}
          maxWidth={640}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <Field
                label="Nome do Devedor *"
                value={form.clientName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, clientName: e.target.value }))
                }
                C={C}
                placeholder="Nome completo"
              />
            </div>
            <Field
              label="CPF"
              mask="cpf"
              value={form.cpf}
              onChange={(e) => setForm((p) => ({ ...p, cpf: e.target.value }))}
              C={C}
              placeholder="000.000.000-00"
            />
            <Field
              label="Telefone"
              mask="phone"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              C={C}
              placeholder="(63) 99999-0000"
            />
            <div style={{ gridColumn: "1/-1" }}>
              <Field
                label="Endereço"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                C={C}
                placeholder="Rua, número, bairro..."
              />
            </div>
            <Field
              label="Valor Total (R$) *"
              type="number"
              value={form.valor}
              onChange={(e) =>
                setForm((p) => ({ ...p, valor: e.target.value }))
              }
              C={C}
              placeholder="0,00"
            />
            <Field
              label="Nº de Parcelas"
              type="number"
              value={form.numParcelas}
              onChange={(e) =>
                setForm((p) => ({ ...p, numParcelas: e.target.value }))
              }
              C={C}
              placeholder="1"
            />
            <Field
              label="Data de Emissão"
              type="date"
              value={form.emissao}
              onChange={(e) =>
                setForm((p) => ({ ...p, emissao: e.target.value }))
              }
              C={C}
            />
            <Field
              label="1º Vencimento *"
              type="date"
              value={form.primeiroVenc}
              onChange={(e) =>
                setForm((p) => ({ ...p, primeiroVenc: e.target.value }))
              }
              C={C}
            />
            {/* Último vencimento calculado automaticamente */}
            {form.primeiroVenc && form.numParcelas && (
              <div style={{ gridColumn: "1/-1", marginBottom: 12 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      padding: "11px 14px",
                      background: C.infoLight,
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.infoDark,
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      📅 Último Vencimento (calculado)
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: C.infoDark,
                      }}
                    >
                      {new Date(
                        calcUltimoVenc(form.primeiroVenc, form.numParcelas) +
                          "T00:00:00",
                      ).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "11px 14px",
                      background: C.purpleLight,
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.purpleDark,
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      💡 Valor por Parcela
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: C.purpleDark,
                      }}
                    >
                      {parseInt(form.numParcelas) > 0 &&
                      parseFloat(form.valor) > 0
                        ? `${form.numParcelas}x de ${fmtMoney((parseFloat(form.valor) || 0) / (parseInt(form.numParcelas) || 1))}`
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Dropdown
              label="Forma de Pagamento"
              value={form.paymentMethod}
              onChange={(e) =>
                setForm((p) => ({ ...p, paymentMethod: e.target.value }))
              }
              options={Object.entries(PROM_PAY).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
              C={C}
            />
            <Dropdown
              label="Status"
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
              options={Object.entries(PROM_STATUS).map(([k, v]) => ({
                value: k,
                label: `${v.icon} ${v.label}`,
              }))}
              C={C}
            />
          </div>
          {/* ── Aquisição ── */}
          <div
            style={{
              marginBottom: 16,
              padding: "16px 18px",
              background: C.inputBg,
              borderRadius: 14,
              border: `1.5px solid ${C.border}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                marginBottom: 12,
              }}
            >
              🛍️ Produto / Aquisição
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 16px",
              }}
            >
              <Dropdown
                label="Categoria"
                value={form.aqCategoria}
                onChange={(e) =>
                  setForm((p) => ({ ...p, aqCategoria: e.target.value }))
                }
                options={[
                  { value: "", label: "Selecione..." },
                  ...Object.entries(PROM_AQCAT).map(([k, v]) => ({
                    value: k,
                    label: `${v.icon} ${v.label}`,
                  })),
                ]}
                C={C}
              />
              <Field
                label="Marca"
                value={form.aqMarca || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, aqMarca: e.target.value }))
                }
                C={C}
                placeholder="Ex: Samsung, LG, Intelbras..."
              />
              <div style={{ gridColumn: "1/-1" }}>
                <Field
                  label="Modelo"
                  value={form.aqModelo || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, aqModelo: e.target.value }))
                  }
                  C={C}
                  placeholder="Ex: Galaxy A54, UN55TU8000, S2020..."
                />
              </div>
            </div>
            {form.aqCategoria && (
              <div
                style={{
                  marginTop: 4,
                  padding: "8px 12px",
                  background: `${PROM_AQCAT[form.aqCategoria]?.color}18`,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>
                  {PROM_AQCAT[form.aqCategoria]?.icon}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: PROM_AQCAT[form.aqCategoria]?.color,
                  }}
                >
                  {PROM_AQCAT[form.aqCategoria]?.label}
                </span>
                {form.aqMarca && (
                  <span style={{ fontSize: 12, color: C.muted }}>
                    · {form.aqMarca}
                  </span>
                )}
                {form.aqModelo && (
                  <span style={{ fontSize: 12, color: C.muted }}>
                    · {form.aqModelo}
                  </span>
                )}
              </div>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <div style={{ gridColumn: "1/-1", marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                Descrição / Motivo
              </label>
              <textarea
                value={form.descricao || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, descricao: e.target.value }))
                }
                rows={3}
                className="rb-input"
                placeholder="Descreva o motivo da promissória, produto vendido, serviço prestado..."
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 13,
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  background: C.inputBg,
                  color: C.text,
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditProm(null);
              }}
              C={C}
            >
              Cancelar
            </Btn>
            <Btn onClick={saveForm} C={C}>
              💾 Salvar
            </Btn>
          </div>
        </Modal>
      )}

      {/* ── Detail Modal ── */}
      {viewProm &&
        (() => {
          const prom = proms.find((x) => x.id === viewProm.id) || viewProm;
          const st = getPromStatus(prom);
          const sv = PROM_STATUS[st] || PROM_STATUS.aberta;
          const paid =
            prom.parcelas
              ?.filter((x) => x.pago)
              .reduce((s, x) => s + x.valor, 0) || 0;
          const restante = Math.max(0, (prom.valor || 0) - paid);
          const pctPago =
            prom.valor > 0
              ? Math.min(100, Math.round((paid / prom.valor) * 100))
              : 0;
          return (
            <Modal
              title={`📜 Promissória #${String(prom.id).slice(-4).padStart(4, "0")}`}
              onClose={() => setViewProm(null)}
              C={C}
              maxWidth={600}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    background: sv.bg,
                    color: sv.c,
                    padding: "5px 14px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 800,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: sv.dot,
                    }}
                  />
                  {sv.icon} {sv.label}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn
                    size="sm"
                    variant="export"
                    onClick={() => generatePromPDF(prom)}
                    C={C}
                  >
                    🖨️ PDF
                  </Btn>
                  <Btn
                    size="sm"
                    onClick={() => {
                      setViewProm(null);
                      openEdit(prom);
                    }}
                    C={C}
                  >
                    ✏️ Editar
                  </Btn>
                </div>
              </div>

              {/* Value summary */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                {[
                  { l: "Valor Total", v: prom.valor, c: C.text, bg: C.inputBg },
                  { l: "Pago", v: paid, c: C.successDark, bg: C.successLight },
                  {
                    l: "Restante",
                    v: restante,
                    c: restante > 0 ? C.dangerDark : C.successDark,
                    bg: restante > 0 ? C.dangerLight : C.successLight,
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    style={{
                      background: d.bg,
                      borderRadius: 14,
                      padding: "13px 14px",
                      textAlign: "center",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: d.c,
                        textTransform: "uppercase",
                        opacity: 0.7,
                        marginBottom: 4,
                      }}
                    >
                      {d.l}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: d.c }}>
                      {hideValues ? HIDDEN_VAL : fmtMoney(d.v)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: C.muted }}
                  >
                    Progresso de pagamento
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: pctPago === 100 ? C.success : C.primary,
                    }}
                  >
                    {pctPago}%
                  </span>
                </div>
                <div
                  style={{
                    background: C.border,
                    borderRadius: 99,
                    height: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pctPago}%`,
                      height: "100%",
                      background:
                        pctPago === 100 ? G.success : C.gradientPrimary,
                      borderRadius: 99,
                      transition: "width .8s",
                    }}
                  />
                </div>
              </div>

              {/* Info grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                {[
                  ["👤 Devedor", prom.clientName],
                  ["📱 Telefone", prom.phone || "—"],
                  ["🪪 CPF", prom.cpf || "—"],
                  ["📍 Endereço", prom.address || "—"],
                  [
                    "📅 Emissão",
                    prom.emissao
                      ? new Date(prom.emissao + "T00:00:00").toLocaleDateString(
                          "pt-BR",
                        )
                      : "—",
                  ],
                  [
                    "📅 Vencimento",
                    prom.vencimento
                      ? new Date(
                          prom.vencimento + "T00:00:00",
                        ).toLocaleDateString("pt-BR")
                      : "—",
                  ],
                  [
                    "🔢 Parcelas",
                    `${prom.numParcelas || 1}x de ${fmtMoney((prom.valor || 0) / (prom.numParcelas || 1))}`,
                  ],
                  [
                    "💳 Forma Pgto",
                    PROM_PAY[prom.paymentMethod] || prom.paymentMethod || "—",
                  ],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    style={{
                      background: C.inputBg,
                      borderRadius: 12,
                      padding: "11px 14px",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.muted,
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              {/* Aquisição */}
              {prom.aqCategoria ? (
                <div
                  style={{
                    marginBottom: 18,
                    background: `${(PROM_AQCAT[prom.aqCategoria] || PROM_AQCAT.outros).color}12`,
                    borderRadius: 14,
                    padding: "14px 18px",
                    border: `1.5px solid ${(PROM_AQCAT[prom.aqCategoria] || PROM_AQCAT.outros).color}33`,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${(PROM_AQCAT[prom.aqCategoria] || PROM_AQCAT.outros).color}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {(PROM_AQCAT[prom.aqCategoria] || PROM_AQCAT.outros).icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: (
                          PROM_AQCAT[prom.aqCategoria] || PROM_AQCAT.outros
                        ).color,
                        textTransform: "uppercase",
                        letterSpacing: ".07em",
                        marginBottom: 3,
                      }}
                    >
                      🛍️ Produto Adquirido
                    </div>
                    <div
                      style={{ fontSize: 15, fontWeight: 800, color: C.text }}
                    >
                      {
                        (PROM_AQCAT[prom.aqCategoria] || PROM_AQCAT.outros)
                          .label
                      }
                      {prom.aqMarca ? ` · ${prom.aqMarca}` : ""}
                    </div>
                    {prom.aqModelo ? (
                      <div
                        style={{ fontSize: 12, color: C.muted, marginTop: 2 }}
                      >
                        {prom.aqModelo}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {prom.descricao && (
                <div
                  style={{
                    marginBottom: 18,
                    background: C.infoLight,
                    borderRadius: 12,
                    padding: "13px 16px",
                    borderLeft: `3px solid ${C.info}`,
                    fontSize: 13,
                    color: C.infoDark,
                    lineHeight: 1.7,
                  }}
                >
                  {prom.descricao}
                </div>
              )}

              {/* Parcelas */}
              {prom.parcelas && prom.parcelas.length > 0 && (
                <>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.muted,
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    📋 Parcelas
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginBottom: 18,
                    }}
                  >
                    {prom.parcelas.map((parc, idx) => {
                      const isVenc = !parc.pago && parc.vencimento < today();
                      return (
                        <div
                          key={parc.id || idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "12px 14px",
                            background: parc.pago
                              ? C.successLight
                              : isVenc
                                ? C.dangerLight
                                : C.inputBg,
                            borderRadius: 12,
                            border: `1.5px solid ${parc.pago ? C.success : isVenc ? C.danger : C.border}`,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 10,
                              background: parc.pago
                                ? C.successLight
                                : isVenc
                                  ? "#fee2e2"
                                  : C.border,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                              fontWeight: 800,
                              color: parc.pago
                                ? C.successDark
                                : isVenc
                                  ? C.dangerDark
                                  : C.muted,
                              flexShrink: 0,
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: C.text,
                              }}
                            >
                              {fmtMoney(parc.valor)}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: C.muted,
                                marginTop: 1,
                              }}
                            >
                              Venc:{" "}
                              {new Date(
                                parc.vencimento + "T00:00:00",
                              ).toLocaleDateString("pt-BR")}
                              {parc.dataPago
                                ? ` · Pago: ${new Date(parc.dataPago + "T00:00:00").toLocaleDateString("pt-BR")}`
                                : ""}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (!parc.pago) setPayParc({ prom, idx });
                              else toggleParcela(prom.id, idx);
                            }}
                            className="rb-btn"
                            style={{
                              background: parc.pago
                                ? "#fee2e2"
                                : "linear-gradient(135deg,#10b981,#059669)",
                              color: parc.pago ? C.dangerDark : "#fff",
                              border: "none",
                              borderRadius: 10,
                              padding: "7px 14px",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              flexShrink: 0,
                            }}
                          >
                            {parc.pago ? "↩ Desfazer" : "✅ Pagar"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Status change */}
              <div
                style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Alterar Status
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(PROM_STATUS).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => markStatus(prom.id, k)}
                      className="rb-btn"
                      style={{
                        padding: "7px 12px",
                        border: `1.5px solid ${getPromStatus(prom) === k ? v.dot : "transparent"}`,
                        borderRadius: 10,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "inherit",
                        background:
                          getPromStatus(prom) === k ? v.bg : "transparent",
                        color: getPromStatus(prom) === k ? v.c : C.muted,
                      }}
                    >
                      {v.icon} {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </Modal>
          );
        })()}

      {/* ── Pay Parcela Modal ── */}
      {payParc && (
        <PayParcModal
          payParc={payParc}
          onClose={() => setPayParc(null)}
          onConfirm={(id, idx, dt) => {
            toggleParcela(id, idx, dt);
          }}
          C={C}
        />
      )}
    </div>
  );
}

// ── Relatórios ─────────────────────────────────────────────────
function RelatoriosPage({
  oiClients,
  groups,
  rbClients,
  sales,
  filterMonth,
  setFilterMonth,
  C,
  hideValues,
}) {
  const [tab, setTab] = useState("devedores");
  const devedores = oiClients
    .filter((c) =>
      ["pendente", "atrasado", "parcial"].includes(
        getPayStatus(c, filterMonth),
      ),
    )
    .map((c) => {
      const st = getPayStatus(c, filterMonth);
      const po = getPayObj(c, filterMonth);
      return {
        ...c,
        status: st,
        debt: st === "parcial" ? po?.remaining || 0 : c.monthlyValue,
      };
    })
    .sort((a, b) => b.debt - a.debt);
  const groupMap = {};
  groups.forEach((g) => {
    groupMap[g.id] = g.responsible;
  });
  const tabs = [
    { k: "devedores", l: "Devedores", icon: "🔴", n: devedores.length },
    { k: "oitv", l: "OI TV", icon: "✅", n: oiClients.length },
    { k: "grupos", l: "Grupos", icon: "👥", n: groups.length },
    { k: "rb", l: "RB", icon: "🛒", n: rbClients.length },
  ];
  function pdfDevedores() {
    exportPDF(
      "Relatório_de_Devedores",
      `Referência: ${fmtMonth(filterMonth)}`,
      ["#", "Nome", "Telefone", "Venc.", "Débito", "Status"],
      devedores.map((c, i) => [
        `#${i + 1}`,
        c.name,
        c.phone || "—",
        `Dia ${c.dueDate}`,
        fmtMoney(c.debt),
        c.status,
      ]),
      [
        { label: "Total", value: String(devedores.length) },
        {
          label: "Em Aberto",
          value: fmtMoney(devedores.reduce((s, c) => s + c.debt, 0)),
        },
      ],
    );
  }
  function pdfOiTv() {
    exportPDF(
      "Clientes_OI_TV",
      `Referência: ${fmtMonth(filterMonth)}`,
      ["Nome", "CAID", "CPF", "Telefone", "Venc.", "Valor", "Status", "Grupo"],
      oiClients.map((c) => [
        c.name,
        c.caid || "—",
        c.cpf || "—",
        c.phone || "—",
        `Dia ${c.dueDate}`,
        fmtMoney(c.monthlyValue),
        getPayStatus(c, filterMonth),
        groupMap[c.groupId] || "—",
      ]),
      [
        { label: "Total", value: String(oiClients.length) },
        {
          label: "Pagos",
          value: String(
            oiClients.filter((c) => getPayStatus(c, filterMonth) === "pago")
              .length,
          ),
        },
      ],
    );
  }
  function pdfGrupos() {
    const rows = groups.map((g) => {
      const gc = oiClients.filter((c) => String(c.groupId) === String(g.id));
      const limit = getGroupLimit(g.responsible);
      const tv = gc.reduce((s, c) => s + c.monthlyValue, 0);
      const tp = gc.reduce(
        (s, c) =>
          s + (getPayStatus(c, filterMonth) === "pago" ? c.monthlyValue : 0),
        0,
      );
      const tp2 = gc.reduce((s, c) => {
        const po = getPayObj(c, filterMonth);
        return (
          s +
          (getPayStatus(c, filterMonth) === "parcial" && po?.paid ? po.paid : 0)
        );
      }, 0);
      return [
        g.responsible,
        `${limit > 5 ? "⭐ Especial" : "Padrão"} (${gc.length}/${limit})`,
        g.contract || "—",
        fmtMoney(tv),
        fmtMoney(tp + tp2),
      ];
    });
    exportPDF(
      "Relatório_de_Grupos",
      `Referência: ${fmtMonth(filterMonth)}`,
      ["Responsável", "Tipo / Clientes", "Contrato", "Total", "Recebido"],
      rows,
      [{ label: "Total Grupos", value: String(groups.length) }],
    );
  }
  return (
    <div style={{ animation: "fadeIn 0.3s" }}>
      <Card
        style={{
          background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
          marginBottom: 24,
        }}
        C={C}
      >
        <div
          style={{
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              📋 Central de Relatórios
            </h2>
          </div>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{
              padding: "9px 14px",
              border: "1px solid rgba(255,255,255,.2)",
              borderRadius: 10,
              fontSize: 14,
              background: "rgba(255,255,255,.1)",
              color: "#fff",
              cursor: "pointer",
              outline: "none",
              fontFamily: "inherit",
            }}
          >
            {MONTHS.map((m) => (
              <option
                key={m}
                value={m}
                style={{ color: "#000", background: "#fff" }}
              >
                {fmtMonth(m)}
              </option>
            ))}
          </select>
        </div>
      </Card>
      <div
        style={{
          display: "flex",
          gap: 4,
          background: C.card,
          borderRadius: 14,
          padding: 6,
          marginBottom: 20,
          boxShadow: shadow.sm,
          border: `1px solid ${C.border}`,
          flexWrap: "wrap",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            style={{
              flex: 1,
              minWidth: 100,
              padding: "10px 14px",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: tab === t.k ? C.gradientPrimary : "transparent",
              color: tab === t.k ? "#fff" : C.muted,
            }}
          >
            {t.icon} {t.l}
            <span
              style={{
                background: tab === t.k ? "rgba(255,255,255,.2)" : C.inputBg,
                color: tab === t.k ? "#fff" : C.primary,
                borderRadius: 20,
                padding: "1px 8px",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {t.n}
            </span>
          </button>
        ))}
      </div>
      {tab === "devedores" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                gap: 14,
                flex: 1,
              }}
            >
              <StatCard
                label="Devedores"
                value={devedores.length}
                icon="👤"
                gradient={G.danger}
                C={C}
              />
              <StatCard
                label="Em Aberto"
                value={maskVal(
                  devedores.reduce((s, c) => s + c.debt, 0),
                  hideValues,
                )}
                icon="💸"
                gradient={G.warning}
                C={C}
              />
            </div>
            <Btn variant="danger" size="sm" onClick={pdfDevedores} C={C}>
              🖨️ PDF
            </Btn>
          </div>
          <Card C={C}>
            <CardHeader
              title={`Devedores — ${fmtMonth(filterMonth)}`}
              icon="🔴"
              C={C}
            />
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 600,
                }}
              >
                <thead>
                  <tr style={{ background: C.inputBg }}>
                    {["#", "Nome", "Telefone", "Venc.", "Débito", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontSize: 11,
                            fontWeight: 700,
                            color: C.muted,
                            borderBottom: `1px solid ${C.border}`,
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {devedores.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState icon="🎉" title="Nenhum devedor!" C={C} />
                      </td>
                    </tr>
                  )}
                  {devedores.map((c, i) => (
                    <tr
                      key={c.id}
                      className="rb-row"
                      style={{ borderBottom: `1px solid ${C.border}` }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            background: i < 3 ? G.warning : G.danger,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 12,
                            color: "#fff",
                          }}
                        >
                          #{i + 1}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 700,
                          color: C.text,
                        }}
                      >
                        {c.name}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        {c.phone || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        Dia {c.dueDate}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 15,
                          fontWeight: 900,
                          color: C.dangerDark,
                        }}
                      >
                        {fmtMoney(c.debt)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <StatusBadge status={c.status} C={C} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
      {tab === "oitv" && (
        <Card C={C}>
          <CardHeader
            title={`OI TV — ${fmtMonth(filterMonth)}`}
            icon="✅"
            C={C}
            action={
              <Btn size="sm" variant="danger" onClick={pdfOiTv} C={C}>
                🖨️ PDF
              </Btn>
            }
          />
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 680,
              }}
            >
              <thead>
                <tr style={{ background: C.inputBg }}>
                  {[
                    "Nome",
                    "CAID",
                    "CPF",
                    "Telefone",
                    "Venc.",
                    "Valor",
                    "Status",
                    "Grupo",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.muted,
                        borderBottom: `1px solid ${C.border}`,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {oiClients.map((c) => (
                  <tr
                    key={c.id}
                    className="rb-row"
                    style={{ borderBottom: `1px solid ${C.border}` }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 700,
                        color: C.text,
                      }}
                    >
                      {c.name}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {c.caid ? (
                        <span
                          style={{
                            background: C.purpleLight,
                            color: C.purpleDark,
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {c.caid}
                        </span>
                      ) : (
                        <span style={{ color: C.muted }}>—</span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: C.muted,
                      }}
                    >
                      {c.cpf || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: C.muted,
                      }}
                    >
                      {c.phone || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: C.muted,
                      }}
                    >
                      Dia {c.dueDate}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 700,
                        color: C.text,
                      }}
                    >
                      {fmtMoney(c.monthlyValue)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <StatusBadge
                        status={getPayStatus(c, filterMonth)}
                        C={C}
                      />
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: C.muted,
                      }}
                    >
                      {groupMap[c.groupId] || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {tab === "grupos" && (
        <Card C={C}>
          <CardHeader
            title={`Grupos — ${fmtMonth(filterMonth)}`}
            icon="👥"
            C={C}
            action={
              <Btn size="sm" variant="danger" onClick={pdfGrupos} C={C}>
                🖨️ PDF
              </Btn>
            }
          />
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 600,
              }}
            >
              <thead>
                <tr style={{ background: C.inputBg }}>
                  {[
                    "Responsável",
                    "Tipo / Limite",
                    "Contrato",
                    "Clientes",
                    "Total",
                    "Recebido",
                    "Pendente",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.muted,
                        borderBottom: `1px solid ${C.border}`,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => {
                  const gc = oiClients.filter(
                    (c) => String(c.groupId) === String(g.id),
                  );
                  const limit = getGroupLimit(g.responsible);
                  const isSpec = limit > 5;
                  const tv = gc.reduce((s, c) => s + c.monthlyValue, 0);
                  const tp = gc.reduce(
                    (s, c) =>
                      s +
                      (getPayStatus(c, filterMonth) === "pago"
                        ? c.monthlyValue
                        : 0),
                    0,
                  );
                  const tp2 = gc.reduce((s, c) => {
                    const po = getPayObj(c, filterMonth);
                    return (
                      s +
                      (getPayStatus(c, filterMonth) === "parcial" && po?.paid
                        ? po.paid
                        : 0)
                    );
                  }, 0);
                  const pend = Math.max(0, tv - tp - tp2);
                  return (
                    <tr
                      key={g.id}
                      className="rb-row"
                      style={{ borderBottom: `1px solid ${C.border}` }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 700,
                          color: C.text,
                        }}
                      >
                        {g.responsible}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {isSpec ? (
                          <span
                            style={{
                              background:
                                "linear-gradient(135deg,#f59e0b,#d97706)",
                              color: "#fff",
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            ⭐ Especial ({limit})
                          </span>
                        ) : (
                          <span
                            style={{
                              background: C.infoLight,
                              color: C.infoDark,
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            Padrão (5)
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        {g.contract || "—"}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            background: C.purpleLight,
                            color: C.purpleDark,
                            borderRadius: 20,
                            padding: "2px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {gc.length}/{limit}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 700,
                          color: C.text,
                        }}
                      >
                        {fmtMoney(tv)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 700,
                          color: C.successDark,
                        }}
                      >
                        {fmtMoney(tp + tp2)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 700,
                          color: pend > 0 ? C.dangerDark : C.successDark,
                        }}
                      >
                        {pend > 0 ? fmtMoney(pend) : "✅"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {tab === "despesas" && (
        <Card C={C}>
          <CardHeader
            title={`Despesas — ${fmtMonth(filterMonth)}`}
            icon="💸"
            C={C}
          />
          <div style={{ padding: 24 }}>
            <p style={{ color: C.muted, fontSize: 14 }}>
              Veja o detalhamento de despesas na aba{" "}
              <strong>Financeiro → Despesas</strong>.
            </p>
          </div>
        </Card>
      )}
      {tab === "rb" && (
        <Card C={C}>
          <CardHeader title="Clientes RB" icon="🛒" C={C} />
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 500,
              }}
            >
              <thead>
                <tr style={{ background: C.inputBg }}>
                  {["Nome", "Telefone", "E-mail", "Compras", "Total"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.muted,
                          borderBottom: `1px solid ${C.border}`,
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rbClients.map((c) => {
                  const cs = sales.filter((s) => s.clientName === c.name);
                  const ct = cs.reduce((s, v) => s + v.value, 0);
                  return (
                    <tr
                      key={c.id}
                      className="rb-row"
                      style={{ borderBottom: `1px solid ${C.border}` }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 700,
                          color: C.text,
                        }}
                      >
                        {c.name}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        {c.phone || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: C.muted,
                        }}
                      >
                        {c.email || "—"}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            background: C.infoLight,
                            color: C.infoDark,
                            borderRadius: 20,
                            padding: "2px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {cs.length}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 14,
                          fontWeight: 800,
                          color: C.successDark,
                        }}
                      >
                        {fmtMoney(ct)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Configurações ──────────────────────────────────────────────
function ConfiguracoesPage({
  C,
  darkMode,
  setDarkMode,
  themeName,
  setThemeName,
  sidebarOpen,
  setSidebarOpen,
  oiClients,
  groups,
  rbClients,
  products,
  sales,
  services,
  despesas,
  filterMonth,
  onRestore,
  auth,
}) {
  const [importMsg, setImportMsg] = useState(null),
    [importing, setImporting] = useState(false);
  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportMsg(null);
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (!d.version) throw new Error("Arquivo inválido.");
        onRestore(d);
        setImportMsg({ ok: true, text: "✅ Dados restaurados!" });
      } catch (err) {
        setImportMsg({ ok: false, text: `❌ ${err.message}` });
      }
      setImporting(false);
      e.target.value = "";
    };
    r.onerror = () => {
      setImportMsg({ ok: false, text: "❌ Erro ao ler." });
      setImporting(false);
    };
    r.readAsText(file, "utf-8");
  }
  const themeOptions = [
    { k: "indigo", label: "Índigo", color: "#6366f1" },
    { k: "emerald", label: "Esmeralda", color: "#10b981" },
    { k: "rose", label: "Rosa", color: "#f43f5e" },
    { k: "violet", label: "Violeta", color: "#8b5cf6" },
    { k: "amber", label: "Âmbar", color: "#f59e0b" },
    { k: "cyan", label: "Ciano", color: "#06b6d4" },
  ];
  const systemStats = [
    {
      label: "Clientes OI TV",
      value: oiClients.length,
      icon: "📺",
      color: C.primary,
    },
    { label: "Grupos", value: groups.length, icon: "👥", color: "#8b5cf6" },
    {
      label: "Clientes RB",
      value: rbClients.length,
      icon: "🛒",
      color: "#10b981",
    },
    { label: "Produtos", value: products.length, icon: "📦", color: "#f59e0b" },
    { label: "Vendas", value: sales.length, icon: "💳", color: "#06b6d4" },
    { label: "Serviços", value: services.length, icon: "📅", color: "#f43f5e" },
  ];
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", animation: "fadeIn 0.3s" }}>
      <Card
        style={{
          background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
          marginBottom: 24,
        }}
        C={C}
      >
        <div
          style={{
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background: C.gradientPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              flexShrink: 0,
            }}
          >
            ⚙️
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              Configurações
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                color: "rgba(255,255,255,.45)",
                fontSize: 13,
              }}
            >
              Logado como{" "}
              <strong style={{ color: "#a5f3fc" }}>{auth?.name}</strong>
            </p>
          </div>
        </div>
      </Card>
      {/* Pit info card */}
      <Card C={C} style={{ marginBottom: 20 }}>
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <PitAvatar size={52} style={{ border: `3px solid ${C.primary}33` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>
              🐾 BELLO — Assistente Virtual
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>
              O BELLO monitora seus clientes em atraso e te ajuda a cobrar via
              WhatsApp. Clique no ícone 🐱 no canto superior direito para
              conversar com ele!
            </div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 28 }}>🐱</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
              Miau!
            </div>
          </div>
        </div>
      </Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <Card C={C} style={{ gridColumn: "1/-1" }}>
          <CardHeader title="🎨 Aparência" C={C} />
          <div style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 18px",
                background: C.inputBg,
                borderRadius: 14,
                marginBottom: 14,
                border: `1px solid ${C.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: darkMode
                      ? "linear-gradient(135deg,#1e1b4b,#312e81)"
                      : "linear-gradient(135deg,#fef3c7,#fcd34d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {darkMode ? "🌙" : "☀️"}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                    Modo Escuro
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    {darkMode ? "Interface escura" : "Interface clara"}
                  </div>
                </div>
              </div>
              <div
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  width: 52,
                  height: 28,
                  borderRadius: 99,
                  background: darkMode ? C.primary : "#e2e8f0",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.3s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: darkMode ? 27 : 3,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,.2)",
                    transition: "left 0.3s cubic-bezier(.34,1.56,.64,1)",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: ".05em",
                marginBottom: 10,
              }}
            >
              Cor principal
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6,1fr)",
                gap: 10,
              }}
            >
              {themeOptions.map((t) => (
                <div
                  key={t.k}
                  onClick={() => setThemeName(t.k)}
                  style={{ cursor: "pointer", textAlign: "center" }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: 14,
                      background: `linear-gradient(135deg,${t.color},${t.color}99)`,
                      border:
                        themeName === t.k
                          ? `3px solid ${C.text}`
                          : "3px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {themeName === t.k && (
                      <span style={{ fontSize: 18, color: "#fff" }}>✓</span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: C.muted,
                      marginTop: 5,
                      fontWeight: 600,
                    }}
                  >
                    {t.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card C={C}>
          <CardHeader title="📊 Dados" C={C} />
          <div
            style={{
              padding: 24,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {systemStats.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 14px",
                  background: C.inputBg,
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: `${s.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card C={C}>
          <CardHeader title="🗂️ Layout" C={C} />
          <div style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                background: C.inputBg,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  Menu expandido
                </div>
              </div>
              <div
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 99,
                  background: sidebarOpen ? C.primary : "#e2e8f0",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.3s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: sidebarOpen ? 24 : 2,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,.15)",
                    transition: "left 0.3s cubic-bezier(.34,1.56,.64,1)",
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Card C={C} style={{ marginBottom: 20 }}>
        <CardHeader title="🛡️ Backup e Restauração" C={C} />
        <div style={{ padding: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                padding: "18px",
                background: C.inputBg,
                borderRadius: 14,
                border: `1px solid ${C.border}`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>⬇️</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 14,
                }}
              >
                Exportar Backup
              </div>
              <Btn
                variant="backup"
                fullWidth
                onClick={() =>
                  exportBackup(
                    oiClients,
                    groups,
                    rbClients,
                    products,
                    sales,
                    services,
                    despesas,
                  )
                }
                C={C}
              >
                🛡️ Baixar .json
              </Btn>
            </div>
            <div
              style={{
                padding: "18px",
                background: C.inputBg,
                borderRadius: 14,
                border: `1px solid ${C.border}`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>⬆️</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 14,
                }}
              >
                Restaurar Backup
              </div>
              <label
                style={{
                  padding: 14,
                  background: G.success,
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "block",
                  textAlign: "center",
                }}
              >
                {importing ? "⏳ Importando…" : "📂 Selecionar"}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
          {importMsg && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: importMsg.ok ? C.successLight : C.dangerLight,
                color: importMsg.ok ? C.successDark : C.dangerDark,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {importMsg.text}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ── Nav ────────────────────────────────────────────────────────
const NAV = [
  { key: "dashboard", icon: "⊞", label: "Dashboard" },
  { key: "oitv", icon: "📺", label: "OI TV" },
  { key: "grupos", icon: "👥", label: "Grupos OI TV" },
  { key: "estoque", icon: "📦", label: "Estoque" },
  { key: "calendario", icon: "📅", label: "Calendário" },
  { key: "financeiro", icon: "💰", label: "Financeiro" },
  { key: "ordemservico", icon: "🗂️", label: "Ordens de Serviço" },
  { key: "promissoria", icon: "📜", label: "Promissórias" },
  { key: "relatorios", icon: "📋", label: "Relatórios" },
  { key: "configuracoes", icon: "⚙️", label: "Configurações" },
];

function BackupReminderModal({ onYes, onNo, C }) {
  const [count, setCount] = useState(30);
  useEffect(() => {
    const t = setInterval(
      () =>
        setCount((p) => {
          if (p <= 1) {
            onNo();
            return 0;
          }
          return p - 1;
        }),
      1000,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.75)",
        zIndex: 4000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: C.card,
          borderRadius: 28,
          padding: "40px 44px",
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 24px 64px rgba(0,0,0,.25)",
          animation: "popIn 0.25s",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#f59e0b,#d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            margin: "0 auto 18px",
          }}
        >
          🛡️
        </div>
        <h3
          style={{
            margin: "0 0 10px",
            fontSize: 20,
            fontWeight: 800,
            color: C.text,
          }}
        >
          Hora do Backup!
        </h3>
        <p
          style={{
            margin: "0 0 28px",
            color: C.muted,
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          Deseja salvar um backup agora?
        </p>
        <div
          style={{
            margin: "0 0 28px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: C.warningLight,
            color: C.warningDark,
            borderRadius: 20,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span
            style={{ animation: "pulse 1s infinite", display: "inline-block" }}
          >
            ⏱️
          </span>{" "}
          Fechando em {count}s
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onNo}
            style={{
              flex: 1,
              padding: "12px",
              background: C.inputBg,
              border: `1.5px solid ${C.border}`,
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              color: C.muted,
              fontFamily: "inherit",
            }}
          >
            Agora não
          </button>
          <button
            onClick={onYes}
            style={{
              flex: 1,
              padding: "12px",
              background: "linear-gradient(135deg,#f59e0b,#d97706)",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              color: "#fff",
              fontFamily: "inherit",
            }}
          >
            🛡️ Backup
          </button>
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(null),
    [page, setPage] = useState("dashboard"),
    [hideValues, setHideValues] = useState(false);
  const [oiClients, setOiRaw] = useState([]),
    [groups, setGroupsRaw] = useState([]),
    [rbClients, setRbRaw] = useState([]),
    [products, setProductsRaw] = useState([]),
    [sales, setSalesRaw] = useState([]),
    [services, setServicesRaw] = useState([]),
    [despesas, setDespRaw] = useState([]);
  const [filterMonth, setFilterMonth] = useState(currentMonth()),
    [loaded, setLoaded] = useState(false),
    [showRestore, setShowRestore] = useState(false);
  const [darkMode, setDarkModeRaw] = useState(false),
    [themeName, setThemeNameRaw] = useState("indigo"),
    [sidebarOpen, setSidebarOpenRaw] = useState(true);
  const [showBackupReminder, setShowBackupReminder] = useState(false),
    [hasUnsaved, setHasUnsaved] = useState(false);
  const backupTimerRef = useRef(null);
  const C = makeColors(themeName, darkMode);

  useEffect(() => {
    (async () => {
      const [oi, gr, rb, pr, sa, sv, de] = await Promise.all([
        storeGet("oiClients"),
        storeGet("groups"),
        storeGet("rbClients"),
        storeGet("products"),
        storeGet("sales"),
        storeGet("services"),
        storeGet("despesas"),
      ]);
      if (oi) setOiRaw(oi);
      if (gr) setGroupsRaw(gr);
      if (rb) setRbRaw(rb);
      if (pr) setProductsRaw(pr);
      if (sa) setSalesRaw(sa);
      if (sv) setServicesRaw(sv);
      if (de) setDespRaw(de);
      try {
        const pref = await window.storage.get("userPrefs");
        if (pref) {
          const p = JSON.parse(pref.value);
          if (p.darkMode !== undefined) setDarkModeRaw(p.darkMode);
          if (p.themeName) setThemeNameRaw(p.themeName);
          if (p.sidebarOpen !== undefined) setSidebarOpenRaw(p.sidebarOpen);
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (!hasUnsaved) return;
      e.preventDefault();
      e.returnValue = "Dados não salvos. Sair mesmo assim?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [hasUnsaved]);

  useEffect(() => {
    if (!auth) return;
    const start = () => {
      backupTimerRef.current = setTimeout(
        () => setShowBackupReminder(true),
        15 * 60 * 1000,
      );
    };
    start();
    return () => clearTimeout(backupTimerRef.current);
  }, [auth]);

  function resetBackupTimer() {
    clearTimeout(backupTimerRef.current);
    setShowBackupReminder(false);
    backupTimerRef.current = setTimeout(
      () => setShowBackupReminder(true),
      15 * 60 * 1000,
    );
  }
  function handleBackupNow() {
    exportBackup(
      oiClients,
      groups,
      rbClients,
      products,
      sales,
      services,
      despesas,
    );
    setHasUnsaved(false);
    resetBackupTimer();
  }

  function savePrefs(prefs) {
    window.storage.set("userPrefs", JSON.stringify(prefs)).catch(() => {});
  }
  function setDarkMode(v) {
    setDarkModeRaw(v);
    savePrefs({ darkMode: v, themeName, sidebarOpen });
  }
  function setThemeName(v) {
    setThemeNameRaw(v);
    savePrefs({ darkMode, themeName: v, sidebarOpen });
  }
  function setSidebarOpen(v) {
    setSidebarOpenRaw(v);
    savePrefs({ darkMode, themeName, sidebarOpen: v });
  }

  const setDespesas = (v) => {
    const n = typeof v === "function" ? v(despesas) : v;
    setDespRaw(n);
    storeSet("despesas", n);
    setHasUnsaved(true);
  };
  const setOiClients = (v) => {
    const n = typeof v === "function" ? v(oiClients) : v;
    setOiRaw(n);
    storeSet("oiClients", n);
    setHasUnsaved(true);
  };
  const setGroups = (v) => {
    const n = typeof v === "function" ? v(groups) : v;
    setGroupsRaw(n);
    storeSet("groups", n);
    setHasUnsaved(true);
  };
  const setRbClients = (v) => {
    const n = typeof v === "function" ? v(rbClients) : v;
    setRbRaw(n);
    storeSet("rbClients", n);
    setHasUnsaved(true);
  };
  const setProducts = (v) => {
    const n = typeof v === "function" ? v(products) : v;
    setProductsRaw(n);
    storeSet("products", n);
    setHasUnsaved(true);
  };
  const setSales = (v) => {
    const n = typeof v === "function" ? v(sales) : v;
    setSalesRaw(n);
    storeSet("sales", n);
    setHasUnsaved(true);
  };
  const setServices = (v) => {
    const n = typeof v === "function" ? v(services) : v;
    setServicesRaw(n);
    storeSet("services", n);
    setHasUnsaved(true);
  };

  function restoreBackup(data) {
    if (data.oiClients) setOiClients(data.oiClients);
    if (data.groups) setGroups(data.groups);
    if (data.rbClients) setRbClients(data.rbClients);
    if (data.products) setProducts(data.products);
    if (data.sales) setSales(data.sales);
    if (data.services) setServices(data.services);
    if (data.despesas) setDespesas(data.despesas);
  }
  function handleLogin(email, pass) {
    const admin = ADMINS.find((a) => a.email === email && a.password === pass);
    if (admin) {
      setAuth({ email, role: "admin", name: admin.name });
      setShowRestore(true);
      return true;
    }
    return false;
  }

  if (!loaded)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg,#0f172a,#1e1b4b)",
          flexDirection: "column",
          gap: 16,
          fontFamily: "'Inter',system-ui",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            animation: "pulse 1.5s infinite",
          }}
        >
          📡
        </div>
        <div style={{ color: "rgba(255,255,255,.4)", fontSize: 13 }}>
          Carregando...
        </div>
      </div>
    );

  if (!auth)
    return (
      <>
        <GlobalStyles C={C} dark={darkMode} />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  if (showRestore)
    return (
      <>
        <GlobalStyles C={C} dark={darkMode} />
        <RestorePrompt
          onRestore={(d) => {
            restoreBackup(d);
            setShowRestore(false);
          }}
          onSkip={() => setShowRestore(false)}
        />
      </>
    );

  const totalRecMes = oiClients.reduce(
    (s, c) =>
      s + (getPayStatus(c, filterMonth) === "pago" ? c.monthlyValue : 0),
    0,
  );
  const totalPendMes = oiClients.reduce(
    (s, c) =>
      s + (getPayStatus(c, filterMonth) !== "pago" ? c.monthlyValue : 0),
    0,
  );
  const curNav = NAV.find((n) => n.key === page);

  // Pit send cobrança helper
  function pitSendCobranca(c) {
    sendCobranca(c, filterMonth);
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        background: C.bg,
        transition: "background 0.3s",
      }}
    >
      {showBackupReminder && (
        <BackupReminderModal
          C={C}
          onYes={handleBackupNow}
          onNo={() => {
            setShowBackupReminder(false);
            resetBackupTimer();
          }}
        />
      )}
      <GlobalStyles C={C} dark={darkMode} />
      <aside
        style={{
          width: sidebarOpen ? 260 : 72,
          background: C.gradientSidebar,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 200,
        }}
      >
        <div
          style={{
            padding: "20px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            borderBottom: "1px solid rgba(255,255,255,.06)",
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: C.gradientPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            📡
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
                RB Sistema
              </div>
              <div style={{ color: "rgba(255,255,255,.35)", fontSize: 11 }}>
                v2.3 · Admin
              </div>
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {NAV.map((n) => {
            const isActive = page === n.key;
            return (
              <div
                key={n.key}
                className="nav-item"
                onClick={() => setPage(n.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  marginBottom: 4,
                  background: isActive ? `${C.primary}33` : "transparent",
                  borderLeft: isActive
                    ? `3px solid ${C.primary}`
                    : "3px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 17, flexShrink: 0 }}>{n.icon}</span>
                {sidebarOpen && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#fff" : "rgba(255,255,255,.6)",
                    }}
                  >
                    {n.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        <div
          style={{
            padding: "14px",
            borderTop: "1px solid rgba(255,255,255,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: C.gradientPrimary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 800,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {auth.name[0]}
            </div>
            {sidebarOpen && (
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                  {auth.name}
                </div>
                <div style={{ color: "rgba(255,255,255,.35)", fontSize: 11 }}>
                  Administrador
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setAuth(null)}
            style={{
              width: "100%",
              padding: "8px",
              background: "rgba(255,255,255,.07)",
              color: "rgba(255,255,255,.5)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "inherit",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {sidebarOpen ? "↩ Sair" : "↩"}
          </button>
        </div>
      </aside>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          minWidth: 0,
        }}
      >
        <header
          style={{
            background: C.card,
            padding: "0 28px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: shadow.sm,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>{curNav?.icon}</span>
            <h1
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 700,
                color: C.text,
              }}
            >
              {curNav?.label}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* ── PIT CHAT BUTTON ── */}
            <PitChat
              oiClients={oiClients}
              filterMonth={filterMonth}
              C={C}
              onSendCobranca={pitSendCobranca}
              services={services}
              setServices={setServices}
              despesas={despesas}
              sales={sales}
            />
            <button
              onClick={handleBackupNow}
              title="Backup"
              style={{
                background: "linear-gradient(135deg,#f59e0b,#d97706)",
                border: "none",
                borderRadius: 10,
                padding: "7px 14px",
                cursor: "pointer",
                fontSize: 13,
                color: "#fff",
                fontFamily: "inherit",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6,
                position: "relative",
              }}
            >
              🛡️{sidebarOpen && <span style={{ fontSize: 12 }}>Backup</span>}
              {hasUnsaved && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ef4444",
                    border: "2px solid " + C.card,
                  }}
                />
              )}
            </button>
            <button
              onClick={() => setHideValues((v) => !v)}
              title={hideValues ? "Mostrar valores" : "Ocultar valores"}
              style={{
                background: C.inputBg,
                border: `1.5px solid ${hideValues ? C.primary : C.border}`,
                borderRadius: 10,
                padding: "7px 12px",
                cursor: "pointer",
                fontSize: 16,
                color: hideValues ? C.primary : C.muted,
                fontFamily: "inherit",
                transition: "all .2s",
              }}
            >
              {hideValues ? "🙈" : "👁️"}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: C.inputBg,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "7px 12px",
                cursor: "pointer",
                fontSize: 16,
                color: C.text,
                fontFamily: "inherit",
              }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <span
              style={{
                fontSize: 12,
                color: C.muted,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.success,
                }}
              />
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: C.gradientPrimary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {auth.name[0]}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: 28, overflowY: "auto" }}>
          {page === "dashboard" && (
            <DashboardPage
              oiClients={oiClients}
              groups={groups}
              rbClients={rbClients}
              sales={sales}
              services={services}
              despesas={despesas}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              totalRecMes={totalRecMes}
              totalPendMes={totalPendMes}
              setPage={setPage}
              userName={auth.name}
              C={C}
              hideValues={hideValues}
            />
          )}
          {page === "oitv" && (
            <OiTvPage
              clients={oiClients}
              setClients={setOiClients}
              groups={groups}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              C={C}
              hideValues={hideValues}
            />
          )}
          {page === "grupos" && (
            <GroupsPage
              groups={groups}
              setGroups={setGroups}
              clients={oiClients}
              setClients={setOiClients}
              filterMonth={filterMonth}
              despesas={despesas}
              setDespesas={setDespesas}
              C={C}
              hideValues={hideValues}
            />
          )}
          {page === "estoque" && (
            <EstoquePage
              products={products}
              setProducts={setProducts}
              C={C}
              hideValues={hideValues}
            />
          )}
          {page === "calendario" && (
            <CalendarPage
              services={services}
              setServices={setServices}
              oiClients={oiClients}
              C={C}
              osOrders={(function () {
                try {
                  return JSON.parse(window.__rbOsOrders || "[]");
                } catch (e) {
                  return [];
                }
              })()}
              setPage={setPage}
            />
          )}
          {page === "financeiro" && (
            <FinanceiroPage
              oiClients={oiClients}
              sales={sales}
              services={services}
              despesas={despesas}
              setDespesas={setDespesas}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              C={C}
              hideValues={hideValues}
            />
          )}
          {page === "ordemservico" && (
            <OrdemServicoPage
              services={services}
              setServices={setServices}
              C={C}
            />
          )}
          {page === "promissoria" && (
            <PromissoriaPage C={C} hideValues={hideValues} />
          )}
          {page === "relatorios" && (
            <RelatoriosPage
              oiClients={oiClients}
              groups={groups}
              rbClients={rbClients}
              sales={sales}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              C={C}
              hideValues={hideValues}
            />
          )}
          {page === "configuracoes" && (
            <ConfiguracoesPage
              C={C}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              themeName={themeName}
              setThemeName={setThemeName}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              oiClients={oiClients}
              groups={groups}
              rbClients={rbClients}
              products={products}
              sales={sales}
              services={services}
              despesas={despesas}
              filterMonth={filterMonth}
              onRestore={restoreBackup}
              auth={auth}
            />
          )}
        </main>
      </div>
    </div>
  );
}
