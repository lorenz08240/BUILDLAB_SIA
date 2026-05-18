const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// API to get all parts grouped by category
app.get("/api/parts", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pc_parts");
    const componentsData = {};
    rows.forEach(row => {
      if (!componentsData[row.category]) {
        componentsData[row.category] = [];
      }
      
      // Map the DB row to the frontend format
      const item = { ...row };
      // The column in DB is already `desc`, so row.desc has the data.
      // Ensure strings are not null to prevent frontend crashes:
      item.desc = item.desc || "";
      item.name = item.name || "";
      item.brand = item.brand || "";

      if (typeof item.tags === 'string') {
        try { item.tags = JSON.parse(item.tags); } catch(e) {}
      }

      componentsData[row.category].push(item);
    });
    res.json(componentsData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get parts by category
app.get("/api/parts/:category", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pc_parts WHERE category = ?", [
      req.params.category,
    ]);
    res.json(rows.map(row => {
      const item = { ...row };
      item.desc = item.desc || "";
      item.name = item.name || "";
      item.brand = item.brand || "";
      if (typeof item.tags === 'string') {
        try { item.tags = JSON.parse(item.tags); } catch(e) {}
      }
      return item;
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// API to get saved builds
app.get("/api/builds", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM saved_builds");
    const builds = [null, null, null];
    rows.forEach(row => {
      builds[row.slot_id] = typeof row.build_data === 'string' ? JSON.parse(row.build_data) : row.build_data;
    });
    res.json(builds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to save a build
app.post("/api/builds/:slot", async (req, res) => {
  try {
    const slot = parseInt(req.params.slot, 10);
    const buildData = JSON.stringify(req.body);
    await db.query(
      "INSERT INTO saved_builds (slot_id, build_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE build_data = VALUES(build_data)",
      [slot, buildData]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
