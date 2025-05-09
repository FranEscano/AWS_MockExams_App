// routes/authRoutes.ts
import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Ruta de inicio de sesión
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

export default router;
