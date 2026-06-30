import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateMyProfile } from "../api/client.js";
import Avatar from "../components/common/Avatar.jsx";
import UserManagement from "../components/profile/UserManagement.jsx";
import ChangePasswordForm from "../components/profile/ChangePasswordForm.jsx";
import VehicleManagement from "../components/profile/VehicleManagement.jsx";
import CampaignManagement from "../components/profile/CampaignManagement.jsx";
import PlatformManagement from "../components/profile/PlatformManagement.jsx";
import ThemeToggle from "../components/layout/ThemeToggle.jsx";

const TABS_AGENCIA = [
  { id: "veiculos", label: "Veículos" },
  { id: "plataformas", label: "Plataformas" },
  { id: "campanhas", label: "Campanhas" },
  { id: "usuarios", label: "Usuários" },
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [nome, setNome] = useState(user.nome);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removerFoto, setRemoverFoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("veiculos");

  function handleFileChange(e) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
    if (selected) setRemoverFoto(false);
  }

  function handleRemovePhoto() {
    setFile(null);
    setPreview(null);
    setRemoverFoto(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("nome", nome);
      if (file) formData.append("foto", file);
      if (removerFoto) formData.append("removerFoto", "true");
      await updateMyProfile(formData);
      await refreshUser();
      setRemoverFoto(false);
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Meu Perfil</h2>
        <ThemeToggle variant="plain" />
      </div>

      {/* Card de dados pessoais + senha */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
          <Avatar nome={nome} fotoUrl={removerFoto ? null : preview || user.fotoUrl} size={72} />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 18 }}>{user.nome}</strong>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>{user.email}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)", textTransform: "capitalize" }}>
              {user.papel}
              {user.papel === "veiculo" && user.veiculos?.length > 0 && (
                <span style={{ marginLeft: 6 }}>
                  · {user.veiculos.join(", ")}
                </span>
              )}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <label style={{ display: "inline-block", padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, cursor: "pointer", background: "var(--card-bg)" }}>
              Trocar foto
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </label>
            {!removerFoto && (preview || user.fotoUrl) && (
              <button type="button" onClick={handleRemovePhoto} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--danger)", fontSize: 12, cursor: "pointer" }}>
                Remover foto
              </button>
            )}
          </div>
        </div>

        <div className="profile-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Dados */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14, color: "var(--text-secondary)" }}>Dados pessoais</p>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Email</label>
              <input value={user.email} disabled style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", opacity: 0.6 }} />
            </div>
            {success && <p style={{ color: "var(--success)", fontSize: 13, margin: 0 }}>Perfil atualizado!</p>}
            <button type="submit" disabled={saving} style={{ padding: "9px 0", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>

          {/* Senha */}
          <div>
            <p style={{ margin: "0 0 14px", fontWeight: 600, fontSize: 14, color: "var(--text-secondary)" }}>Segurança</p>
            <ChangePasswordForm />
          </div>
        </div>
      </div>

      {/* Seções da agência em abas */}
      {user.papel === "agencia" && (
        <div>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
            {TABS_AGENCIA.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px 8px 0 0",
                  border: "1px solid var(--border)",
                  borderBottom: activeTab === tab.id ? "1px solid var(--card-bg)" : "1px solid var(--border)",
                  background: activeTab === tab.id ? "var(--card-bg)" : "transparent",
                  color: activeTab === tab.id ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: activeTab === tab.id ? 700 : 400,
                  fontSize: 13,
                  cursor: "pointer",
                  position: "relative",
                  bottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo da aba */}
          <div>
            {activeTab === "veiculos" && <VehicleManagement />}
            {activeTab === "plataformas" && <PlatformManagement />}
            {activeTab === "campanhas" && <CampaignManagement />}
            {activeTab === "usuarios" && <UserManagement />}
          </div>
        </div>
      )}
    </div>
  );
}
