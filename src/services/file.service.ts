import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class FileService {
  private static readonly UPLOAD_DIR = "uploads";
  private static readonly FORM_UPLOAD_DIR = "uploads/forms";

  private static readonly ALLOWED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/jpg",
  ];

  private static readonly ALLOWED_DOCUMENT_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ];

  private static readonly ALLOWED_ALL_MIME_TYPES = [
    ...this.ALLOWED_IMAGE_MIME_TYPES,
    ...this.ALLOWED_DOCUMENT_MIME_TYPES,
  ];

  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  static async saveImage(base64String: string): Promise<string> {
    return this.saveFile(
      base64String,
      this.UPLOAD_DIR,
      this.ALLOWED_IMAGE_MIME_TYPES
    );
  }

  static async saveFormFile(
    base64String: string,
    allowedTypes: string[] = this.ALLOWED_ALL_MIME_TYPES,
    maxSize: number = this.MAX_FILE_SIZE
  ): Promise<string> {
    return this.saveFile(
      base64String,
      this.FORM_UPLOAD_DIR,
      allowedTypes,
      maxSize
    );
  }

  static async saveFile(
    base64String: string,
    uploadDir: string = this.UPLOAD_DIR,
    allowedTypes: string[] = this.ALLOWED_ALL_MIME_TYPES,
    maxSize: number = this.MAX_FILE_SIZE
  ): Promise<string> {
    const uploadDirPath = !uploadDir.includes("uploads")
      ? `${this.UPLOAD_DIR}/${uploadDir}`
      : uploadDir;
    try {
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDirPath)) {
        fs.mkdirSync(uploadDirPath, { recursive: true });
      }

      // Clean up the base64 string
      let base64Data = base64String.trim();
      let mimeType = "application/octet-stream"; // default mime type

      // Extract mime type if present
      if (base64Data.includes("data:")) {
        const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,/);
        if (matches && matches.length > 1) {
          mimeType = matches[1];
          // Remove the data URI prefix
          base64Data = base64Data.replace(/^data:([A-Za-z-+/]+);base64,/, "");
        }
      }

      // Validate mime type
      console.log(mimeType);
      if (!allowedTypes.includes(mimeType)) {
        throw new Error(
          `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
        );
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, "base64");

      // Validate file size
      if (buffer.length > maxSize) {
        throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      }

      // Generate unique filename with proper extension
      const extension = mimeType.split("/")[1] || "bin";
      const filename = `${uuidv4()}.${extension}`;
      const filepath = path.join(uploadDirPath, filename);

      // Save file
      await fs.promises.writeFile(filepath, buffer);

      // Return relative path that can be used as URL
      return `/${uploadDirPath}/${filename}`;
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  }

  static async deleteFile(filepath: string): Promise<void> {
    try {
      // Remove the leading slash and 'uploads' from the path
      const relativePath = filepath.replace(/^\/uploads\//, "");
      const absolutePath = path.join("uploads", relativePath);

      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}
