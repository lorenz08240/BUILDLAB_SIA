const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// API to get parts by category
app.get("/api/parts/:category", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pc_parts WHERE category = ?", [
      req.params.category,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
