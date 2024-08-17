import { pool, queryOne } from '@Configs/db.config';
import { Role } from '@Models/role.model';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export default class RoleService {
	// Create a new role
	public static async createRole(role: Role): Promise<Role> {
		const query = `INSERT INTO roles (id, name, created_by, created_at, updated_by, updated_at, deleted)
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
		const values = [role.id, role.name, role.createdBy, role.createdAt, role.updatedBy, role.updatedAt, role.deleted];

		await pool.query(query, values);
		return role;
	}

	// Get a role by ID
	public static async getRoleById(id: string): Promise<Role | null> {
		const query = `SELECT * FROM roles WHERE id = ? and deleted=false`;
		const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
		return rows.length > 0 ? (rows[0] as Role) : null;
	}

	// Update a role by ID
	public static async updateRole(role: Role): Promise<Role | null> {
		const query = `UPDATE roles
                       SET name = ?, updated_by = ?, updated_at = ?, deleted = ?
                       WHERE id = ?`;
		const values = [role.name, role.updatedBy, role.updatedAt, role.deleted, role.id];

		const [result] = await pool.query<ResultSetHeader>(query, values);
		const affectedRows = result.affectedRows;
		return affectedRows > 0 ? role : null;
	}

	// Delete a role by ID
	public static async deleteRole(id: string): Promise<boolean> {
		const query = `UPDATE roles SET deleted = true WHERE id = ?`;
		const [result] = await pool.query<ResultSetHeader>(query, [id]);
		const affectedRows = result.affectedRows;
		return affectedRows > 0;
	}

	// List all roles
	public static async listRoles(): Promise<Role[]> {
		const query = `SELECT * FROM roles WHERE deleted=false`;
		const [rows] = await pool.query<RowDataPacket[]>(query);
		return rows as Role[];
	}

	// Find role by name
	public static async findByName(name: string): Promise<Role | null> {
		const query = 'SELECT * FROM roles WHERE name = ? and deleted= false';
		const role = await queryOne(query, [name]);

		if (role) {
			return role as Role;
		}
		return null;
	}
}
