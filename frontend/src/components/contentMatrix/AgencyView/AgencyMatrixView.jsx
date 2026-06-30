import { useEffect, useState } from "react";
import { getMatrixCreatives, deleteMatrixCreative, updateMatrixCreativeStatus } from "../../../api/client.js";
import StatusSelect from "../statusSelect.jsx";
import CreativeFormModal from "./CreativeFormModal.jsx";
import DownloadButton from "../DownloadButton.jsx";
import CreativePreviewPopup from "../CreativePreviewPopup.jsx";
import MatrixFilterBar from "../MatrixFilterBar.jsx";
import MatrixMobileHeader from "../MatrixMobileHeader.jsx";
import { useMatrixFilters } from "../useMatrixFilters.js";
import ThemeToggle from "../../layout/ThemeToggle.jsx";
import Spinner from "../../common/Spinner.jsx";
import useIsMobile from "../../../hooks/useIsMobile.js";

function formatPeriodo(inicio, fim) {
  if (!inicio && !fim) return "-";
  const fmt = (iso) => {
    const [y, m, d] = iso.slice(0, 10).split("-");
    return `${d}/${m}`;
  };
  if (inicio && fim) return `${fmt(inicio)} - ${fmt(fim)}`;
  return fmt(inicio || fim);
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CreativeMobileCard({ c, onEdit, onDelete, onStatusChange, updating }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header com status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--card-bg)", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>
          {c.campanha} · {c.veiculo}
        </span>
        <StatusSelect value={c.status} onChange={(status) => onStatusChange(c.id, status)} disabled={updating} />
      </div>

      {/* Corpo */}
      <div style={{ padding: "12px 14px", display: "flex", gap: 12 }}>
        {/* Thumbnail clicável */}
        <CreativePreviewPopup creative={c}>
          {c.tipo_midia === "video" ? (
            <video src={c.cloudinary_url} style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0, display: "block" }} />
          ) : (
            <img src={c.cloudinary_url} alt={c.nome} style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0, display: "block" }} />
          )}
        </CreativePreviewPopup>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          <strong style={{ fontSize: 14, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {c.nome}
          </strong>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 12, rowGap: 3, fontSize: 12 }}>
            {c.conjunto && (
              <>
                <span style={{ color: "var(--text-secondary)" }}>Conjunto</span>
                <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.conjunto}</strong>
              </>
            )}
            {c.formato && (
              <>
                <span style={{ color: "var(--text-secondary)" }}>Formato</span>
                <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.formato}</strong>
              </>
            )}
            <span style={{ color: "var(--text-secondary)" }}>Período</span>
            <strong>{formatPeriodo(c.periodo_inicio, c.periodo_fim)}</strong>
            <span style={{ color: "var(--text-secondary)" }}>Ad Name</span>
            <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: c.ad_name ? "var(--text-primary)" : "var(--text-secondary)" }}>
              {c.ad_name || "não vinculado"}
            </strong>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div style={{ display: "flex", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => onEdit(c)}
          style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", color: "var(--accent)", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRight: "1px solid var(--border)" }}
        >
          Editar
        </button>
        <DownloadButton creative={c} compact />
        <button
          onClick={() => onDelete(c.id)}
          style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", color: "var(--danger)", fontSize: 13, fontWeight: 600, cursor: "pointer", borderLeft: "1px solid var(--border)" }}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

export default function AgencyMatrixView() {
  const [creatives, setCreatives] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const { filtered, options, filters, setStatus, setVeiculo, setCampanha } = useMatrixFilters(creatives);
  const isMobile = useIsMobile();

  function load() {
    setCreatives(null);
    getMatrixCreatives().then(setCreatives).catch(console.error);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Excluir este criativo? Esta ação não pode ser desfeita.")) return;
    await deleteMatrixCreative(id);
    load();
  }

  async function handleStatusChange(id, status) {
    setUpdatingId(id);
    try {
      await updateMatrixCreativeStatus(id, status);
      load();
    } finally {
      setUpdatingId(null);
    }
  }

  function openEdit(creative) {
    setEditing(creative);
    setModalOpen(true);
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  if (isMobile) {
    return (
      <div>
        <MatrixMobileHeader
          options={options}
          filters={filters}
          setStatus={setStatus}
          setVeiculo={setVeiculo}
          setCampanha={setCampanha}
          extraAction={
            <button
              onClick={openCreate}
              aria-label="Novo criativo"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <PlusIcon />
            </button>
          }
        />

        <h2 style={{ margin: "16px 0" }}>Matriz de Conteúdo</h2>

        {!creatives ? (
          <Spinner />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((c) => (
              <CreativeMobileCard
                key={c.id}
                c={c}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                updating={updatingId === c.id}
              />
            ))}
            {filtered.length === 0 && (
              <div className="card" style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                {creatives.length === 0
                  ? "Nenhum criativo cadastrado ainda"
                  : "Nenhum criativo encontrado para os filtros selecionados"}
              </div>
            )}
          </div>
        )}

        {modalOpen && <CreativeFormModal creative={editing} onClose={() => setModalOpen(false)} onSaved={load} />}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Matriz de Conteúdo</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ThemeToggle variant="plain" />
          <button
            onClick={openCreate}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Novo criativo
          </button>
        </div>
      </div>

      {creatives && creatives.length > 0 && (
        <MatrixFilterBar
          options={options}
          filters={filters}
          setStatus={setStatus}
          setVeiculo={setVeiculo}
          setCampanha={setCampanha}
        />
      )}

      <div className="card" style={{ overflowX: creatives?.length ? "auto" : undefined }}>
        {!creatives ? (
          <Spinner />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Criativo</th>
                <th>Campanha</th>
                <th>Conjunto</th>
                <th>Veículo</th>
                <th>Formato</th>
                <th>Período</th>
                <th>Ad Name</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <CreativePreviewPopup creative={c}>
                      {c.tipo_midia === "video" ? (
                        <video src={c.cloudinary_url} style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />
                      ) : (
                        <img src={c.cloudinary_url} alt={c.nome} style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />
                      )}
                      <strong style={{ fontSize: 13, cursor: "default" }}>{c.nome}</strong>
                    </CreativePreviewPopup>
                  </td>
                  <td>{c.campanha}</td>
                  <td>{c.conjunto || "-"}</td>
                  <td>{c.veiculo}</td>
                  <td style={{ fontSize: 12 }}>{c.formato || <span style={{ color: "var(--text-secondary)" }}>—</span>}</td>
                  <td style={{ fontSize: 12 }}>{formatPeriodo(c.periodo_inicio, c.periodo_fim)}</td>
                  <td>
                    {c.ad_name || (
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>não vinculado</span>
                    )}
                  </td>
                  <td>
                    <StatusSelect
                      value={c.status}
                      onChange={(status) => handleStatusChange(c.id, status)}
                      disabled={updatingId === c.id}
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <DownloadButton creative={c} compact />
                      <button
                        onClick={() => openEdit(c)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          background: "transparent",
                          color: "var(--text-primary)",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          background: "transparent",
                          color: "var(--danger)",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                    {creatives.length === 0
                      ? "Nenhum criativo cadastrado ainda"
                      : "Nenhum criativo encontrado para os filtros selecionados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <CreativeFormModal creative={editing} onClose={() => setModalOpen(false)} onSaved={load} />
      )}
    </div>
  );
}
