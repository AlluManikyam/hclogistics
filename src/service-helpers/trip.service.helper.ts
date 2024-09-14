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
			updated_at,
			deleted
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
			trip.deleted,
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
                       SET slno = ?, vehicle_no = ?, status = ?, pickup_location = ?, transporter_name = ?,
											 product_type = ?, product_weight = ?, product_bill_image = ?, pickup_product_location_image = ?,
											 pickup_date = ?, pick_by = ?, drop_location=?, updated_at = ?
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
			trip.dropLocation,
			trip.updatedAt,
			trip.id,
		];

		const [result] = await pool.query<ResultSetHeader>(query, values);
		const affectedRows = result.affectedRows;
		return affectedRows > 0 ? trip : null;
	}

	// Update a trip status by slno
	public static async updateTripStatus(trip: Trip): Promise<Trip | null> {
		const query = `UPDATE trips
                       SET drop_product_location_image = ?,  status = ?, drop_by = ?, drop_date = ?, updated_at = ?
                       WHERE id = ?`;
		const values = [trip.dropProductLocationImage, trip.status, trip.dropBy, trip.dropDate, trip.updatedAt, trip.id];

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
		const query = `
        SELECT
            t.*,
            -- Pickup location info
            pickupInfo.id AS pickup_location_id,
            pickupInfo.name AS pickup_location_name,
            pickupInfo.latitude AS pickup_location_latitude,
            pickupInfo.longitude AS pickup_location_longitude,
            pickupInfo.address AS pickup_location_address,
            -- Drop location info
            dropInfo.id AS drop_location_id,
            dropInfo.name AS drop_location_name,
            dropInfo.latitude AS drop_location_latitude,
            dropInfo.longitude AS drop_location_longitude,
            dropInfo.address AS drop_location_address
        FROM trips t
        JOIN locations pickupInfo ON t.pickup_location = pickupInfo.id
        JOIN locations dropInfo ON t.drop_location = dropInfo.id
        WHERE t.slno = ?`;

		const trip = await queryOne(query, [slno]);

		if (trip) {
			return trip as Trip;
		}
		return null;
	}
}
