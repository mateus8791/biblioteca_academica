// Arquivo: backend/src/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- 1. IMPORTAR TODAS AS NOSSAS ROTAS ---
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const loanRoutes = require('./routes/loanRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes'); // Rota de Relatórios
const userRoutes = require('./routes/userRoutes');       // <-- A LINHA QUE FALTAVA
const dashboardRoutes = require('./routes/dashboardRoutes'); // 1. IMPORTE AQUI
const perfilRoutes = require('./routes/perfilRoutes'); // 1. IMPORTE AQUI
const conquistasRoutes = require('./routes/conquistasRoutes'); // 1. IMPORTE AQUI
const financeiroRoutes = require('./routes/financeiroRoutes'); // 1. IMPORTE AQUI

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// --- 2. USAR AS ROTAS QUE IMPORTAMOS ---
app.use('/api/auth', authRoutes);
app.use('/api', bookRoutes);
app.use('/api', authorRoutes);
app.use('/api', categoryRoutes);
app.use('/api', reservationRoutes);
app.use('/api', loanRoutes);
app.use('/api', relatorioRoutes);
app.use('/api', userRoutes); // <-- Agora esta linha vai funcionar
app.use('/api', dashboardRoutes); // 2. REGISTRE AQUI
app.use('/api', perfilRoutes); // 2. REGISTRE AQUI
app.use('/api', conquistasRoutes); // 2. REGISTRE AQUI
app.use('/api', financeiroRoutes); // 2. REGISTRE AQUI


// Rota principal de teste
app.get('/', (req, res) => {
  res.send('<h1>API do Bibliotech está no ar!</h1>');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}.`);
});