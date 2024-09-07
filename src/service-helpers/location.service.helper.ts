import { pool, queryOne } from '@Configs/db.config';
import { Location } from '@Models/location.model';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export default class LocationService {
	// Create a new location
	public static async createLocation(location: Location): Promise<Location> {
		const query = `INSERT INTO locations (id, name, latitude, longitude, address, created_by, created_at, updated_by, updated_at, deleted)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
		const values = [
			location.id,
			location.name,
			location.latitude,
			location.longitude,
			location.address,
			location.createdBy,
			location.createdAt,
			location.updatedBy,
			location.updatedAt,
			location.deleted,
		];

		await pool.query(query, values);
		return location;
	}

	// Get a location by ID
	public static async getLocationById(id: string): Promise<Location | null> {
		const query = `SELECT * FROM locations WHERE id = ? and deleted=false`;
		const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
		return rows.length > 0 ? (rows[0] as Location) : null;
	}

	// Update a location by ID
	public static async updateLocation(location: Location): Promise<Location | null> {
		const query = `UPDATE locations
                       SET name = ?, latitude = ?, longitude = ?, address = ?, updated_by = ?, updated_at = ?, deleted = ?
                       WHERE id = ?`;
		const values = [
			location.name,
			location.latitude,
			location.longitude,
			location.address,
			location.updatedBy,
			location.updatedAt,
			location.deleted,
			location.id,
		];

		const [result] = await pool.query<ResultSetHeader>(query, values);
		const affectedRows = result.affectedRows;
		return affectedRows > 0 ? location : null;
	}

	// Delete a location by ID
	public static async deleteLocation(id: string): Promise<boolean> {
		const query = `UPDATE locations SET deleted = true WHERE id = ?`;
		const [result] = await pool.query<ResultSetHeader>(query, [id]);
		const affectedRows = result.affectedRows;
		return affectedRows > 0;
	}

	// List all location
	public static async listLocations(): Promise<Location[]> {
		const query = `SELECT * FROM locations WHERE deleted=false`;
		const [rows] = await pool.query<RowDataPacket[]>(query);
		return rows as Location[];
	}

	// Find location by name
	public static async findByName(name: string): Promise<Location | null> {
		const query = 'SELECT * FROM locations WHERE name = ? and deleted= false';
		const location = await queryOne(query, [name]);

		if (location) {
			return location as Location;
		}
		return null;
	}
}
