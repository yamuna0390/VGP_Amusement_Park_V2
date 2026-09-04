const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(adminMiddleware);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex") + "-" + Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and WebP are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded or invalid file type." });
  }

  // Return the relative path to be stored in the DB
  const filePath = `/uploads/${req.file.filename}`;
  
  res.status(200).json({
    success: true,
    url: filePath,
  });
});

const fs = require("fs");

const rideStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const slug = req.params.slug;
    // ensure safe slug
    const safeSlug = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase();
    const destDir = path.join(__dirname, "../uploads/rides", safeSlug);
    fs.mkdirSync(destDir, { recursive: true });
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(4).toString("hex") + "-" + Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    // determine prefix based on fieldname or query
    const prefix = req.query.type === 'gallery' ? 'gallery' : 'main';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

const uploadRide = multer({
  storage: rideStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/ride/:slug", (req, res) => {
  uploadRide.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: "Image is too large. Maximum size is 5 MB." });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      // Handles the fileFilter error
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded or invalid file type." });
    }
    
    const safeSlug = req.params.slug.replace(/[^a-z0-9-]/gi, "").toLowerCase();
    const filePath = `/uploads/rides/${safeSlug}/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      url: filePath,
    });
  });
});

const videoFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["video/mp4", "video/webm"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4 and WebM are allowed."));
  }
};

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(__dirname, "../uploads/video");
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(4).toString("hex") + "-" + Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `hero-${uniqueSuffix}${ext}`);
  }
});

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

router.post("/video/homepage", (req, res) => {
  uploadVideo.single("video")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: "Video is too large. Maximum size is 50 MB." });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video uploaded or invalid file type." });
    }

    const filePath = `/uploads/video/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      url: filePath,
    });
  });
});

module.exports = router;
