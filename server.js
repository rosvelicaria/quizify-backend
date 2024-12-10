const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to serve static files (e.g., your HTML, CSS, JS files)
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML page at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'quizify.html'));
});

// Handle file upload
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const uploadPath = path.join(__dirname, 'uploads', file.name);

  // Make sure the uploads directory exists
  if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
  }

  // Move the file to the 'uploads' directory
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Hardcoded questions (simulating quiz generation after upload)
    const questions = [
      { question: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Rome'], correct: 'A' },
      { question: 'Who wrote "Romeo and Juliet"?', options: ['Shakespeare', 'Dickens', 'Austen', 'Hemingway'], correct: 'A' },
      { question: 'What is 5 + 5?', options: ['10', '11', '12', '9'], correct: 'A' },
      { question: 'Which planet is known as the Red Planet?', options: ['Mars', 'Earth', 'Jupiter', 'Venus'], correct: 'A' }
    ];

    res.send({ message: 'File uploaded!', filePath: uploadPath, questions });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:3000`);
});
