import { pool, queryOne } from '@Configs/db.config'; // Adjust import path as necessary
import { User } from '@Models/user.model'; // Adjust import path as necessary
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export default class UserService {
	// Create a new user
	public static async createUser(user: User): Promise<User> {
		const query = `INSERT INTO users (id, firstName, lastName, email, mobileNumber, gender, profilePic, userRole, accountStatus, createdBy, createdAt, updatedBy, updatedAt, deleted)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			user.id,
			user.firstName,
			user.lastName,
			user.email,
			user.mobileNumber,
			user.gender,
			user.profilePic,
			user.userRole,
			user.accountStatus,
			user.createdBy,
			user.createdAt,
			user.updatedBy,
			user.updatedAt,
			user.deleted,
		];

		await pool.query(query, values);
		return user;
	}

	// Get a user by ID
	public static async getUserById(id: string): Promise<User | null> {
		const query = `SELECT * FROM users WHERE id = ?`;
		const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
		return rows.length > 0 ? (rows[0] as User) : null;
	}

	// Update a user by ID
	public static async updateUser(user: User): Promise<User | null> {
		const query = `UPDATE users
                       SET firstName = ?, lastName = ?, email = ?, mobileNumber = ?, gender = ?, profilePic = ?, userRole = ?, accountStatus = ?, updatedBy = ?, updatedAt = ?, deleted = ?
                       WHERE id = ?`;
		const values = [
			user.firstName,
			user.lastName,
			user.email,
			user.mobileNumber,
			user.gender,
			user.profilePic,
			user.userRole,
			user.accountStatus,
			user.updatedBy,
			user.updatedAt,
			user.deleted,
			user.id,
		];

		const [result] = await pool.query<ResultSetHeader>(query, values);
		const affectedRows = result.affectedRows;
		return affectedRows > 0 ? user : null;
	}

	// Delete a user by ID
	public static async deleteUser(id: string): Promise<boolean> {
		const query = `DELETE FROM users WHERE id = ?`;
		const [result] = await pool.query<ResultSetHeader>(query, [id]);
		const affectedRows = result.affectedRows;
		return affectedRows > 0;
	}

	// List all users
	public static async listUsers(): Promise<User[]> {
		const query = `SELECT * FROM users`;
		const [rows] = await pool.query<RowDataPacket[]>(query);
		return rows as User[];
	}

	// Find user by mobile
	public static async findByMobileNumber(mobile: string): Promise<User | null> {
		const query = 'SELECT * FROM users WHERE mobile = ?';
		const user = await queryOne(query, [mobile]);

		if (user) {
			return user as User;
		}
		return null;
	}
}
