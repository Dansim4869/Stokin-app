// ============================================================
//  STOKIN v3.3 — PT NAULI MITRA STRATEGIC
//  Tool & Consumable Inventory Management
//  Industrial Modern Theme
// ============================================================
//  Install:
//    npm install @supabase/supabase-js jspdf jspdf-autotable
//  .env:
//    VITE_SUPABASE_URL=https://xxxx.supabase.co
//    VITE_SUPABASE_ANON_KEY=eyJxxxxxxx
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SB_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null;

// ─── LOGO PERUSAHAAN (Base64) ─────────────────────────────────────────────────
const COMPANY_LOGO = "data:image/jpeg;base64,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";

// ─── THEME (MODERN INDUSTRIAL - BRIGHT) ──────────────────────────────────────
const T = {
  bg: "#1a1d23",
  surface: "#252830",
  sidebar: "#1e2127",
  border: "#4a4d55",
  borderInput: "#5a5d65",
  inputBg: "#2a2d35",
  text: "#ffffff",
  textSub: "#d0d3d8",
  textMuted: "#9a9da5",
  accent: "#ff7b1a",
  accentBg: "#3d2a1a",
  accentHover: "#ff9a4d",
  green: "#00e676",
  blue: "#448aff",
  red: "#ff5252",
  purple: "#b388ff",
  tblHead: "#2a2d35",
  tblRow: "#252830",
  tblRowAlt: "#2e3138",
  shadow: "0 4px 16px rgba(0,0,0,0.4)",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ROLE_COLOR = { admin: T.accent, editor: T.blue };
const ROLE_LABEL = { admin: "Admin", editor: "Editor" };
const TXN_LABEL = { receipt: "Receipt", issue: "Issue", return: "Return" };
const TXN_COLOR = {
  receipt: { bg: "#152d1a", text: T.green, border: "#1f5c2a" },
  issue: { bg: "#15202d", text: T.blue, border: "#1f3a5c" },
  return: { bg: "#2d152d", text: T.purple, border: "#5c1f5c" },
};

const canEdit = r => r === "admin" || r === "editor";
const canAdmin = r => r === "admin";
const fmtDate = d => d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—";
const fmtDateS = d => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const IS = {
  width: "100%",
  background: T.inputBg,
  border: `2px solid ${T.borderInput}`,
  borderRadius: 4,
  color: T.text,
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  boxSizing: "border-box",
  outline: "none",
  letterSpacing: 0.3,
};

const BP = {
  background: T.accent,
  color: "#fff",
  border: "none",
  padding: "10px 24px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: 0.5,
  fontFamily: "'Inter', sans-serif",
  textTransform: "uppercase",
  boxShadow: "0 2px 8px rgba(255,123,26,0.3)",
};

const BG = {
  background: "transparent",
  color: T.textSub,
  border: `2px solid ${T.border}`,
  padding: "10px 18px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  letterSpacing: 0.5,
};

const BRD = {
  background: "#2d1518",
  color: T.red,
  border: "1px solid #5c1f24",
  padding: "6px 14px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  letterSpacing: 1,
};

const BGN = {
  background: "#152d1a",
  color: T.green,
  border: "1px solid #1f5c2a",
  padding: "6px 14px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  letterSpacing: 1,
};

// ─── COMPRESS IMAGE ───────────────────────────────────────────────────────────
const compressImage = (file, maxW = 600) => new Promise(res => {
  const r = new FileReader();
  r.onload = e => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const s = Math.min(1, maxW / img.width);
      c.width = img.width * s;
      c.height = img.height * s;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.72));
    };
    img.src = e.target.result;
  };
  r.readAsDataURL(file);
});

// ─── DOCUMENT NUMBER GENERATOR (Anti-Duplicate) ──────────────────────────────
async function generateDocNo(jenis) {
  const prefix = { receipt: "RCP", issue: "ISS", return: "RET" }[jenis];
  const year = new Date().getFullYear();

  const { data } = await supabase
    .from("laporan_transaksi")
    .select("no_dokumen")
    .eq("jenis", jenis)
    .like("no_dokumen", `NMS/${prefix}/${year}/%`)
    .order("no_dokumen", { ascending: false })
    .limit(1);

  let nextSeq = 1;

  if (data && data.length > 0) {
    const lastDoc = data[0].no_dokumen;
    const parts = lastDoc.split("/");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      nextSeq = lastSeq + 1;
    }
  }

  const seq = String(nextSeq).padStart(4, "0");
  return `NMS/${prefix}/${year}/${seq}`;
}

// ─── PDF GENERATOR (Landscape A4 – Clean, Compact, Formal) ────────────────────
function printPDF(laporan, details) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const PW = 297, PH = 210, M = 12;

  // ─── HEADER ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("PT NAULI MITRA STRATEGIC", M, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Jalan Surabaya Situbondo KM 136, Sumberanyar", M, 19);
  doc.text("Paiton, Probolinggo, Jawa Timur, ID 67291", M, 22);

  // Logo (kotak 18x17mm)
  const logoX = PW - M - 22;
  const logoY = 5;
  const logoW = 18;
  const logoH = 17;

  if (typeof COMPANY_LOGO !== "undefined" && COMPANY_LOGO && COMPANY_LOGO !== "") {
    try {
      doc.addImage(COMPANY_LOGO, "PNG", logoX, logoY, logoW, logoH, undefined, "FAST");
    } catch (error) {
      doc.setDrawColor(100, 100, 100);
      doc.rect(logoX, logoY, logoW, logoH, "S");
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text("[LOGO]", logoX + logoW/2, logoY + logoH/2 + 2, { align: "center" });
    }
  } else {
    doc.setDrawColor(100, 100, 100);
    doc.rect(logoX, logoY, logoW, logoH, "S");
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text("[LOGO]", logoX + logoW/2, logoY + logoH/2 + 2, { align: "center" });
  }

  // Garis pemisah
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(M, 24, PW - M, 24);

  // ─── JUDUL ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("DELIVERY ORDER", PW / 2, 31, { align: "center" });

  // ─── INFO DOKUMEN (3 Kolom) ───
const jLabel = TXN_LABEL[laporan.jenis] || laporan.jenis;
const infoY = 38;

doc.setFont("helvetica", "normal");
doc.setFontSize(8);
doc.setTextColor(0, 0, 0);

const col1X = M;
const col2X = M + 85;
const col3X = M + 175;

// === KOLOM 1: No. Document, Date, Project/Work Name ===
doc.setFont("helvetica", "bold");
doc.text("No. Document", col1X, infoY);
doc.setFont("helvetica", "normal");
doc.text(`: ${laporan.no_dokumen || "-"}`, col1X + 28, infoY);

doc.setFont("helvetica", "bold");
doc.text("Date", col1X, infoY + 5);
doc.setFont("helvetica", "normal");
doc.text(`: ${fmtDateS(laporan.tanggal) || "-"}`, col1X + 28, infoY + 5);

  // Project/Work Name — selalu tampil
doc.setFont("helvetica", "bold");
doc.text("Project/Work Name", col1X, infoY + 10);
doc.setFont("helvetica", "normal");
doc.text(`: ${laporan.keterangan || " "}`, col1X + 28, infoY + 10);

// === KOLOM 2: Destination, Type of Vehicle, Registration No. ===
let col2Row = infoY;
const col2Fields = [
  ["Destination", laporan.destination],
  ["Type of Vehicle", laporan.vehicle_type],
  ["Registration No.", laporan.registration_no],
];

col2Fields.forEach(([label, value]) => {
  doc.setFont("helvetica", "bold");
  doc.text(label, col2X, col2Row);
  doc.setFont("helvetica", "normal");
  doc.text(`: ${value || " "}`, col2X + 28, col2Row);
  col2Row += 5;
});

// === KOLOM 3: Type, Printed By ===
doc.setFont("helvetica", "bold");
doc.text("Type", col3X, infoY);
doc.setFont("helvetica", "normal");
doc.text(`: ${jLabel.toUpperCase()}`, col3X + 28, infoY);

doc.setFont("helvetica", "bold");
doc.text("Printed By", col3X, infoY + 5);
doc.setFont("helvetica", "normal");
doc.text(`: ${laporan.nama_user || "-"}`, col3X + 28, infoY + 5);

// ─── TABEL ───
const tblY = infoY + 16;

  autoTable(doc, {
    startY: tblY,
    margin: { left: M, right: M },
    head: [["No", "Description", "Specification", "Serial Number", "Unit", "Qty", "Remarks"]],
    body: details.map((d, i) => [
      (i + 1).toString(),
      d.nama_barang || " ",
      d.spek || " ",
      Array.isArray(d.serial_numbers) && d.serial_numbers.length ? d.serial_numbers.join(", ") : " ",
      d.satuan || " ",
      d.jumlah.toString(),
      d.keterangan || " ",
    ]),
    styles: {
      fontSize: 7.5,
      cellPadding: 1,
      font: "helvetica",
      textColor: 0,
      fillColor: 255,
      lineColor: 0,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: 255,
      textColor: 0,
      fontStyle: "bold",
      fontSize: 7.5,
      lineColor: 0,
      lineWidth: 0.3,
      cellPadding: 2,
      halign: "center",
    },
    alternateRowStyles: { fillColor: 255 },
    columnStyles: {
    0: { cellWidth: 8, halign: "center" },
    1: { cellWidth: 75 },
    2: { cellWidth: 40 },
    3: { cellWidth: 85 },
    4: { cellWidth: 14, halign: "center" },
    5: { cellWidth: 12, halign: "center" },
    },
    tableLineColor: 0,
    tableLineWidth: 0.2,
  });

  // ─── SIGNATURE BOXES ───
  const afterTable = doc.lastAutoTable.finalY;
  let sigY = afterTable + 6;
  if (sigY > PH - 45) sigY = PH - 45;

  const boxW = (PW - M * 2) / 5;
  const boxH = 34;
  const boxes = ["Prepared By", "Approved By", "Transported By", "Received By", "Returned By"];

  boxes.forEach((title, i) => {
    const bx = M + i * boxW;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(bx, sigY, boxW, boxH);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(0, 0, 0);
    doc.text(title, bx + boxW / 2, sigY + 5, { align: "center" });
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(bx + 3, sigY + 7, bx + boxW - 3, sigY + 7);

    const signY = sigY + 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text("Sign :", bx + 3, signY + 11);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(bx + 14, signY + 11, bx + boxW - 5, signY + 11);

    doc.text("Name :", bx + 3, signY + 15);
    doc.text("Section :", bx + 3, signY + 19);
  });

  // ─── FOOTER ───
  doc.setFontSize(5.5);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Printed: ${new Date().toLocaleString("en-US")} | ${laporan.no_dokumen}`,
    PW / 2,
    PH - 4,
    { align: "center" }
  );

  window.open(doc.output("bloburl"), "_blank");
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Badge({ role }) {
  const color = role === "admin" ? T.accent : T.blue;
  return (
    <span style={{
      background: color + "22",
      color: color,
      border: `1px solid ${color}55`,
      padding: "3px 12px",
      borderRadius: 3,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      fontFamily: "'Inter', sans-serif",
    }}>
      {ROLE_LABEL[role] || role}
    </span>
  );
}

function TxnBadge({ jenis }) {
  const s = TXN_COLOR[jenis] || { bg: T.bg, text: T.textSub, border: T.border };
  return (
    <span style={{
      background: s.bg,
      color: s.text,
      border: `1px solid ${s.border}`,
      padding: "3px 12px",
      borderRadius: 3,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
      fontFamily: "'Inter', sans-serif",
    }}>
      {TXN_LABEL[jenis] || jenis}
    </span>
  );
}

function Alert({ text }) {
  if (!text) return null;
  const ok = text.startsWith("✓");
  return (
    <div style={{
      background: ok ? "#152d1a" : "#2d1518",
      border: `1px solid ${ok ? "#1f5c2a" : "#5c1f24"}`,
      color: ok ? T.green : T.red,
      padding: "12px 18px",
      borderRadius: 4,
      marginBottom: 16,
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      letterSpacing: 1,
    }}>
      {text}
    </div>
  );
}

function Modal({ title, onClose, children, width = 600 }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16,
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: T.surface,
        border: `2px solid ${T.border}`,
        borderRadius: 8,
        padding: 24,
        width: "100%",
        maxWidth: width,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          borderBottom: `2px solid ${T.accent}`,
          paddingBottom: 12,
        }}>
          <p style={{
            color: T.accent,
            fontSize: 14,
            letterSpacing: 2,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            textTransform: "uppercase",
            margin: 0,
          }}>
            {title}
          </p>
          <button onClick={onClose} style={{
            background: "transparent",
            border: "none",
            color: T.textMuted,
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <label style={{
      display: "block",
      color: T.textSub,
      fontSize: 11,
      letterSpacing: 1,
      marginBottom: 6,
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      textTransform: "uppercase",
    }}>
      {children}
    </label>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: `1px solid ${T.border}`, margin: "16px 0" }} />;
}

// ─── SETUP & LOADING ──────────────────────────────────────────────────────────
function SetupScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: 40,
    }}>
      <div style={{
        maxWidth: 580,
        background: T.surface,
        border: `2px solid ${T.border}`,
        borderRadius: 8,
        padding: 40,
        boxShadow: T.shadow,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36,
            height: 36,
            background: T.accent,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}>⚙️</div>
          <span style={{
            color: T.accent,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            fontFamily: "'Inter', sans-serif",
          }}>STOKIN v3.3</span>
        </div>
        <p style={{ color: T.red, fontSize: 13, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>⚠ SUPABASE NOT CONFIGURED</p>
        <div style={{
          background: T.inputBg,
          border: `1px solid ${T.border}`,
          borderRadius: 4,
          padding: 14,
          marginBottom: 14,
          fontSize: 12,
          color: T.green,
          lineHeight: 2,
          fontFamily: "'Inter', sans-serif",
        }}>
          VITE_SUPABASE_URL=https://xxxxx.supabase.co<br />
          VITE_SUPABASE_ANON_KEY=eyJxxxxxx
        </div>
        <p style={{ color: T.textMuted, fontSize: 12, lineHeight: 2, fontFamily: "'Inter', sans-serif" }}>
          1. Sign up at <span style={{ color: T.blue }}>supabase.com</span><br />
          2. Settings → API → copy URL & anon key<br />
          3. Run <span style={{ color: T.accent }}>supabase-schema-v3.2.sql</span> in SQL Editor<br />
          4. Restart: <span style={{ color: T.green }}>npm run dev</span>
        </p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: T.bg,
    }}>
      <div style={{ textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>⚙️</div>
        <p style={{ color: T.accent, fontSize: 12, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase" }}>
          LOADING DATA...
        </p>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "editor" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);
  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErr(""); setOk(""); };

  const doSignIn = async () => {
    if (!form.email || !form.password) { setErr("Please fill in all fields."); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.from("users").select("*").eq("email", form.email).eq("password", form.password).single();
      if (error || !data) setErr("Incorrect email or password.");
      else onLogin(data);
    } catch { setErr("Cannot connect to database."); }
    setBusy(false);
  };

  const doSignUp = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) { setErr("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    if (form.password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setBusy(true);
    try {
      const { data: ex } = await supabase.from("users").select("id").eq("email", form.email).single();
      if (ex) { setErr("This email is already registered."); setBusy(false); return; }
      const { error } = await supabase.from("users").insert([{ nama: form.name, email: form.email, password: form.password, role: form.role }]);
      if (error) setErr(error.message);
      else { setOk("Account created! You may now sign in."); setForm({ name: "", email: "", password: "", confirm: "", role: "editor" }); setTimeout(() => setMode("signin"), 1800); }
    } catch { setErr("Cannot connect to database."); }
    setBusy(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${T.bg} 0%, #0d0f13 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: 440,
        padding: "40px 36px",
        background: T.surface,
        borderRadius: 8,
        border: `2px solid ${T.border}`,
        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
      }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{
            width: 56,
            height: 56,
            background: T.accent,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            margin: "0 auto 16px",
            boxShadow: "0 4px 16px rgba(255,123,26,0.4)",
          }}>
            ⚙️
          </div>
          <h1 style={{
            color: T.accent,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 2,
            margin: "0 0 4px",
            textTransform: "uppercase",
          }}>
            STOKIN
          </h1>
          <p style={{
            color: T.textMuted,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            margin: 0,
            fontWeight: 500,
          }}>
            PT NAULI MITRA STRATEGIC
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${T.accent}`, marginBottom: 24, opacity: 0.5 }} />

        <div style={{ display: "flex", background: T.bg, borderRadius: 4, padding: 3, marginBottom: 22 }}>
          {[["signin", "Sign In"], ["signup", "Sign Up"]].map(([m, lbl]) => (
            <button
              key={m}
              onClick={() => { setMode(m); setErr(""); setOk(""); }}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
                background: mode === m ? T.accent : "transparent",
                color: mode === m ? "#fff" : T.textMuted,
                transition: "all 0.2s",
              }}
            >
              {lbl}
            </button>
          ))}
        </div>

        <Alert text={err ? "❌ " + err : ok ? "✓ " + ok : ""} />

        {mode === "signin" ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <Label>EMAIL</Label>
              <input
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                onKeyDown={e => e.key === "Enter" && doSignIn()}
                style={{ ...IS, "::placeholder": { color: T.textMuted } }}
              />
            </div>
            <div style={{ marginBottom: 22 }}>
              <Label>PASSWORD</Label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && doSignIn()}
                style={IS}
              />
            </div>
            <button onClick={doSignIn} disabled={busy} style={{ ...BP, width: "100%", padding: "12px", fontSize: 15, opacity: busy ? 0.7 : 1 }}>
              {busy ? "SIGNING IN..." : "SIGN IN →"}
            </button>
            <p style={{ color: T.textMuted, fontSize: 13, textAlign: "center", marginTop: 16 }}>
              No account? <span onClick={() => { setMode("signup"); setErr(""); }} style={{ color: T.accent, cursor: "pointer", fontWeight: 700 }}>Sign Up</span>
            </p>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div><Label>FULL NAME</Label><input value={form.name} onChange={set("name")} style={IS} /></div>
              <div><Label>ROLE</Label><select value={form.role} onChange={set("role")} style={{ ...IS }}>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select></div>
            </div>
            <div style={{ marginBottom: 10 }}><Label>EMAIL</Label><input value={form.email} onChange={set("email")} style={IS} /></div>
            <div style={{ marginBottom: 10 }}><Label>PASSWORD (min. 6 chars)</Label><input type="password" value={form.password} onChange={set("password")} style={IS} /></div>
            <div style={{ marginBottom: 18 }}><Label>CONFIRM PASSWORD</Label><input type="password" value={form.confirm} onChange={set("confirm")} style={IS} /></div>
            <div style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 4,
              padding: "10px 12px",
              marginBottom: 18,
              fontSize: 11,
              color: T.textMuted,
              lineHeight: 1.8,
              fontFamily: "'Inter', sans-serif",
            }}>
              <b style={{ color: T.accent }}>Editor</b> — Record transactions, edit descriptions.<br />
              <b style={{ color: T.accent }}>Admin</b> — Full access + manage users, serial numbers, deletions.
            </div>
            <button onClick={doSignUp} disabled={busy} style={{ ...BP, width: "100%", padding: "12px", fontSize: 15, opacity: busy ? 0.7 : 1 }}>
              {busy ? "CREATING..." : "CREATE ACCOUNT →"}
            </button>
            <p style={{ color: T.textMuted, fontSize: 13, textAlign: "center", marginTop: 16 }}>
              Have account? <span onClick={() => { setMode("signin"); setErr(""); }} style={{ color: T.accent, cursor: "pointer", fontWeight: 700 }}>Sign In</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "desc", icon: "📦", label: "Description" },
  { id: "transaction", icon: "🛒", label: "Transaction" },
  { id: "history", icon: "≡", label: "History" },
  { id: "users", icon: "👥", label: "Users", admin: true },
];

function Sidebar({ page, onNav, user, onLogout }) {
  return (
    <div style={{
      width: 230,
      minHeight: "100vh",
      background: T.sidebar,
      borderRight: `2px solid ${T.border}`,
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', sans-serif",
      flexShrink: 0,
      boxShadow: "2px 0 20px rgba(0,0,0,0.5)",
    }}>
      <div style={{ padding: "20px 16px", borderBottom: `2px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 32,
            height: 32,
            background: T.accent,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            boxShadow: "0 2px 8px rgba(255,123,26,0.4)",
          }}>
            ⚙️
          </div>
          <span style={{
            color: T.accent,
            fontWeight: 700,
            letterSpacing: 2,
            fontSize: 18,
            textTransform: "uppercase",
          }}>
            STOKIN
          </span>
        </div>
        <p style={{
          color: T.textMuted,
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          margin: 0,
          fontWeight: 500,
        }}>
          PT Nauli Mitra Strategic
        </p>
      </div>

      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {NAV.filter(n => !n.admin || canAdmin(user.role)).map(n => (
          <button
            key={n.id}
            onClick={() => onNav(n.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "10px 14px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              marginBottom: 4,
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              transition: "all 0.2s",
              background: page === n.id ? T.accentBg : "transparent",
              color: page === n.id ? T.accent : T.textSub,
              borderLeft: page === n.id ? `3px solid ${T.accent}` : "3px solid transparent",
            }}
          >
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "16px", borderTop: `2px solid ${T.border}` }}>
        <p style={{
          color: T.text,
          fontSize: 14,
          fontWeight: 600,
          margin: "0 0 4px",
          letterSpacing: 0.5,
        }}>
          {user.nama}
        </p>
        <div style={{ marginBottom: 12 }}>
          <Badge role={user.role} />
        </div>
        <button onClick={onLogout} style={{ ...BG, width: "100%", padding: "8px", fontSize: 13 }}>
          SIGN OUT
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ items, laporans }) {
  const lowStock = items.filter(b => b.stok <= b.stok_min);
  const totalRcp = laporans.filter(l => l.jenis === "receipt").length;
  const totalIss = laporans.filter(l => l.jenis === "issue").length;
  const totalRet = laporans.filter(l => l.jenis === "return").length;

  const Stat = ({ label, value, sub, color, icon }) => (
    <div style={{
      background: T.surface,
      border: `2px solid ${T.border}`,
      borderRadius: 8,
      padding: "20px",
      flex: 1,
      minWidth: 150,
      borderTop: `3px solid ${color}`,
      boxShadow: T.shadow,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{
            color: T.textMuted,
            fontSize: 11,
            letterSpacing: 1,
            margin: "0 0 8px",
            textTransform: "uppercase",
            fontWeight: 600,
          }}>
            {label}
          </p>
          <p style={{
            color,
            fontSize: 32,
            fontWeight: 800,
            margin: 0,
            fontFamily: "'Inter', sans-serif",
          }}>
            {value}
          </p>
          {sub && (
            <p style={{
              color: T.textMuted,
              fontSize: 12,
              margin: "6px 0 0",
              fontWeight: 500,
            }}>
              {sub}
            </p>
          )}
        </div>
        <div style={{
          width: 40,
          height: 40,
          background: color + "22",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{
        marginBottom: 24,
        borderBottom: `2px solid ${T.accent}`,
        paddingBottom: 16,
      }}>
        <h2 style={{
          color: T.text,
          fontSize: 24,
          margin: "0 0 4px",
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 700,
        }}>
          Dashboard
        </h2>
        <p style={{
          color: T.textMuted,
          fontSize: 14,
          margin: 0,
          fontWeight: 500,
        }}>
          Inventory Overview — PT Nauli Mitra Strategic
        </p>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <Stat label="Total Items" value={items.length} icon="📦" color={T.accent} sub={`${lowStock.length} low stock`} />
        <Stat label="Receipts" value={totalRcp} icon="⬆" color={T.green} sub="stock received" />
        <Stat label="Issues" value={totalIss} icon="⬇" color={T.blue} sub="tools issued" />
        <Stat label="Returns" value={totalRet} icon="↩" color={T.purple} sub="tools returned" />
        <Stat label="Restock Needed" value={lowStock.length} icon="⚠" color={T.red} sub="below minimum" />
      </div>

      {lowStock.length > 0 && (
        <div style={{
          background: "#2d1518",
          border: "1px solid #5c1f24",
          borderRadius: 8,
          padding: "14px 18px",
          marginBottom: 24,
        }}>
          <p style={{
            color: T.red,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            margin: "0 0 10px",
            textTransform: "uppercase",
          }}>
            ⚠ Low Stock Alert
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {lowStock.map(b => (
              <span key={b.id} style={{
                background: T.surface,
                border: "1px solid #5c1f24",
                color: T.red,
                padding: "4px 12px",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
              }}>
                {b.nama} ({b.stok}/{b.stok_min})
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{
        background: T.surface,
        border: `2px solid ${T.border}`,
        borderRadius: 8,
        padding: 20,
        boxShadow: T.shadow,
      }}>
        <p style={{
          color: T.textMuted,
          fontSize: 11,
          letterSpacing: 1,
          margin: "0 0 14px",
          textTransform: "uppercase",
          fontWeight: 600,
        }}>
          Recent Transactions
        </p>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
        }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${T.border}` }}>
              {["Doc No.", "Type", "Date", "Recorded By"].map(h => (
                <th key={h} style={{
                  textAlign: "left",
                  color: T.textSub,
                  padding: "8px 14px",
                  fontSize: 11,
                  letterSpacing: 1,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {laporans.slice(0, 6).map((l, i) => (
              <tr key={l.id} style={{
                borderBottom: `1px solid ${T.border}`,
                background: i % 2 === 0 ? T.tblRow : T.tblRowAlt,
              }}>
                <td style={{
                  padding: "10px 14px",
                  color: T.accent,
                  fontWeight: 700,
                  fontSize: 13,
                }}>
                  {l.no_dokumen}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <TxnBadge jenis={l.jenis} />
                </td>
                <td style={{
                  padding: "10px 14px",
                  color: T.textSub,
                  fontSize: 13,
                  fontWeight: 500,
                }}>
                  {fmtDate(l.tanggal)}
                </td>
                <td style={{
                  padding: "10px 14px",
                  color: T.textSub,
                  fontSize: 13,
                  fontWeight: 500,
                }}>
                  {l.nama_user}
                </td>
              </tr>
            ))}
            {laporans.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "30px", textAlign: "center", color: T.textMuted }}>
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SERIAL NUMBER PANEL ──────────────────────────────────────────────────────
function SerialNumberPanel({ item, user }) {
  const [sns, setSns] = useState([]);
  const [newSN, setNewSN] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("serial_numbers").select("*").eq("barang_id", item.id).order("nomor");
    setSns(data || []);
  }, [item.id]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newSN.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("serial_numbers").insert([{ barang_id: item.id, nomor: newSN.trim(), status: "available" }]);
    if (error) setMsg("❌ " + error.message);
    else { setNewSN(""); setMsg("✓ Serial number added."); load(); }
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this serial number?")) return;
    await supabase.from("serial_numbers").delete().eq("id", id);
    setMsg("✓ Deleted.");
    load();
    setTimeout(() => setMsg(""), 2000);
  };

  const statusStyle = s => ({
    background: s === "available" ? "#152d1a" : "#15202d",
    color: s === "available" ? T.green : T.blue,
    border: `1px solid ${s === "available" ? "#1f5c2a" : "#1f3a5c"}`,
    padding: "2px 10px",
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    fontFamily: "'Inter', sans-serif",
  });

  return (
    <div style={{
      background: T.bg,
      borderRadius: 6,
      padding: 14,
      marginTop: 8,
      border: `1px solid ${T.border}`,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}>
        <p style={{
          color: T.textSub,
          fontSize: 11,
          letterSpacing: 1,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
        }}>
          SERIAL NUMBERS — {item.nama}
        </p>
        <span style={{ color: T.textMuted, fontSize: 11 }}>
          {sns.filter(s => s.status === "available").length} available / {sns.length} total
        </span>
      </div>
      <Alert text={msg} />
      <div style={{ maxHeight: 180, overflowY: "auto", marginBottom: 12 }}>
        {sns.length === 0 ? (
          <p style={{
            color: T.textMuted,
            fontSize: 12,
            textAlign: "center",
            padding: "12px 0",
            fontFamily: "'Inter', sans-serif",
          }}>
            No serial numbers registered
          </p>
        ) : (
          sns.map(sn => (
            <div key={sn.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 4,
              marginBottom: 3,
              background: T.surface,
              border: `1px solid ${T.border}`,
            }}>
              <code style={{
                flex: 1,
                fontSize: 12,
                color: T.text,
                background: T.inputBg,
                padding: "4px 10px",
                borderRadius: 4,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}>
                {sn.nomor}
              </code>
              <span style={statusStyle(sn.status)}>{sn.status}</span>
              {canAdmin(user.role) && sn.status === "available" && (
                <button onClick={() => handleDelete(sn.id)} style={{
                  background: "transparent",
                  border: "none",
                  color: T.textMuted,
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1,
                }}>✕</button>
              )}
            </div>
          ))
        )}
      </div>
      {canAdmin(user.role) && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={newSN}
            onChange={e => setNewSN(e.target.value)}
            placeholder="e.g. NMS/1/0001"
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            style={{ ...IS, flex: 1, fontSize: 13, padding: "8px 12px" }}
          />
          <button onClick={handleAdd} disabled={loading || !newSN.trim()} style={{
            ...BGN,
            opacity: (loading || !newSN.trim()) ? 0.6 : 1,
          }}>
            {loading ? "..." : "+ Add SN"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SPEC PANEL (Mirip Serial Number, untuk spesifikasi) ──────────────────────
function SpecPanel({ item, user }) {
  const [specs, setSpecs] = useState([]);
  const [newSpec, setNewSpec] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("item_specs").select("*").eq("barang_id", item.id).order("nama");
    setSpecs(data || []);
  }, [item.id]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newSpec.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("item_specs").insert([{ barang_id: item.id, nama: newSpec.trim() }]);
    if (error) setMsg("❌ " + error.message);
    else { setNewSpec(""); setMsg("✓ Spec added."); load(); }
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this spec?")) return;
    await supabase.from("item_specs").delete().eq("id", id);
    setMsg("✓ Deleted.");
    load();
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div style={{
      background: T.bg,
      borderRadius: 6,
      padding: 14,
      marginTop: 8,
      border: `1px solid ${T.border}`,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}>
        <p style={{
          color: T.textSub,
          fontSize: 11,
          letterSpacing: 1,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
        }}>
          SPECIFICATIONS — {item.nama}
        </p>
        <span style={{ color: T.textMuted, fontSize: 11 }}>{specs.length} specs</span>
      </div>
      <Alert text={msg} />
      <div style={{ maxHeight: 180, overflowY: "auto", marginBottom: 12 }}>
        {specs.length === 0 ? (
          <p style={{
            color: T.textMuted,
            fontSize: 12,
            textAlign: "center",
            padding: "12px 0",
            fontFamily: "'Inter', sans-serif",
          }}>
            No specifications registered
          </p>
        ) : (
          specs.map(sp => (
            <div key={sp.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 4,
              marginBottom: 3,
              background: T.surface,
              border: `1px solid ${T.border}`,
            }}>
              <code style={{
                flex: 1,
                fontSize: 12,
                color: T.text,
                background: T.inputBg,
                padding: "4px 10px",
                borderRadius: 4,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}>
                {sp.nama}
              </code>
              {canAdmin(user.role) && (
                <button onClick={() => handleDelete(sp.id)} style={{
                  background: "transparent",
                  border: "none",
                  color: T.textMuted,
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1,
                }}>✕</button>
              )}
            </div>
          ))
        )}
      </div>
      {canAdmin(user.role) && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={newSpec}
            onChange={e => setNewSpec(e.target.value)}
            placeholder="e.g. Makita, 500W, 220V"
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            style={{ ...IS, flex: 1, fontSize: 13, padding: "8px 12px" }}
          />
          <button onClick={handleAdd} disabled={loading || !newSpec.trim()} style={{
            ...BGN,
            opacity: (loading || !newSpec.trim()) ? 0.6 : 1,
          }}>
            {loading ? "..." : "+ Add Spec"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── DESCRIPTION PAGE ─────────────────────────────────────────────────────────
const EMPTY_ITEM = { nama: "", satuan: "", stok: "", stok_min: "", kategori: "", foto: "" };

function DescriptionPage({ items, onRefresh, user }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [expandSN, setExpandSN] = useState(null);
  const [expandSpec, setExpandSpec] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [sortDir, setSortDir] = useState("asc");
  const [catFilter, setCatFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const flash = m => { setMsg(m); setTimeout(() => setMsg(""), 3500); };

  const formRef = useRef({
    nama: "",
    satuan: "",
    stok: "",
    stok_min: "",
    kategori: "",
    foto: "",
  });
  const [, forceUpdate] = useState(0);

  const fileRef = useRef();

  const setFormValue = (key, value) => {
    formRef.current[key] = value;
  };

  const getFormValues = () => formRef.current;

  const resetForm = () => {
    formRef.current = { ...EMPTY_ITEM };
    forceUpdate(n => n + 1);
  };

  const setFormFromItem = (item) => {
    formRef.current = {
      nama: item.nama || "",
      satuan: item.satuan || "",
      stok: item.stok?.toString() || "",
      stok_min: item.stok_min?.toString() || "",
      kategori: item.kategori || "",
      foto: item.foto || "",
    };
    forceUpdate(n => n + 1);
  };

  const categories = [...new Set(items.map(i => i.kategori).filter(Boolean))].sort();

  const filtered = items
    .filter(b => {
      const q = search.toLowerCase();
      const matchQ = b.nama.toLowerCase().includes(q) || (b.kategori || "").toLowerCase().includes(q);
      const matchC = catFilter === "all" || (b.kategori || "") === catFilter;
      return matchQ && matchC;
    })
    .sort((a, b) => {
      const va = (a[sortBy] || "").toString().toLowerCase();
      const vb = (b[sortBy] || "").toString().toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    formRef.current.foto = "__loading__";
    forceUpdate(n => n + 1);
    const compressed = await compressImage(file);
    formRef.current.foto = compressed;
    forceUpdate(n => n + 1);
  };

  const handleAdd = async () => {
    const f = getFormValues();
    if (!f.nama || !f.satuan) { flash("❌ Description and Unit are required."); return; }
    setLoading(true);
    const { error } = await supabase.from("barang").insert([{
      nama: f.nama,
      satuan: f.satuan,
      stok: parseInt(f.stok) || 0,
      stok_min: parseInt(f.stok_min) || 0,
      kategori: f.kategori,
      foto: f.foto,
    }]);
    if (error) flash("❌ " + error.message);
    else { flash("✓ Item added."); setShowAdd(false); resetForm(); onRefresh(); }
    setLoading(false);
  };

  const handleEdit = async () => {
    const f = getFormValues();
    if (!f.nama || !f.satuan) { flash("❌ Required fields missing."); return; }
    setLoading(true);
    const { error } = await supabase.from("barang").update({
      nama: f.nama,
      satuan: f.satuan,
      stok: parseInt(f.stok) || 0,
      stok_min: parseInt(f.stok_min) || 0,
      kategori: f.kategori,
      foto: f.foto,
    }).eq("id", editItem.id);
    if (error) flash("❌ " + error.message);
    else { flash("✓ Item updated."); setEditItem(null); onRefresh(); }
    setLoading(false);
  };

  const handleDelete = async id => {
    if (!confirm("Delete this item? Related transaction data will be kept.")) return;
    const { error } = await supabase.from("barang").delete().eq("id", id);
    if (error) flash("❌ " + error.message);
    else { flash("✓ Item deleted."); onRefresh(); }
  };

  const openEdit = (b) => {
    setFormFromItem(b);
    setEditItem(b);
  };

  const ItemForm = ({ onSave, onCancel }) => {
    const form = formRef.current;

    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[
            ["nama", "Description *"],
            ["satuan", "Unit *"],
            ["stok", "Initial Stock"],
            ["stok_min", "Min. Stock"],
            ["kategori", "Category"],
          ].map(([k, lbl]) => (
            <div key={k}>
              <Label>{lbl.toUpperCase()}</Label>
              <input
                defaultValue={form[k]}
                onChange={(e) => setFormValue(k, e.target.value)}
                autoComplete="off"
                spellCheck={false}
                style={{ ...IS }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 14 }}>
          <Label>ITEM PHOTO</Label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {form.foto && form.foto !== "__loading__" ? (
              <img src={form.foto} alt="preview" style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 6, border: `1px solid ${T.border}` }} />
            ) : (
              <div style={{
                width: 52,
                height: 52,
                background: T.bg,
                borderRadius: 6,
                border: `2px dashed ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}>
                {form.foto === "__loading__" ? "⏳" : "📦"}
              </div>
            )}
            <button type="button" onClick={() => fileRef.current.click()} style={{ ...BG, fontSize: 12, padding: "6px 12px" }}>
              📷 {form.foto && form.foto !== "__loading__" ? "Change" : "Upload"}
            </button>
            {form.foto && form.foto !== "__loading__" && (
              <button type="button" onClick={() => { formRef.current.foto = ""; forceUpdate(n => n + 1); }} style={{ ...BRD, padding: "5px 10px" }}>✕ Remove</button>
            )}
            <input type="file" accept="image/*" ref={fileRef} onChange={handleImg} style={{ display: "none" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onSave} disabled={loading || form.foto === "__loading__"} style={{ ...BP, opacity: (loading || form.foto === "__loading__") ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={onCancel} style={{ ...BG }}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{
        marginBottom: 24,
        borderBottom: `2px solid ${T.accent}`,
        paddingBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <div>
          <h2 style={{
            color: T.text,
            fontSize: 24,
            margin: "0 0 4px",
            letterSpacing: 1,
            textTransform: "uppercase",
            fontWeight: 700,
          }}>
            Description
          </h2>
          <p style={{ color: T.textMuted, fontSize: 14, margin: 0, fontWeight: 500 }}>
            {items.length} items · {filtered.length} shown
          </p>
        </div>
        {canAdmin(user.role) && (
          <button onClick={() => { setShowAdd(!showAdd); setEditItem(null); resetForm(); }} style={{ ...BP }}>
            + Add Item
          </button>
        )}
      </div>

      <Alert text={msg} />

      {showAdd && (
        <div style={{
          background: T.surface,
          border: `2px solid ${T.border}`,
          borderRadius: 8,
          padding: 20,
          marginBottom: 18,
          boxShadow: T.shadow,
        }}>
          <p style={{
            color: T.accent,
            fontSize: 12,
            letterSpacing: 2,
            marginBottom: 14,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            textTransform: "uppercase",
          }}>
            New Item
          </p>
          <ItemForm onSave={handleAdd} onCancel={() => { setShowAdd(false); resetForm(); }} />
        </div>
      )}

      {editItem && (
        <Modal title="Edit Item" onClose={() => setEditItem(null)}>
          <ItemForm onSave={handleEdit} onCancel={() => setEditItem(null)} />
        </Modal>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search description, category..."
          autoComplete="off"
          spellCheck={false}
          style={{ ...IS, flex: 1, minWidth: 220, borderRadius: 4 }}
        />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ ...IS, width: "auto", minWidth: 130 }}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={`${sortBy}_${sortDir}`} onChange={e => { const [s, d] = e.target.value.split("_"); setSortBy(s); setSortDir(d); }} style={{ ...IS, width: "auto", minWidth: 150 }}>
          <option value="nama_asc">Name A → Z</option>
          <option value="nama_desc">Name Z → A</option>
          <option value="kategori_asc">Category A → Z</option>
          <option value="stok_asc">Stock Low → High</option>
          <option value="stok_desc">Stock High → Low</option>
        </select>
      </div>

      <div style={{
        background: T.surface,
        border: `2px solid ${T.border}`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: T.shadow,
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
        }}>
          <thead>
            <tr style={{ background: T.tblHead, borderBottom: `2px solid ${T.border}` }}>
              {["Photo", "Description", "Category", "Unit", "Stock", "Status", canEdit(user.role) && "Actions"].filter(Boolean).map(h => (
                <th key={h} style={{
                  textAlign: "center",
                  color: T.textSub,
                  padding: "10px 14px",
                  fontSize: 13,
                  letterSpacing: 1,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => {
              const low = b.stok <= b.stok_min;
              return (
                <>
                  <tr key={b.id} style={{
                    borderBottom: `1px solid ${T.border}`,
                    background: i % 2 === 0 ? T.tblRow : T.tblRowAlt,
                  }}>
                    <td style={{ padding: "8px 14px" }}>
                      {b.foto ? (
                        <img src={b.foto} alt={b.nama} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4, cursor: "pointer" }} onClick={() => setPreviewImg(b.foto)} />
                      ) : (
                        <div style={{
                          width: 40,
                          height: 40,
                          background: T.bg,
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                        }}>🔧</div>
                      )}
                    </td>
                    <td style={{ padding: "8px 14px", color: T.text, fontWeight: 600, textAlign: "left" }}>{b.nama}</td>
                    <td style={{ padding: "8px 14px", color: T.textSub, fontSize: 13, fontWeight: 500 }}>{b.kategori || "—"}</td>
                    <td style={{ padding: "8px 14px", color: T.textSub, fontWeight: 500 }}>{b.satuan}</td>
                    <td style={{ padding: "8px 14px", color: low ? T.red : T.text, fontWeight: 700 }}>{b.stok}</td>
                    <td style={{ padding: "8px 14px" }}>
                      <span style={{
                        background: low ? "#2d1518" : "#152d1a",
                        color: low ? T.red : T.green,
                        border: `1px solid ${low ? "#5c1f24" : "#1f5c2a"}`,
                        padding: "3px 10px",
                        borderRadius: 3,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}>
                        {low ? "LOW" : "OK"}
                      </span>
                    </td>
                    {canEdit(user.role) && (
                      <td style={{ padding: "8px 14px" }}>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          <button onClick={() => setExpandSN(expandSN === b.id ? null : b.id)}
                            style={{
                              background: "#1f1a2e",
                              color: T.purple,
                              border: "1px solid #3a2f5c",
                              padding: "4px 10px",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontSize: 11,
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                            }}>
                            {expandSN === b.id ? "▲ SN" : "▼ SN"}
                          </button>
                          <button onClick={() => setExpandSpec(expandSpec === b.id ? null : b.id)}
                            style={{
                              background: "#1a2e2d",
                              color: T.green,
                              border: "1px solid #2f5c5a",
                              padding: "4px 10px",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontSize: 11,
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                            }}>
                            {expandSpec === b.id ? "▲ Spec" : "▼ Spec"}
                          </button>
                          <button onClick={() => openEdit(b)} style={{
                            background: T.accentBg,
                            color: T.accent,
                            border: `1px solid ${T.accent}55`,
                            padding: "4px 10px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                          }}>Edit</button>
                          {canAdmin(user.role) && (
                            <button onClick={() => handleDelete(b.id)} style={{ ...BRD, padding: "4px 10px", fontSize: 11 }}>Del</button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                  {expandSN === b.id && (
                    <tr key={b.id + "_sn"} style={{ background: T.bg }}>
                      <td colSpan={7} style={{ padding: "0 14px 12px 14px" }}>
                        <SerialNumberPanel item={b} user={user} />
                      </td>
                    </tr>
                  )}
                  {expandSpec === b.id && (
                    <tr key={b.id + "_sp"} style={{ background: T.bg }}>
                      <td colSpan={7} style={{ padding: "0 14px 12px 14px" }}>
                        <SpecPanel item={b} user={user} />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{
                  padding: "40px",
                  textAlign: "center",
                  color: T.textMuted,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {previewImg && (
        <Modal title="Item Photo" onClose={() => setPreviewImg(null)} width={700}>
          <img src={previewImg} alt="Preview" style={{ width: "100%", height: "auto", borderRadius: 8 }} />
        </Modal>
      )}
    </div>
  );
}

// ─── TRANSACTION PAGE ─────────────────────────────────────────────────────────
function TransactionPage({ items, onRefresh, user, cart, setCart }) {
  const [jenis, setJenis] = useState("issue");
  const [remarks, setRemarks] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [search, setSearch] = useState("");
  const [selItem, setSelItem] = useState(null);
  const [snList, setSnList] = useState([]);
  const [specList, setSpecList] = useState([]);
  const [selSNs, setSelSNs] = useState([]);
  const [selSpecs, setSelSpecs] = useState([]);
  const [manualQty, setManualQty] = useState("1");
  const [lineNote, setLineNote] = useState("");
  const [snLoading, setSnLoading] = useState(false);

  const flash = m => { setMsg(m); setTimeout(() => setMsg(""), 5000); };

  useEffect(() => {
    if (!selItem) { setSnList([]); setSelSNs([]); setSpecList([]); setSelSpecs([]); return; }
    setSnLoading(true);
    const status = jenis === "return" ? "issued" : "available";
    Promise.all([
      supabase.from("serial_numbers").select("*").eq("barang_id", selItem.id).eq("status", status).order("nomor"),
      supabase.from("item_specs").select("*").eq("barang_id", selItem.id).order("nama"),
    ]).then(([{ data: snData }, { data: specData }]) => {
      setSnList(snData || []);
      setSpecList(specData || []);
      setSnLoading(false);
    });
    setSelSNs([]);
    setSelSpecs([]);
    setManualQty("1");
    setLineNote("");
  }, [selItem, jenis]);

  const toggleSN = sn => setSelSNs(prev => prev.includes(sn.nomor) ? prev.filter(x => x !== sn.nomor) : [...prev, sn.nomor]);
  const toggleSpec = sp => setSelSpecs(prev => prev.includes(sp.nama) ? prev.filter(x => x !== sp.nama) : [...prev, sp.nama]);

  const addToCart = () => {
    if (!selItem) return;
    const qty = selSNs.length > 0 ? selSNs.length : parseInt(manualQty) || 1;
    if (jenis === "issue" && qty > selItem.stok) { flash("❌ Insufficient stock."); return; }
    const alreadySNs = cart.flatMap(c => c.serialNumbers);
    const conflict = selSNs.filter(s => alreadySNs.includes(s));
    if (conflict.length > 0) { flash(`❌ Serial number(s) already in cart: ${conflict.join(", ")}`); return; }

    setCart(prev => [...prev, {
      _id: Date.now() + "_" + Math.random(),
      barangId: selItem.id,
      nama: selItem.nama,
      satuan: selItem.satuan,
      jumlah: qty,
      serialNumbers: selSNs,
      specs: selSpecs,
      keterangan: lineNote,
    }]);
    setSelItem(null);
    setSearch("");
    setSelSNs([]);
    setSelSpecs([]);
    setManualQty("1");
    setLineNote("");
  };

  const removeFromCart = id => setCart(prev => prev.filter(c => c._id !== id));

  const saveTransaction = async () => {
    if (cart.length === 0) { flash("❌ Cart is empty. Add at least one item."); return; }
    setSaving(true);

    let retryCount = 0;
    const maxRetries = 5;

    while (retryCount < maxRetries) {
      try {
        const no_dokumen = await generateDocNo(jenis);

        const { data: laporan, error: e1 } = await supabase
          .from("laporan_transaksi")
          .insert([{
            no_dokumen,
            jenis,
            user_id: user.id,
            nama_user: user.nama,
            keterangan: remarks,
            destination: destination,
            vehicle_type: vehicleType,
            registration_no: registrationNo,
            tanggal: new Date().toISOString(),
          }])
          .select()
          .single();

        if (e1) {
          if (e1.code === "23505" || e1.message.includes("duplicate key")) {
            retryCount++;
            continue;
          }
          throw e1;
        }

        const detailRows = cart.map(c => ({
          laporan_id: laporan.id,
          barang_id: c.barangId,
          nama_barang: c.nama,
          satuan: c.satuan,
          jumlah: c.jumlah,
          serial_numbers: c.serialNumbers,
          spek: c.specs.join(", "),
          keterangan: c.keterangan,
        }));

        const { error: e2 } = await supabase.from("detail_transaksi").insert(detailRows);
        if (e2) throw e2;

        for (const c of cart) {
          const { data: b } = await supabase.from("barang").select("stok").eq("id", c.barangId).single();
          const newStok = (jenis === "issue") ? (b.stok - c.jumlah) : (b.stok + c.jumlah);
          await supabase.from("barang").update({ stok: Math.max(0, newStok) }).eq("id", c.barangId);
        }

        for (const c of cart) {
          if (c.serialNumbers.length > 0) {
            const newStatus = jenis === "issue" ? "issued" : "available";
            await supabase
              .from("serial_numbers")
              .update({ status: newStatus })
              .in("nomor", c.serialNumbers)
              .eq("barang_id", c.barangId);
          }
        }

        flash("✓ Transaction saved successfully.");
        setCart([]);
        setRemarks("");
        setDestination("");
        setVehicleType("");
        setRegistrationNo("");
        onRefresh();
        break;
      } catch (e) {
        flash("❌ " + e.message);
        break;
      }
    }

    if (retryCount >= maxRetries) {
      flash("❌ Failed to generate unique document number after " + maxRetries + " attempts.");
    }

    setSaving(false);
  };

  const filteredItems = items.filter(b => b.nama.toLowerCase().includes(search.toLowerCase()));

  const typeBtn = (t, label, color) => (
    <button
      key={t}
      onClick={() => { setJenis(t); setSelItem(null); }}
      style={{
        flex: 1,
        padding: "10px",
        borderRadius: 4,
        border: `2px solid ${jenis === t ? color : T.border}`,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 1,
        fontFamily: "'Inter', sans-serif",
        background: jenis === t ? color + "18" : T.bg,
        color: jenis === t ? color : T.textMuted,
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );

  const cartTotal = cart.reduce((a, b) => a + b.jumlah, 0);

  return (
    <div>
      <div style={{
        marginBottom: 24,
        borderBottom: `2px solid ${T.accent}`,
        paddingBottom: 16,
      }}>
        <h2 style={{
          color: T.text,
          fontSize: 24,
          margin: "0 0 4px",
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 700,
        }}>
          Record Transaction
        </h2>
        <p style={{ color: T.textMuted, fontSize: 14, margin: 0, fontWeight: 500 }}>
          Multi-item cart — build your transaction then save
        </p>
      </div>

      <Alert text={msg} />

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {typeBtn("receipt", "▲ Receipt", T.green)}
        {typeBtn("issue", "▼ Issue", T.blue)}
        {typeBtn("return", "↩ Return", T.purple)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

        {/* LEFT PANEL */}
        <div style={{
          background: T.surface,
          border: `2px solid ${T.border}`,
          borderRadius: 8,
          padding: 20,
          boxShadow: T.shadow,
        }}>
          <p style={{
            color: T.textMuted,
            fontSize: 10,
            letterSpacing: 2,
            marginBottom: 14,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            textTransform: "uppercase",
          }}>
            Add Item to Cart
          </p>

          <div style={{ marginBottom: 10 }}>
            <Label>SEARCH & SELECT DESCRIPTION</Label>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setSelItem(null); }}
              placeholder="Type to search..."
              style={{ ...IS }}
            />
          </div>

          {!search && !selItem && (
            <div style={{
              border: `1px solid ${T.border}`,
              borderRadius: 4,
              maxHeight: 160,
              overflowY: "auto",
              marginBottom: 12,
              background: T.surface,
            }}>
              {items.slice(0, 8).map(b => (
                <div
                  key={b.id}
                  onClick={() => { setSelItem(b); setSearch(b.nama); }}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderBottom: `1px solid ${T.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{b.nama}</span>
                  <span style={{ color: T.textMuted, fontSize: 11 }}>{b.stok} {b.satuan}</span>
                </div>
              ))}
              {items.length > 8 && <p style={{ padding: 8, color: T.textMuted, fontSize: 11 }}>Type to search more items...</p>}
            </div>
          )}

          {search && !selItem && (
            <div style={{
              border: `1px solid ${T.border}`,
              borderRadius: 4,
              maxHeight: 160,
              overflowY: "auto",
              marginBottom: 12,
              background: T.surface,
            }}>
              {filteredItems.length === 0 ? (
                <p style={{ padding: "14px", color: T.textMuted, fontSize: 12, textAlign: "center" }}>No items found</p>
              ) : (
                filteredItems.map(b => (
                  <div
                    key={b.id}
                    onClick={() => { setSelItem(b); setSearch(b.nama); }}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      borderBottom: `1px solid ${T.border}`,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{b.nama}</span>
                    <span style={{ color: T.textMuted, fontSize: 11 }}>Stock: {b.stok} {b.satuan}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {selItem && (
            <div style={{
              background: T.bg,
              borderRadius: 4,
              padding: 12,
              marginBottom: 12,
              border: `1px solid ${T.border}`,
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}>
                <span style={{ color: T.text, fontWeight: 600, fontSize: 14 }}>{selItem.nama}</span>
                <button onClick={() => { setSelItem(null); setSearch(""); }} style={{
                  background: "transparent",
                  border: "none",
                  color: T.textMuted,
                  cursor: "pointer",
                  fontSize: 16,
                }}>✕</button>
              </div>
              <p style={{ color: T.textMuted, fontSize: 11 }}>
                Stock: <b style={{ color: T.text }}>{selItem.stok}</b> {selItem.satuan}
              </p>
            </div>
          )}

          {selItem && (
            <>
              {/* Serial Numbers */}
              <div style={{ marginBottom: 10 }}>
                <Label>SELECT SERIAL NUMBERS {jenis === "return" ? "(ISSUED)" : "(AVAILABLE)"}</Label>
                {snLoading ? (
                  <p style={{ color: T.textMuted, fontSize: 12, padding: "8px 0" }}>Loading...</p>
                ) : snList.length === 0 ? (
                  <p style={{ color: T.textMuted, fontSize: 12, padding: "8px 0", fontStyle: "italic" }}>
                    No serial numbers registered — use manual quantity.
                  </p>
                ) : (
                  <div style={{
                    maxHeight: 120,
                    overflowY: "auto",
                    border: `1px solid ${T.border}`,
                    borderRadius: 4,
                    background: T.surface,
                  }}>
                    {snList.map(sn => (
                      <label key={sn.id} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 10px",
                        cursor: "pointer",
                        borderBottom: `1px solid ${T.border}`,
                      }}>
                        <input type="checkbox" checked={selSNs.includes(sn.nomor)} onChange={() => toggleSN(sn)}
                          style={{ accentColor: T.accent, width: 14, height: 14 }} />
                        <code style={{
                          fontSize: 12,
                          color: T.text,
                          fontFamily: "'Inter', sans-serif",
                          flex: 1,
                          fontWeight: 500,
                        }}>
                          {sn.nomor}
                        </code>
                      </label>
                    ))}
                  </div>
                )}
                {selSNs.length > 0 && (
                  <p style={{ color: T.green, fontSize: 11, marginTop: 4 }}>
                    ✓ {selSNs.length} selected → qty = {selSNs.length}
                  </p>
                )}
              </div>

              {/* Specifications */}
              <div style={{ marginBottom: 10 }}>
                <Label>SELECT SPECIFICATIONS (OPTIONAL)</Label>
                {specList.length === 0 ? (
                  <p style={{ color: T.textMuted, fontSize: 12, padding: "8px 0", fontStyle: "italic" }}>
                    No specifications registered.
                  </p>
                ) : (
                  <div style={{
                    maxHeight: 100,
                    overflowY: "auto",
                    border: `1px solid ${T.border}`,
                    borderRadius: 4,
                    background: T.surface,
                  }}>
                    {specList.map(sp => (
                      <label key={sp.id} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 10px",
                        cursor: "pointer",
                        borderBottom: `1px solid ${T.border}`,
                      }}>
                        <input type="checkbox" checked={selSpecs.includes(sp.nama)} onChange={() => toggleSpec(sp)}
                          style={{ accentColor: T.green, width: 14, height: 14 }} />
                        <code style={{
                          fontSize: 12,
                          color: T.text,
                          fontFamily: "'Inter', sans-serif",
                          flex: 1,
                          fontWeight: 500,
                        }}>
                          {sp.nama}
                        </code>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {selSNs.length === 0 && (
                <div style={{ marginBottom: 10 }}>
                  <Label>QUANTITY</Label>
                  <input
                    type="number"
                    min="1"
                    max={jenis === "issue" ? selItem.stok : 9999}
                    value={manualQty}
                    onChange={e => setManualQty(e.target.value)}
                    style={{ ...IS }}
                  />
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <Label>LINE REMARKS (OPTIONAL)</Label>
                <input
                  value={lineNote}
                  onChange={e => setLineNote(e.target.value)}
                  placeholder="e.g. Issued to Site A"
                  style={{ ...IS }}
                />
              </div>

              <button onClick={addToCart} style={{
                ...BP,
                width: "100%",
                padding: "10px",
                background: jenis === "receipt" ? T.green : jenis === "issue" ? T.blue : T.purple,
              }}>
                + Add to Cart
              </button>
            </>
          )}

          <Divider />

          {/* Transport Info */}
          <div>
            <Label>DESTINATION (OPTIONAL)</Label>
            <input
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Site B, Workshop C"
              style={{ ...IS, marginBottom: 10 }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <Label>TYPE OF VEHICLE (OPTIONAL)</Label>
              <input
                value={vehicleType}
                onChange={e => setVehicleType(e.target.value)}
                placeholder="e.g. Truck, Pickup"
                style={{ ...IS }}
              />
            </div>
            <div>
              <Label>REGISTRATION NO. (OPTIONAL)</Label>
              <input
                value={registrationNo}
                onChange={e => setRegistrationNo(e.target.value)}
                placeholder="e.g. B 1234 XYZ"
                style={{ ...IS }}
              />
            </div>
          </div>
          <Divider />
          <div>
            <Label>PROJECT / WORK NAME</Label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              rows={2}
              placeholder="e.g. Major Outage A, Emergency B"
              style={{ ...IS, resize: "vertical" }}
            />
          </div>
        </div>

        {/* RIGHT PANEL — CART */}
        <div style={{
          background: T.surface,
          border: `2px solid ${T.border}`,
          borderRadius: 8,
          padding: 20,
          boxShadow: T.shadow,
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}>
            <p style={{
              color: T.textMuted,
              fontSize: 10,
              letterSpacing: 2,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              textTransform: "uppercase",
            }}>
              Cart
            </p>
            {cart.length > 0 && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{
                  background: T.accentBg,
                  color: T.accent,
                  border: `1px solid ${T.accent}55`,
                  padding: "3px 10px",
                  borderRadius: 3,
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  {cart.length} items · {cartTotal} qty
                </span>
                <button onClick={() => setCart([])} style={{ ...BRD, padding: "3px 10px", fontSize: 11 }}>Clear</button>
              </div>
            )}
          </div>

          {cart.length === 0 ? (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: T.textMuted,
              gap: 8,
              padding: "40px 0",
            }}>
              <span style={{ fontSize: 36 }}>🛒</span>
              <p style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Cart is empty</p>
              <p style={{ fontSize: 11 }}>Select items from the left panel</p>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: "auto", marginBottom: 14 }}>
              {cart.map((c, i) => (
                <div key={c._id} style={{
                  background: T.bg,
                  borderRadius: 4,
                  padding: "10px 12px",
                  marginBottom: 8,
                  border: `1px solid ${T.border}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                        <span style={{
                          background: T.inputBg,
                          color: T.textMuted,
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 3,
                          fontWeight: 600,
                        }}>
                          {i + 1}
                        </span>
                      </div>
                      <p style={{ color: T.text, fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{c.nama}</p>
                      {c.serialNumbers.length > 0 && (
                        <p style={{
                          color: T.textSub,
                          background: T.inputBg,
                          padding: "2px 8px",
                          borderRadius: 3,
                          fontSize: 10,
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: 2,
                          border: `1px solid ${T.border}`,
                        }}>
                          SNs: {c.serialNumbers.join(", ")}
                        </p>
                      )}
                      {c.specs.length > 0 && (
                        <p style={{
                          color: T.green,
                          background: "#152d1a",
                          padding: "2px 8px",
                          borderRadius: 3,
                          fontSize: 10,
                          fontFamily: "'Inter', sans-serif",
                          marginBottom: 2,
                          border: "1px solid #1f5c2a",
                        }}>
                          Spec: {c.specs.join(", ")}
                        </p>
                      )}
                      {c.keterangan && (
                        <p style={{ color: T.textMuted, fontSize: 11, fontStyle: "italic" }}>{c.keterangan}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: 8 }}>
                      <span style={{
                        background: jenis === "issue" ? "#15202d" : jenis === "receipt" ? "#152d1a" : "#2d152d",
                        color: jenis === "issue" ? T.blue : jenis === "receipt" ? T.green : T.purple,
                        border: `1px solid ${jenis === "issue" ? "#1f3a5c" : jenis === "receipt" ? "#1f5c2a" : "#5c1f5c"}`,
                        padding: "3px 10px",
                        borderRadius: 3,
                        fontSize: 11,
                        fontWeight: 700,
                      }}>
                        {c.jumlah} {c.satuan}
                      </span>
                      <button onClick={() => removeFromCart(c._id)} style={{
                        background: "transparent",
                        border: "none",
                        color: T.red,
                        cursor: "pointer",
                        fontSize: 16,
                      }}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <button onClick={saveTransaction} disabled={saving} style={{
              ...BP,
              width: "100%",
              padding: "12px",
              background: jenis === "receipt" ? T.green : jenis === "issue" ? T.blue : T.purple,
              opacity: saving ? 0.7 : 1,
              fontSize: 15,
            }}>
              {saving ? "SAVING..." : "SAVE TRANSACTION"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────
function HistoryPage({ laporans, onRefresh, user }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [details, setDetails] = useState({});
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState("");

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 4000); };

  const rows = laporans.filter(l => {
    if (filter !== "all" && l.jenis !== filter) return false;
    if (search && !l.no_dokumen.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const loadDetails = async (id) => {
    if (details[id]) {
      setExpanded(expanded === id ? null : id);
      return;
    }
    const { data } = await supabase
      .from("detail_transaksi")
      .select("*")
      .eq("laporan_id", id)
      .order("id");
    setDetails(prev => ({ ...prev, [id]: data || [] }));
    setExpanded(id);
  };

  const handleDelete = async (laporan) => {
    if (!confirm(`Are you sure you want to delete this transaction?\n\nDocument: ${laporan.no_dokumen}\n\nStock and serial numbers will be restored automatically.`)) {
      return;
    }

    setDeleting(laporan.id);

    try {
      let detailData = details[laporan.id];
      if (!detailData) {
        const { data } = await supabase
          .from("detail_transaksi")
          .select("*")
          .eq("laporan_id", laporan.id)
          .order("id");
        detailData = data || [];
      }

      for (const d of detailData) {
        if (!d.barang_id) continue;

        const { data: barang } = await supabase
          .from("barang")
          .select("stok")
          .eq("id", d.barang_id)
          .single();

        if (barang) {
          let newStok;
          if (laporan.jenis === "issue") {
            newStok = barang.stok + d.jumlah;
          } else if (laporan.jenis === "receipt" || laporan.jenis === "return") {
            newStok = Math.max(0, barang.stok - d.jumlah);
          }

          await supabase.from("barang").update({ stok: newStok }).eq("id", d.barang_id);
        }

        if (d.serial_numbers && Array.isArray(d.serial_numbers) && d.serial_numbers.length > 0) {
          let newStatus;
          if (laporan.jenis === "issue") {
            newStatus = "available";
          } else if (laporan.jenis === "return") {
            newStatus = "issued";
          }

          if (newStatus) {
            await supabase
              .from("serial_numbers")
              .update({ status: newStatus })
              .in("nomor", d.serial_numbers)
              .eq("barang_id", d.barang_id);
          } else if (laporan.jenis === "receipt") {
            await supabase
              .from("serial_numbers")
              .delete()
              .in("nomor", d.serial_numbers)
              .eq("barang_id", d.barang_id);
          }
        }
      }

      await supabase.from("detail_transaksi").delete().eq("laporan_id", laporan.id);
      const { error } = await supabase.from("laporan_transaksi").delete().eq("id", laporan.id);
      if (error) throw error;

      setDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[laporan.id];
        return newDetails;
      });
      setExpanded(null);
      flash("✓ Transaction deleted. Stock and serial numbers restored.");
      onRefresh();
    } catch (error) {
      flash("❌ Failed to delete: " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const handlePrint = async (laporan) => {
    let detailData = details[laporan.id];
    if (!detailData) {
      const { data } = await supabase
        .from("detail_transaksi")
        .select("*")
        .eq("laporan_id", laporan.id)
        .order("id");
      detailData = data || [];
      setDetails(prev => ({ ...prev, [laporan.id]: detailData }));
    }
    setTimeout(() => {
      printPDF(laporan, detailData);
    }, 50);
  };

  return (
    <div>
      <div style={{
        marginBottom: 24,
        borderBottom: `2px solid ${T.accent}`,
        paddingBottom: 16,
      }}>
        <h2 style={{
          color: T.text,
          fontSize: 24,
          margin: "0 0 4px",
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 700,
        }}>
          Transaction History
        </h2>
        <p style={{ color: T.textMuted, fontSize: 14, margin: 0, fontWeight: 500 }}>
          {laporans.length} total documents
        </p>
      </div>

      <Alert text={msg} />

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {[["all", "All"], ["receipt", "Receipt"], ["issue", "Issue"], ["return", "Return"]].map(([f, lbl]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? T.accent : T.surface,
              color: filter === f ? "#fff" : T.textSub,
              border: `2px solid ${filter === f ? T.accent : T.border}`,
              padding: "7px 16px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {lbl}
          </button>
        ))}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search document number..."
          style={{ ...IS, minWidth: 220, width: "auto", borderRadius: 4 }}
        />
        <span style={{
          color: T.textMuted,
          fontSize: 11,
          fontFamily: "'Inter', sans-serif",
          marginLeft: "auto",
          fontWeight: 500,
        }}>
          {rows.length} records
        </span>
      </div>

      <div style={{
        background: T.surface,
        border: `2px solid ${T.border}`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: T.shadow,
      }}>
        {rows.length === 0 ? (
          <p style={{ padding: "40px", textAlign: "center", color: T.textMuted, fontFamily: "'Inter', sans-serif" }}>
            No records found
          </p>
        ) : (
          rows.map((l, i) => (
            <div key={l.id}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto auto auto",
                  gap: 10,
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: `1px solid ${T.border}`,
                  background: i % 2 === 0 ? T.tblRow : T.tblRowAlt,
                  cursor: "pointer",
                }}
                onClick={() => loadDetails(l.id)}
              >
                <div>
                  <p style={{
                    color: T.accent,
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: 2,
                  }}>
                    {l.no_dokumen}
                  </p>
                  <p style={{ color: T.textMuted, fontSize: 11, fontWeight: 500 }}>
                    {fmtDate(l.tanggal)} · by {l.nama_user}
                  </p>
                </div>
                <TxnBadge jenis={l.jenis} />
                {l.keterangan && (
                  <span style={{
                    color: T.textMuted,
                    fontSize: 11,
                    maxWidth: 140,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}>
                    {l.keterangan}
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrint(l); }}
                  style={{ ...BGN, padding: "4px 12px", fontSize: 11, whiteSpace: "nowrap" }}
                >
                  🖨 Print
                </button>
                {canAdmin(user.role) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(l); }}
                    disabled={deleting === l.id}
                    style={{
                      ...BRD,
                      padding: "4px 10px",
                      fontSize: 11,
                      whiteSpace: "nowrap",
                      opacity: deleting === l.id ? 0.5 : 1,
                    }}
                  >
                    {deleting === l.id ? "⏳" : "🗑 Delete"}
                  </button>
                )}
                <span style={{ color: T.textMuted, fontSize: 13 }}>
                  {expanded === l.id ? "▲" : "▼"}
                </span>
              </div>

              {expanded === l.id && (
                <div style={{
                  background: T.bg,
                  borderBottom: `1px solid ${T.border}`,
                  padding: "12px 16px",
                }}>
                  {!details[l.id] ? (
                    <p style={{ color: T.textMuted, fontSize: 12 }}>Loading...</p>
                  ) : details[l.id].length === 0 ? (
                    <p style={{ color: T.textMuted, fontSize: 12 }}>No detail records found.</p>
                  ) : (
                    <table style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                    }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                          {["No", "Description", "Spec.", "Serial Number(s)", "Unit", "Qty", "Remarks"].map(h => (
                            <th key={h} style={{
                              textAlign: "left",
                              color: T.textSub,
                              padding: "5px 10px",
                              fontSize: 10,
                              letterSpacing: 1,
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {details[l.id].map((d, di) => (
                          <tr key={d.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                            <td style={{ padding: "7px 10px", color: T.textMuted }}>{di + 1}</td>
                            <td style={{ padding: "7px 10px", color: T.text, fontWeight: 600 }}>{d.nama_barang}</td>
                            <td style={{ padding: "7px 10px", color: T.textSub }}>{d.spek || "—"}</td>
                            <td style={{ padding: "7px 10px", color: T.textSub, fontSize: 11 }}>
                              {Array.isArray(d.serial_numbers) && d.serial_numbers.length ? d.serial_numbers.join(", ") : "—"}
                            </td>
                            <td style={{ padding: "7px 10px", color: T.textSub }}>{d.satuan || "—"}</td>
                            <td style={{ padding: "7px 10px", color: T.text, fontWeight: 700 }}>{d.jumlah}</td>
                            <td style={{
                              padding: "7px 10px",
                              color: T.textMuted,
                              maxWidth: 130,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}>
                              {d.keterangan || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── USERS PAGE ───────────────────────────────────────────────────────────────
function UsersPage({ users, onRefresh, currentUser }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", password: "", role: "editor" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAdd = async () => {
    if (!form.nama || !form.email || !form.password) { setMsg("❌ Fill all fields."); return; }
    setLoading(true);
    const { error } = await supabase.from("users").insert([form]);
    if (error) setMsg("❌ " + error.message);
    else { setForm({ nama: "", email: "", password: "", role: "editor" }); setShowForm(false); setMsg("✓ User added."); onRefresh(); }
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleDelete = async id => {
    if (!confirm("Delete this user?")) return;
    await supabase.from("users").delete().eq("id", id);
    setMsg("✓ User deleted.");
    onRefresh();
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div>
      <div style={{
        marginBottom: 24,
        borderBottom: `2px solid ${T.accent}`,
        paddingBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <div>
          <h2 style={{
            color: T.text,
            fontSize: 24,
            margin: "0 0 4px",
            letterSpacing: 1,
            textTransform: "uppercase",
            fontWeight: 700,
          }}>
            Users
          </h2>
          <p style={{ color: T.textMuted, fontSize: 14, margin: 0, fontWeight: 500 }}>
            {users.length} users registered
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ ...BP }}>+ Add User</button>
      </div>

      <Alert text={msg} />

      {showForm && (
        <div style={{
          background: T.surface,
          border: `2px solid ${T.border}`,
          borderRadius: 8,
          padding: 20,
          marginBottom: 18,
          boxShadow: T.shadow,
        }}>
          <p style={{
            color: T.accent,
            fontSize: 12,
            letterSpacing: 2,
            marginBottom: 14,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            textTransform: "uppercase",
          }}>
            Add User
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[["nama", "Full Name", "text"], ["email", "Email", "text"], ["password", "Password", "password"]].map(([k, lbl, t]) => (
              <div key={k}><Label>{lbl.toUpperCase()}</Label><input type={t} value={form[k]} onChange={set(k)} style={{ ...IS }} /></div>
            ))}
            <div>
              <Label>ROLE</Label>
              <select value={form.role} onChange={set("role")} style={{ ...IS }}>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} disabled={loading} style={{ ...BP, opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} style={{ ...BG }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{
        background: T.surface,
        border: `2px solid ${T.border}`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: T.shadow,
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
        }}>
          <thead>
            <tr style={{ background: T.tblHead, borderBottom: `2px solid ${T.border}` }}>
              {["Name", "Email", "Role", "Access Level", "Actions"].map(h => (
                <th key={h} style={{
                  textAlign: "left",
                  color: T.textSub,
                  padding: "10px 14px",
                  fontSize: 11,
                  letterSpacing: 1,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{
                borderBottom: `1px solid ${T.border}`,
                background: i % 2 === 0 ? T.tblRow : T.tblRowAlt,
              }}>
                <td style={{ padding: "11px 14px", color: T.text, fontWeight: 600 }}>{u.nama}</td>
                <td style={{ padding: "11px 14px", color: T.textSub }}>{u.email}</td>
                <td style={{ padding: "11px 14px" }}><Badge role={u.role} /></td>
                <td style={{ padding: "11px 14px", color: T.textMuted, fontSize: 11 }}>
                  {u.role === "admin" ? "Full access + user management" : "Record transactions, edit descriptions"}
                </td>
                <td style={{ padding: "11px 14px" }}>
                  {u.id !== currentUser.id ? (
                    <button onClick={() => handleDelete(u.id)} style={{ ...BRD }}>Delete</button>
                  ) : (
                    <span style={{ color: T.textMuted, fontSize: 11 }}>(You)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [laporans, setLap] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  if (!supabase) return <SetupScreen />;

  const fetchAll = async () => {
    setLoading(true);
    const [b, l, u] = await Promise.all([
      supabase.from("barang").select("*").order("nama"),
      supabase.from("laporan_transaksi").select("*").order("tanggal", { ascending: false }),
      supabase.from("users").select("*").order("nama"),
    ]);
    setItems(b.data || []);
    setLap(l.data || []);
    setUsers(u.data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  if (!user) return <AuthPage onLogin={setUser} />;
  if (loading) return <LoadingScreen />;

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: T.bg,
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: ${T.bg};
        }
        
        input, textarea, select {
          font-family: 'Inter', sans-serif !important;
          transition: border-color 0.2s !important;
        }
        
        input::placeholder, textarea::placeholder {
          color: ${T.textMuted} !important;
          opacity: 0.7;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none !important;
          border-color: ${T.accent} !important;
          box-shadow: 0 0 0 2px rgba(255,123,26,0.3) !important;
        }
        
        *,*::before,*::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          background: ${T.bg};
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${T.bg};
        }
        ::-webkit-scrollbar-thumb {
          background: ${T.border};
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${T.accent};
        }
        
        select option {
          background: ${T.surface};
          color: ${T.text};
        }
      `}</style>

      <Sidebar page={page} onNav={setPage} user={user} onLogout={() => setUser(null)} />

      <main style={{
        flex: 1,
        padding: "28px 32px",
        overflowY: "auto",
        fontFamily: "'Inter', sans-serif",
      }}>
        {page === "dashboard" && <DashboardPage items={items} laporans={laporans} />}
        {page === "desc" && <DescriptionPage items={items} onRefresh={fetchAll} user={user} />}
        {page === "transaction" && <TransactionPage items={items} onRefresh={fetchAll} user={user} cart={cart} setCart={setCart} />}
        {page === "history" && <HistoryPage laporans={laporans} onRefresh={fetchAll} user={user} />}
        {page === "users" && canAdmin(user.role) && <UsersPage users={users} onRefresh={fetchAll} currentUser={user} />}
      </main>
    </div>
  );
}
