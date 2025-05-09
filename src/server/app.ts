// server/app.ts
import express from 'express';
import session from 'express-session';
import passport from '../config/passport';
import authRoutes from '../routes/authRoutes';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configurar sesiones
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Inicializar Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/auth', authRoutes);

export default app;
