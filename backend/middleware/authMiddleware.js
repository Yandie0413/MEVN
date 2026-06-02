const mongoose = require("mongoose");
const User = require("../models/User");

const authMiddleware = {
  attachUser: async (req, res, next) => {
    const userId = req.header("x-user-id") || null;
    const email = req.header("x-user-email");
    const role = req.header("x-user-role");
    const name = req.header("x-user-name");

    if (!userId) {
      return next();
    }

    try {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        const user = await User.findById(userId).select("_id name email role");
        if (user) {
          req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }

      if (!req.user && (email || role || name)) {
        req.user = {
          id: userId,
          name,
          email,
          role,
        };
      }
    } catch (error) {
      console.error("authMiddleware.attachUser error", error.message || error);
    }

    next();
  },

  requireAuth: (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentification requise" });
    }
    next();
  },

  requireAdmin: (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit" });
    }
    next();
  },
};

module.exports = authMiddleware;
