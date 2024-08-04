// src/services/otp.service.ts

import { Otp } from '@Models/otp.model'; // Adjust import path as necessary
import { queryOne, pool } from '@Configs/db.config'; // Adjust import path as necessary

export default class OtpService {
	// Create a new OTP record
	public static async createOtp(otp: Otp): Promise<void> {
		const query = `
            INSERT INTO otp (id, sendTo, otp, status, sourceType, requestAttempts, validateAttempts, expiryDate, createdBy, createdAt, updatedBy, updatedAt, deleted)
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
		const sql = 'SELECT * FROM otp WHERE sendTo = ? AND status = ?';
		const result = await queryOne(sql, [sendTo, status]);

		if (result) {
			return result as Otp;
		}
		return null;
	}

	// Update OTP
	public static async updateOtp(otp: Otp): Promise<void> {
		const sql = `
            UPDATE otp
            SET otp = ?, status = ?, requestAttempts = ?, validateAttempts = ?, expiryDate = ?, updatedBy = ?, updatedAt = ?, deleted = ?
            WHERE id = ?
        `;
		const values = [
			otp.otp,
			otp.status,
			otp.requestAttempts,
			otp.validateAttempts,
			otp.expiryDate,
			otp.updatedBy,
			otp.updatedAt,
			otp.deleted,
			otp.id,
		];
		await pool.query(sql, values);
	}

	// Resend OTP
	public static async resendOtp(sendTo: string): Promise<Otp | null> {
		const otp = await OtpService.findOtpBySendTo(sendTo, 'pending');

		if (otp) {
			otp.requestAttempts += 1;
			otp.expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
			otp.otp = Math.floor(100000 + Math.random() * 900000).toString();
			otp.updatedAt = new Date();

			await OtpService.updateOtp(otp);

			return otp;
		}
		return null;
	}
}
