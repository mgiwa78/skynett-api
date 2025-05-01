import { Router } from "express";
import { FAQController } from "@controllers/faq-controller";

const router = Router();
const faqController = new FAQController();

router.post("/", faqController.createFAQ);
router.get("/", faqController.getAllFAQs);
router.get("/:id", faqController.getFAQById);
router.put("/:id", faqController.updateFAQ);
router.delete("/:id", faqController.deleteFAQ);

export default router;
