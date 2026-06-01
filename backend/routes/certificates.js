const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");

router.get("/", certificateController.getCertificates);
router.get("/:id", certificateController.getCertificateById);
router.get("/:id/download", certificateController.downloadCertificatePdf);
router.post("/:id/regenerate", certificateController.regenerateCertificate);
router.post("/cleanup", certificateController.cleanupExpiredPdfs);
router.post("/", certificateController.createCertificate);
router.put("/:id", certificateController.updateCertificate);
router.delete("/:id", certificateController.deleteCertificate);

module.exports = router;
