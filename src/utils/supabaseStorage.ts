import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import path from "path";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter(_req, file, cb) {
    file.filename = `IMG${Date.now()}${path.extname(file.originalname)}`;
    cb(null, true);
  },
}).single("image");

export const uploadDoc = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter(_req, file, cb) {
    file.filename = `DOC${Date.now()}${path.extname(file.originalname)}`;
    cb(null, true);
  },
}).single("document");

export const handleUpload = (req: any, res: any, next: any) => {
  upload(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File details::", {
      size: req.file.size,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer?.length || 0,
      fileName: req.file.originalname,
    });

    next();
  });
};

export const handleUploadDoc = (req: any, res: any, next: any) => {
  uploadDoc(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File details::", {
      size: req.file.size,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer?.length || 0,
      fileName: req.file.originalname,
    });

    next();
  });
};

export async function uploadToSupabase(file: Express.Multer.File) {
  // Validate file exists
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate buffer exists and has content
  if (!file.buffer || !(file.buffer instanceof Buffer)) {
    throw new Error(`Invalid file buffer:: ${file.originalname}`);
  }

  const fileName = `IMG${Date.now()}${path.extname(file.originalname)}`;
  const filePath = `observations/${fileName}`;

  console.log("Upload details::", {
    fileName,
    filePath,
    mimeType: file.mimetype,
    size: file.buffer.length,
  });

  try {
    const { data, error } = await supabase.storage
      .from("assets")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    console.log("data upload::", data);
    console.log("error upload::", error);

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("assets").getPublicUrl(filePath);

    console.log("return data upload::", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export async function uploadToSupabaseDoc(file: Express.Multer.File) {
  // Validate file exists
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate buffer exists and has content
  if (!file.buffer || !(file.buffer instanceof Buffer)) {
    throw new Error(`Invalid file buffer:: ${file.originalname}`);
  }

  const fileName = `DOC${Date.now()}${path.extname(file.originalname)}`;
  const filePath = `reports/${fileName}`;

  console.log("Upload details::", {
    fileName,
    filePath,
    mimeType: file.mimetype,
    size: file.buffer.length,
  });

  try {
    const { data, error } = await supabase.storage
      .from("assets")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    console.log("data upload::", data);
    console.log("error upload::", error);

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("assets").getPublicUrl(filePath);

    console.log("return data upload::", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

// region doc

export async function deleteFromSupabaseDoc(docUrl: string) {
  try {
    // Extract file path from URL
    const urlParts = docUrl.split("/");

    const filePath = urlParts[urlParts.length - 1];

    console.log("URL parts delete::", filePath);

    const { data, error } = await supabase.storage
      .from("assets")
      .remove([`reports/${filePath}`]);

    if (error) {
      console.error("Delete error::", error);
      throw error;
    }

    console.log("return data delete::", data);

    return data;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
}

export async function replaceImageInSupabaseDoc(
  oldDocUrl: string,
  newDoc: Express.Multer.File
) {
  try {
    // Delete old image
    await deleteFromSupabaseDoc(oldDocUrl);

    // Upload new image
    return uploadToSupabaseDoc(newDoc);
  } catch (error) {
    console.error("Replace image failed:", error);
    throw error;
  }
}

// endregion

export async function deleteFromSupabase(imageUrl: string) {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split("/");

    const filePath = urlParts[urlParts.length - 1];

    console.log("URL parts delete::", filePath);

    const { data, error } = await supabase.storage
      .from("assets")
      .remove([`observations/${filePath}`]);

    if (error) {
      console.error("Delete error::", error);
      throw error;
    }

    console.log("return data delete::", data);

    return data;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
}

export async function replaceImageInSupabase(
  oldImageUrl: string,
  newImage: Express.Multer.File
) {
  try {
    // Delete old image
    await deleteFromSupabase(oldImageUrl);

    // Upload new image
    return uploadToSupabase(newImage);
  } catch (error) {
    console.error("Replace image failed:", error);
    throw error;
  }
}
