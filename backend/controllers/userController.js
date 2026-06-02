const crypto = require("crypto");
const User = require("../models/User");

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    const passwordHash = password
      ? crypto.createHash("sha256").update(password).digest("hex")
      : "";

    const user = await User.create({
      name: name || "",
      email,
      role: role || "user",
      passwordHash,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id name email role",
    );
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};
