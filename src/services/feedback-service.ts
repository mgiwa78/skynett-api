import { Feedback } from "@entities/feedback";
import { PaginatedResult } from "@repositories/base-repository";
import { FeedbackRepository } from "@repositories/feedback-repository";

export class FeedbackService {
  private feedbackRepository: FeedbackRepository;

  constructor() {
    this.feedbackRepository = new FeedbackRepository();
  }

  async createFeedback(data: Partial<Feedback>): Promise<Feedback> {
    return this.feedbackRepository.createEntity(data);
  }

  async getFeedbackById(id: number): Promise<Feedback | null> {
    return this.feedbackRepository.findById(id);
  }

  async getAllFeedbacks(): Promise<PaginatedResult<Feedback>> {
    return this.feedbackRepository.findAll();
  }

  async updateFeedback(
    id: number,
    data: Partial<Feedback>
  ): Promise<Feedback | null> {
    return this.feedbackRepository.updateEntity(id, data);
  }

  async deleteFeedback(id: number): Promise<boolean> {
    return this.feedbackRepository.deleteEntity(id);
  }
}
