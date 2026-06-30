import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import {
  listCampanhas,
  createCampanha,
  updateCampanhaNome,
  deleteCampanha,
  upsertCampanhaVeiculo,
  deleteCampanhaVeiculo,
} from "../services/campanhasService.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await listCampanhas());
  } catch (err) {
    next(err);
  }
});

router.post("/", requireRole("agencia"), async (req, res, next) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Campo obrigatório: nome" });
    const campanha = await createCampanha(nome);
    res.status(201).json(campanha);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Já existe uma campanha com este nome" });
    }
    next(err);
  }
});

router.put("/:id", requireRole("agencia"), async (req, res, next) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Campo obrigatório: nome" });
    const updated = await updateCampanhaNome(req.params.id, nome);
    if (!updated) return res.status(404).json({ error: "Campanha não encontrada" });
    res.json(updated);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Já existe uma campanha com este nome" });
    }
    next(err);
  }
});

router.delete("/:id", requireRole("agencia"), async (req, res, next) => {
  try {
    const deleted = await deleteCampanha(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Campanha não encontrada" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Vincula um veículo a uma campanha com plataformas específicas e tipo de mídia
router.put("/:id/veiculos", requireRole("agencia"), async (req, res, next) => {
  try {
    const { vehicleId, plataformas, tipoMidia } = req.body;
    if (!vehicleId || !Array.isArray(plataformas)) {
      return res.status(400).json({ error: "Campos obrigatórios: vehicleId, plataformas (array)" });
    }
    const result = await upsertCampanhaVeiculo(req.params.id, vehicleId, plataformas, tipoMidia);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Remove vínculo veículo de campanha
router.delete("/veiculos/:vinculoId", requireRole("agencia"), async (req, res, next) => {
  try {
    const deleted = await deleteCampanhaVeiculo(req.params.vinculoId);
    if (!deleted) return res.status(404).json({ error: "Vínculo não encontrado" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
