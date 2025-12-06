const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Task = require("./models/Task");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Home
app.get("/", async (req, res) => {
  const tasks = await Task.find({});
  res.render("index", { tasks });
});

// Add
app.post("/add", async (req, res) => {
  await Task.create({ name: req.body.task });
  res.redirect("/");
});

// Delete
app.post("/delete", async (req, res) => {
  await Task.findByIdAndDelete(req.body.id);
  res.redirect("/");
});

// ✅ Edit / Update
app.post("/edit", async (req, res) => {
  await Task.findByIdAndUpdate(
    req.body.id,
    { name: req.body.updatedTask }
  );
  res.redirect("/");
});
// Toggle task completion
app.post("/toggle", async (req, res) => {
  const task = await Task.findById(req.body.id);
  task.completed = !task.completed;
  await task.save();
  res.redirect("/");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
