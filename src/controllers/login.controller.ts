import { Request, Response } from 'express';
import OTPService from '@ServiceHelpers/otp.service.helper'; // Adjust import path as necessary
import { SystemHelper } from '@Utility/system-helper'; // Adjust import path as necessary
import UserService from '@ServiceHelpers/user.service.helper'; // Adjust import path as necessary
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Otp } from '@Models/otp.model';
import OtpService from '@ServiceHelpers/otp.service.helper';

// JWT secret key (use environment variables for security)
const JWT_SECRET = process.env.JWT_SECRET || 'this is hmc logistics application';

export default class LoginController {
	public static async ValidateUser(req: Request, res: Response) {
		try {
			const { mobileNumber } = req.body;

			// Check if the user exists
			const user = await UserService.findByMobileNumber(mobileNumber);

			// Cancelled previous otps
			await OtpService.updateCancelOtp(mobileNumber);

			if (!user) {
				return SystemHelper.throwError(req, res, 404, 'Invalid User Credentials', 'INVALID_USER');
			}

			// Send OTP
			// const otpValue = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
			const otpValue = '123456'; // 6-digit OTP for testing
			const otpId = uuidv4();
			const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes

			const otp = new Otp(otpId, mobileNumber, otpValue, 'pending', 'login', 1, 0, expiryDate);

			await OtpService.createOtp(otp);

			return SystemHelper.sendResponse(req, res, 200, { valid: true });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error during validate user', 'VALIDATE_USER_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Handle login with OTP
	public static async login(req: Request, res: Response) {
		try {
			const { mobileNumber, otpValue } = req.body;

			// Check if the user exists
			const user = await UserService.findByMobileNumber(mobileNumber);

			if (!user) {
				return SystemHelper.throwError(req, res, 404, 'User not found', 'USER_NOT_FOUND');
			}

			// Verify OTP
			const otpRecord: any = await OTPService.findOtpBySendTo(mobileNumber, 'pending');
			if (!otpRecord) {
				return SystemHelper.throwError(req, res, 404, 'OTP not found', 'OTP_NOT_FOUND');
			}

			const otpExpiryDate = otpRecord.expiry_date;

			if (otpRecord.otp === otpValue && new Date() <= otpExpiryDate) {
				otpRecord.requestAttempts = otpRecord.request_attempts;
				otpRecord.status = 'verified';
				otpRecord.updatedAt = new Date();
				await OTPService.updateOtp(otpRecord);

				// Generate JWT token
				const token = jwt.sign({ id: user.id, mobileNumber: user.mobileNumber }, JWT_SECRET, { expiresIn: '1h' });

				return SystemHelper.sendResponse(req, res, 200, { token, user });
			} else {
				return SystemHelper.throwError(req, res, 401, 'Invalid or expired OTP', 'INVALID_OTP');
			}
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error during login', 'LOGIN_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}
}
