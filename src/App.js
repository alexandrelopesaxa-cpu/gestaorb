import { useState, useEffect, useRef } from "react";

// ── Config ────────────────────────────────────────────────────
const ADMINS = [
  {
    email: "alexandrelopesaxa@gmail.com",
    password: "admin123",
    name: "Alexandre",
  },
  { email: "bonfimpereirab@gmail.com", password: "admin123", name: "Bonfim" },
];
const WHATSAPP_NUMBER = "5563999990000";

const MONTHS = [];
for (let y = 2026; y <= 2027; y++) {
  for (let m = 1; m <= 12; m++) {
    MONTHS.push(`${y}-${String(m).padStart(2, "0")}`);
  }
}

const fmtMoney = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v || 0,
  );
const fmtMonth = (m) => (m ? `${m.split("-")[1]}/${m.split("-")[0]}` : "");
const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const today = () => new Date().toISOString().split("T")[0];

// ── Storage ───────────────────────────────────────────────────
async function storeGet(k) {
  try {
    const r = await window.storage.get(k);
    return r ? JSON.parse(r.value) : null;
  } catch {
    return null;
  }
}
async function storeSet(k, v) {
  try {
    await window.storage.set(k, JSON.stringify(v));
  } catch (e) {
    console.error(e);
  }
}

// ── Downloads ─────────────────────────────────────────────────
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
function exportOiCsv(cls, m) {
  dlFile(
    toCSV(
      ["Nome", "CPF", "Tel", "Venc", "Valor", "CAID", "Cartão", "Status"],
      cls.map((c) => [
        c.name,
        c.cpf,
        c.phone,
        `Dia ${c.dueDate}`,
        fmtMoney(c.monthlyValue),
        c.caid,
        c.card,
        c.payments?.[m]?.status || "pendente",
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
          c.payments?.[m]?.status || "pendente",
        ]),
        ...sales.map((s) => ["RB", s.clientName, fmtMoney(s.value), "pago"]),
      ],
    ),
    `Financeiro_${m}.csv`,
    "text/csv;charset=utf-8;",
  );
}
function exportBackup(oi, gr, rb, pr, sa) {
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
      },
      null,
      2,
    ),
    `RBSistema_${new Date().toISOString().slice(0, 10)}.json`,
    "application/json",
  );
}

// helper: get payment status string from payment object
function getPayStatus(client, month) {
  const p = client.payments?.[month];
  if (!p) return "pendente";
  if (typeof p === "string") return p; // legacy
  return p.status || "pendente";
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

// ── WhatsApp ──────────────────────────────────────────────────
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

// ── CSS ───────────────────────────────────────────────────────
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
      @keyframes popIn{0%{transform:scale(.9);opacity:0}60%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
      @keyframes spin{to{transform:rotate(360deg)}}
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ── UI Primitives ─────────────────────────────────────────────
function Btn({
  children,
  variant = "primary",
  onClick,
  fullWidth,
  style = {},
}) {
  const vs = {
    primary: {
      background: "linear-gradient(135deg,#1a1a2e,#16213e)",
      color: "#fff",
      border: "none",
    },
    secondary: {
      background: "#f8fafc",
      color: "#1a1a2e",
      border: "1.5px solid #e2e8f0",
    },
    danger: { background: "#fee2e2", color: "#991b1b", border: "none" },
    whatsapp: {
      background: "linear-gradient(135deg,#25d366,#128c7e)",
      color: "#fff",
      border: "none",
    },
    export: {
      background: "linear-gradient(135deg,#0f3460,#533483)",
      color: "#fff",
      border: "none",
    },
    backup: {
      background: "linear-gradient(135deg,#b45309,#92400e)",
      color: "#fff",
      border: "none",
    },
    restore: {
      background: "linear-gradient(135deg,#065f46,#047857)",
      color: "#fff",
      border: "none",
    },
    success: {
      background: "linear-gradient(135deg,#059669,#047857)",
      color: "#fff",
      border: "none",
    },
  };
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        width: fullWidth ? "100%" : undefined,
        ...(vs[variant] || vs.primary),
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#444",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1.5px solid #e2e8f0",
          borderRadius: 8,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          ...(props.style || {}),
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1a1a2e")}
        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
      />
    </div>
  );
}

function Dropdown({ label, options, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#444",
          }}
        >
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: "1.5px solid #e2e8f0",
          borderRadius: 8,
          fontSize: 14,
          background: "#fff",
          outline: "none",
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

function Toggle({
  label,
  checked,
  onChange,
  colorOn = "#059669",
  colorOff = "#e2e8f0",
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
        cursor: "pointer",
      }}
      onClick={() => onChange(!checked)}
    >
      <div
        style={{
          width: 46,
          height: 26,
          borderRadius: 13,
          background: checked ? colorOn : colorOff,
          position: "relative",
          transition: "background 0.25s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 23 : 3,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            transition: "left 0.25s",
          }}
        />
      </div>
      {label && (
        <span style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>
          {label}
        </span>
      )}
    </div>
  );
}

function Modal({ title, onClose, children, maxWidth = 580 }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        animation: "fadeIn 0.18s",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "slideUp 0.22s",
        }}
      >
        <div
          style={{
            padding: "20px 24px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 1,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#1a1a2e",
            }}
          >
            {title}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
                color: "#888",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ msg, onOk, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "32px 36px",
          maxWidth: 360,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 28px 70px rgba(0,0,0,0.35)",
          animation: "popIn 0.25s",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <h3
          style={{
            margin: "0 0 10px",
            fontSize: 18,
            fontWeight: 800,
            color: "#1a1a2e",
          }}
        >
          Confirmar exclusão
        </h3>
        <p
          style={{
            margin: "0 0 26px",
            color: "#666",
            fontSize: 14,
            lineHeight: 1.65,
          }}
        >
          {msg}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Btn variant="secondary" onClick={onCancel}>
            Cancelar
          </Btn>
          <Btn variant="danger" onClick={onOk}>
            🗑️ Excluir
          </Btn>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pago: { bg: "#d1fae5", c: "#065f46", label: "Pago" },
    parcial: { bg: "#dbeafe", c: "#1e40af", label: "Parcial" },
    pendente: { bg: "#fef3c7", c: "#92400e", label: "Pendente" },
    atrasado: { bg: "#fee2e2", c: "#991b1b", label: "Atrasado" },
  };
  const s = map[status] || map.pendente;
  return (
    <span
      style={{
        background: s.bg,
        color: s.c,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {s.label}
    </span>
  );
}

function ProgBar({ pct, color }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.08)",
        borderRadius: 99,
        height: 8,
        overflow: "hidden",
        marginTop: 5,
      }}
    >
      <div
        style={{
          width: `${w}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width 1s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      />
    </div>
  );
}

// ── Payment Modal ─────────────────────────────────────────────
function PaymentModal({ client, month, onSave, onClose }) {
  const existing = getPayObj(client, month);
  const totalValue = client.monthlyValue || 0;
  const [paid, setPaid] = useState(String(existing?.paid ?? ""));
  const [date, setDate] = useState(existing?.date || today());
  const [notes, setNotes] = useState(existing?.notes || "");

  const paidNum = parseFloat(paid) || 0;
  const remaining = Math.max(0, totalValue - paidNum);
  const paidPct =
    totalValue > 0
      ? Math.min(100, Math.round((paidNum / totalValue) * 100))
      : 0;
  const status =
    paidNum <= 0 ? "pendente" : paidNum >= totalValue ? "pago" : "parcial";

  const statusColor = {
    pago: "#059669",
    parcial: "#2563eb",
    pendente: "#d97706",
    atrasado: "#dc2626",
  };

  function handleSave() {
    onSave({ status, paid: paidNum, remaining, date, notes });
  }

  return (
    <Modal
      title={`💳 Registrar Pagamento — ${client.name}`}
      onClose={onClose}
      maxWidth={520}
    >
      {/* client info strip */}
      <div
        style={{
          background: "linear-gradient(135deg,#f0f4ff,#e0e7ff)",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1e40af" }}>
            {client.name}
          </div>
          <div style={{ fontSize: 11, color: "#6366f1", marginTop: 2 }}>
            Vencimento: dia {client.dueDate} · {fmtMonth(month)}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* total service value (read-only) */}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#444",
          }}
        >
          Valor Total do Serviço
        </label>
        <div
          style={{
            padding: "10px 14px",
            background: "#f8fafc",
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 800,
            color: "#1a1a2e",
          }}
        >
          {fmtMoney(totalValue)}
        </div>
      </div>

      {/* paid amount */}
      <Field
        label="Valor Pago (R$)"
        type="number"
        placeholder="0,00"
        value={paid}
        onChange={(e) => setPaid(e.target.value)}
        style={{ fontSize: 15, fontWeight: 700 }}
      />

      {/* progress */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>
            Progresso do pagamento
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: statusColor[status],
            }}
          >
            {paidPct}%
          </span>
        </div>
        <div
          style={{
            background: "#fee2e2",
            borderRadius: 99,
            height: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${paidPct}%`,
              height: "100%",
              background:
                status === "pago"
                  ? "linear-gradient(90deg,#34d399,#059669)"
                  : "linear-gradient(90deg,#60a5fa,#3b82f6)",
              borderRadius: 99,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* remaining — highlighted */}
      <div
        style={{
          marginBottom: 16,
          padding: "14px 18px",
          borderRadius: 12,
          background:
            remaining === 0
              ? "linear-gradient(135deg,#d1fae5,#a7f3d0)"
              : "linear-gradient(135deg,#fee2e2,#fecaca)",
          border: `1.5px solid ${remaining === 0 ? "#6ee7b7" : "#fca5a5"}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: remaining === 0 ? "#065f46" : "#991b1b",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
        >
          {remaining === 0 ? "✅ Pagamento completo" : "Saldo Restante"}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: remaining === 0 ? "#065f46" : "#dc2626",
          }}
        >
          {remaining === 0 ? "Quitado!" : fmtMoney(remaining)}
        </div>
      </div>

      {/* date */}
      <Field
        label="Data do Pagamento"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* notes */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#444",
          }}
        >
          Observações
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Ex: pagou em duas notas…"
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 13,
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>
          Cancelar
        </Btn>
        <Btn variant="success" onClick={handleSave}>
          ✅ Salvar Pagamento
        </Btn>
      </div>
    </Modal>
  );
}

// ── Login ─────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1a1a2e,#0f3460,#533483)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI',sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 40,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          animation: "popIn 0.4s",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📡</div>
          <h2
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 900,
              color: "#1a1a2e",
            }}
          >
            RB Sistema
          </h2>
          <p style={{ margin: "8px 0 0", color: "#888", fontSize: 14 }}>
            Gestão Integrada de Clientes
          </p>
        </div>
        <Field
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
        />
        <Field
          label="Senha"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="••••••••"
        />
        <Btn
          fullWidth
          onClick={() => onLogin(email, pass)}
          style={{ padding: 14, fontSize: 16, marginTop: 8 }}
        >
          Entrar →
        </Btn>
      </div>
    </div>
  );
}

// ── Restore Prompt ────────────────────────────────────────────
function RestorePrompt({ onRestore, onSkip }) {
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const fRef = useRef();
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (!d.version) throw new Error("Arquivo inválido.");
        onRestore(d);
        setMsg({ ok: true, text: "✅ Restaurado com sucesso!" });
        setTimeout(() => onSkip(), 1400);
      } catch (err) {
        setMsg({ ok: false, text: `❌ ${err.message}` });
      }
      setBusy(false);
      e.target.value = "";
    };
    r.onerror = () => {
      setMsg({ ok: false, text: "❌ Erro ao ler." });
      setBusy(false);
    };
    r.readAsText(file, "utf-8");
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1a1a2e,#0f3460,#533483)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 40,
          width: "100%",
          maxWidth: 480,
          textAlign: "center",
          animation: "popIn 0.35s",
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 12 }}>🛡️</div>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 24,
            fontWeight: 900,
            color: "#1a1a2e",
          }}
        >
          Restaurar Backup?
        </h2>
        <p style={{ margin: "0 0 28px", color: "#666", fontSize: 15 }}>
          Carregar dados de um backup anterior?
        </p>
        <input
          ref={fRef}
          type="file"
          accept=".json"
          onChange={handleFile}
          style={{ display: "none" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Btn
            variant="restore"
            fullWidth
            onClick={() => fRef.current.click()}
            style={{ padding: 16, fontSize: 15 }}
          >
            {busy ? "⏳ Importando…" : "📂 Selecionar Arquivo (.json)"}
          </Btn>
          <Btn
            variant="secondary"
            fullWidth
            onClick={onSkip}
            style={{ padding: 14, fontSize: 15 }}
          >
            Continuar sem restaurar
          </Btn>
        </div>
        {msg && (
          <div
            style={{
              marginTop: 20,
              padding: "14px 18px",
              borderRadius: 12,
              background: msg.ok ? "#d1fae5" : "#fee2e2",
              color: msg.ok ? "#065f46" : "#991b1b",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
function DashboardPage({
  oiClients,
  groups,
  rbClients,
  sales,
  filterMonth,
  setFilterMonth,
  totalRecMes,
  totalPendMes,
  setPage,
  userName,
}) {
  const pagoC = oiClients.filter(
    (c) => getPayStatus(c, filterMonth) === "pago",
  ).length;
  const pendC = oiClients.filter((c) =>
    ["pendente", "atrasado"].includes(getPayStatus(c, filterMonth)),
  ).length;
  const atrasC = oiClients.filter(
    (c) => getPayStatus(c, filterMonth) === "atrasado",
  ).length;
  const total = oiClients.length || 1;
  const salesTotal = sales.reduce((s, v) => s + v.value, 0);

  const cards = [
    {
      label: "Clientes OI TV",
      val: oiClients.length,
      icon: "📺",
      bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
      tc: "#1e40af",
      nav: "oitv",
    },
    {
      label: "Grupos OI TV",
      val: groups.length,
      icon: "👥",
      bg: "linear-gradient(135deg,#f3e8ff,#e9d5ff)",
      tc: "#7e22ce",
      nav: "grupos",
    },
    {
      label: "Clientes RB Revendas",
      val: rbClients.length,
      icon: "🛒",
      bg: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
      tc: "#166534",
      nav: "rbrevendas",
    },
    {
      label: "Receita do Mês",
      val: totalRecMes,
      icon: "💰",
      bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
      tc: "#065f46",
      nav: "financeiro",
      money: true,
    },
    {
      label: "Total Pendente",
      val: totalPendMes,
      icon: "⏳",
      bg: "linear-gradient(135deg,#fef3c7,#fde68a)",
      tc: "#92400e",
      nav: "oitv",
      money: true,
    },
    {
      label: "RB Revendas Total",
      val: salesTotal,
      icon: "🛍️",
      bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
      tc: "#5b21b6",
      nav: "rbrevendas",
      money: true,
    },
  ];

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
      100,
    );
    return () => clearTimeout(t);
  }, [filterMonth, oiClients.length]);

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#1a1a2e,#0f3460 55%,#533483)",
          borderRadius: 20,
          padding: "28px 36px",
          marginBottom: 28,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
              Olá, {userName}! 👋
            </h2>
            <p style={{ margin: "8px 0 0", opacity: 0.75, fontSize: 14 }}>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Mês:
            </label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{
                padding: "8px 14px",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {MONTHS.map((m) => (
                <option key={m} value={m} style={{ color: "#1a1a2e" }}>
                  {fmtMonth(m)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}
        >
          {[
            { l: "Pagos", v: pagoC, c: "#34d399" },
            { l: "Pendentes", v: pendC, c: "#fbbf24" },
            { l: "Atrasados", v: atrasC, c: "#f87171" },
          ].map((s, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: s.c,
                }}
              />
              <span style={{ fontSize: 13, opacity: 0.9 }}>
                <strong style={{ color: s.c }}>{s.v}</strong> {s.l}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={() => setPage(c.nav)}
            style={{
              background: c.bg,
              borderRadius: 16,
              padding: "22px",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.18s,box-shadow 0.18s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -10,
                top: -10,
                fontSize: 56,
                opacity: 0.1,
              }}
            >
              {c.icon}
            </div>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: c.tc }}>
              {c.money ? fmtMoney(c.val) : c.val}
            </div>
            <div
              style={{
                fontSize: 12,
                color: c.tc,
                opacity: 0.75,
                marginTop: 5,
                fontWeight: 600,
              }}
            >
              {c.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 28,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: 16,
              fontWeight: 700,
              color: "#1a1a2e",
            }}
          >
            📈 Faturamento OI TV — 2026
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 5,
              height: 160,
              marginTop: 20,
            }}
          >
            {chartMonths.map((m, i) => (
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
                {monthVals[i] > 0 && (
                  <span
                    style={{
                      fontSize: 8,
                      color: "#888",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {(monthVals[i] / 1000).toFixed(1)}k
                  </span>
                )}
                <div
                  style={{
                    width: "100%",
                    height: 120,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${barH[i]}%`,
                      background:
                        m === filterMonth
                          ? "#f59e0b"
                          : "linear-gradient(180deg,#4f6ef7,#1e1e6e)",
                      borderRadius: "5px 5px 0 0",
                      minHeight: barH[i] > 0 ? 4 : 0,
                      transition: "height 0.85s cubic-bezier(0.34,1.2,0.64,1)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 8,
                    color: m === filterMonth ? "#f59e0b" : "#555",
                    fontWeight: m === filterMonth ? 800 : 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.split("-")[1]}/{m.split("-")[0].slice(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: 16,
              fontWeight: 700,
              color: "#1a1a2e",
            }}
          >
            📋 Status — {fmtMonth(filterMonth)}
          </h3>
          {[
            {
              label: "Pagos",
              count: pagoC,
              pct: Math.round((pagoC / total) * 100),
              color: "#10b981",
              tc: "#065f46",
            },
            {
              label: "Pendentes",
              count: pendC,
              pct: Math.round((pendC / total) * 100),
              color: "#f59e0b",
              tc: "#92400e",
            },
            {
              label: "Atrasados",
              count: atrasC,
              pct: Math.round((atrasC / total) * 100),
              color: "#ef4444",
              tc: "#991b1b",
            },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.tc }}>
                  {s.count} ({s.pct}%)
                </span>
              </div>
              <ProgBar pct={s.pct} color={s.color} />
            </div>
          ))}
          <div
            style={{
              padding: 16,
              background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
              borderRadius: 12,
              textAlign: "center",
              border: "1px solid #bbf7d0",
              marginTop: 8,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color: "#065f46" }}>
              {fmtMoney(totalRecMes)}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#059669",
                marginTop: 3,
                fontWeight: 600,
              }}
            >
              Recebido em {fmtMonth(filterMonth)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Backup Page ───────────────────────────────────────────────
function BackupPage({
  oiClients,
  groups,
  rbClients,
  products,
  sales,
  filterMonth,
  onRestore,
}) {
  const [importMsg, setImportMsg] = useState(null);
  const [importing, setImporting] = useState(false);
  const fRef = useRef();
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
  const stats = [
    {
      label: "OI TV",
      count: oiClients.length,
      icon: "📺",
      bg: "#dbeafe",
      tc: "#1e40af",
    },
    {
      label: "Grupos",
      count: groups.length,
      icon: "👥",
      bg: "#f3e8ff",
      tc: "#7e22ce",
    },
    {
      label: "RB Clientes",
      count: rbClients.length,
      icon: "🛒",
      bg: "#dcfce7",
      tc: "#166534",
    },
    {
      label: "Produtos",
      count: products.length,
      icon: "📦",
      bg: "#fef3c7",
      tc: "#92400e",
    },
    {
      label: "Vendas",
      count: sales.length,
      icon: "💳",
      bg: "#d1fae5",
      tc: "#065f46",
    },
  ];
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#1a1a2e,#0f3460)",
          borderRadius: 20,
          padding: "32px 36px",
          marginBottom: 24,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ fontSize: 48 }}>🛡️</div>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
            Central de Backup
          </h2>
          <p style={{ margin: "6px 0 0", opacity: 0.75, fontSize: 14 }}>
            Exporte e importe todos os dados do sistema.
          </p>
        </div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: 15,
            fontWeight: 800,
            color: "#1a1a2e",
          }}
        >
          📊 Dados no sistema
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))",
            gap: 12,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: s.bg,
                borderRadius: 12,
                padding: "14px 16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: s.tc,
                  marginTop: 4,
                }}
              >
                {s.count}
              </div>
              <div style={{ fontSize: 11, color: s.tc, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 15,
            fontWeight: 800,
            color: "#1a1a2e",
          }}
        >
          ⬇️ Exportar Backup Completo
        </h3>
        <Btn
          variant="backup"
          onClick={() =>
            exportBackup(oiClients, groups, rbClients, products, sales)
          }
          style={{ padding: "14px 28px", fontSize: 15 }}
        >
          🛡️ Baixar Backup (.json)
        </Btn>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 15,
            fontWeight: 800,
            color: "#1a1a2e",
          }}
        >
          ⬆️ Importar Backup
        </h3>
        <input
          ref={fRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: "none" }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <Btn
            variant="restore"
            onClick={() => fRef.current.click()}
            style={{ padding: "13px 24px" }}
          >
            {importing ? "⏳ Importando…" : "📂 Selecionar Arquivo"}
          </Btn>
          {importMsg && (
            <div
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 10,
                background: importMsg.ok ? "#d1fae5" : "#fee2e2",
                color: importMsg.ok ? "#065f46" : "#991b1b",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {importMsg.text}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: 15,
            fontWeight: 800,
            color: "#1a1a2e",
          }}
        >
          📄 Relatórios CSV
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            {
              label: "Clientes OI TV",
              icon: "📺",
              fn: () => exportOiCsv(oiClients, filterMonth),
            },
            {
              label: "Vendas RB Revendas",
              icon: "🛒",
              fn: () => exportSalesCsv(sales),
            },
            {
              label: "Relatório Financeiro",
              icon: "💰",
              fn: () => exportFinCsv(oiClients, sales, filterMonth),
            },
          ].map((ex, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                background: "#f8fafc",
                borderRadius: 12,
                border: "1px solid #e9ecef",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{ex.icon}</span>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}
                >
                  {ex.label}
                </span>
              </div>
              <Btn
                variant="export"
                onClick={ex.fn}
                style={{ padding: "8px 16px", fontSize: 12 }}
              >
                ⬇️ Exportar
              </Btn>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Client Form Modal (shared by OiTV and Groups) ─────────────
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

function ClientFormModal({ client, groups, onSave, onClose, title }) {
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
        />
        <Field
          label="CPF"
          value={form.cpf}
          onChange={(e) => setForm((p) => ({ ...p, cpf: e.target.value }))}
          placeholder="000.000.000-00"
        />
        <Field
          label="Telefone (com DDD)"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="63 99999-0000"
        />
        <Field
          label="Dia de Vencimento"
          value={form.dueDate}
          onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
          placeholder="10"
        />
        <Field
          label="Valor Mensal (R$)"
          value={form.monthlyValue}
          onChange={(e) =>
            setForm((p) => ({ ...p, monthlyValue: e.target.value }))
          }
          placeholder="89.90"
        />
        <Field
          label="CAID"
          value={form.caid}
          onChange={(e) => setForm((p) => ({ ...p, caid: e.target.value }))}
        />
        <Field
          label="CARTÃO"
          value={form.card}
          onChange={(e) => setForm((p) => ({ ...p, card: e.target.value }))}
        />
        <Dropdown
          label="Grupo"
          value={form.groupId}
          onChange={(e) => setForm((p) => ({ ...p, groupId: e.target.value }))}
          options={[
            { value: "", label: "Nenhum" },
            ...groups.map((g) => ({
              value: String(g.id),
              label: g.responsible,
            })),
          ]}
        />
      </div>
      <Field
        label="Endereço"
        value={form.address}
        onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
      />
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#444",
          }}
        >
          Observações
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          rows={3}
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>
          Cancelar
        </Btn>
        <Btn onClick={save}>Salvar</Btn>
      </div>
    </Modal>
  );
}

// ── OI TV Page ────────────────────────────────────────────────
function OiTvPage({
  clients,
  setClients,
  groups,
  filterMonth,
  setFilterMonth,
}) {
  const [editClient, setEditClient] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [payClient, setPayClient] = useState(null);
  const [histClient, setHistClient] = useState(null);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("todos");
  const [confirm, setConfirm] = useState(null);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const match =
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.cpf?.includes(q) ||
      c.phone?.includes(q) ||
      c.caid?.toLowerCase().includes(q);
    const st = getPayStatus(c, filterMonth);
    return match && (statusF === "todos" || st === statusF);
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
      msg: "Excluir este cliente?",
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
    <div>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
        />
      )}
      {showNew && (
        <ClientFormModal
          groups={groups}
          onSave={saveNew}
          onClose={() => setShowNew(false)}
        />
      )}
      {editClient && (
        <ClientFormModal
          client={editClient}
          groups={groups}
          onSave={saveEdit}
          onClose={() => setEditClient(null)}
        />
      )}
      {payClient && (
        <PaymentModal
          client={payClient}
          month={filterMonth}
          onSave={(obj) => savePay(payClient.id, obj)}
          onClose={() => setPayClient(null)}
        />
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 18,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Nome, CPF, telefone, CAID…"
            style={{
              padding: "10px 14px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 14,
              minWidth: 200,
              flex: 1,
            }}
          />
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            style={{
              padding: "10px 12px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            <option value="todos">Todos</option>
            <option value="pago">✅ Pago</option>
            <option value="parcial">🔵 Parcial</option>
            <option value="pendente">⏳ Pendente</option>
            <option value="atrasado">🔴 Atrasado</option>
          </select>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{
              padding: "10px 12px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {fmtMonth(m)}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn
            variant="export"
            onClick={() => exportOiCsv(filtered, filterMonth)}
          >
            ⬇️ CSV
          </Btn>
          <Btn onClick={() => setShowNew(true)}>+ Novo Cliente</Btn>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 800, color: "#065f46" }}>
            {fmtMoney(totalRec)}
          </div>
          <div style={{ fontSize: 12, color: "#065f46", marginTop: 3 }}>
            Recebido — {fmtMonth(filterMonth)}
          </div>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg,#fee2e2,#fecaca)",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 800, color: "#991b1b" }}>
            {fmtMoney(totalPend)}
          </div>
          <div style={{ fontSize: 12, color: "#991b1b", marginTop: 3 }}>
            Pendente / Atrasado
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "auto",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}
        >
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {[
                "Nome",
                "CPF",
                "Telefone",
                "Venc.",
                "Valor",
                "CAID",
                "Status",
                "Ações",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 10px",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#555",
                    borderBottom: "1px solid #f0f0f0",
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
                <td
                  colSpan={8}
                  style={{ padding: 40, textAlign: "center", color: "#aaa" }}
                >
                  Nenhum cliente encontrado
                </td>
              </tr>
            )}
            {filtered.map((c, i) => {
              const st = getPayStatus(c, filterMonth);
              const po = getPayObj(c, filterMonth);
              return (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: "1px solid #f8f8f8",
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f0f4ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      i % 2 === 0 ? "#fff" : "#fafafa")
                  }
                >
                  <td
                    style={{
                      padding: "9px 10px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1a1a2e",
                    }}
                  >
                    {c.name}
                  </td>
                  <td
                    style={{ padding: "9px 10px", fontSize: 12, color: "#666" }}
                  >
                    {c.cpf}
                  </td>
                  <td
                    style={{ padding: "9px 10px", fontSize: 12, color: "#666" }}
                  >
                    {c.phone}
                  </td>
                  <td
                    style={{ padding: "9px 10px", fontSize: 12, color: "#666" }}
                  >
                    Dia {c.dueDate}
                  </td>
                  <td
                    style={{
                      padding: "9px 10px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1a1a2e",
                    }}
                  >
                    <div>{fmtMoney(c.monthlyValue)}</div>
                    {po && po.paid > 0 && po.paid < c.monthlyValue && (
                      <div
                        style={{
                          fontSize: 10,
                          color: "#2563eb",
                          fontWeight: 600,
                        }}
                      >
                        Pago: {fmtMoney(po.paid)}
                      </div>
                    )}
                  </td>
                  <td
                    style={{ padding: "9px 10px", fontSize: 11, color: "#666" }}
                  >
                    {c.caid}
                  </td>
                  <td style={{ padding: "9px 10px" }}>
                    <StatusBadge status={st} />
                  </td>
                  <td style={{ padding: "9px 10px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[
                        {
                          icon: "💳",
                          bg: "#d1fae5",
                          c: "#065f46",
                          title: "Pagamento",
                          fn: () => setPayClient(c),
                        },
                        {
                          icon: "📋",
                          bg: "#dbeafe",
                          c: "#1e40af",
                          title: "Histórico",
                          fn: () => setHistClient(c),
                        },
                        {
                          icon: "💬",
                          bg: "#f0fdf4",
                          c: "#15803d",
                          title: "WhatsApp",
                          fn: () => sendCobranca(c, filterMonth),
                        },
                        {
                          icon: "✏️",
                          bg: "#fef3c7",
                          c: "#92400e",
                          title: "Editar",
                          fn: () => setEditClient(c),
                        },
                        {
                          icon: "🗑️",
                          bg: "#fee2e2",
                          c: "#991b1b",
                          title: "Excluir",
                          fn: () => del(c.id),
                        },
                      ].map((btn, j) => (
                        <button
                          key={j}
                          title={btn.title}
                          onClick={btn.fn}
                          style={{
                            background: btn.bg,
                            color: btn.c,
                            border: "none",
                            borderRadius: 6,
                            padding: "5px 8px",
                            fontSize: 12,
                            cursor: "pointer",
                            fontWeight: 600,
                            transition: "transform 0.12s",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.18)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "none")
                          }
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

      {histClient && (
        <Modal
          title={`Histórico — ${histClient.name}`}
          onClose={() => setHistClient(null)}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px 16px",
              marginBottom: 16,
            }}
          >
            {[
              ["CPF", histClient.cpf],
              ["Telefone", histClient.phone],
              ["CAID", histClient.caid],
              ["Cartão", histClient.card],
            ].map(([k, v]) => (
              <p key={k} style={{ margin: 0, fontSize: 13, color: "#555" }}>
                <strong>{k}:</strong> {v}
              </p>
            ))}
          </div>
          <h4
            style={{
              margin: "0 0 12px",
              fontSize: 14,
              fontWeight: 700,
              color: "#1a1a2e",
            }}
          >
            Pagamentos
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 340,
              overflowY: "auto",
            }}
          >
            {MONTHS.map((m) => {
              const po = getPayObj(histClient, m);
              const st = getPayStatus(histClient, m);
              return (
                <div
                  key={m}
                  style={{
                    padding: "10px 14px",
                    background: "#f8fafc",
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {fmtMonth(m)}
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {po && po.paid > 0 && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#2563eb",
                          fontWeight: 600,
                        }}
                      >
                        {fmtMoney(po.paid)}
                      </span>
                    )}
                    {po && po.date && (
                      <span style={{ fontSize: 11, color: "#aaa" }}>
                        {new Date(po.date + "T00:00:00").toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    )}
                    <StatusBadge status={st} />
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

// ── Groups Page ───────────────────────────────────────────────
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

function GroupsPage({ groups, setGroups, clients, setClients, filterMonth }) {
  const [form, setForm] = useState(EMPTY_GROUP);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  // client editing inside group
  const [editClient, setEditClient] = useState(null);
  const [payClient, setPayClient] = useState(null);
  const [showNewCli, setShowNewCli] = useState(null); // groupId
  const [clientConfirm, setClientConfirm] = useState(null);

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
  function openNew() {
    setForm(EMPTY_GROUP);
    setEditId(null);
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
  function toggle(id) {
    setExpanded((p) => (p === id ? null : id));
  }
  function toggleSettled(g) {
    setGroups((p) =>
      p.map((x) => (x.id === g.id ? { ...x, settled: !x.settled } : x)),
    );
  }

  // client ops within group
  function saveNewClient(gId, data) {
    setClients((p) => [
      ...p,
      { ...data, id: Date.now(), payments: {}, groupId: gId },
    ]);
    setShowNewCli(null);
  }
  function saveEditClient(data) {
    setClients((p) =>
      p.map((c) => (c.id === editClient.id ? { ...c, ...data } : c)),
    );
    setEditClient(null);
  }
  function delClient(cid) {
    setClientConfirm({
      msg: "Excluir este cliente do grupo?",
      onOk: () => {
        setClients((p) => p.filter((c) => c.id !== cid));
        setClientConfirm(null);
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

  const filtered = groups.filter(
    (g) =>
      !search ||
      g.responsible?.toLowerCase().includes(search.toLowerCase()) ||
      g.contract?.includes(search),
  );

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
        />
      )}
      {clientConfirm && (
        <ConfirmDialog
          msg={clientConfirm.msg}
          onOk={clientConfirm.onOk}
          onCancel={() => setClientConfirm(null)}
        />
      )}
      {showNewCli !== null && (
        <ClientFormModal
          groups={groups}
          onSave={(d) => saveNewClient(showNewCli, d)}
          onClose={() => setShowNewCli(null)}
          title="Novo Cliente no Grupo"
        />
      )}
      {editClient && (
        <ClientFormModal
          client={editClient}
          groups={groups}
          onSave={saveEditClient}
          onClose={() => setEditClient(null)}
        />
      )}
      {payClient && (
        <PaymentModal
          client={payClient}
          month={filterMonth}
          onSave={(obj) => savePay(payClient.id, obj)}
          onClose={() => setPayClient(null)}
        />
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
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar grupo…"
          style={{
            padding: "10px 14px",
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
            flex: 1,
            minWidth: 180,
          }}
        />
        <Btn onClick={openNew}>+ Novo Grupo</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "#aaa", padding: 40 }}>
            Nenhum grupo encontrado.
          </p>
        )}
        {filtered.map((g) => {
          const gc = clients.filter((c) => String(c.groupId) === String(g.id));
          const isOpen = expanded === g.id;
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
          const allPaid = gc.length > 0 && totalPend <= 0 && totalParcial === 0;
          const pctPago =
            totalInvest > 0
              ? Math.min(
                  100,
                  Math.round(((totalPago + totalParcial) / totalInvest) * 100),
                )
              : 0;
          const groupInvest = g.investedValue || 0;

          return (
            <div
              key={g.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: isOpen
                  ? "0 8px 32px rgba(0,0,0,0.13)"
                  : "0 2px 10px rgba(0,0,0,0.06)",
                border: `2px solid ${isOpen ? "#1a1a2e" : "#f0f0f0"}`,
                overflow: "hidden",
                transition: "box-shadow 0.25s,border-color 0.25s",
              }}
            >
              {/* ── Header ── */}
              <div
                onClick={() => toggle(g.id)}
                style={{
                  padding: "18px 22px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  userSelect: "none",
                  background: isOpen
                    ? "linear-gradient(135deg,#1a1a2e,#0f3460)"
                    : "#fff",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) e.currentTarget.style.background = "#fff";
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    transition: "transform 0.3s",
                    transform: isOpen ? "rotate(90deg)" : "none",
                    color: isOpen ? "#fff" : "#1a1a2e",
                    flexShrink: 0,
                  }}
                >
                  ▶
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                        color: isOpen ? "#fff" : "#1a1a2e",
                      }}
                    >
                      {g.responsible}
                    </h3>
                    {gc.length > 0 && (
                      <span
                        style={{
                          background: allPaid ? "#d1fae5" : "#fef3c7",
                          color: allPaid ? "#065f46" : "#92400e",
                          borderRadius: 20,
                          padding: "2px 10px",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {allPaid ? "✅ Quitado" : "⏳ Pendente"}
                      </span>
                    )}
                    {g.settled && (
                      <span
                        style={{
                          background: "#d1fae5",
                          color: "#065f46",
                          borderRadius: 20,
                          padding: "2px 10px",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        💼 Acerto OK
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      marginTop: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: isOpen ? "rgba(255,255,255,0.65)" : "#888",
                      }}
                    >
                      Contrato: {g.contract || "—"}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: isOpen ? "rgba(255,255,255,0.65)" : "#888",
                      }}
                    >
                      {gc.length}/5 clientes
                    </span>
                    {groupInvest > 0 && (
                      <span
                        style={{
                          fontSize: 12,
                          color: isOpen ? "rgba(255,255,255,0.65)" : "#888",
                        }}
                      >
                        Investimento: {fmtMoney(groupInvest)}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    flexShrink: 0,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 900,
                        color: isOpen ? "#34d399" : "#065f46",
                      }}
                    >
                      {fmtMoney(totalPago + totalParcial)}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: isOpen ? "rgba(255,255,255,0.55)" : "#aaa",
                        fontWeight: 600,
                      }}
                    >
                      Investido
                    </div>
                  </div>
                  {totalPend > 0 && (
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 900,
                          color: isOpen ? "#f87171" : "#991b1b",
                        }}
                      >
                        {fmtMoney(totalPend)}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: isOpen ? "rgba(255,255,255,0.55)" : "#aaa",
                          fontWeight: 600,
                        }}
                      >
                        Pendente
                      </div>
                    </div>
                  )}
                  <div
                    style={{ display: "flex", gap: 6 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => openEdit(e, g)}
                      style={{
                        background: isOpen
                          ? "rgba(255,255,255,0.15)"
                          : "#fef3c7",
                        color: isOpen ? "#fff" : "#92400e",
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 10px",
                        fontSize: 13,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => del(e, g.id)}
                      style={{
                        background: isOpen
                          ? "rgba(255,255,255,0.15)"
                          : "#fee2e2",
                        color: isOpen ? "#fff" : "#991b1b",
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 10px",
                        fontSize: 13,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Expanded ── */}
              {isOpen && (
                <div
                  style={{ padding: "0 22px 24px", animation: "slideUp 0.22s" }}
                >
                  {/* Settled toggle + invested value */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      margin: "20px 0 16px",
                      padding: "16px 18px",
                      background: "#f8fafc",
                      borderRadius: 12,
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#888",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          marginBottom: 8,
                        }}
                      >
                        💼 Valor Investido no Grupo
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 900,
                          color: "#1e40af",
                        }}
                      >
                        {fmtMoney(groupInvest)}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#888",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          marginBottom: 8,
                        }}
                      >
                        Status do Acerto
                      </div>
                      <Toggle
                        label={
                          g.settled ? "Acerto realizado" : "Acerto pendente"
                        }
                        checked={g.settled || false}
                        onChange={() => toggleSettled(g)}
                        colorOn="#059669"
                        colorOff="#e2e8f0"
                      />
                    </div>
                  </div>

                  {/* progress */}
                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{ fontSize: 12, fontWeight: 700, color: "#555" }}
                      >
                        Progresso do Investimento — {fmtMonth(filterMonth)}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: pctPago === 100 ? "#065f46" : "#92400e",
                        }}
                      >
                        {pctPago}%
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#fee2e2",
                        borderRadius: 99,
                        height: 10,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pctPago}%`,
                          height: "100%",
                          background: "linear-gradient(90deg,#34d399,#059669)",
                          borderRadius: 99,
                          transition:
                            "width 0.8s cubic-bezier(0.34,1.2,0.64,1)",
                        }}
                      />
                    </div>
                  </div>

                  {/* financial cards */}
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
                        label: "Total do Grupo",
                        val: totalInvest,
                        bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                        tc: "#1e40af",
                        icon: "💼",
                      },
                      {
                        label: "Investido (Pago)",
                        val: totalPago + totalParcial,
                        bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                        tc: "#065f46",
                        icon: "✅",
                      },
                      {
                        label: "Pendente",
                        val: Math.max(0, totalPend),
                        bg:
                          totalPend > 0
                            ? "linear-gradient(135deg,#fee2e2,#fecaca)"
                            : "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                        tc: totalPend > 0 ? "#991b1b" : "#065f46",
                        icon: totalPend > 0 ? "⏳" : "🎉",
                      },
                    ].map((card, i) => (
                      <div
                        key={i}
                        style={{
                          background: card.bg,
                          borderRadius: 12,
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
                            fontWeight: 900,
                            color: card.tc,
                          }}
                        >
                          {fmtMoney(card.val)}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: card.tc,
                            marginTop: 3,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {card.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* client list with actions */}
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1px solid #e9ecef",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 16px",
                        background: "#f0f4ff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#1a1a2e",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Clientes do Grupo
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#555",
                          }}
                        >
                          {gc.length}/5
                        </span>
                        {gc.length < 5 && (
                          <button
                            onClick={() => setShowNewCli(g.id)}
                            style={{
                              background: "#1a1a2e",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "4px 10px",
                              fontSize: 11,
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            + Cliente
                          </button>
                        )}
                      </div>
                    </div>
                    {gc.length === 0 ? (
                      <div
                        style={{
                          padding: "24px",
                          textAlign: "center",
                          color: "#aaa",
                          fontSize: 13,
                        }}
                      >
                        Nenhum cliente vinculado.{" "}
                        <button
                          onClick={() => setShowNewCli(g.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#1e40af",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: 13,
                            textDecoration: "underline",
                          }}
                        >
                          Adicionar agora
                        </button>
                      </div>
                    ) : (
                      gc.map((c, i) => {
                        const st = getPayStatus(c, filterMonth);
                        const po = getPayObj(c, filterMonth);
                        const isPago = st === "pago";
                        return (
                          <div
                            key={c.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "12px 16px",
                              borderBottom:
                                i < gc.length - 1
                                  ? "1px solid #e9ecef"
                                  : "none",
                              background: i % 2 === 0 ? "#fff" : "#f8fafc",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                background: isPago
                                  ? "#d1fae5"
                                  : st === "parcial"
                                    ? "#dbeafe"
                                    : "#fee2e2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                                flexShrink: 0,
                              }}
                            >
                              {isPago ? "✅" : st === "parcial" ? "🔵" : "⏳"}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: "#1a1a2e",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {c.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#888",
                                  marginTop: 1,
                                }}
                              >
                                Vence dia {c.dueDate} · {c.phone || "sem tel"}
                              </div>
                              {po && po.paid > 0 && st === "parcial" && (
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: "#2563eb",
                                    fontWeight: 600,
                                    marginTop: 1,
                                  }}
                                >
                                  Pago: {fmtMoney(po.paid)} · Restante:{" "}
                                  {fmtMoney(po.remaining)}
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                textAlign: "right",
                                flexShrink: 0,
                                marginRight: 8,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: isPago
                                    ? "#065f46"
                                    : st === "parcial"
                                      ? "#1e40af"
                                      : "#991b1b",
                                }}
                              >
                                {fmtMoney(c.monthlyValue)}
                              </div>
                              <div style={{ marginTop: 3 }}>
                                <StatusBadge status={st} />
                              </div>
                            </div>
                            <div
                              style={{ display: "flex", gap: 4, flexShrink: 0 }}
                            >
                              <button
                                title="Registrar Pagamento"
                                onClick={() => setPayClient(c)}
                                style={{
                                  background: "#d1fae5",
                                  color: "#065f46",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "5px 8px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  fontWeight: 700,
                                }}
                              >
                                💳
                              </button>
                              <button
                                title="Editar Cliente"
                                onClick={() => setEditClient(c)}
                                style={{
                                  background: "#fef3c7",
                                  color: "#92400e",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "5px 8px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  fontWeight: 700,
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                title="Excluir"
                                onClick={() => delClient(c.id)}
                                style={{
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "5px 8px",
                                  fontSize: 12,
                                  cursor: "pointer",
                                  fontWeight: 700,
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* notes + tags */}
                  {g.notes && (
                    <div
                      style={{
                        marginBottom: 14,
                        padding: "12px 16px",
                        background: "#fffbeb",
                        borderRadius: 10,
                        border: "1px solid #fde68a",
                        fontSize: 13,
                        color: "#92400e",
                      }}
                    >
                      📝 {g.notes}
                    </div>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      { l: "CPF", v: g.cpf },
                      { l: "Mãe", v: g.motherName },
                      {
                        l: "Nasc.",
                        v: g.birthDate
                          ? new Date(
                              g.birthDate + "T00:00:00",
                            ).toLocaleDateString("pt-BR")
                          : "—",
                      },
                    ].map(({ l, v }) => (
                      <span
                        key={l}
                        style={{
                          background: "#f0f4ff",
                          color: "#1e40af",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {l}: {v || "—"}
                      </span>
                    ))}
                    {allPaid && gc.length > 0 && (
                      <span
                        style={{
                          background: "#d1fae5",
                          color: "#065f46",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        🎉 Grupo quitado em {fmtMonth(filterMonth)}
                      </span>
                    )}
                    {g.settled && (
                      <span
                        style={{
                          background: "#d1fae5",
                          color: "#065f46",
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        💼 Custos acertados
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Group Form Modal */}
      {showModal && (
        <Modal
          title={editId ? "Editar Grupo" : "Novo Grupo"}
          onClose={() => setShowModal(false)}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <Field
              label="Nome do Responsável *"
              value={form.responsible}
              onChange={(e) =>
                setForm((p) => ({ ...p, responsible: e.target.value }))
              }
            />
            <Field
              label="CPF"
              value={form.cpf}
              onChange={(e) => setForm((p) => ({ ...p, cpf: e.target.value }))}
            />
            <Field
              label="Nº do Contrato"
              value={form.contract}
              onChange={(e) =>
                setForm((p) => ({ ...p, contract: e.target.value }))
              }
            />
            <Field
              label="Nome da Mãe"
              value={form.motherName}
              onChange={(e) =>
                setForm((p) => ({ ...p, motherName: e.target.value }))
              }
            />
            <Field
              label="Data de Nascimento"
              type="date"
              value={form.birthDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, birthDate: e.target.value }))
              }
            />
            <Field
              label="💼 Valor Investido (R$)"
              value={form.investedValue}
              onChange={(e) =>
                setForm((p) => ({ ...p, investedValue: e.target.value }))
              }
              placeholder="0,00"
            />
          </div>
          <Toggle
            label="Status de Acerto do Grupo (custos liquidados)"
            checked={form.settled || false}
            onChange={(v) => setForm((p) => ({ ...p, settled: v }))}
          />
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "#444",
              }}
            >
              Observações
            </label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Btn>
            <Btn onClick={save}>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── RB Revendas Page ──────────────────────────────────────────
function RbRevendasPage({ clients, setClients, sales, setSales }) {
  const [tab, setTab] = useState("clientes");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [saleForm, setSaleForm] = useState({
    clientName: "",
    product: "",
    value: "",
    payment: "pix",
    date: today(),
  });
  const [editId, setEditId] = useState(null);
  const [showCForm, setShowCForm] = useState(false);
  const [showSForm, setShowSForm] = useState(false);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  function saveClient() {
    if (!form.name) return alert("Nome obrigatório");
    if (editId)
      setClients((p) =>
        p.map((c) => (c.id === editId ? { ...c, ...form } : c)),
      );
    else setClients((p) => [...p, { ...form, id: Date.now() }]);
    setShowCForm(false);
    setEditId(null);
  }
  function saveSale() {
    if (!saleForm.clientName || !saleForm.product)
      return alert("Preencha os campos obrigatórios");
    setSales((p) => [
      ...p,
      { ...saleForm, id: Date.now(), value: parseFloat(saleForm.value) || 0 },
    ]);
    setShowSForm(false);
  }
  function delClient(id) {
    setConfirm({
      msg: "Excluir este cliente?",
      onOk: () => {
        setClients((p) => p.filter((x) => x.id !== id));
        setConfirm(null);
      },
    });
  }
  function delSale(id) {
    setConfirm({
      msg: "Excluir esta venda?",
      onOk: () => {
        setSales((p) => p.filter((x) => x.id !== id));
        setConfirm(null);
      },
    });
  }

  const fc = clients.filter(
    (c) =>
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search),
  );
  const totalSales = sales.reduce((s, v) => s + v.value, 0);

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div
        style={{
          display: "flex",
          marginBottom: 24,
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e9ecef",
        }}
      >
        {[
          ["clientes", "👥 Clientes"],
          ["vendas", "💳 Vendas"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              background: tab === k ? "#1a1a2e" : "transparent",
              color: tab === k ? "#fff" : "#555",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {l}
          </button>
        ))}
      </div>
      {tab === "clientes" && (
        <>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "space-between",
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Buscar…"
              style={{
                padding: "10px 14px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                flex: 1,
                minWidth: 180,
              }}
            />
            <Btn
              onClick={() => {
                setEditId(null);
                setForm({ name: "", phone: "", email: "", address: "" });
                setShowCForm(true);
              }}
            >
              + Novo Cliente
            </Btn>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Nome", "Telefone", "E-mail", "Ações"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#555",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fc.map((c) => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: "1px solid #f8f8f8" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f4ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#1a1a2e",
                      }}
                    >
                      {c.name}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#666",
                      }}
                    >
                      {c.phone}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#666",
                      }}
                    >
                      {c.email}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => {
                            setForm(c);
                            setEditId(c.id);
                            setShowCForm(true);
                          }}
                          style={{
                            background: "#fef3c7",
                            color: "#92400e",
                            border: "none",
                            borderRadius: 6,
                            padding: "5px 10px",
                            fontSize: 12,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => delClient(c.id)}
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "none",
                            borderRadius: 6,
                            padding: "5px 10px",
                            fontSize: 12,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {fc.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: 30,
                        textAlign: "center",
                        color: "#aaa",
                      }}
                    >
                      Nenhum cliente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab === "vendas" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                borderRadius: 12,
                padding: "10px 18px",
              }}
            >
              <span style={{ fontSize: 13, color: "#065f46" }}>
                Total: <strong>{fmtMoney(totalSales)}</strong>
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="export" onClick={() => exportSalesCsv(sales)}>
                ⬇️ CSV
              </Btn>
              <Btn
                onClick={() => {
                  setSaleForm({
                    clientName: "",
                    product: "",
                    value: "",
                    payment: "pix",
                    date: today(),
                  });
                  setShowSForm(true);
                }}
              >
                + Registrar Venda
              </Btn>
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Data", "Cliente", "Produto", "Valor", "Pgto", ""].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#555",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr
                    key={s.id}
                    style={{ borderBottom: "1px solid #f8f8f8" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f4ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#666",
                      }}
                    >
                      {new Date(s.date + "T00:00:00").toLocaleDateString(
                        "pt-BR",
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#1a1a2e",
                      }}
                    >
                      {s.clientName}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#555",
                      }}
                    >
                      {s.product}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#065f46",
                      }}
                    >
                      {fmtMoney(s.value)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          background: "#dbeafe",
                          color: "#1e40af",
                          padding: "2px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {s.payment.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() => delSale(s.id)}
                        style={{
                          background: "#fee2e2",
                          color: "#991b1b",
                          border: "none",
                          borderRadius: 6,
                          padding: "5px 10px",
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: 30,
                        textAlign: "center",
                        color: "#aaa",
                      }}
                    >
                      Nenhuma venda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showCForm && (
        <Modal
          title={editId ? "Editar Cliente" : "Novo Cliente RB"}
          onClose={() => setShowCForm(false)}
        >
          <Field
            label="Nome *"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <Field
            label="Telefone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <Field
            label="E-mail"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Field
            label="Endereço"
            value={form.address}
            onChange={(e) =>
              setForm((p) => ({ ...p, address: e.target.value }))
            }
          />
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowCForm(false)}>
              Cancelar
            </Btn>
            <Btn onClick={saveClient}>Salvar</Btn>
          </div>
        </Modal>
      )}
      {showSForm && (
        <Modal title="Registrar Venda" onClose={() => setShowSForm(false)}>
          <Field
            label="Nome do Cliente *"
            value={saleForm.clientName}
            onChange={(e) =>
              setSaleForm((p) => ({ ...p, clientName: e.target.value }))
            }
          />
          <Field
            label="Produto *"
            value={saleForm.product}
            onChange={(e) =>
              setSaleForm((p) => ({ ...p, product: e.target.value }))
            }
          />
          <Field
            label="Valor (R$)"
            value={saleForm.value}
            onChange={(e) =>
              setSaleForm((p) => ({ ...p, value: e.target.value }))
            }
          />
          <Field
            label="Data"
            type="date"
            value={saleForm.date}
            onChange={(e) =>
              setSaleForm((p) => ({ ...p, date: e.target.value }))
            }
          />
          <Dropdown
            label="Pagamento"
            value={saleForm.payment}
            onChange={(e) =>
              setSaleForm((p) => ({ ...p, payment: e.target.value }))
            }
            options={[
              { value: "pix", label: "PIX" },
              { value: "cartao", label: "Cartão" },
              { value: "dinheiro", label: "Dinheiro" },
              { value: "boleto", label: "Boleto" },
            ]}
          />
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowSForm(false)}>
              Cancelar
            </Btn>
            <Btn onClick={saveSale}>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Products Page ─────────────────────────────────────────────
function ProductsPage({ products, setProducts }) {
  const [form, setForm] = useState({
    name: "",
    desc: "",
    price: "",
    stock: "",
    image: "📦",
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirm, setConfirm] = useState(null);
  function save() {
    if (!form.name) return alert("Nome obrigatório");
    const data = {
      ...form,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
    };
    if (editId)
      setProducts((p) =>
        p.map((x) => (x.id === editId ? { ...x, ...data } : x)),
      );
    else setProducts((p) => [...p, { ...data, id: Date.now() }]);
    setShowModal(false);
    setEditId(null);
  }
  function openEdit(x) {
    setForm({ ...x, price: String(x.price), stock: String(x.stock) });
    setEditId(x.id);
    setShowModal(true);
  }
  function del(id) {
    setConfirm({
      msg: "Excluir este produto?",
      onOk: () => {
        setProducts((p) => p.filter((x) => x.id !== id));
        setConfirm(null);
      },
    });
  }
  return (
    <div>
      {confirm && (
        <ConfirmDialog
          msg={confirm.msg}
          onOk={confirm.onOk}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <Btn
          onClick={() => {
            setEditId(null);
            setForm({ name: "", desc: "", price: "", stock: "", image: "📦" });
            setShowModal(true);
          }}
        >
          + Novo Produto
        </Btn>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: 20,
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1px solid #f0f0f0",
              transition: "transform 0.2s,box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#f8fafc,#e9ecef)",
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              {p.image}
            </div>
            <div style={{ padding: 20 }}>
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#1a1a2e",
                }}
              >
                {p.name}
              </h3>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#888" }}>
                {p.desc}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{ fontSize: 20, fontWeight: 800, color: "#0f3460" }}
                >
                  {fmtMoney(p.price)}
                </span>
                <span
                  style={{
                    background: p.stock > 0 ? "#d1fae5" : "#fee2e2",
                    color: p.stock > 0 ? "#065f46" : "#991b1b",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Estoque: {p.stock}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => openEdit(p)}
                  style={{
                    flex: 1,
                    background: "#fef3c7",
                    color: "#92400e",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => del(p.id)}
                  style={{
                    flex: 1,
                    background: "#fee2e2",
                    color: "#991b1b",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p style={{ color: "#aaa", fontSize: 14 }}>
            Nenhum produto cadastrado.
          </p>
        )}
      </div>
      {showModal && (
        <Modal
          title={editId ? "Editar Produto" : "Novo Produto"}
          onClose={() => setShowModal(false)}
        >
          <Field
            label="Nome *"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "#444",
              }}
            >
              Descrição
            </label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
              rows={2}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 16px",
            }}
          >
            <Field
              label="Preço (R$)"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="99.90"
            />
            <Field
              label="Estoque"
              value={form.stock}
              onChange={(e) =>
                setForm((p) => ({ ...p, stock: e.target.value }))
              }
              placeholder="10"
            />
            <Field
              label="Emoji"
              value={form.image}
              onChange={(e) =>
                setForm((p) => ({ ...p, image: e.target.value }))
              }
              placeholder="📦"
            />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Btn>
            <Btn onClick={save}>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Public Store ──────────────────────────────────────────────
function PublicStore({ products, onLogout }) {
  const wa = (p) => {
    const msg = encodeURIComponent(
      `Olá! Tenho interesse em: *${p.name}* — ${fmtMoney(p.price)}. Poderia me dar mais informações?`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };
  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif" }}>
      <header
        style={{
          background: "linear-gradient(135deg,#1a1a2e,#0f3460)",
          color: "#fff",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
            🛒 RB Revendas
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.8 }}>
            Produtos com qualidade e preço justo
          </p>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Sair
          </button>
        )}
      </header>
      <div style={{ padding: "40px", maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: 900,
            color: "#1a1a2e",
            marginBottom: 8,
          }}
        >
          Nossos Produtos
        </h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 40 }}>
          Clique em "Comprar" para falar pelo WhatsApp
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 24,
          }}
        >
          {products
            .filter((p) => p.stock > 0)
            .map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s,box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 36px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg,#f8fafc,#e9ecef)",
                    height: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 64,
                  }}
                >
                  {p.image}
                </div>
                <div style={{ padding: 24 }}>
                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#1a1a2e",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p
                    style={{ margin: "0 0 16px", fontSize: 14, color: "#888" }}
                  >
                    {p.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 900,
                        color: "#0f3460",
                      }}
                    >
                      {fmtMoney(p.price)}
                    </span>
                    <span
                      style={{
                        background: "#d1fae5",
                        color: "#065f46",
                        padding: "4px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Em estoque
                    </span>
                  </div>
                  <button
                    onClick={() => wa(p)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "linear-gradient(135deg,#25d366,#128c7e)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    💬 Comprar pelo WhatsApp
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Financeiro Page ───────────────────────────────────────────
function FinanceiroPage({ oiClients, sales, filterMonth, setFilterMonth }) {
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
  const byPay = {};
  sales.forEach((s) => {
    byPay[s.payment] = (byPay[s.payment] || 0) + s.value;
  });
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontWeight: 600, color: "#555" }}>Mês:</label>
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{
            padding: "8px 14px",
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
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
          onClick={() => exportFinCsv(oiClients, sales, filterMonth)}
        >
          ⬇️ Exportar CSV
        </Btn>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[
          {
            l: "Recebido OI TV",
            v: rec,
            bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
            tc: "#065f46",
          },
          {
            l: "Parcial OI TV",
            v: parcial,
            bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
            tc: "#1e40af",
          },
          {
            l: "Pendente OI TV",
            v: pend,
            bg: "linear-gradient(135deg,#fef3c7,#fde68a)",
            tc: "#92400e",
          },
          {
            l: "Atrasado OI TV",
            v: atras,
            bg: "linear-gradient(135deg,#fee2e2,#fecaca)",
            tc: "#991b1b",
          },
          {
            l: "Total RB Revendas",
            v: totalV,
            bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
            tc: "#5b21b6",
          },
        ].map((c, i) => (
          <div
            key={i}
            style={{ background: c.bg, borderRadius: 14, padding: "20px 22px" }}
          >
            <div
              style={{
                fontSize: 12,
                color: c.tc,
                fontWeight: 700,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {c.l}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: c.tc }}>
              {fmtMoney(c.v)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: 16,
              fontWeight: 800,
              color: "#1a1a2e",
            }}
          >
            📊 OI TV — {fmtMonth(filterMonth)}
          </h3>
          {oiClients.length === 0 && (
            <p style={{ color: "#aaa", fontSize: 14 }}>Nenhum cliente.</p>
          )}
          {oiClients.map((c) => {
            const st = getPayStatus(c, filterMonth);
            const po = getPayObj(c, filterMonth);
            return (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 0",
                  borderBottom: "1px solid #f8f8f8",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1a1a2e",
                    }}
                  >
                    {c.name}
                  </p>
                  {po && po.paid > 0 && st === "parcial" && (
                    <p style={{ margin: 0, fontSize: 11, color: "#2563eb" }}>
                      Pago: {fmtMoney(po.paid)} · Restante:{" "}
                      {fmtMoney(po.remaining)}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#555" }}
                  >
                    {fmtMoney(c.monthlyValue)}
                  </span>
                  <StatusBadge status={st} />
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: 16,
              fontWeight: 800,
              color: "#1a1a2e",
            }}
          >
            💳 Formas de Pagamento — RB
          </h3>
          {Object.entries(byPay).map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "11px 0",
                borderBottom: "1px solid #f8f8f8",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#555",
                }}
              >
                {k}
              </span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>
                {fmtMoney(v)}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: 14,
              padding: "14px 0",
              borderTop: "2px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 800, color: "#1a1a2e" }}>TOTAL</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#0f3460" }}>
              {fmtMoney(totalV)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [oiClients, setOiRaw] = useState([]);
  const [groups, setGroupsRaw] = useState([]);
  const [rbClients, setRbRaw] = useState([]);
  const [products, setProductsRaw] = useState([]);
  const [sales, setSalesRaw] = useState([]);
  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [loaded, setLoaded] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    (async () => {
      const [oi, gr, rb, pr, sa] = await Promise.all([
        storeGet("oiClients"),
        storeGet("groups"),
        storeGet("rbClients"),
        storeGet("products"),
        storeGet("sales"),
      ]);
      if (oi) setOiRaw(oi);
      if (gr) setGroupsRaw(gr);
      if (rb) setRbRaw(rb);
      if (pr) setProductsRaw(pr);
      if (sa) setSalesRaw(sa);
      setLoaded(true);
    })();
  }, []);

  const setOiClients = (v) => {
    const n = typeof v === "function" ? v(oiClients) : v;
    setOiRaw(n);
    storeSet("oiClients", n);
  };
  const setGroups = (v) => {
    const n = typeof v === "function" ? v(groups) : v;
    setGroupsRaw(n);
    storeSet("groups", n);
  };
  const setRbClients = (v) => {
    const n = typeof v === "function" ? v(rbClients) : v;
    setRbRaw(n);
    storeSet("rbClients", n);
  };
  const setProducts = (v) => {
    const n = typeof v === "function" ? v(products) : v;
    setProductsRaw(n);
    storeSet("products", n);
  };
  const setSales = (v) => {
    const n = typeof v === "function" ? v(sales) : v;
    setSalesRaw(n);
    storeSet("sales", n);
  };

  function restoreBackup(data) {
    if (data.oiClients) setOiClients(data.oiClients);
    if (data.groups) setGroups(data.groups);
    if (data.rbClients) setRbClients(data.rbClients);
    if (data.products) setProducts(data.products);
    if (data.sales) setSales(data.sales);
  }

  function handleLogin(email, pass) {
    const admin = ADMINS.find((a) => a.email === email && a.password === pass);
    if (admin) {
      setAuth({ email, role: "admin", name: admin.name });
      setShowRestore(true);
    } else if (email && pass) setAuth({ email, role: "user", name: email });
    else alert("Credenciais inválidas");
  }

  if (!loaded)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a2e",
          color: "#fff",
          fontSize: 18,
          fontFamily: "sans-serif",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 40, animation: "spin 1.5s linear infinite" }}>
          ⚙️
        </div>
        Carregando…
      </div>
    );
  if (!auth)
    return (
      <>
        <GlobalStyles />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  if (auth.role !== "admin")
    return (
      <>
        <GlobalStyles />
        <PublicStore products={products} onLogout={() => setAuth(null)} />
      </>
    );
  if (showRestore)
    return (
      <>
        <GlobalStyles />
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

  const nav = [
    { key: "backup", icon: "🛡️", label: "Backup" },
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "oitv", icon: "📺", label: "OI TV" },
    { key: "grupos", icon: "👥", label: "Grupos OI TV" },
    { key: "rbrevendas", icon: "🛒", label: "RB Revendas" },
    { key: "loja", icon: "🏪", label: "Loja Pública" },
    { key: "produtos", icon: "📦", label: "Produtos" },
    { key: "financeiro", icon: "💰", label: "Financeiro" },
  ];
  const currentNav = nav.find((n) => n.key === page);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Segoe UI',sans-serif",
        background: "#f7f8fc",
      }}
    >
      <GlobalStyles />
      <aside
        style={{
          width: sidebarOpen ? 240 : 64,
          background: "linear-gradient(180deg,#1a1a2e,#0f3460)",
          color: "#fff",
          transition: "width 0.3s ease",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span style={{ fontSize: 22, flexShrink: 0 }}>📡</span>
          {sidebarOpen && (
            <span
              style={{ fontWeight: 800, fontSize: 16, whiteSpace: "nowrap" }}
            >
              RB Sistema
            </span>
          )}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {nav.map((n) => (
            <div
              key={n.key}
              onClick={() => setPage(n.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                marginBottom: 4,
                background:
                  page === n.key ? "rgba(255,255,255,0.15)" : "transparent",
                whiteSpace: "nowrap",
                transition: "background 0.2s,transform 0.2s",
                borderLeft:
                  n.key === "backup"
                    ? "3px solid #f59e0b"
                    : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (page !== n.key)
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                if (page !== n.key)
                  e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "none";
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
              {sidebarOpen && (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: page === n.key ? 700 : 400,
                  }}
                >
                  {n.label}
                </span>
              )}
            </div>
          ))}
        </nav>
        <div
          style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          {sidebarOpen && (
            <>
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Admin
              </p>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 600,
                }}
              >
                {auth.name}
              </p>
            </>
          )}
          <button
            onClick={() => setAuth(null)}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 13,
              width: sidebarOpen ? "100%" : "auto",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.1)")
            }
          >
            {sidebarOpen ? "Sair" : "↩"}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto" }}>
        <header
          style={{
            background: "#fff",
            padding: "16px 28px",
            borderBottom: "1px solid #e9ecef",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "#1a1a2e",
            }}
          >
            {currentNav?.icon} {currentNav?.label}
          </h1>
          <span style={{ fontSize: 13, color: "#888" }}>
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </header>
        <div style={{ padding: 28 }}>
          {page === "backup" && (
            <BackupPage
              oiClients={oiClients}
              groups={groups}
              rbClients={rbClients}
              products={products}
              sales={sales}
              filterMonth={filterMonth}
              onRestore={restoreBackup}
            />
          )}
          {page === "dashboard" && (
            <DashboardPage
              oiClients={oiClients}
              groups={groups}
              rbClients={rbClients}
              sales={sales}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              totalRecMes={totalRecMes}
              totalPendMes={totalPendMes}
              setPage={setPage}
              userName={auth.name}
            />
          )}
          {page === "oitv" && (
            <OiTvPage
              clients={oiClients}
              setClients={setOiClients}
              groups={groups}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
            />
          )}
          {page === "grupos" && (
            <GroupsPage
              groups={groups}
              setGroups={setGroups}
              clients={oiClients}
              setClients={setOiClients}
              filterMonth={filterMonth}
            />
          )}
          {page === "rbrevendas" && (
            <RbRevendasPage
              clients={rbClients}
              setClients={setRbClients}
              sales={sales}
              setSales={setSales}
            />
          )}
          {page === "loja" && <PublicStore products={products} />}
          {page === "produtos" && (
            <ProductsPage products={products} setProducts={setProducts} />
          )}
          {page === "financeiro" && (
            <FinanceiroPage
              oiClients={oiClients}
              sales={sales}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
            />
          )}
        </div>
      </main>
    </div>
  );
}
