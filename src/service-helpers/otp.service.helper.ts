// src/services/otp.service.ts

import { Otp } from '@Models/otp.model'; // Adjust import path as necessary
import { queryOne, pool } from '@Configs/db.config'; // Adjust import path as necessary

export default class OtpService {
	// Create a new OTP record
	public static async createOtp(otp: Otp): Promise<void> {
		const query = `
            INSERT INTO otps (id,send_to,otp,status,source_type,request_attempts,validate_attempts,expiry_date,created_by,created_at,updated_by,updated_at,deleted)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

		const values = [
			otp.id,
			otp.sendTo,
			otp.otp,
			otp.status,
			otp.sourceType,
			otp.requestAttempts,
			otp.validateAttempts,
			otp.expiryDate,
			otp.createdBy,
			otp.createdAt,
			otp.updatedBy,
			otp.updatedAt,
			otp.deleted,
		];
		await pool.query(query, values);
	}

	// Find OTP by sendTo and status
	public static async findOtpBySendTo(sendTo: string, status: string): Promise<Otp | null> {
		const sql = 'SELECT * FROM otps WHERE send_to = ? AND status = ?';
		const result = await queryOne(sql, [sendTo, status]);

		if (result) {
			return result as Otp;
		}
		return null;
	}

	// Cancelled OTP
	public static async updateCancelOtp(sendTo: string): Promise<void> {
		// Cancel or supersede all previous OTPs for the same sendTo
		const cancelSql = `
        UPDATE otps
        SET status = 'cancelled', updated_at = ?
        WHERE send_to = ? AND status = 'pending'
    `;
		await pool.query(cancelSql, [new Date(), sendTo]);
	}

	// Update OTP
	public static async updateOtp(otp: Otp): Promise<void> {
		const sql = `
            UPDATE otps
            SET otp = ?, status = ?, request_attempts=?, updated_by = ?, updated_at = ?, deleted = ?
            WHERE id = ?
        `;
		const values = [otp.otp, otp.status, otp.requestAttempts, otp.updatedBy, otp.updatedAt, otp.deleted, otp.id];
		await pool.query(sql, values);
	}

	// Resend OTP
	public static async resendOtp(sendTo: string): Promise<Otp | null> {
		const otp: any = await OtpService.findOtpBySendTo(sendTo, 'pending');

		if (otp) {
			const requestAttempts = otp.request_attempts;
			otp.requestAttempts = requestAttempts + 1;
			otp.expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
			// otp.otp = Math.floor(100000 + Math.random() * 900000).toString();
			otp.otp = '123456';
			otp.updatedAt = new Date();

			await OtpService.updateOtp(otp);

			return otp;
		}
		return null;
	}
}
