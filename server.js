const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema para as pontuações
const ScoreSchema = new mongoose.Schema({
  pontuacao: Number,
  tempo: Number,
  data: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', ScoreSchema);

// Rota para obter o leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ pontuacao: -1, tempo: 1 })
      .limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para adicionar nova pontuação
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { pontuacao, tempo } = req.body;
    const newScore = new Score({ pontuacao, tempo });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 