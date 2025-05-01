import { Router } from "express";
import { FeedbackController } from "@controllers/feedback-controller";

const feedbackRouter = Router();
const feedbackController = new FeedbackController();

feedbackRouter.post("/", feedbackController.createFeedback);
feedbackRouter.get("/", feedbackController.getAllFeedbacks);
feedbackRouter.get("/:id", feedbackController.getFeedbackById);
feedbackRouter.put("/:id", feedbackController.updateFeedback);
feedbackRouter.delete("/:id", feedbackController.deleteFeedback);

export default feedbackRouter;
