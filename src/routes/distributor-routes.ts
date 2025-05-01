import { Router } from "express";
import { DistributorController } from "@controllers/distributor-controller";

const router = Router();
const distributorController = new DistributorController();

router.post("/", distributorController.createDistributor);
router.get("/", distributorController.getAllDistributors);
router.get("/:id", distributorController.getDistributorById);
router.put("/:id", distributorController.updateDistributor);
router.delete("/:id", distributorController.deleteDistributor);

export default router;
