console.log("Starting minimal test...");

import express from "express";
console.log("Express imported successfully");

const app = express();
console.log("Express app created");

app.get("/test", (req, res) => {
  res.json({ status: "working" });
});

app.listen(3001, () => {
  console.log("Minimal server started on port 3001");
});
