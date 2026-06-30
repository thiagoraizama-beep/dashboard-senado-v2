import { Router } from "express";
import { getFilterOptions, getSummary, getCategoriesBreakdown } from "../services/offlineMediaService.js";
import { scopeVeiculoFilter, scopeCampanhaFilter, temAcessoTipoMidia } from "../utils/scopeFilter.js";

const router = Router();

// Bloqueia o acesso de usuarios "veiculo"/"parceiro" que nao tem nenhum
// vinculo de midia offline (ex: trabalham so online numa campanha).
router.use((req, res, next) => {
  if (!temAcessoTipoMidia(req.user, "offline")) {
    return res.status(403).json({ error: "Sem acesso a mídia offline" });
  }
  next();
});

function parseFilters(req) {
  return {
    categoria: req.query.categoria || null,
    praca: req.query.praca || null,
    veiculo: scopeVeiculoFilter(req.user, req.query.veiculo || null),
    campanha: scopeCampanhaFilter(req.user, req.query.campanha || null),
  };
}

router.get("/filter-options", async (_req, res, next) => {
  try {
    res.json(await getFilterOptions());
  } catch (err) {
    next(err);
  }
});

router.get("/summary", async (req, res, next) => {
  try {
    res.json(await getSummary(parseFilters(req)));
  } catch (err) {
    next(err);
  }
});

router.get("/categories", async (req, res, next) => {
  try {
    res.json(await getCategoriesBreakdown(parseFilters(req)));
  } catch (err) {
    next(err);
  }
});

export default router;
