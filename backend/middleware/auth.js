const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protège les routes : vérifie si l'utilisateur est authentifié via JWT
 */
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Vous n'êtes pas connecté." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ message: "L'utilisateur n'existe plus." });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

/**
 * Restriction par rôle (RBAC)
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Action non autorisée pour ce profil." });
    }
    next();
  };
};
