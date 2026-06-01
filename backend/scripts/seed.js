const connectDB = require("../config/db");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const Chapter = require("../models/Chapter");
const Quiz = require("../models/Quiz");

async function seed() {
  try {
    await connectDB();

    console.log("Purge des collections...");
    await Promise.all([
      Course.deleteMany({}),
      Chapter.deleteMany({}),
      Quiz.deleteMany({}),
    ]);

    console.log("Création d'un cours exemple...");
    const course = await Course.create({
      title: "Introduction à Node.js",
      description: "Apprenez les bases de Node.js et développez des APIs.",
      category: "Development",
      level: "débutant",
    });

    console.log("Ajout des chapitres...");
    const chaptersData = [
      {
        course: course._id,
        title: "Présentation et installation",
        content: "Contenu du chapitre 1",
        order: 1,
      },
      {
        course: course._id,
        title: "Modules et npm",
        content: "Contenu du chapitre 2",
        order: 2,
      },
      {
        course: course._id,
        title: "Express et APIs",
        content: "Contenu du chapitre 3",
        order: 3,
      },
    ];

    const chapters = await Chapter.insertMany(chaptersData);

    console.log("Création d'un quiz pour le chapitre 1...");
    const quiz = await Quiz.create({
      title: "Quiz Chapitre 1",
      course: course._id,
      chapter: chapters[0]._id,
      questions: [
        {
          text: "Quel est le gestionnaire de paquets pour Node.js?",
          type: "single",
          options: ["pip", "npm", "composer"],
          answer: "npm",
          points: 2,
        },
        {
          text: "Quels sont les modules fournis par défaut? (choix multiple)",
          type: "multiple",
          options: ["fs", "http", "requests", "express"],
          answer: ["fs", "http"],
          points: 3,
        },
        {
          text: "Combien de bits dans un octet?",
          type: "single",
          answer: 8,
          tolerance: 0,
          points: 1,
        },
      ],
    });

    // lier le quiz au chapitre
    chapters[0].quiz = quiz._id;
    await chapters[0].save();

    // mettre à jour la liste des chapitres dans le cours
    course.chapters = chapters.map((c) => c._id);
    await course.save();

    console.log("Seed terminé.");
    console.log("CourseId:", course._id.toString());
    console.log(
      "ChapterIds:",
      chapters.map((c) => c._id.toString()),
    );
    console.log("QuizId:", quiz._id.toString());

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Erreur seed:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
