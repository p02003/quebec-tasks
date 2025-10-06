import Task from "../models/Task.js";

export const listTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) { next(e); }
};

export const getTask = async (req, res, next) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  } catch (e) { next(e); }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, notes } = req.body;
    const t = await Task.create({ title, notes });
    res.status(201).json(t);
  } catch (e) { next(e); }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, notes, done } = req.body;
    const t = await Task.findByIdAndUpdate(
      req.params.id,
      { title, notes, done },
      { new: true, runValidators: true }
    );
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json(t);
  } catch (e) { next(e); }
};

export const deleteTask = async (req, res, next) => {
  try {
    const t = await Task.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
};
