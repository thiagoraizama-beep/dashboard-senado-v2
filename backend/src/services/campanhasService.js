import { query } from "../config/database.js";

// Retorna campanhas com os veículos e plataformas vinculados
export async function listCampanhas() {
  const { rows: campanhas } = await query(
    "SELECT * FROM campanhas ORDER BY nome ASC"
  );

  const { rows: vinculos } = await query(`
    SELECT cv.*, v.nome AS veiculo_nome, v.logo_url, v.plataformas AS plataformas_veiculo, v.tipo
    FROM campanha_veiculos cv
    JOIN vehicles v ON v.id = cv.vehicle_id
    ORDER BY v.nome ASC
  `);

  return campanhas.map((c) => ({
    ...c,
    veiculos: vinculos
      .filter((v) => v.campanha_id === c.id)
      .map((v) => ({
        id: v.id,
        vehicleId: v.vehicle_id,
        nome: v.veiculo_nome,
        logoUrl: v.logo_url,
        tipo: v.tipo,
        tipoMidia: v.tipo_midia,
        plataformas: v.plataformas,
        plataformasVeiculo: v.plataformas_veiculo,
      })),
  }));
}

export async function createCampanha(nome) {
  const { rows } = await query(
    "INSERT INTO campanhas (nome) VALUES ($1) RETURNING *",
    [nome]
  );
  return { ...rows[0], veiculos: [] };
}

export async function updateCampanhaNome(id, nome) {
  const { rows } = await query(
    "UPDATE campanhas SET nome = $2 WHERE id = $1 RETURNING *",
    [id, nome]
  );
  return rows[0] || null;
}

export async function deleteCampanha(id) {
  const { rowCount } = await query("DELETE FROM campanhas WHERE id = $1", [id]);
  return rowCount > 0;
}

// Adiciona ou atualiza o vínculo de um veículo numa campanha com suas plataformas
// e o escopo de midia (online/offline/ambos) que ele atende NESTA campanha.
export async function upsertCampanhaVeiculo(campanhaId, vehicleId, plataformas, tipoMidia) {
  const { rows } = await query(
    `INSERT INTO campanha_veiculos (campanha_id, vehicle_id, plataformas, tipo_midia)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (campanha_id, vehicle_id)
     DO UPDATE SET plataformas = EXCLUDED.plataformas, tipo_midia = EXCLUDED.tipo_midia
     RETURNING *`,
    [campanhaId, vehicleId, plataformas, tipoMidia || "online"]
  );
  return rows[0];
}

export async function deleteCampanhaVeiculo(id) {
  const { rowCount } = await query("DELETE FROM campanha_veiculos WHERE id = $1", [id]);
  return rowCount > 0;
}

// Retorna os vinculos (campanha + plataformas + tipo de midia) de um usuario "veiculo",
// baseado nos nomes de veiculo vinculados a conta (user.veiculos).
// As plataformas sao expandidas pelos seus subcanais cadastrados (ex: "Meta Ads" ->
// ["Facebook", "Instagram"]) para bater com os nomes reais usados na planilha/realizado.
export async function getEscoposUsuario(nomeVeiculos) {
  if (!nomeVeiculos?.length) return [];

  const { rows } = await query(
    `SELECT cv.plataformas, cv.tipo_midia AS "tipoMidia", c.nome AS campanha, v.nome AS veiculo
     FROM campanha_veiculos cv
     JOIN campanhas c ON c.id = cv.campanha_id
     JOIN vehicles v ON v.id = cv.vehicle_id
     WHERE v.nome = ANY($1)`,
    [nomeVeiculos]
  );

  const { rows: plataformasDb } = await query("SELECT nome, subcanais FROM plataformas");
  const subcanaisPorNome = new Map(plataformasDb.map((p) => [p.nome, p.subcanais]));

  return rows.map((r) => ({
    ...r,
    plataformas: r.plataformas.flatMap((nomePlataforma) => {
      const subcanais = subcanaisPorNome.get(nomePlataforma);
      return subcanais?.length ? subcanais : [nomePlataforma];
    }),
  }));
}
