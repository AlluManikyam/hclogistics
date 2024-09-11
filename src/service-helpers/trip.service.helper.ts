import { pool, queryOne } from '@Configs/db.config';
import { Trip } from '@Models/trip.model';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export default class TripService {
	// Create a new trip
	public static async createTrip(trip: Trip): Promise<Trip> {
		const query = `INSERT INTO trips (
		  id,
			slno,
			vehicle_no,
			status,
			pickup_location,
			transporter_name,
			product_type,
			product_weight,
			product_bill_image,
			pickup_product_location_image,
			pickup_date,
			pick_by,
			drop_location,
			created_at,
			updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

		const values = [
			trip.id,
			trip.slno,
			trip.vehicleNo,
			trip.status,
			trip.pickupLocation,
			trip.transporterName,
			trip.productType,
			trip.productWeight,
			trip.productBillImage,
			trip.pickupProductLocationImage,
			trip.pickupDate,
			trip.pickBy,
			trip.dropLocation,
			trip.createdAt,
			trip.updatedAt,
		];

		await pool.query(query, values);
		return trip;
	}

	// Get a trip by ID
	public static async getTripById(id: string): Promise<Trip | null> {
		const query = `SELECT * FROM trips WHERE id = ?`;
		const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
		return rows.length > 0 ? (rows[0] as Trip) : null;
	}

	// Update a trip by ID
	public static async updateTrip(trip: Trip): Promise<Trip | null> {
		const query = `UPDATE trips
                       SET slno = ?, vehicle_no = ?, status = ?, pickup_location = ?, transporter_name = ?, product_type = ?, product_weight = ?, product_bill_image = ?, pickup_product_location_image = ?, pickup_date = ?, pick_by = ?, updated_at = ?
                       WHERE id = ?`;
		const values = [
			trip.slno,
			trip.vehicleNo,
			trip.status,
			trip.pickupLocation,
			trip.transporterName,
			trip.productType,
			trip.productWeight,
			trip.productBillImage,
			trip.pickupProductLocationImage,
			trip.pickupDate,
			trip.pickBy,
			trip.updatedAt,
			trip.id,
		];

		const [result] = await pool.query<ResultSetHeader>(query, values);
		const affectedRows = result.affectedRows;
		return affectedRows > 0 ? trip : null;
	}

	// Delete a trip by ID
	public static async deleteTrip(id: string): Promise<boolean> {
		const query = `DELETE FROM trips WHERE id = ?`;
		const [result] = await pool.query<ResultSetHeader>(query, [id]);
		const affectedRows = result.affectedRows;
		return affectedRows > 0;
	}

	// List all trips
	public static async listTrips(): Promise<Trip[]> {
		const query = `SELECT * FROM trips`;
		const [rows] = await pool.query<RowDataPacket[]>(query);
		return rows as Trip[];
	}

	// Find trip by SLNo
	public static async findBySlNo(slno: string): Promise<Trip | null> {
		const query = 'SELECT * FROM trips WHERE slno = ?';
		const trip = await queryOne(query, [slno]);

		if (trip) {
			return trip as Trip;
		}
		return null;
	}
}
