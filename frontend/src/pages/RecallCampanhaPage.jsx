import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  SOBRE_PESQUISA,
  DETALHAMENTO_AMOSTRA,
  AMOSTRA_TOTAL,
  PERFIL_GENERO,
  PERFIL_CLASSE_SOCIAL,
  RESUMO_EXECUTIVO,
  RECALL_FUNIL,
  RECALL_POR_REGIAO,
  RECALL_POR_CORTE,
  RECALL_DESTAQUES,
  AVALIACAO_FILME,
  MEIO_LEMBRANCA,
  MENSAGEM_TRANSMITIDA,
  AVALIACAO_ESTIMULOS,
  RESUMO_INDICADORES,
  PAPEL_SENADO,
  APRENDIZADOS,
} from "../data/recallCampanha.js";
import BrazilRegionMap from "../components/recall/BrazilRegionMap.jsx";
import InvestmentRecallCross from "../components/recall/InvestmentRecallCross.jsx";

const BAR_COLOR = "#2f6feb";
const GENERO_CORES = { Mulheres: "#0f3d91", Homens: "#5b8def" };

function Section({ title, children }) {
  return (
    <div className="card">
      <p className="card-title">{title}</p>
      {children}
    </div>
  );
}

function KpiCard({ label, value, sub }) {
  return (
    <div className="card" style={{ flex: "1 1 200px" }}>
      <p className="card-title">{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 32, fontWeight: 700, color: "var(--accent)" }}>{value}</p>
      {sub && <small style={{ color: "var(--text-secondary)" }}>{sub}</small>}
    </div>
  );
}

function wrapLabel(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function WrappedYAxisTick({ x, y, payload }) {
  const lines = wrapLabel(payload.value, 18);
  const lineHeight = 12;
  const startY = -((lines.length - 1) * lineHeight) / 2;
  return (
    <text x={x} y={y} textAnchor="end" fontSize={11} fill="var(--text-secondary)">
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? startY : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function HorizontalBarCard({ title, data, dataKey, nameKey, unit = "%", height, colorOf }) {
  return (
    <Section title={title}>
      <ResponsiveContainer width="100%" height={height || Math.max(160, data.length * 42)}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}${unit}`} />
          <YAxis type="category" dataKey={nameKey} tick={<WrappedYAxisTick />} width={140} interval={0} />
          <Tooltip
            formatter={(v) => [`${v}${unit}`, ""]}
            allowEscapeViewBox={{ x: true, y: true }}
            wrapperStyle={{ zIndex: 10 }}
            contentStyle={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
              padding: "8px 10px",
              whiteSpace: "nowrap",
            }}
            labelStyle={{ color: "var(--text-primary)", fontWeight: 600, whiteSpace: "nowrap" }}
            itemStyle={{ whiteSpace: "nowrap" }}
          />
          <Bar dataKey={dataKey} radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((d, i) => (
              <Cell key={i} fill={colorOf ? colorOf(d) : BAR_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Section>
  );
}

function FunilBar({ label, funil }) {
  const segmentos = [
    { key: "naoLembrou", label: "Não lembrou", cor: "#cbd5e1" },
    { key: "naoComprovada", label: "Lembrança não comprovada", cor: "#0f172a" },
    { key: "mub", label: "Estimulada pelo MUB", cor: "#2f6feb" },
    { key: "kwai", label: "Estimulada pelas Novelinhas Kwai", cor: "#93c5fd" },
    { key: "campanhaSenado", label: "Pela Campanha Senado Federal", cor: "#0f3d91" },
    { key: "senadoFederal", label: "Estimulada pelo Senado Federal", cor: "#5b8def" },
  ];
  return (
    <div style={{ flex: "1 1 160px", textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "3px solid var(--accent)",
          margin: "0 auto 8px",
          fontWeight: 700,
          fontSize: 18,
          color: "var(--accent)",
        }}
      >
        {funil.recall}%
      </div>
      <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13 }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", borderRadius: 8, overflow: "hidden", fontSize: 11 }}>
        {segmentos.map((s) => {
          const v = funil[s.key];
          if (!v) return null;
          return (
            <div
              key={s.key}
              title={s.label}
              style={{
                background: s.cor,
                color: s.key === "naoLembrou" || s.key === "kwai" ? "#0f172a" : "#fff",
                padding: "6px 4px",
                fontWeight: 600,
              }}
            >
              {v}%
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EstimuloCard({ item }) {
  const escalas = [
    { key: "gosteiMuito", label: "Gostei Muito", cor: "#1d4ed8" },
    { key: "gostei", label: "Gostei", cor: "#7dd3fc" },
    { key: "indiferente", label: "Indiferente", cor: "#cbd5e1" },
    { key: "naoGostei", label: "Não Gostei", cor: "#475569" },
    { key: "naoGosteiNada", label: "Não Gostei Nada", cor: "#0f172a" },
  ];
  return (
    <div style={{ flex: "1 1 220px", border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
      <p style={{ fontSize: 12, fontWeight: 600, minHeight: 48 }}>{item.tema}</p>
      <div style={{ display: "flex", gap: 12 }}>
        {["imagem", "video"].map((tipo) => (
          <div key={tipo} style={{ flex: 1, textAlign: "center" }}>
            <small style={{ color: "var(--text-secondary)" }}>{tipo === "imagem" ? "Imagem" : "Vídeo"}</small>
            <p style={{ margin: "2px 0 6px", fontWeight: 700 }}>{item[tipo].t2b}% T2B</p>
            <div style={{ display: "flex", flexDirection: "column", borderRadius: 6, overflow: "hidden", fontSize: 10 }}>
              {escalas.map((e) => {
                const v = item[tipo][e.key];
                if (!v) return null;
                return (
                  <div key={e.key} title={e.label} style={{ background: e.cor, color: "#fff", padding: "3px 2px" }}>
                    {v}%
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecallCampanhaPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card" style={{ background: "var(--accent-soft)", border: "none" }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Recall de Campanha — Senado Federal</h1>
        <p style={{ margin: "6px 0 0", color: "var(--text-secondary)", fontSize: 13 }}>
          Pesquisa realizada pela Bridge Research/CLX em Julho de 2026 · {AMOSTRA_TOTAL.total.toLocaleString("pt-BR")} entrevistas
          ({AMOSTRA_TOTAL.online.toLocaleString("pt-BR")} online + {AMOSTRA_TOTAL.presencial.toLocaleString("pt-BR")} presencial) em 12 capitais.
          Margem de erro total: {AMOSTRA_TOTAL.erroTotal}.
        </p>
      </div>

      <Section title="Sobre a Pesquisa">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 4px" }}>Objetivo</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{SOBRE_PESQUISA.objetivo}</p>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 4px" }}>Metodologia, Público-alvo e Amostra</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 6px" }}>{SOBRE_PESQUISA.metodologia}</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-secondary)" }}>
              {SOBRE_PESQUISA.publicoAlvo.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p style={{ fontSize: 13, margin: "6px 0 0" }}>
              {SOBRE_PESQUISA.entrevistasOnline.toLocaleString("pt-BR")} entrevistas online (erro amostral: {SOBRE_PESQUISA.erroOnline}) ·{" "}
              {SOBRE_PESQUISA.entrevistasPresencial.toLocaleString("pt-BR")} entrevistas presenciais (erro amostral: {SOBRE_PESQUISA.erroPresencial})
            </p>
          </div>
        </div>
      </Section>

      <Section title="Detalhamento da Amostra">
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Cidade</th>
                <th>Online (Base)</th>
                <th>Erro Amostral</th>
                <th>Presencial (Base)</th>
                <th>Erro Amostral</th>
                <th>Total (Base)</th>
                <th>Erro Amostral</th>
              </tr>
            </thead>
            <tbody>
              {DETALHAMENTO_AMOSTRA.map((d) => (
                <tr key={d.cidade}>
                  <td>{d.cidade}</td>
                  <td>{d.online}</td>
                  <td>{d.erroOnline}</td>
                  <td>{d.presencial ?? "-"}</td>
                  <td>{d.erroPresencial ?? "-"}</td>
                  <td>{d.total}</td>
                  <td>{d.erroTotal}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 700 }}>
                <td>Total</td>
                <td>{AMOSTRA_TOTAL.online.toLocaleString("pt-BR")}</td>
                <td>{AMOSTRA_TOTAL.erroOnline}</td>
                <td>{AMOSTRA_TOTAL.presencial}</td>
                <td>{AMOSTRA_TOTAL.erroPresencial}</td>
                <td>{AMOSTRA_TOTAL.total.toLocaleString("pt-BR")}</td>
                <td>{AMOSTRA_TOTAL.erroTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <small style={{ color: "var(--text-secondary)" }}>{AMOSTRA_TOTAL.notaColetaPresencial}</small>
      </Section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <KpiCard label="Recall Comprovado" value={`${RECALL_FUNIL.total.recall}%`} />
        <KpiCard label="Recall Online" value={`${RECALL_FUNIL.online.recall}%`} />
        <KpiCard label="Recall Presencial" value={`${RECALL_FUNIL.presencial.recall}%`} />
        <KpiCard label="Nota do Filme" value={`${AVALIACAO_FILME.notaMedia}`} sub={`de ${AVALIACAO_FILME.escalaMax}`} />
      </div>

      <Section title="Perfil da Amostra">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: "1 1 260px", minWidth: 0 }}>
            <HorizontalBarCard
              title="Gênero"
              data={PERFIL_GENERO}
              dataKey="percentual"
              nameKey="corte"
              colorOf={(d) => GENERO_CORES[d.corte]}
              height={140}
            />
          </div>
          <div style={{ flex: "1 1 260px", minWidth: 0 }}>
            <HorizontalBarCard
              title="Classe Social"
              data={PERFIL_CLASSE_SOCIAL}
              dataKey="percentual"
              nameKey="corte"
              colorOf={(d) => d.cor}
              height={200}
            />
          </div>
          <div style={{ flex: "1 1 260px", minWidth: 0 }} className="card">
            <p className="card-title">Recall por Região</p>
            <BrazilRegionMap data={RECALL_POR_REGIAO} />
          </div>
        </div>
      </Section>

      <Section title="Resumo Executivo">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", columnGap: 40, rowGap: 24 }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 4px" }}>Sobre o Estudo</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-secondary)" }}>
              {RESUMO_EXECUTIVO.sobreEstudo.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 4px" }}>Principais Resultados</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-secondary)" }}>
              {RESUMO_EXECUTIVO.principaisResultados.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 4px" }}>Leitura Estratégica</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 4px" }}>{RESUMO_EXECUTIVO.leituraEstrategica.intro}</p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-secondary)" }}>
              {RESUMO_EXECUTIVO.leituraEstrategica.pontos.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 4px" }}>Recomendação Central</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{RESUMO_EXECUTIVO.recomendacaoCentral}</p>
          </div>
        </div>
      </Section>

      <Section title="Recall de Campanha — Funil (Total / Online / Presencial)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
          <FunilBar label="Total" funil={RECALL_FUNIL.total} />
          <FunilBar label="Online" funil={RECALL_FUNIL.online} />
          <FunilBar label="Presencial" funil={RECALL_FUNIL.presencial} />
        </div>
      </Section>

      <HorizontalBarCard title="Recall por Corte (Gênero, Idade, Região, Classe)" data={RECALL_POR_CORTE} dataKey="recall" nameKey="corte" height={480} />

      <Section title="Destaques de Recall">
        <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {RECALL_DESTAQUES.map((texto, i) => (
            <li key={i} style={{ fontSize: 13 }}>
              {texto}
            </li>
          ))}
        </ul>
      </Section>

      <HorizontalBarCard title="Meio Gerador de Lembrança (Total)" data={MEIO_LEMBRANCA} dataKey="total" nameKey="meio" height={280} />

      <Section title="Mensagem Transmitida (Total)">
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Mensagem</th>
                <th>Total</th>
                <th>Online</th>
                <th>Presencial</th>
              </tr>
            </thead>
            <tbody>
              {MENSAGEM_TRANSMITIDA.map((m) => (
                <tr key={m.mensagem}>
                  <td>{m.mensagem}</td>
                  <td>{m.total}%</td>
                  <td>{m.online}%</td>
                  <td>{m.presencial}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Avaliação dos Estímulos (Imagem Estática vs Vídeo)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {AVALIACAO_ESTIMULOS.map((item) => (
            <EstimuloCard key={item.tema} item={item} />
          ))}
        </div>
      </Section>

      <Section title="Resumo dos Indicadores da Campanha">
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 0 }}>{RESUMO_INDICADORES.destaque}</p>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Total</th>
                <th>Impactados</th>
                <th>Não Impactados</th>
                <th>Masculino</th>
                <th>Feminino</th>
                <th>Nordeste</th>
                <th>Norte</th>
                <th>Classe A</th>
                <th>Classe B</th>
                <th>Classe C/D/E</th>
              </tr>
            </thead>
            <tbody>
              {RESUMO_INDICADORES.linhas.map((l) => {
                const isMedia = l.indicador.includes("Média");
                const unidade = isMedia ? "" : "%";
                return (
                  <tr key={l.indicador}>
                    <td>{l.indicador}</td>
                    <td>{l.total}{unidade}</td>
                    <td>{l.impactados}{unidade}</td>
                    <td>{l.naoImpactados}{unidade}</td>
                    <td>{l.masculino}{unidade}</td>
                    <td>{l.feminino}{unidade}</td>
                    <td>{l.nordeste}{unidade}</td>
                    <td>{l.norte}{unidade}</td>
                    <td>{l.classeA}{unidade}</td>
                    <td>{l.classeB}{unidade}</td>
                    <td>{l.classeCDE}{unidade}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <KpiCard label="Sabe que o Senado aprova leis" value={`${PAPEL_SENADO.sabeQueAprovaLeis}%`} />
        <KpiCard label="Não sabe o papel do Senado" value={`${PAPEL_SENADO.naoSabeOPapel}%`} />
      </div>

      <Section title="Aprendizados e Recomendações">
        <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {APRENDIZADOS.map((texto, i) => (
            <li key={i} style={{ fontSize: 13 }}>
              {texto}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Cruzamento: Entrega da Campanha x Recall da Pesquisa">
        <InvestmentRecallCross />
      </Section>
    </div>
  );
}
