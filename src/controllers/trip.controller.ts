import { Request, Response } from 'express';
import { Trip } from '@Models/trip.model'; // Adjust import path as necessary
import { SystemHelper } from '@Utility/system-helper'; // Adjust import path as necessary
import { v4 as uuidv4 } from 'uuid';
import TripService from '@ServiceHelpers/trip.service.helper'; // Adjust import path as necessary
import { getS3Url } from '@Helpers/aws-helpter';
import { Constants } from '@Utility/constants';

export default class TripController {
	constructor() {}

	// Create a new trip
	public static async createTrip(req: Request, res: Response) {
		try {
			const userId = req?.user?.id || '-1';
			const {
				slno,
				vehicleNo,
				pickupLocation,
				transporterName,
				productType,
				productWeight,
				productBillImage,
				pickupProductLocationImage,
				dropLocation,
			} = req.body;

			// Check if the slno already exists
			const existingTrip = await TripService.findBySlNo(slno);

			if (existingTrip) {
				return SystemHelper.throwError(req, res, 400, 'Trip SLNo already exists', 'DUPLICATE_SLNO');
			}

			const productBillImageUrl = productBillImage ? await getS3Url(productBillImage, `trip_${slno}-product-bill-image`, Constants.Aws.BUCKET) : '';

			const pickupProductLocationImageUrl = pickupProductLocationImage
				? await getS3Url(pickupProductLocationImage, `trip_${slno}-product-location-image`, Constants.Aws.BUCKET)
				: '';

			const id = uuidv4();

			// Create new trip
			const newTrip = new Trip(
				id,
				slno,
				vehicleNo,
				'pending',
				pickupLocation,
				transporterName,
				productType,
				productWeight,
				productBillImageUrl,
				pickupProductLocationImageUrl,
				new Date(), // Pickup date
				userId,
				dropLocation,
				undefined, // Drop-related fields are left out
				undefined,
				undefined,
				new Date(),
				new Date(),
				false,
			);

			// Save the new trip to the database
			await TripService.createTrip(newTrip);

			return SystemHelper.sendResponse(req, res, 200, { trip: newTrip });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error creating trip', 'CREATE_TRIP_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Get a trip by ID
	public static async getTripById(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch trip from the database
			const trip = await TripService.getTripById(id);

			if (!trip) {
				return SystemHelper.throwError(req, res, 404, 'Trip not found', 'TRIP_NOT_FOUND');
			}

			return SystemHelper.sendResponse(req, res, 200, { trip });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching trip', 'FETCH_TRIP_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Get a trip by ID
	public static async getTripBySlno(req: Request, res: Response) {
		try {
			const { slno } = req.params;

			// Fetch trip from the database
			const trip = await TripService.findBySlNo(slno);

			if (!trip) {
				return SystemHelper.throwError(req, res, 404, 'Trip not found', 'TRIP_NOT_FOUND');
			}

			return SystemHelper.sendResponse(req, res, 200, { trip });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching trip', 'FETCH_TRIP_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Update a trip by ID
	public static async updateTrip(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const userId = req?.user?.id || '-1';

			const {
				slno,
				vehicleNo,
				status,
				pickupLocation,
				transporterName,
				productType,
				productWeight,
				productBillImage,
				pickupProductLocationImage,
				dropLocation,
			} = req.body;

			// Check if the slno already exists and is not the current trip
			const existingTrip = await TripService.findBySlNo(slno);

			if (existingTrip && existingTrip.id !== id) {
				return SystemHelper.throwError(req, res, 400, 'Trip SLNo already in use', 'DUPLICATE_SLNO');
			}

			// Fetch trip from the database
			const trip: any = await TripService.getTripById(id);

			if (!trip) {
				return SystemHelper.throwError(req, res, 404, 'Trip not found', 'TRIP_NOT_FOUND');
			}

			const productBillImageUrl = SystemHelper.isBase64DataUrl(productBillImage)
				? await getS3Url(productBillImage, `trip_${slno}-product-bill-image`, Constants.Aws.BUCKET)
				: trip.product_bill_image;

			const pickupProductLocationImageUrl = SystemHelper.isBase64DataUrl(pickupProductLocationImage)
				? await getS3Url(pickupProductLocationImage, `trip-pickup-${slno}-product-location-image`, Constants.Aws.BUCKET)
				: trip.pickup_product_location_image;

			// Update trip properties
			trip.slno = slno || trip.slno;
			trip.vehicleNo = vehicleNo || trip.vehicle_no;
			trip.status = status || trip.status;
			trip.pickupLocation = pickupLocation || trip.pickup_location;
			trip.transporterName = transporterName || trip.transporter_name;
			trip.productType = productType || trip.product_type;
			trip.productWeight = productWeight || trip.product_weight;
			trip.productBillImage = productBillImageUrl;
			trip.pickupProductLocationImage = pickupProductLocationImageUrl;
			trip.pickupDate = new Date() || trip.pickup_date;
			trip.dropLocation = dropLocation || trip.drop_location;
			trip.pickBy = userId || trip.pick_by;
			trip.updatedAt = new Date();
			trip.delete = false;

			// Save the updated trip to the database
			await TripService.updateTrip(trip);

			// Fetch trip from the database
			const updatedTrip: any = await TripService.getTripById(id);

			return SystemHelper.sendResponse(req, res, 200, { trip: updatedTrip });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error updating trip', 'UPDATE_TRIP_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Update a trip by ID
	public static async updateTripStatus(req: Request, res: Response) {
		try {
			const userId = req?.user?.id || '-1';
			const { slno } = req.params;
			const { dropProductLocationImage } = req.body;

			// Fetch trip from the database
			const trip: any = await TripService.findBySlNo(slno);

			if (!trip) {
				return SystemHelper.throwError(req, res, 404, 'Trip not found', 'TRIP_NOT_FOUND');
			}

			// Update trip properties
			trip.status = 'completed';

			const dropProductLocationImageUrl = SystemHelper.isBase64DataUrl(dropProductLocationImage)
				? await getS3Url(dropProductLocationImage, `trip-drop-${slno}-product-location-image`, Constants.Aws.BUCKET)
				: trip.drop_product_location_image;

			trip.dropProductLocationImage = dropProductLocationImageUrl;
			trip.dropBy = userId || trip.drop_by;
			trip.dropDate = new Date();
			trip.updatedAt = new Date();

			// Save the updated trip to the database
			await TripService.updateTripStatus(trip);

			// Fetch trip from the database
			const updatedTrip: any = await TripService.findBySlNo(slno);

			return SystemHelper.sendResponse(req, res, 200, { trip: updatedTrip });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error updating trip', 'UPDATE_TRIP_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Delete a trip by ID
	public static async deleteTrip(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch trip from the database
			const trip = await TripService.getTripById(id);

			if (!trip) {
				return SystemHelper.throwError(req, res, 404, 'Trip not found', 'TRIP_NOT_FOUND');
			}

			// Delete trip from the database
			await TripService.deleteTrip(id);

			return SystemHelper.sendResponse(req, res, 200, { message: 'Trip deleted successfully' });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error deleting trip', 'DELETE_TRIP_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// List all trips
	public static async listTrips(req: Request, res: Response) {
		try {
			// Fetch all trips from the database
			const trips = await TripService.listTrips();

			return SystemHelper.sendResponse(req, res, 200, { trips });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching trips', 'FETCH_TRIPS_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}
}
