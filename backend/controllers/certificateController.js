const PDFDocument = require("pdfkit");
const Certificate = require("../models/Certificate");
const Progress = require("../models/Progress");
const { issueCertificateIfNeeded } = require("./quizController");

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
      { new: true },
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
