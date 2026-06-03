const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");
const { protect, restrictTo } = require("../middleware/auth");

router.get("/", protect, certificateController.getCertificates);
router.get("/:id", protect, certificateController.getCertificateById);
router.get(
  "/:id/download",
  protect,
  certificateController.downloadCertificatePdf,
);
router.post(
  "/:id/regenerate",
  protect,
  restrictTo("admin"),
  certificateController.regenerateCertificate,
);
router.post(
  "/cleanup",
  protect,
  restrictTo("admin"),
  certificateController.cleanupExpiredPdfs,
);
router.post(
  "/",
  protect,
  restrictTo("admin"),
  certificateController.createCertificate,
);
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  certificateController.updateCertificate,
);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  certificateController.deleteCertificate,
);

module.exports = router;
