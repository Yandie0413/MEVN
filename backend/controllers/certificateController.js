const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Certificate = require("../models/Certificate");
const Progress = require("../models/Progress");
const { issueCertificateIfNeeded } = require("./quizController");
const pdfService = require("../services/pdfService");

exports.getCertificates = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.courseId) filter.course = req.query.courseId;
    const certificates = await Certificate.find(filter).populate("course");
    res.json(certificates);
  } catch (error) {
    next(error);
  }
};

exports.getCertificateById = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate(
      "course",
    );
    if (!certificate) {
      return res.status(404).json({ message: "Certificat non trouvé" });
    }
    res.json(certificate);
  } catch (error) {
    next(error);
  }
};

exports.createCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.create(req.body);
    res.status(201).json(certificate);
  } catch (error) {
    next(error);
  }
};

exports.updateCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" },
    );
    if (!certificate) {
      return res.status(404).json({ message: "Certificat non trouvé" });
    }
    res.json(certificate);
  } catch (error) {
    next(error);
  }
};

exports.downloadCertificatePdf = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate(
      "course",
    );
    if (!certificate) {
      return res.status(404).json({ message: "Certificat non trouvé" });
    }
    // If a stored PDF exists, send it directly
    if (certificate.pdfPath && fs.existsSync(certificate.pdfPath)) {
      return res.sendFile(path.resolve(certificate.pdfPath));
    }

    // Otherwise generate, store and send
    try {
      const { filePath, filename } =
        await pdfService.generateCertificatePdf(certificate);
      certificate.pdfPath = filePath;
      certificate.pdfUrl = `/storage/certificates/${filename}`;
      await certificate.save();
      return res.sendFile(path.resolve(filePath));
    } catch (err) {
      // Fallback: generate PDF in-memory
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="certificat-${certificate._id}.pdf"`,
        );
        res.send(pdfBuffer);
      });

      doc.fontSize(24).text("Certificat de réussite", { align: "center" });
      doc.moveDown(2);
      doc.fontSize(14).text(`Utilisateur : ${certificate.userId}`);
      doc.text(`Cours : ${certificate.course?.title || certificate.course}`);
      doc.text(`Note : ${certificate.score} %`);
      doc.text(`Mention : ${certificate.grade}`);
      doc.text(`Émis le : ${certificate.issuedAt.toLocaleDateString("fr-FR")}`);
      doc.moveDown();
      doc
        .fontSize(12)
        .text(
          "Ce document atteste que l'utilisateur a validé le cours avec succès.",
          { align: "justify" },
        );
      doc.moveDown(2);
      doc
        .fontSize(10)
        .text("Merci d'avoir utilisé la plateforme de formation en ligne.");

      doc.end();
    }
  } catch (error) {
    next(error);
  }
};

exports.regenerateCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificat non trouvé" });
    }

    const progress = await Progress.findOne({
      userId: certificate.userId,
      course: certificate.course,
    });

    if (!progress) {
      return res
        .status(404)
        .json({ message: "Aucune progression trouvée pour ce certificat" });
    }

    const updated = await issueCertificateIfNeeded({
      userId: certificate.userId,
      courseId: certificate.course,
      progress,
    });

    if (!updated) {
      certificate.status = "en attente";
      certificate.grade = "";
      certificate.score = 0;
      await certificate.save();
      return res.json({
        message: "Certificat non attribué après régénération",
        certificate,
      });
    }

    return res.json({ message: "Certificat régénéré", certificate: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificat non trouvé" });
    }
    res.json({ message: "Certificat supprimé" });
  } catch (error) {
    next(error);
  }
};

exports.cleanupExpiredPdfs = async (req, res, next) => {
  try {
    const TTL_DAYS = parseInt(process.env.PDF_TTL_DAYS || "30", 10);
    const cutoff = Date.now() - TTL_DAYS * 24 * 60 * 60 * 1000;
    const storageDir = require("path").resolve(
      __dirname,
      "..",
      "storage",
      "certificates",
    );
    const files = require("fs").readdirSync(storageDir);
    let deleted = 0;

    for (const f of files) {
      try {
        const full = require("path").join(storageDir, f);
        const stat = require("fs").statSync(full);
        if (stat.mtimeMs < cutoff) {
          require("fs").unlinkSync(full);
          // unset DB references
          await Certificate.updateMany(
            { pdfPath: full },
            { $set: { pdfPath: "", pdfUrl: "" } },
          );
          deleted++;
        }
      } catch (err) {
        console.error("cleanup file error", f, err.message || err);
      }
    }

    res.json({ message: "Cleanup done", deleted });
  } catch (err) {
    next(err);
  }
};
