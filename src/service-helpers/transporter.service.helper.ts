import { pool, queryOne } from '@Configs/db.config';
import { Transporter } from '@Models/transporter.model';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export default class TransporterService {
	// Create a new transporter
	public static async createTransporter(transporter: Transporter): Promise<Transporter> {
		const query = `INSERT INTO transporters (id, name, created_by, created_at, updated_by, updated_at, deleted)
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			transporter.id,
			transporter.name,
			transporter.createdBy,
			transporter.createdAt,
			transporter.updatedBy,
			transporter.updatedAt,
			transporter.deleted,
		];

		await pool.query(query, values);
		return transporter;
	}

	// Get a transporter by ID
	public static async getTransporterById(id: string): Promise<Transporter | null> {
		const query = `SELECT * FROM transporters WHERE id = ? and deleted=false`;
		const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
		return rows.length > 0 ? (rows[0] as Transporter) : null;
	}

	// Update a transporter by ID
	public static async updateTransporter(transporter: Transporter): Promise<Transporter | null> {
		const query = `UPDATE transporters
                       SET name = ?, updated_by = ?, updated_at = ?, deleted = ?
                       WHERE id = ?`;
		const values = [transporter.name, transporter.updatedBy, transporter.updatedAt, transporter.deleted, transporter.id];

		const [result] = await pool.query<ResultSetHeader>(query, values);
		const affectedRows = result.affectedRows;
		return affectedRows > 0 ? transporter : null;
	}

	// Delete a transporter by ID
	public static async deleteTransporter(id: string): Promise<boolean> {
		const query = `UPDATE transporters SET deleted = true WHERE id = ?`;
		const [result] = await pool.query<ResultSetHeader>(query, [id]);
		const affectedRows = result.affectedRows;
		return affectedRows > 0;
	}

	// List all transporters
	public static async listTransporters(): Promise<Transporter[]> {
		const query = `SELECT * FROM transporters WHERE deleted=false`;
		const [rows] = await pool.query<RowDataPacket[]>(query);
		return rows as Transporter[];
	}

	// Find transporter by name
	public static async findByName(name: string): Promise<Transporter | null> {
		const query = 'SELECT * FROM transporters WHERE name = ? and deleted= false';
		const transporter = await queryOne(query, [name]);

		if (transporter) {
			return transporter as Transporter;
		}
		return null;
	}
}
