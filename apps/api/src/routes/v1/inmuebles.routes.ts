import { Router } from "express";
import { inmuebleController } from "../../controllers/inmueble.controller";
import { authenticateGateway, requireRole } from "../../gateway/middlewares/auth.middleware";

const router = Router();

router.get("/", inmuebleController.getAll.bind(inmuebleController));
router.get("/disponibles", inmuebleController.getInmueblesDisponibles.bind(inmuebleController));
router.get("/:id", inmuebleController.getById.bind(inmuebleController));

router.post(
  "/",
  authenticateGateway,
  requireRole("locador"),
  inmuebleController.create.bind(inmuebleController)
);

router.put(
  "/:id",
  authenticateGateway,
  requireRole("locador"),
  inmuebleController.update.bind(inmuebleController)
);

router.delete(
  "/:id",
  authenticateGateway,
  requireRole("locador"),
  inmuebleController.delete.bind(inmuebleController)
);

export default router;

