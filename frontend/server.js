import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3221;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Default route: Redirect to login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for signup
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route for home (protected)
app.get('/home', (req, res) => {
  // Check if the user is "authenticated" (using a placeholder logic for now)
  const isAuthenticated = true; // Replace this with actual authentication logic
  if (isAuthenticated) {
    res.sendFile(path.join(__dirname, 'public', 'home3.html'));
  } else {
    res.redirect('/'); // Redirect to login if not authenticated
  }
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://54.211.108.140:${PORT}`);
});
