// src/routes/login.routes.ts

import LoginController from '@Controllers/login.controller';
import express from 'express';

const router = express.Router();

// Login route
router.post('/validate-user', LoginController.ValidateUser);
router.post('/login', LoginController.login);

export default router;
