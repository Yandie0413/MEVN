const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
