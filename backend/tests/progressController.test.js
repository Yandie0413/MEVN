jest.mock("../models/Chapter");
jest.mock("../models/Progress");

const Chapter = require("../models/Chapter");
const Progress = require("../models/Progress");
const { createOrUpdateProgress } = require("../controllers/progressController");

describe("progressController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("createOrUpdateProgress refuse un chapitre qui n'appartient pas au cours", async () => {
    Chapter.findById.mockResolvedValue({ course: "courseA", _id: "chapter1" });

    const req = {
      body: { userId: "user1", courseId: "courseB", chapterId: "chapter1" },
    };
    const res = createMockRes();
    await createOrUpdateProgress(req, res, jest.fn());

    expect(Chapter.findById).toHaveBeenCalledWith("chapter1");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Le chapitre n'appartient pas à ce cours",
    });
  });

  test("createOrUpdateProgress ajoute ou met à jour une progression valide", async () => {
    Chapter.findById.mockResolvedValue({ course: "courseA", _id: "chapter1" });
    Progress.findOneAndUpdate.mockResolvedValue({
      userId: "user1",
      course: "courseA",
      completedChapters: ["chapter1"],
      updatedAt: new Date(),
    });

    const req = {
      body: { userId: "user1", courseId: "courseA", chapterId: "chapter1" },
    };
    const res = createMockRes();
    await createOrUpdateProgress(req, res, jest.fn());

    expect(Progress.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: "user1", course: "courseA" },
      {
        $addToSet: { completedChapters: "chapter1" },
        updatedAt: expect.any(Date),
      },
      { new: true, upsert: true },
    );
    expect(res.json).toHaveBeenCalledWith({
      userId: "user1",
      course: "courseA",
      completedChapters: ["chapter1"],
      updatedAt: expect.any(Date),
    });
  });
});
