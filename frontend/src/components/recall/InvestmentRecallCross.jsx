import { useEffect, useState } from "react";
import { getVehicles } from "../../api/client.js";
import { VEICULO_PARA_MEIO_PESQUISA } from "../../data/vehicleToMeioMap.js";
import { MEIO_LEMBRANCA } from "../../data/recallCampanha.js";
import Spinner from "../common/Spinner.jsx";

const RANGE_TOTAL = { start: null, end: null };

export default function InvestmentRecallCross() {
  const [vehicles, setVehicles] = useState(null);

  useEffect(() => {
    getVehicles(RANGE_TOTAL, false, null, null, null).then(setVehicles).catch(console.error);
  }, []);

  if (!vehicles) return <Spinner />;

  const veiculosPorMeio = {};
  for (const v of vehicles) {
    const meio = VEICULO_PARA_MEIO_PESQUISA[v.veiculo];
    if (!meio) continue;
    if (!veiculosPorMeio[meio]) veiculosPorMeio[meio] = [];
    veiculosPorMeio[meio].push(v);
  }

  const linhas = MEIO_LEMBRANCA.map((m) => {
    const veiculosDoMeio = veiculosPorMeio[m.meio] || [];
    const temVeiculacaoNoDashboard = veiculosDoMeio.length > 0;
    const contratado = veiculosDoMeio.reduce((sum, v) => sum + v.contratado, 0);
    const entregue = veiculosDoMeio.reduce((sum, v) => sum + v.entregue, 0);
    const percentualEntrega = contratado > 0 ? Math.round((entregue / contratado) * 100) : null;

    return {
      meio: m.meio,
      temVeiculacaoNoDashboard,
      contratado,
      entregue,
      percentualEntrega,
      recallTotal: m.total,
      recallOnline: m.online,
      recallPresencial: m.presencial,
    };
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Meio</th>
            <th>Origem</th>
            <th>Contratado</th>
            <th>Entregue</th>
            <th>% Entrega</th>
            <th>Recall Total</th>
            <th>Recall Online</th>
            <th>Recall Presencial</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.meio}>
              <td>{l.meio}</td>
              <td>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: l.temVeiculacaoNoDashboard ? "var(--accent-soft)" : "var(--border)",
                    color: l.temVeiculacaoNoDashboard ? "var(--accent)" : "var(--text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {l.temVeiculacaoNoDashboard ? "Online (dashboard)" : "Offline / institucional"}
                </span>
              </td>
              <td>{l.contratado > 0 ? l.contratado.toLocaleString("pt-BR") : "-"}</td>
              <td>{l.entregue > 0 ? l.entregue.toLocaleString("pt-BR") : "-"}</td>
              <td>{l.percentualEntrega != null ? `${l.percentualEntrega}%` : "-"}</td>
              <td>{l.recallTotal}%</td>
              <td>{l.recallOnline}%</td>
              <td>{l.recallPresencial}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small style={{ color: "var(--text-secondary)" }}>
        Contratado/Entregue vêm da veiculação real registrada no dashboard (Meta, TikTok, Kwai → "Redes Sociais"; YouTube → "Streaming de Vídeo").
        Recall Total/Online/Presencial vêm da pesquisa Bridge Research/CLX. Meios sem veiculação cadastrada no dashboard (TV, Rádio, Cartazes/Anúncios, Internet,
        Streaming de Música) são captados apenas pela pesquisa, por serem de mídia offline/institucional ou fora do escopo de mensuração digital do sistema.
      </small>
    </div>
  );
}
