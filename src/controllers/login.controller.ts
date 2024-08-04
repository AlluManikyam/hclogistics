import { Request, Response } from 'express';
import OTPService from '@ServiceHelpers/otp.service.helper'; // Adjust import path as necessary
import { SystemHelper } from '@Utility/system-helper'; // Adjust import path as necessary
import UserService from '@ServiceHelpers/user.service.helper'; // Adjust import path as necessary
import jwt from 'jsonwebtoken';

// JWT secret key (use environment variables for security)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default class LoginController {
	public static async ValidateUser(req: Request, res: Response) {
		try {
			const { mobileNumber } = req.body;

			// Check if the user exists
			const user = await UserService.findByMobileNumber(mobileNumber);

			if (!user) {
				return SystemHelper.throwError(req, res, 404, 'User not found', 'USER_NOT_FOUND');
			}

			return SystemHelper.sendResponse(req, res, 200, { user });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error during validate user', 'LOGIN_ERROR', { errorMeta: err.message });
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

			// Verify OTP
			const otpRecord: any = await OTPService.findOtpBySendTo(mobileNumber, 'pending');
			if (!otpRecord) {
				return SystemHelper.throwError(req, res, 404, 'OTP not found', 'OTP_NOT_FOUND');
			}

			if (otpRecord.otp === otpValue && new Date() <= otpRecord.expiryDate) {
				otpRecord.status = 'verified';
				otpRecord.validateAttempts += 1;
				otpRecord.updatedAt = new Date();
				await OTPService.updateOtp(otpRecord);

				// Check if the user exists
				const user = await UserService.findByMobileNumber(mobileNumber);

				if (!user) {
					return SystemHelper.throwError(req, res, 404, 'User not found', 'USER_NOT_FOUND');
				}

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
