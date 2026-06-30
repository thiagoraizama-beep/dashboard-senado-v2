import { useEffect, useState } from "react";
import { createMatrixCreative, updateMatrixCreative, getPlataformas, getCampanhas } from "../../../api/client.js";

const TODOS_FORMATOS = [
  // Meta / Instagram
  "Feed", "Stories", "Reels", "Carrossel", "Coleção", "Instant Experience", "Messenger",
  // TikTok
  "In-Feed", "TopView", "Brand Takeover", "Branded Hashtag Challenge", "Branded Effect", "Spark Ads",
  // YouTube
  "In-Stream Pulável", "In-Stream Não Pulável", "Bumper Ad", "Discovery", "Shorts", "Masthead",
  // Kwai / Outras redes
  "Kwai In-Feed", "Kwai TopView",
  // Deezer / Spotify / Áudio
  "Audio Ad", "Podcast Ad", "Branded Playlist", "Display Audio",
  // Programática / Display
  "Display", "Display Rich Media", "Interstitial", "Native", "Skin / Roadblock",
  "Banner", "Half Page", "Billboard", "Pop-Under",
  // OOH / DOOH
  "DOOH", "OOH Outdoor", "OOH Mobiliário Urbano", "DOOH Metro", "DOOH Aeroporto",
  // TV / Rádio (off)
  "VT 30s", "VT 15s", "VT 60s", "Spot Rádio 30s", "Spot Rádio 60s", "Merchandising",
  // Portal / UOL / Display online
  "Banner Home", "Sponsored Content", "Newsletter", "Push Notification",
  // Outros
  "Influencer Post", "Live", "Stories Interativo", "Link Patrocinado",
];
import SearchSelect from "../../layout/SearchSelect.jsx";
import RangeCalendarPicker from "../../layout/RangeCalendarPicker.jsx";

export default function CreativeFormModal({ creative, onClose, onSaved }) {
  const isEdit = Boolean(creative);
  const [nome, setNome] = useState(creative?.nome || "");
  const [adName, setAdName] = useState(creative?.ad_name || "");
  const [campanha, setCampanha] = useState(creative?.campanha || "");
  const [conjunto, setConjunto] = useState(creative?.conjunto || "");
  const [descricao, setDescricao] = useState(creative?.descricao || "");
  const [observacoes, setObservacoes] = useState(creative?.observacoes || "");
  const [periodoInicio, setPeriodoInicio] = useState(creative?.periodo_inicio?.slice(0, 10) || "");
  const [periodoFim, setPeriodoFim] = useState(creative?.periodo_fim?.slice(0, 10) || "");
  const [veiculo, setVeiculo] = useState(creative?.veiculo || "");
  const [formato, setFormato] = useState(creative?.formato || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [veiculoOptions, setVeiculoOptions] = useState([]);
  const [campanhaOptions, setCampanhaOptions] = useState([]);

  useEffect(() => {
    getPlataformas()
      .then((p) => setVeiculoOptions(p.map((x) => x.nome)))
      .catch(console.error);

    getCampanhas()
      .then((c) => setCampanhaOptions(c.map((x) => x.nome)))
      .catch(console.error);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (isEdit) {
        await updateMatrixCreative(creative.id, {
          nome,
          adName,
          campanha,
          conjunto,
          descricao,
          observacoes,
          periodoInicio: periodoInicio || null,
          periodoFim: periodoFim || null,
          veiculo,
          formato: formato || null,
        });
      } else {
        if (!file) {
          setError("Selecione um arquivo de imagem ou vídeo");
          setSaving(false);
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("nome", nome);
        formData.append("adName", adName);
        formData.append("campanha", campanha);
        formData.append("conjunto", conjunto);
        formData.append("descricao", descricao);
        formData.append("observacoes", observacoes);
        if (periodoInicio) formData.append("periodoInicio", periodoInicio);
        if (periodoFim) formData.append("periodoFim", periodoFim);
        formData.append("veiculo", veiculo);
        if (formato) formData.append("formato", formato);
        await createMatrixCreative(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar criativo");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)" };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(20,33,61,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="card"
        style={{ width: 480, maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: 15 }}>{isEdit ? "Editar criativo" : "Novo criativo"}</strong>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text-secondary)" }}>×</button>
        </div>

        {!isEdit && (
          <div>
            <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Arquivo (imagem ou vídeo)</label>
            <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required style={{ width: "100%", marginTop: 4 }} />
          </div>
        )}

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Nome do criativo</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required style={inputStyle} />
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Veículo (plataforma)</label>
          <SearchSelect
            value={veiculo}
            onChange={(v) => setVeiculo(v || "")}
            options={veiculoOptions}
            placeholder="Digite para buscar (Meta, TikTok, Kwai...)"
            allowFreeText
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Campanha</label>
          <SearchSelect
            value={campanha}
            onChange={(v) => setCampanha(v || "")}
            options={campanhaOptions}
            placeholder="Digite para buscar a campanha..."
            allowFreeText
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Formato (posicionamento)</label>
          <SearchSelect
            value={formato}
            onChange={(v) => setFormato(v || "")}
            options={TODOS_FORMATOS}
            placeholder="Digite para buscar (Stories, Reels, Feed...)"
            allowFreeText
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Conjunto (ad set)</label>
          <input value={conjunto} onChange={(e) => setConjunto(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Ad Name (vínculo com a planilha de performance)
          </label>
          <input
            value={adName}
            onChange={(e) => setAdName(e.target.value)}
            placeholder="Deve bater exatamente com o Ad Name da planilha"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Período de veiculação</label>
          <RangeCalendarPicker
            start={periodoInicio}
            end={periodoFim}
            onChange={(start, end) => { setPeriodoInicio(start); setPeriodoFim(end); }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} style={{ ...inputStyle, fontFamily: "inherit" }} />
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Observações</label>
          <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} style={{ ...inputStyle, fontFamily: "inherit" }} />
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: 13, margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{ padding: "10px 0", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
