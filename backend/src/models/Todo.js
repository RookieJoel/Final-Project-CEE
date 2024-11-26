const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true }, // ชื่อของ To-Do
  description: { type: String, default: '' }, // คำอธิบายเพิ่มเติม
  completed: { type: Boolean, default: false }, // สถานะ (ทำเสร็จหรือยัง)
  createdAt: { type: Date, default: Date.now } // วันที่สร้าง
});

module.exports = mongoose.model('Todo', todoSchema);
