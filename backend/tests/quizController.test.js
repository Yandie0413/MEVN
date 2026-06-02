jest.mock("../models/Course");
jest.mock("../models/Certificate");
jest.mock("../models/Quiz");
jest.mock("../models/Progress");
jest.mock("../models/User");

const Course = require("../models/Course");
const Certificate = require("../models/Certificate");
const Quiz = require("../models/Quiz");
const Progress = require("../models/Progress");
const User = require("../models/User");
const {
  calculateQuizResult,
  issueCertificateIfNeeded,
  submitQuiz,
} = require("../controllers/quizController");

describe("logique métier quizController", () => {
  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.CERT_THRESHOLD;
    delete process.env.COMPLETION_THRESHOLD;
  });

  test("calculateQuizResult donne un score partiel pour une question multiple", () => {
    const quiz = {
      questions: [
        {
          _id: "q1",
          text: "Choix multiple",
          type: "multiple",
          answer: ["a", "b"],
          points: 4,
        },
      ],
    };

    const result = calculateQuizResult(quiz, { q1: ["a", "x"] });

    expect(result.score).toBe(1);
    expect(result.total).toBe(4);
    expect(result.details[0].awarded).toBe(1);
    expect(result.details[0].correct).toBe(false);
  });

  test("calculateQuizResult gère une réponse numérique avec tolérance", () => {
    const quiz = {
      questions: [
        {
          _id: "q1",
          text: "Nombre",
          type: "single",
          answer: 10,
          tolerance: 0.5,
          points: 5,
        },
      ],
    };

    const result = calculateQuizResult(quiz, { q1: "9.7" });

    expect(result.score).toBe(5);
    expect(result.details[0].correct).toBe(true);
  });

  test("issueCertificateIfNeeded retourne null si le taux de complétion est insuffisant", async () => {
    Course.findById.mockResolvedValue({
      chapters: ["c1", "c2", "c3", "c4", "c5"],
    });
    const progress = {
      completedChapters: ["c1", "c2", "c3"],
      quizAttempts: [{ score: 10, total: 10 }],
    };

    const result = await issueCertificateIfNeeded({
      userId: "user1",
      courseId: "course1",
      progress,
    });

    expect(result).toBeNull();
  });

  test("issueCertificateIfNeeded retourne null si le score moyen est inférieur au seuil", async () => {
    Course.findById.mockResolvedValue({
      chapters: ["c1", "c2", "c3", "c4", "c5"],
    });
    const progress = {
      completedChapters: ["c1", "c2", "c3", "c4", "c5"],
      quizAttempts: [{ score: 5, total: 10 }],
    };

    const result = await issueCertificateIfNeeded({
      userId: "user1",
      courseId: "course1",
      progress,
    });

    expect(result).toBeNull();
  });

  test("issueCertificateIfNeeded crée un certificat quand les seuils sont atteints", async () => {
    Course.findById.mockResolvedValue({
      chapters: ["c1", "c2", "c3", "c4", "c5"],
    });
    Certificate.findOne.mockResolvedValue(null);
    Certificate.create.mockResolvedValue({
      user: "user1",
      course: "course1",
      score: 80,
      status: "attribué",
      grade: "Très bien",
    });

    const progress = {
      completedChapters: ["c1", "c2", "c3", "c4"],
      quizAttempts: [
        { score: 8, total: 10 },
        { score: 8, total: 10 },
      ],
    };

    const result = await issueCertificateIfNeeded({
      userId: "user1",
      courseId: "course1",
      progress,
    });

    expect(result).toEqual({
      user: "user1",
      course: "course1",
      score: 80,
      status: "attribué",
      grade: "Très bien",
    });
    expect(Certificate.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user: "user1",
        course: "course1",
        score: 80,
        status: "attribué",
        grade: "Très bien",
      }),
    );
  });

  test("issueCertificateIfNeeded met à jour un certificat existant", async () => {
    Course.findById.mockResolvedValue({
      chapters: ["c1", "c2", "c3", "c4", "c5"],
    });
    const existingCertificate = {
      userId: "user1",
      course: "course1",
      score: 70,
      status: "en attente",
      grade: "Bien",
      save: jest.fn().mockResolvedValue(true),
    };

    Certificate.findOne.mockResolvedValue(existingCertificate);

    const progress = {
      completedChapters: ["c1", "c2", "c3", "c4"],
      quizAttempts: [
        { score: 10, total: 10 },
        { score: 9, total: 10 },
      ],
    };

    const result = await issueCertificateIfNeeded({
      userId: "user1",
      courseId: "course1",
      progress,
    });

    expect(result).toBe(existingCertificate);
    expect(existingCertificate.score).toBe(95);
    expect(existingCertificate.status).toBe("attribué");
    expect(existingCertificate.grade).toBe("Excellent");
    expect(existingCertificate.save).toHaveBeenCalled();
  });

  test("submitQuiz refuse la soumission si le chapitre lié n'est pas terminé", async () => {
    const req = {
      params: { id: "quiz1" },
      body: { userId: "user1", answers: { q1: "a" } },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    Quiz.findById.mockResolvedValue({
      _id: "quiz1",
      course: "course1",
      chapter: "chapter1",
      questions: [],
    });
    User.findById.mockResolvedValue({ _id: "user1" });
    Progress.findOne.mockResolvedValue({
      user: "user1",
      course: "course1",
      completedChapters: [],
      quizAttempts: [],
    });

    await submitQuiz(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Impossible de soumettre ce quiz avant d'avoir terminé le chapitre",
    });
  });
});
