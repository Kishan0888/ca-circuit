export const storageService = {
  // Upload single image
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();

      return data.secure_url;
    } catch (error: any) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  },

  // Upload multiple images
  async uploadImages(files: File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  },

  // Upload document
  async uploadDocument(file: File): Promise<string> {
    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Document upload failed");
      }

      const data = await response.json();

      return data.secure_url;
    } catch (error: any) {
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  },

  // Upload multiple documents
  async uploadDocuments(files: File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadDocument(file)));
  },

  // Delete (Cloudinary unsigned uploads can't be deleted directly from frontend)
  async deleteFile(): Promise<void> {
    console.warn("Delete operation is not supported with unsigned Cloudinary uploads.");
  },

  async deleteFiles(): Promise<void> {
    console.warn("Delete operation is not supported with unsigned Cloudinary uploads.");
  },

  // Get file extension
  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  },

  // Validate image file
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size exceeds 5MB limit.",
      };
    }

    return { valid: true };
  },

  // Validate document file
  validateDocumentFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Invalid file type. Only PDF and Word documents are allowed.",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size exceeds 10MB limit.",
      };
    }

    return { valid: true };
  },
};