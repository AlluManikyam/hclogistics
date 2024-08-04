// src/routes/login.routes.ts

import LoginController from '@Controllers/login.controller'; // Adjust import path as necessary
import express from 'express';

const router = express.Router();

// Login route
router.post('/login', LoginController.login);

export default router;
