import { Request, Response } from "express";
import { DistributorService } from "../services/distributor.service";

export class DistributorController {
  private distributorService: DistributorService;

  constructor() {
    this.distributorService = new DistributorService();
  }

  createDistributor = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const distributor = await this.distributorService.createDistributor(
        req.body
      );
      return res.status(201).json(distributor);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to create distributor", error: err.message });
    }
  };

  getDistributorById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const distributor = await this.distributorService.getDistributorById(
        req.params.id
      );
      if (!distributor)
        return res.status(404).json({ message: "Distributor not found" });

      return res.status(200).json(distributor);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch distributor", error: err.message });
    }
  };

  getAllDistributors = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const distributors = await this.distributorService.getAllDistributors();
      return res.status(200).json(distributors);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to fetch distributors", error: err.message });
    }
  };

  updateDistributor = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const updatedDistributor =
        await this.distributorService.updateDistributor(
          req.params.id,
          req.body
        );
      if (!updatedDistributor)
        return res.status(404).json({ message: "Distributor not found" });

      return res.status(200).json(updatedDistributor);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to update distributor", error: err.message });
    }
  };

  deleteDistributor = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const result = await this.distributorService.deleteDistributor(
        req.params.id
      );
      if (!result)
        return res.status(404).json({ message: "Distributor not found" });

      return res
        .status(200)
        .json({ message: "Distributor deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete distributor", error: err.message });
    }
  };
}
