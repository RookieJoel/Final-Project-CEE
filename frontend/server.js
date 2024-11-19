// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3221;

// กำหนด __dirname ใหม่สำหรับ ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// กำหนดเส้นทางสำหรับไฟล์สาธารณะ
app.use(express.static(path.join(__dirname, 'public')));

// เสิร์ฟหน้าแรก (home.html) เมื่อเข้าถึงรูท '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
