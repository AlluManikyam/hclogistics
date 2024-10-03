import { Request, Response } from 'express';
import { Location } from '@Models/location.model';
import { SystemHelper } from '@Utility/system-helper';
import { v4 as uuidv4 } from 'uuid';
import LocationService from '@ServiceHelpers/location.service.helper';

export default class LocationController {
	constructor() {}

	// Create a new location
	public static async createLocation(req: Request, res: Response) {
		try {
			const userId = req?.user?.id || '-1';

			const { name, latitude, longitude, address } = req.body;

			// Check if the name already exists
			const existingLocation = await LocationService.findByName(name);

			if (existingLocation) {
				return SystemHelper.throwError(req, res, 400, 'Name already exists', 'DUPLICATE_NAME');
			}

			// Generate a unique ID for the new location
			const id = uuidv4();
			const createdAt = new Date(); // Use Date object
			const updatedAt = new Date(); // Use Date object

			const newLocation = new Location(id, name, latitude, longitude, address, userId, createdAt, userId, updatedAt, false);

			// Save the new location to the database
			await LocationService.createLocation(newLocation);

			return SystemHelper.sendResponse(req, res, 200, { location: newLocation });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error creating location', 'CREATE_LOCATION_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Get a location by ID
	public static async getLocationById(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch location from the database
			const location = await LocationService.getLocationById(id);

			if (!location) {
				return SystemHelper.throwError(req, res, 404, 'Location not found', 'LOCATION_NOT_FOUND');
			}

			return SystemHelper.sendResponse(req, res, 200, { location });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching location', 'FETCH_LOCATION_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Update a location by ID
	public static async updateLocation(req: Request, res: Response) {
		try {
			const userId = req?.user?.id || '-1';

			const { id } = req.params;
			const { name, latitude, longitude, address } = req.body;

			// Check if the name already exists
			const existingLocation = await LocationService.findByName(name);

			if (existingLocation && existingLocation.id !== id) {
				return SystemHelper.throwError(req, res, 400, 'Name already in use', 'DUPLICATE_NAME');
			}
			// Fetch location from the database
			const location = await LocationService.getLocationById(id);

			if (!location) {
				return SystemHelper.throwError(req, res, 404, 'Location not found', 'LOCATION_NOT_FOUND');
			}

			// Update location properties
			location.name = name || location.name;
			location.address = address || location.address;
			location.latitude = latitude || location.latitude;
			location.longitude = longitude || location.longitude;
			location.updatedBy = userId || location.updatedBy;
			location.updatedAt = new Date();

			// Save the updated location to the database
			await LocationService.updateLocation(location);

			return SystemHelper.sendResponse(req, res, 200, { location });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error updating location', 'UPDATE_LOCATION_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Delete a location by ID
	public static async deleteLocation(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch location from the database
			const location = await LocationService.getLocationById(id);

			if (!location) {
				return SystemHelper.throwError(req, res, 404, 'location not found', 'LOCATION_NOT_FOUND');
			}

			// Delete location from the database
			await LocationService.deleteLocation(id);

			return SystemHelper.sendResponse(req, res, 200, { message: 'Location deleted successfully' });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error deleting location', 'DELETE_LOCATION_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// List all locations
	public static async listLocations(req: Request, res: Response) {
		try {
			// Fetch all locations from the database
			const locations = await LocationService.listLocations();

			return SystemHelper.sendResponse(req, res, 200, { locations });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching locations', 'FETCH_LOCATIONS_ERROR', {
					errorMeta: err.message,
				});
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}
}
