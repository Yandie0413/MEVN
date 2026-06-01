const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const STORAGE_DIR = path.resolve(__dirname, "..", "storage", "certificates");
fs.mkdirSync(STORAGE_DIR, { recursive: true });

async function generateCertificatePdf(certificate) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `certificat-${certificate._id}.pdf`;
      const filePath = path.join(STORAGE_DIR, filename);
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc.fontSize(24).text("Certificat de réussite", { align: "center" });
      doc.moveDown(2);
      doc.fontSize(14).text(`Utilisateur : ${certificate.userId}`);
      doc.text(`Cours : ${certificate.course?.title || certificate.course}`);
      doc.text(`Note : ${certificate.score} %`);
      doc.text(`Mention : ${certificate.grade}`);
      doc.text(
        `Émis le : ${new Date(certificate.issuedAt).toLocaleDateString("fr-FR")}`,
      );
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

      stream.on("finish", () => resolve({ filePath, filename }));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateCertificatePdf };
