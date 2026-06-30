import { query } from "../config/database.js";

export async function listPlataformas() {
  const { rows } = await query("SELECT * FROM plataformas ORDER BY nome ASC");
  return rows;
}

export async function createPlataforma({ nome, tipo, subcanais }) {
  const { rows } = await query(
    "INSERT INTO plataformas (nome, tipo, subcanais) VALUES ($1, $2, $3) RETURNING *",
    [nome, tipo || "online", subcanais || []]
  );
  return rows[0];
}

export async function updatePlataforma(id, { nome, tipo, subcanais }) {
  const { rows } = await query(
    `UPDATE plataformas SET
      nome = COALESCE($2, nome),
      tipo = COALESCE($3, tipo),
      subcanais = COALESCE($4, subcanais)
     WHERE id = $1 RETURNING *`,
    [id, nome, tipo, subcanais]
  );
  return rows[0] || null;
}

export async function deletePlataforma(id) {
  const { rowCount } = await query("DELETE FROM plataformas WHERE id = $1", [id]);
  return rowCount > 0;
}
