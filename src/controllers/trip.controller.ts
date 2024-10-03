import { Request, Response } from 'express';
import { Trip } from '@Models/trip.model';
import { SystemHelper } from '@Utility/system-helper';
import { v4 as uuidv4 } from 'uuid';
import TripService from '@ServiceHelpers/trip.service.helper';
import { getS3Url } from '@Helpers/aws-helper';
import { Constants } from '@Utility/constants';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
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
				transporterId,
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
				transporterId,
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
				transporterId,
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
			trip.transporterId = transporterId || trip.transporter_id;
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
			const { slno = '', status = '', pickupStartDate = '', pickupEndDate = '' } = req.body;
			// Fetch all trips from the database
			const filterData = { slno, status, pickupStartDate, pickupEndDate };
			const trips = await TripService.listTrips(filterData);

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

	// Download trips
	public static async downloadTrips(req: Request, res: Response): Promise<void> {
		try {
			const { slno = '', status = '', pickupStartDate = '', pickupEndDate = '' } = req.query;
			// Fetch all trips from the database
			const filterData = { slno, status, pickupStartDate, pickupEndDate };
			const trips = await TripService.listTrips(filterData);

			const formattedTrips = trips.map((item: any) => ({
				SlNo: item.slno,
				'Vehicle No': item.vehicle_no,
				Status: item.status,
				'Product Type': item.product_type,
				'Product Weight': item.product_weight,
				'Transporter Name': item.transporter_name,
				// 'Product Bill Image': item.product_bill_image,
				// 'Pickup Product Location Image': item.pickup_product_location_image,
				'Pickup Location Name': item.pickup_location_name,
				'Pickup Date': item.pickup_date,
				'Pickup By': item.pickup_by,
				'Drop Location Name': item.drop_location_name, // Default value if not present
				'Drop Date': item.drop_date || '-',
				'Verified By': item.drop_by || '-',
				// 'Drop Product Location Image': item.drop_product_location_image,
			}));

			const workbook = XLSX.utils.book_new();
			const worksheet = XLSX.utils.json_to_sheet(formattedTrips);
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

			const filePath = path.join(__dirname, '../../data.xlsx');
			XLSX.writeFile(workbook, filePath);

			res.setHeader('Content-Disposition', 'attachment filename=data.xlsx');
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

			const utcDate = SystemHelper.getFormattedDate().replace(/[:\s]/g, '-'); // Replace invalid characters for filename

			// Use res.download to send the file
			res.download(filePath, `trips-${utcDate}.xlsx`, err => {
				// No need to return here if no further processing is needed
				// Error handling for file download
				if (err) {
					console.error('Error while sending file:', err);
					// Use SystemHelper.throwError to send an error response
					SystemHelper.throwError(req, res, 500, 'Error fetching trips', 'FETCH_TRIPS_ERROR', { errorMeta: err.message });
				} else {
					// Remove the file after it has been downloaded
					fs.unlinkSync(filePath);
					// Log success
					console.log('File successfully downloaded');
				}
			});
		} catch (err) {
			if (err instanceof Error) {
				// Log the error instead of returning
				console.log('trips download error', err);
				// Optionally use SystemHelper.throwError to send an error response
				SystemHelper.throwError(req, res, 500, 'Error downloading trips', 'DOWNLOAD_TRIPS_ERROR', { errorMeta: err.message });
			} else {
				// Log generic error if it's not an instance of Error
				console.log('Unknown error during trip download');
			}
		}
	}
}
