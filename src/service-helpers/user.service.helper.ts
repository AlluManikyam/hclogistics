import { pool, queryOne } from '@Configs/db.config';
import { User } from '@Models/user.model';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export default class UserService {
	// Create a new user
	public static async createUser(user: User): Promise<User> {
		const query = `INSERT INTO users (id, name, mobile_number, user_role, account_status, created_by, created_at, updated_by, updated_at, deleted)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			user.id,
			user.name,
			user.mobileNumber,
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
		const query = `SELECT u.*, r.name as role_name FROM users u
									join roles r on r.id= u.user_role
 									WHERE u.id = ? and u.deleted= ?`;
		console.log(query);

		const [rows] = await pool.query<RowDataPacket[]>(query, [id, false]);
		return rows.length > 0 ? (rows[0] as User) : null;
	}

	// Update a user by ID
	public static async updateUser(user: User): Promise<User | null> {
		const query = `UPDATE users
                       SET name = ?, mobile_number = ?, user_role = ?, account_status = ?, updated_by = ?, updated_at = ?, updated_by=?, deleted = ?
                       WHERE id = ?`;
		const values = [
			user.name,
			user.mobileNumber,
			user.userRole,
			user.accountStatus,
			user.updatedBy,
			user.updatedAt,
			user.updatedBy,
			user.deleted,
			user.id,
		];

		const [result] = await pool.query<ResultSetHeader>(query, values);
		const affectedRows = result.affectedRows;
		return affectedRows > 0 ? user : null;
	}

	// Delete a user by ID
	public static async deleteUser(id: string): Promise<boolean> {
		const query = `UPDATE users SET deleted = true WHERE id = ?`;
		const [result] = await pool.query<ResultSetHeader>(query, [id]);
		const affectedRows = result.affectedRows;
		return affectedRows > 0;
	}

	// List all users
	public static async listUsers(): Promise<User[]> {
		const query = `SELECT u.*, r.name as role_name FROM users u
									 join roles r on r.id= u.user_role
									 where u.deleted= false`;
		const [rows] = await pool.query<RowDataPacket[]>(query);
		return rows as User[];
	}

	// Find user by mobile
	public static async findByMobileNumber(mobile: string): Promise<User | null> {
		const query = 'SELECT * FROM users WHERE mobile_number = ? and deleted= ? and account_status= ?';

		const user = await queryOne(query, [mobile, false, 'Active']);

		console.log(user);

		if (user) {
			return user as User;
		}
		return null;
	}
}
