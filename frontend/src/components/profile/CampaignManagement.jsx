import { useEffect, useState } from "react";
import {
  getCampanhas,
  createCampanha,
  updateCampanhaNome,
  deleteCampanha,
  upsertCampanhaVeiculo,
  deleteCampanhaVeiculo,
  getRegisteredVehicles,
  getPlataformas,
} from "../../api/client.js";
import SearchSelect from "../layout/SearchSelect.jsx";
import MultiSelectDropdown from "../layout/MultiSelectDropdown.jsx";
import Spinner from "../common/Spinner.jsx";

const TIPO_MIDIA_OPTIONS = ["Online", "Offline", "Online e Offline"];
const TIPO_MIDIA_FROM_LABEL = { Online: "online", Offline: "offline", "Online e Offline": "ambos" };
const TIPO_MIDIA_LABEL = { online: "Online", offline: "Offline", ambos: "Online e Offline" };

export default function CampaignManagement() {
  const [campanhas, setCampanhas] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [plataformasDb, setPlataformasDb] = useState([]);
  const [criando, setCriando] = useState(false);
  const [nomeCampanha, setNomeCampanha] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setCampanhas(null);
    Promise.all([getCampanhas(), getRegisteredVehicles(), getPlataformas()]).then(([c, v, p]) => {
      setCampanhas(c);
      setVehicles(v);
      setPlataformasDb(p);
    });
  }

  useEffect(() => { load(); }, []);

  async function handleCriar(e) {
    e.preventDefault();
    if (!nomeCampanha.trim()) return;
    setSaving(true);
    setError("");
    try {
      await createCampanha(nomeCampanha.trim());
      setNomeCampanha("");
      setCriando(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao criar campanha");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCampanha(id, nome) {
    if (!confirm(`Excluir a campanha "${nome}"? Os vínculos com veículos serão removidos.`)) return;
    await deleteCampanha(id);
    load();
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p className="card-title" style={{ margin: 0 }}>Campanhas</p>
        <button
          onClick={() => { setCriando((o) => !o); setError(""); setNomeCampanha(""); }}
          style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          {criando ? "Cancelar" : "+ Nova campanha"}
        </button>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 16px" }}>
        Cadastre campanhas e vincule os veículos com as plataformas e o tipo de mídia (online/offline) que cada um trabalha nesta campanha específica.
      </p>

      {criando && (
        <form onSubmit={handleCriar} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={nomeCampanha}
            onChange={(e) => setNomeCampanha(e.target.value)}
            placeholder="Nome da campanha (ex: Campanha Institucional 2026)"
            required
            autoFocus
            style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
          />
          <button
            type="submit"
            disabled={saving}
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {saving ? "..." : "Criar"}
          </button>
        </form>
      )}
      {error && <p style={{ color: "var(--danger)", fontSize: 13, margin: "-8px 0 12px" }}>{error}</p>}

      {!campanhas ? (
        <Spinner />
      ) : campanhas.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Nenhuma campanha cadastrada. Crie uma campanha e vincule os veículos.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {campanhas.map((campanha) => (
            <CampanhaCard
              key={campanha.id}
              campanha={campanha}
              vehicles={vehicles}
              plataformasDb={plataformasDb}
              onChanged={load}
              onDelete={() => handleDeleteCampanha(campanha.id, campanha.nome)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CampanhaCard({ campanha, vehicles, plataformasDb, onChanged, onDelete }) {
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeEditado, setNomeEditado] = useState(campanha.nome);
  const [vinculoForm, setVinculoForm] = useState(null); // null | { vinculoId?, vehicleId, tipoMidia, plataformas }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Veículos ainda não vinculados a esta campanha (para o form de novo vínculo)
  const vinculadosIds = campanha.veiculos.map((v) => v.vehicleId);
  const vehiclesDisponiveis = vehicles.filter((v) => !vinculadosIds.includes(v.id));

  const vehicleSelecionado = vinculoForm
    ? vehicles.find((v) => v.id === vinculoForm.vehicleId)
    : null;

  function plataformasParaTipo(tipoMidia) {
    return plataformasDb
      .filter((p) => {
        if (tipoMidia === "online") return p.tipo === "online" || p.tipo === "ambos";
        if (tipoMidia === "offline") return p.tipo === "offline" || p.tipo === "ambos";
        return true;
      })
      .map((p) => p.nome);
  }

  function abrirNovoVinculo() {
    setVinculoForm({ vinculoId: null, vehicleId: null, tipoMidia: "online", plataformas: [] });
    setError("");
  }

  function abrirEdicaoVinculo(v) {
    setVinculoForm({
      vinculoId: v.id,
      vehicleId: v.vehicleId,
      tipoMidia: v.tipoMidia || "online",
      plataformas: v.plataformas,
    });
    setError("");
  }

  async function handleSalvarNome(e) {
    e.preventDefault();
    if (!nomeEditado.trim()) return;
    setSaving(true);
    setError("");
    try {
      await updateCampanhaNome(campanha.id, nomeEditado.trim());
      setEditandoNome(false);
      onChanged();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar nome");
    } finally {
      setSaving(false);
    }
  }

  async function handleVincular(e) {
    e.preventDefault();
    if (!vinculoForm.vehicleId || vinculoForm.plataformas.length === 0) {
      setError("Selecione o veículo e ao menos uma plataforma");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await upsertCampanhaVeiculo(campanha.id, vinculoForm.vehicleId, vinculoForm.plataformas, vinculoForm.tipoMidia);
      setVinculoForm(null);
      onChanged();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao vincular");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoverVinculo(vinculoId, nomeVeiculo) {
    if (!confirm(`Remover ${nomeVeiculo} desta campanha?`)) return;
    await deleteCampanhaVeiculo(vinculoId);
    onChanged();
  }

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      {/* Header campanha */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg)", gap: 10 }}>
        {editandoNome ? (
          <form onSubmit={handleSalvarNome} style={{ display: "flex", gap: 6, flex: 1 }}>
            <input
              value={nomeEditado}
              onChange={(e) => setNomeEditado(e.target.value)}
              autoFocus
              required
              style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", fontSize: 13 }}
            />
            <button type="submit" disabled={saving} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Salvar
            </button>
            <button type="button" onClick={() => { setEditandoNome(false); setNomeEditado(campanha.nome); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-primary)", fontSize: 12, cursor: "pointer" }}>
              Cancelar
            </button>
          </form>
        ) : (
          <strong style={{ fontSize: 14, flex: 1 }}>{campanha.nome}</strong>
        )}

        {!editandoNome && (
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => setEditandoNome(true)}
              style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-primary)", fontSize: 12, cursor: "pointer" }}
            >
              Editar
            </button>
            {vehiclesDisponiveis.length > 0 && (
              <button
                onClick={() => (vinculoForm ? setVinculoForm(null) : abrirNovoVinculo())}
                style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                {vinculoForm && !vinculoForm.vinculoId ? "Cancelar" : "+ Veículo"}
              </button>
            )}
            <button
              onClick={onDelete}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--danger)", cursor: "pointer", fontSize: 16 }}
              title="Excluir campanha"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Formulário de vínculo (criar ou editar) */}
      {vinculoForm && (
        <form onSubmit={handleVincular} style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Veículo (empresa)</label>
            {vinculoForm.vinculoId ? (
              <p style={{ margin: "4px 0 0", fontWeight: 600, fontSize: 14 }}>{vehicleSelecionado?.nome}</p>
            ) : (
              <SearchSelect
                value={vehicleSelecionado?.nome || ""}
                onChange={(nome) => {
                  const v = vehicles.find((x) => x.nome === nome);
                  setVinculoForm((f) => ({ ...f, vehicleId: v ? v.id : null, plataformas: [] }));
                }}
                options={vehiclesDisponiveis.map((v) => v.nome)}
                placeholder="Digite para buscar o veículo..."
              />
            )}
          </div>

          {vinculoForm.vehicleId && (
            <div>
              <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Tipo de mídia nesta campanha
              </label>
              <MultiSelectDropdown
                value={TIPO_MIDIA_LABEL[vinculoForm.tipoMidia]}
                onChange={(v) => {
                  if (v) setVinculoForm((f) => ({ ...f, tipoMidia: TIPO_MIDIA_FROM_LABEL[v] || "online", plataformas: [] }));
                }}
                options={TIPO_MIDIA_OPTIONS}
                placeholder="Selecione"
              />
              <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "4px 0 0" }}>
                Define o que este veículo poderá ver nesta campanha, mesmo que opere outras mídias em geral.
              </p>
            </div>
          )}

          {vinculoForm.vehicleId && (() => {
            const opcoesPlataformas = plataformasParaTipo(vinculoForm.tipoMidia);
            // Garante que toda plataforma ja selecionada continua visivel/removivel no
            // dropdown, mesmo que o tipo de midia mudou e ela nao bateria mais no filtro.
            const opcoesComSelecionadas = [...new Set([...opcoesPlataformas, ...vinculoForm.plataformas])];
            return (
              <div>
                <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Plataformas que este veículo trabalhará nesta campanha
                </label>
                <MultiSelectDropdown
                  multi
                  value={vinculoForm.plataformas}
                  onChange={(plataformas) => setVinculoForm((f) => ({ ...f, plataformas }))}
                  options={opcoesComSelecionadas}
                  placeholder="Selecione as plataformas"
                />
              </div>
            );
          })()}

          {error && <p style={{ color: "var(--danger)", fontSize: 12, margin: 0 }}>{error}</p>}

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={saving || !vinculoForm.vehicleId || vinculoForm.plataformas.length === 0}
              style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: (!vinculoForm.vehicleId || vinculoForm.plataformas.length === 0) ? 0.5 : 1 }}
            >
              {saving ? "Salvando..." : vinculoForm.vinculoId ? "Salvar alterações" : "Vincular"}
            </button>
            <button
              type="button"
              onClick={() => setVinculoForm(null)}
              style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-primary)", fontSize: 13, cursor: "pointer" }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Veículos vinculados */}
      {campanha.veiculos.length > 0 ? (
        <div style={{ padding: "8px 16px 12px" }}>
          {campanha.veiculos.map((v) => (
            <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid var(--border)", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 13 }}>{v.nome}</strong>
                <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-secondary)" }}>
                  ({TIPO_MIDIA_LABEL[v.tipoMidia] || "Online"})
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                  {v.plataformas.map((p) => (
                    <span key={p} style={{ padding: "2px 8px", borderRadius: 999, background: "var(--accent-soft)", color: "var(--accent)", fontSize: 11, fontWeight: 600 }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => abrirEdicaoVinculo(v)}
                  style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-primary)", fontSize: 12, cursor: "pointer" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemoverVinculo(v.id, v.nome)}
                  style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: 18, padding: 0 }}
                  title="Remover veículo da campanha"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !vinculoForm && (
          <p style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
            Nenhum veículo vinculado. {vehicles.length === 0 ? "Cadastre veículos na aba Veículos primeiro." : "Clique em '+ Veículo' para vincular."}
          </p>
        )
      )}
    </div>
  );
}
