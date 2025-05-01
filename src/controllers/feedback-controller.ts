import { Request, Response } from "express";
import { FeedbackService } from "@services/feedback-service";

export class FeedbackController {
  private feedbackService: FeedbackService;

  constructor() {
    this.feedbackService = new FeedbackService();
  }

  createFeedback = async (req: Request, res: Response): Promise<Response> => {
    try {
      const feedback = await this.feedbackService.createFeedback(req.body);
      return res.status(201).json(feedback);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create Feedback", error: err.message });
    }
  };

  getFeedbackById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const feedback = await this.feedbackService.getFeedbackById(
        parseInt(req.params.id)
      );
      if (!feedback)
        return res.status(404).json({ message: "Feedback not found" });

      return res.status(200).json(feedback);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch Feedback", error: err.message });
    }
  };

  getAllFeedbacks = async (req: Request, res: Response): Promise<Response> => {
    try {
      const feedbacks = await this.feedbackService.getAllFeedbacks();
      return res.status(200).json(feedbacks);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch Feedbacks", error: err.message });
    }
  };

  updateFeedback = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedFeedback = await this.feedbackService.updateFeedback(
        parseInt(req.params.id),
        req.body
      );
      if (!updatedFeedback)
        return res.status(404).json({ message: "Feedback not found" });

      return res.status(200).json(updatedFeedback);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update Feedback", error: err.message });
    }
  };

  deleteFeedback = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.feedbackService.deleteFeedback(
        parseInt(req.params.id)
      );
      if (!result)
        return res.status(404).json({ message: "Feedback not found" });

      return res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete Feedback", error: err.message });
    }
  };
}
