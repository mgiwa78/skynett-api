import { Request, Response } from "express";
import { FAQService } from "@services/faq.service";

export class FAQController {
  private faqService: FAQService;

  constructor() {
    this.faqService = new FAQService();
  }

  createFAQ = async (req: Request, res: Response): Promise<Response> => {
    try {
      const faq = await this.faqService.createFAQ(req.body);
      return res.status(201).json(faq);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create FAQ", error: err.message });
    }
  };

  getFAQById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const faq = await this.faqService.getFAQById(req.params.id);
      if (!faq) return res.status(404).json({ message: "FAQ not found" });

      return res.status(200).json(faq);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch FAQ", error: err.message });
    }
  };

  getAllFAQs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const faqs = await this.faqService.getAllFAQs();
      return res.status(200).json(faqs);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch FAQs", error: err.message });
    }
  };

  updateFAQ = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updatedFAQ = await this.faqService.updateFAQ(
        req.params.id,
        req.body
      );
      if (!updatedFAQ)
        return res.status(404).json({ message: "FAQ not found" });

      return res.status(200).json(updatedFAQ);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update FAQ", error: err.message });
    }
  };

  deleteFAQ = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.faqService.deleteFAQ(req.params.id);
      if (!result) return res.status(404).json({ message: "FAQ not found" });

      return res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete FAQ", error: err.message });
    }
  };
}
