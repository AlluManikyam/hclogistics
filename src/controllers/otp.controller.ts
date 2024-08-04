// src/controllers/otp.controller.ts

import { Request, Response } from 'express';
import OtpService from '@ServiceHelpers/otp.service.helper'; // Adjust import path as necessary
import { SystemHelper } from '@Utility/system-helper'; // Adjust import path as necessary
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Otp } from '@Models/otp.model';
import UserService from '@ServiceHelpers/user.service.helper';

// JWT secret key (use environment variables for security)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default class OTPController {
	// Validity User and Generate
	public static async generateOTP(req: Request, res: Response) {
		try {
			const { mobileNumber } = req.body;

			// Check if the user exists
			const user = await UserService.findByMobileNumber(mobileNumber);

			if (!user) {
				return SystemHelper.throwError(req, res, 404, 'User not found', 'USER_NOT_FOUND');
			}

			const otpValue = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
			const otpId = uuidv4();
			const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes

			const otp = new Otp(otpId, mobileNumber, otpValue, 'pending', 'login', 1, 0, expiryDate);

			await OtpService.createOtp(otp);

			// Send the OTP to the user's mobile number here (e.g., via SMS)

			return SystemHelper.sendResponse(req, res, 200, { otp: otpValue });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error generating OTP', 'OTP_GENERATION_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// Verify OTP
	public static async verifyOTP(req: Request, res: Response) {
		try {
			const { mobileNumber, otpValue } = req.body;

			const otpRecord: any = await OtpService.findOtpBySendTo(mobileNumber, 'pending');
			if (!otpRecord) {
				return SystemHelper.throwError(req, res, 404, 'OTP not found', 'OTP_NOT_FOUND');
			}

			if (otpRecord.otp === otpValue && new Date() <= otpRecord.expiryDate) {
				otpRecord.status = 'verified';
				otpRecord.validateAttempts += 1;
				otpRecord.updatedAt = new Date();
				await OtpService.updateOtp(otpRecord);

				const token = jwt.sign({ id: otpRecord.id, mobileNumber: otpRecord.sendTo }, JWT_SECRET, { expiresIn: '1h' });

				return SystemHelper.sendResponse(req, res, 200, { token });
			} else {
				return SystemHelper.throwError(req, res, 401, 'Invalid or expired OTP', 'INVALID_OTP');
			}
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error verifying OTP', 'OTP_VERIFICATION_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// Resend OTP
	public static async resendOTP(req: Request, res: Response) {
		try {
			const { mobileNumber } = req.body;

			const otp = await OtpService.resendOtp(mobileNumber);

			if (!otp) {
				return SystemHelper.throwError(req, res, 404, 'OTP not found', 'OTP_NOT_FOUND');
			}

			// Send the new OTP to the user's mobile number here (e.g., via SMS)

			return SystemHelper.sendResponse(req, res, 200, { otp: otp.otp });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error resending OTP', 'OTP_RESEND_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}
}
