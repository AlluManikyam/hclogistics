import { pool, queryOne } from '@Configs/db.config';
import { AppVersion } from '@Models/app-version.model';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export default class AppVersionService {
	// Create a new appVersion
	public static async createAppVersion(appVersion: AppVersion): Promise<AppVersion> {
		const query = `INSERT INTO app_versions (id, title, description, version, additional_info, created_by, created_at, updated_by, updated_at, deleted)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			appVersion.id,
			appVersion.title,
			appVersion.description,
			appVersion.version,
			appVersion.additionalInfo,
			appVersion.createdBy,
			appVersion.createdAt,
			appVersion.updatedBy,
			appVersion.updatedAt,
			appVersion.deleted,
		];

		await pool.query(query, values);
		return appVersion;
	}

	// Get app version by ID
	public static async getAppVersionById(id: string): Promise<AppVersion | null> {
		const query = `SELECT * FROM app_versions WHERE id = ? and deleted=false`;
		const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
		return rows.length > 0 ? (rows[0] as AppVersion) : null;
	}

	// Update a app version by ID
	public static async updateAppVersion(appVersion: AppVersion): Promise<AppVersion | null> {
		const query = `UPDATE app_versions
                       SET title = ?, description = ?, version = ?, additional_info = ?, updated_by = ?, updated_at = ?, deleted = ?
                       WHERE id = ?`;
		const values = [
			appVersion.title,
			appVersion.description,
			appVersion.version,
			appVersion.additionalInfo,
			appVersion.updatedBy,
			appVersion.updatedAt,
			appVersion.deleted,
			appVersion.id,
		];

		const [result] = await pool.query<ResultSetHeader>(query, values);
		const affectedRows = result.affectedRows;
		return affectedRows > 0 ? appVersion : null;
	}

	// Delete app version by ID
	public static async deleteAppVersion(id: string): Promise<boolean> {
		const query = `UPDATE app_versions SET deleted = true WHERE id = ?`;
		const [result] = await pool.query<ResultSetHeader>(query, [id]);
		const affectedRows = result.affectedRows;
		return affectedRows > 0;
	}

	// List all app versions
	public static async listAppVersions(): Promise<AppVersion[]> {
		const query = `SELECT * FROM app_versions WHERE deleted=false`;
		const [rows] = await pool.query<RowDataPacket[]>(query);
		return rows as AppVersion[];
	}

	// Get app version by version
	public static async findByVersion(version: string): Promise<AppVersion | null> {
		const query = 'SELECT * FROM app_versions WHERE version = ? and deleted= false';
		const appVersion = await queryOne(query, [version]);

		if (appVersion) {
			return appVersion as AppVersion;
		}
		return null;
	}

	// Get latest app version
	public static async getLatestAppVersion(): Promise<AppVersion | null> {
		const query = 'SELECT * FROM app_versions WHERE deleted= false order by created_at desc';
		const appVersion = await queryOne(query);

		if (appVersion) {
			return appVersion as AppVersion;
		}
		return null;
	}
}
