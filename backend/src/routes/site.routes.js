import { Router } from "express";
import { getSiteSummary } from "../services/siteService.js";
import { parseRange } from "../utils/dateRange.js";
import { scopeVeiculoFilter, scopeCampanhaFilter } from "../utils/scopeFilter.js";

const router = Router();

router.get("/summary", async (req, res, next) => {
  try {
    const { start, end, campanha, veiculo } = parseRange(req.query);
    const veiculoEscopo = scopeVeiculoFilter(req.user, veiculo);
    const campanhaEscopo = scopeCampanhaFilter(req.user, campanha);
    res.json(await getSiteSummary(start, end, campanhaEscopo, veiculoEscopo));
  } catch (err) {
    next(err);
  }
});

export default router;
