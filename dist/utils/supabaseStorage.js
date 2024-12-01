"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadDoc = exports.handleUpload = exports.uploadDoc = exports.upload = void 0;
exports.uploadToSupabase = uploadToSupabase;
exports.uploadToSupabaseDoc = uploadToSupabaseDoc;
exports.deleteFromSupabaseDoc = deleteFromSupabaseDoc;
exports.replaceImageInSupabaseDoc = replaceImageInSupabaseDoc;
exports.deleteFromSupabase = deleteFromSupabase;
exports.replaceImageInSupabase = replaceImageInSupabase;
const supabase_js_1 = require("@supabase/supabase-js");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter(_req, file, cb) {
        file.filename = `IMG${Date.now()}${path_1.default.extname(file.originalname)}`;
        cb(null, true);
    },
}).single("image");
exports.uploadDoc = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter(_req, file, cb) {
        file.filename = `DOC${Date.now()}${path_1.default.extname(file.originalname)}`;
        cb(null, true);
    },
}).single("document");
const handleUpload = (req, res, next) => {
    (0, exports.upload)(req, res, (err) => {
        var _a;
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        console.log("File details::", {
            size: req.file.size,
            mimetype: req.file.mimetype,
            buffer: ((_a = req.file.buffer) === null || _a === void 0 ? void 0 : _a.length) || 0,
            fileName: req.file.originalname,
        });
        next();
    });
};
exports.handleUpload = handleUpload;
const handleUploadDoc = (req, res, next) => {
    (0, exports.uploadDoc)(req, res, (err) => {
        var _a;
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        console.log("File details::", {
            size: req.file.size,
            mimetype: req.file.mimetype,
            buffer: ((_a = req.file.buffer) === null || _a === void 0 ? void 0 : _a.length) || 0,
            fileName: req.file.originalname,
        });
        next();
    });
};
exports.handleUploadDoc = handleUploadDoc;
function uploadToSupabase(file) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate file exists
        if (!file) {
            throw new Error("No file provided");
        }
        // Validate buffer exists and has content
        if (!file.buffer || !(file.buffer instanceof Buffer)) {
            throw new Error(`Invalid file buffer:: ${file.originalname}`);
        }
        const fileName = `IMG${Date.now()}${path_1.default.extname(file.originalname)}`;
        const filePath = `public/${fileName}`;
        console.log("Upload details::", {
            fileName,
            filePath,
            mimeType: file.mimetype,
            size: file.buffer.length,
        });
        try {
            const { data, error } = yield supabase.storage
                .from("observations")
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
            const { data: { publicUrl }, } = supabase.storage.from("observations").getPublicUrl(filePath);
            console.log("return data upload::", publicUrl);
            return publicUrl;
        }
        catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    });
}
function uploadToSupabaseDoc(file) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate file exists
        if (!file) {
            throw new Error("No file provided");
        }
        // Validate buffer exists and has content
        if (!file.buffer || !(file.buffer instanceof Buffer)) {
            throw new Error(`Invalid file buffer:: ${file.originalname}`);
        }
        const fileName = `DOC${Date.now()}${path_1.default.extname(file.originalname)}`;
        const filePath = `public/${fileName}`;
        console.log("Upload details::", {
            fileName,
            filePath,
            mimeType: file.mimetype,
            size: file.buffer.length,
        });
        try {
            const { data, error } = yield supabase.storage
                .from("reports")
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
            const { data: { publicUrl }, } = supabase.storage.from("reports").getPublicUrl(filePath);
            console.log("return data upload::", publicUrl);
            return publicUrl;
        }
        catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    });
}
// region doc
function deleteFromSupabaseDoc(docUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Extract file path from URL
            const urlParts = docUrl.split("/");
            const filePath = urlParts[urlParts.length - 1];
            console.log("URL parts delete::", filePath);
            const { data, error } = yield supabase.storage
                .from("reports")
                .remove([`public/${filePath}`]);
            if (error) {
                console.error("Delete error::", error);
                throw error;
            }
            console.log("return data delete::", data);
            return data;
        }
        catch (error) {
            console.error("Delete failed:", error);
            throw error;
        }
    });
}
function replaceImageInSupabaseDoc(oldDocUrl, newDoc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Delete old image
            yield deleteFromSupabaseDoc(oldDocUrl);
            // Upload new image
            return uploadToSupabaseDoc(newDoc);
        }
        catch (error) {
            console.error("Replace image failed:", error);
            throw error;
        }
    });
}
// endregion
function deleteFromSupabase(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Extract file path from URL
            const urlParts = imageUrl.split("/");
            const filePath = urlParts[urlParts.length - 1];
            console.log("URL parts delete::", filePath);
            const { data, error } = yield supabase.storage
                .from("observations")
                .remove([`public/${filePath}`]);
            if (error) {
                console.error("Delete error::", error);
                throw error;
            }
            console.log("return data delete::", data);
            return data;
        }
        catch (error) {
            console.error("Delete failed:", error);
            throw error;
        }
    });
}
function replaceImageInSupabase(oldImageUrl, newImage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Delete old image
            yield deleteFromSupabase(oldImageUrl);
            // Upload new image
            return uploadToSupabase(newImage);
        }
        catch (error) {
            console.error("Replace image failed:", error);
            throw error;
        }
    });
}
