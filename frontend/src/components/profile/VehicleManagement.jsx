import { useEffect, useState } from "react";
import { getRegisteredVehicles, createVehicle, updateVehicle, deleteVehicle } from "../../api/client.js";
import Avatar from "../common/Avatar.jsx";
import TrashIcon from "../common/TrashIcon.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import MultiSelectDropdown from "../layout/MultiSelectDropdown.jsx";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  function load() {
    getRegisteredVehicles().then(setVehicles).catch(console.error);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    await deleteVehicle(deleting.id);
    setDeleting(null);
    load();
  }

  function openEdit(vehicle) {
    setEditing(vehicle);
    setFormOpen(true);
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p className="card-title" style={{ margin: 0 }}>Veículos</p>
        <button
          onClick={openCreate}
          style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          + Novo veículo
        </button>
      </div>

      {formOpen && (
        <VehicleForm
          vehicle={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { load(); setFormOpen(false); setEditing(null); }}
        />
      )}

      {!vehicles ? (
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Carregando...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {vehicles.map((v) => (
            <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar nome={v.nome} fotoUrl={v.logo_url} size={32} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 13 }}>{v.nome}</strong>
                <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-secondary)" }}>
                  ({({ redes_sociais: "Redes Sociais", online_outros: "Online (outros)", offline: "Offline", online: "Online", ambos: "Online" })[v.tipo] || v.tipo})
                </span>
              </div>
              <button
                onClick={() => openEdit(v)}
                style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-primary)", fontSize: 12, cursor: "pointer" }}
              >
                Editar
              </button>
              <button
                onClick={() => setDeleting(v)}
                title="Excluir veículo"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--danger)", cursor: "pointer" }}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
          {vehicles.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Nenhum veículo cadastrado ainda</p>
          )}
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title="Excluir veículo"
          message={`Tem certeza que deseja excluir "${deleting.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

function VehicleForm({ vehicle, onClose, onSaved }) {
  const isEdit = Boolean(vehicle);
  const [nome, setNome] = useState(vehicle?.nome || "");
  const [tipo, setTipo] = useState(vehicle?.tipo || "online");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const TIPO_OPTIONS = [
    "Redes Sociais",
    "Online (outros)",
    "Offline (TV/Rádio/OOH)",
  ];
  const TIPO_FROM_LABEL = {
    "Redes Sociais": "redes_sociais",
    "Online (outros)": "online_outros",
    "Offline (TV/Rádio/OOH)": "offline",
  };
  const TIPO_LABEL = {
    redes_sociais: "Redes Sociais",
    online_outros: "Online (outros)",
    offline: "Offline (TV/Rádio/OOH)",
    online: "Online (outros)", // compatibilidade com registros antigos
    ambos: "Online (outros)",
  };
  const tipoLabel = TIPO_LABEL[tipo] || "Redes Sociais";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("tipo", tipo);
      if (file) formData.append("logo", file);
      if (isEdit) {
        await updateVehicle(vehicle.id, formData);
      } else {
        await createVehicle(formData);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar veículo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Nome do veículo</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Ex: Go On Ad Group"
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)" }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Tipo de mídia</label>
          <MultiSelectDropdown
            value={tipoLabel}
            onChange={(v) => v && setTipo(TIPO_FROM_LABEL[v] || "redes_sociais")}
            options={TIPO_OPTIONS}
            placeholder="Selecione"
          />
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Logo (imagem)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ width: "100%", marginTop: 4 }}
        />
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{error}</p>}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="submit"
          disabled={saving}
          style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-primary)", fontSize: 13, cursor: "pointer" }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
