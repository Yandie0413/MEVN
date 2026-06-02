const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const Course = require("../models/Course");
const Chapter = require("../models/Chapter");
const Progress = require("../models/Progress");
const Certificate = require("../models/Certificate");
const User = require("../models/User");

const user1 = new mongoose.Types.ObjectId();
const user2 = new mongoose.Types.ObjectId();

beforeAll(async () => {
  process.env.MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mevn-test";
  await connectDB();
  await User.create([
    {
      _id: user1,
      name: "User One",
      email: "user1@example.com",
      passwordHash: "hash1",
      role: "user",
    },
    {
      _id: user2,
      name: "User Two",
      email: "user2@example.com",
      passwordHash: "hash2",
      role: "user",
    },
  ]);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

afterEach(async () => {
  await Promise.all([
    Course.deleteMany({}),
    Chapter.deleteMany({}),
    Progress.deleteMany({}),
    Certificate.deleteMany({}),
  ]);
});

describe("API integration - reports", () => {
  test("GET /api/reports/course/:courseId retourne un rapport de progression", async () => {
    const course = await Course.create({
      title: "Cours Rapport",
      description: "Test course",
      category: "Test",
      level: "intermédiaire",
    });

    const chapters = await Chapter.insertMany([
      { course: course._id, title: "Chapitre 1", content: "a", order: 1 },
      { course: course._id, title: "Chapitre 2", content: "b", order: 2 },
      { course: course._id, title: "Chapitre 3", content: "c", order: 3 },
      { course: course._id, title: "Chapitre 4", content: "d", order: 4 },
    ]);

    course.chapters = chapters.map((c) => c._id);
    await course.save();

    await Progress.create({
      user: user1,
      course: course._id,
      completedChapters: [chapters[0]._id, chapters[1]._id, chapters[2]._id],
      quizAttempts: [
        {
          quiz: new mongoose.Types.ObjectId(),
          score: 80,
          total: 100,
          passed: true,
        },
      ],
    });

    await Progress.create({
      user: user2,
      course: course._id,
      completedChapters: [chapters[0]._id, chapters[1]._id],
      quizAttempts: [
        {
          quiz: new mongoose.Types.ObjectId(),
          score: 10,
          total: 20,
          passed: false,
        },
      ],
    });

    await Certificate.create({
      user: user1,
      course: course._id,
      score: 80,
      status: "attribué",
      grade: "Très bien",
    });

    const res = await request(app).get(`/api/reports/course/${course._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.courseId).toBe(course._id.toString());
    expect(res.body.totalChapters).toBe(4);
    expect(res.body.totalUsers).toBe(2);
    expect(res.body.certificateCount).toBe(1);
    expect(res.body.averageCompletionRate).toBe(62.5);
    expect(res.body.averageScore).toBe(75);
  });

  test("GET /api/reports/user/:userId retourne le progrès et les certificats", async () => {
    const course = await Course.create({
      title: "Cours Utilisateur",
      description: "Test course",
      category: "Test",
      level: "débutant",
      chapters: [],
    });

    const chapters = await Chapter.insertMany([
      { course: course._id, title: "Chapitre 1", content: "a", order: 1 },
      { course: course._id, title: "Chapitre 2", content: "b", order: 2 },
    ]);
    course.chapters = chapters.map((c) => c._id);
    await course.save();

    await Progress.create({
      user: user1,
      course: course._id,
      completedChapters: [chapters[0]._id],
      quizAttempts: [
        {
          quiz: new mongoose.Types.ObjectId(),
          score: 5,
          total: 10,
          passed: false,
        },
      ],
    });

    await Certificate.create({
      user: user1,
      course: course._id,
      score: 50,
      status: "en attente",
      grade: "Bien",
    });

    const res = await request(app).get(`/api/reports/user/${user1.toString()}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.userId).toBe(user1.toString());
    expect(res.body.progress).toHaveLength(1);
    expect(res.body.progress[0].completionRate).toBe(50);
    expect(res.body.certificates).toHaveLength(1);
    expect(res.body.certificates[0].status).toBe("en attente");
  });

  test("POST /api/certificates/:id/regenerate met à jour un certificat existant", async () => {
    const course = await Course.create({
      title: "Cours Regénération",
      description: "Test course",
      category: "Test",
      level: "intermédiaire",
    });

    const chapters = await Chapter.insertMany([
      { course: course._id, title: "Chapitre 1", content: "a", order: 1 },
      { course: course._id, title: "Chapitre 2", content: "b", order: 2 },
      { course: course._id, title: "Chapitre 3", content: "c", order: 3 },
      { course: course._id, title: "Chapitre 4", content: "d", order: 4 },
      { course: course._id, title: "Chapitre 5", content: "e", order: 5 },
    ]);

    course.chapters = chapters.map((c) => c._id);
    await course.save();

    const certificate = await Certificate.create({
      user: user1,
      course: course._id,
      score: 50,
      status: "en attente",
      grade: "Bien",
    });

    await Progress.create({
      user: user1,
      course: course._id,
      completedChapters: [
        chapters[0]._id,
        chapters[1]._id,
        chapters[2]._id,
        chapters[3]._id,
      ],
      quizAttempts: [
        {
          quiz: new mongoose.Types.ObjectId(),
          score: 90,
          total: 100,
          passed: true,
        },
      ],
    });

    const res = await request(app).post(
      `/api/certificates/${certificate._id}/regenerate`,
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Certificat régénéré");
    expect(res.body.certificate.status).toBe("attribué");
    expect(res.body.certificate.grade).toBe("Excellent");
    expect(res.body.certificate.score).toBe(90);
  });

  test("POST /api/progress crée une progression quand le chapitre appartient au cours", async () => {
    const course = await Course.create({
      title: "Cours Progression",
      description: "Test progress",
      category: "Test",
      level: "débutant",
    });

    const chapter = await Chapter.create({
      course: course._id,
      title: "Chapitre A",
      content: "Contenu",
      order: 1,
    });

    course.chapters = [chapter._id];
    await course.save();

    const res = await request(app).post("/api/progress").send({
      userId: user1.toString(),
      courseId: course._id,
      chapterId: chapter._id,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBe(user1.toString());
    expect(res.body.course).toBe(course._id.toString());
    expect(res.body.completedChapters).toContain(chapter._id.toString());
  });

  test("POST /api/progress refuse un chapitre qui n'appartient pas au cours", async () => {
    const courseA = await Course.create({
      title: "Cours A",
      description: "Test A",
      category: "Test",
      level: "débutant",
    });
    const courseB = await Course.create({
      title: "Cours B",
      description: "Test B",
      category: "Test",
      level: "débutant",
    });

    const chapterB = await Chapter.create({
      course: courseB._id,
      title: "Chapitre B",
      content: "Contenu",
      order: 1,
    });

    const res = await request(app).post("/api/progress").send({
      userId: user1.toString(),
      courseId: courseA._id,
      chapterId: chapterB._id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Le chapitre n'appartient pas à ce cours");
  });

  test("POST /api/quizzes/:id/submit refuse la soumission si le chapitre n'est pas terminé", async () => {
    const course = await Course.create({
      title: "Cours Quiz",
      description: "Test quiz",
      category: "Test",
      level: "débutant",
    });

    const chapter = await Chapter.create({
      course: course._id,
      title: "Chapitre Quiz",
      content: "Contenu",
      order: 1,
    });

    const quiz = await request(app)
      .post("/api/quizzes")
      .send({
        title: "Quiz Test",
        course: course._id,
        chapter: chapter._id,
        questions: [
          {
            text: "Question 1",
            type: "single",
            answer: "a",
            points: 10,
          },
        ],
      });

    expect(quiz.statusCode).toBe(201);

    const res = await request(app)
      .post(`/api/quizzes/${quiz.body._id}/submit`)
      .send({
        userId: user1.toString(),
        answers: { [quiz.body.questions[0]._id]: "a" },
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Impossible de soumettre ce quiz avant d'avoir terminé le chapitre",
    );
  });

  test("POST /api/quizzes/:id/submit crée un quizAttempt et génère un certificat si les seuils sont atteints", async () => {
    const course = await Course.create({
      title: "Cours Certification",
      description: "Test cert",
      category: "Test",
      level: "intermédiaire",
    });

    const chapters = await Chapter.insertMany([
      { course: course._id, title: "Chapitre 1", content: "a", order: 1 },
      { course: course._id, title: "Chapitre 2", content: "b", order: 2 },
      { course: course._id, title: "Chapitre 3", content: "c", order: 3 },
      { course: course._id, title: "Chapitre 4", content: "d", order: 4 },
    ]);

    course.chapters = chapters.map((c) => c._id);
    await course.save();

    await Progress.create({
      user: user1,
      course: course._id,
      completedChapters: chapters.map((c) => c._id),
      quizAttempts: [],
    });

    const quizRes = await request(app)
      .post("/api/quizzes")
      .send({
        title: "Quiz Certif",
        course: course._id,
        chapter: chapters[0]._id,
        questions: [
          {
            text: "Question 1",
            type: "single",
            answer: "a",
            points: 10,
          },
        ],
      });

    expect(quizRes.statusCode).toBe(201);

    const res = await request(app)
      .post(`/api/quizzes/${quizRes.body._id}/submit`)
      .send({
        userId: user1.toString(),
        answers: { [quizRes.body.questions[0]._id]: "a" },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.passed).toBe(true);
    expect(res.body.certificate).not.toBeNull();
    expect(res.body.certificate.grade).toBe("Excellent");
    expect(res.body.certificate.score).toBe(100);
  });
});
