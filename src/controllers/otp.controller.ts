// src/controllers/otp.controller.ts

import { Request, Response } from 'express';
import OtpService from '@ServiceHelpers/otp.service.helper'; // Adjust import path as necessary
import { SystemHelper } from '@Utility/system-helper'; // Adjust import path as necessary
import { v4 as uuidv4 } from 'uuid';
import { Otp } from '@Models/otp.model';
import UserService from '@ServiceHelpers/user.service.helper';

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

			// const otpValue = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
			const otpValue = '123456'; // 6-digit OTP for testing
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

	// Resend OTP
	public static async resendOTP(req: Request, res: Response) {
		try {
			const { mobileNumber } = req.body;

			// Check if the user exists
			const user = await UserService.findByMobileNumber(mobileNumber);

			if (!user) {
				return SystemHelper.throwError(req, res, 404, 'User not found', 'USER_NOT_FOUND');
			}

			const otp = await OtpService.resendOtp(mobileNumber);

			if (!otp) {
				return SystemHelper.throwError(req, res, 404, 'OTP not found', 'OTP_NOT_FOUND');
			}

			// Send the new OTP to the user's mobile number here (e.g., via SMS)

			return SystemHelper.sendResponse(req, res, 200, 'OTP sent successfully');
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error resending OTP', 'OTP_RESEND_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}
}
