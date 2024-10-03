// src/routes/otp.routes.ts

import OTPController from '@Controllers/otp.controller';
import express from 'express';

const router = express.Router();

// Generate OTP
router.post('/generate-otp', OTPController.generateOTP);

// Resend OTP
router.post('/resend-otp', OTPController.resendOTP);

export default router;
