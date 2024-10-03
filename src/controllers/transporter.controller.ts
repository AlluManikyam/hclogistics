import { Request, Response } from 'express';
import { Transporter } from '@Models/transporter.model';
import { SystemHelper } from '@Utility/system-helper';
import { v4 as uuidv4 } from 'uuid';
import TransporterService from '@ServiceHelpers/transporter.service.helper';

export default class TransporterController {
	constructor() {}

	// Create a new transporter
	public static async createTransporter(req: Request, res: Response) {
		try {
			const userId = req?.user?.id || '-1';
			const { name } = req.body;

			// Check if the name already exists
			const existingTransporter = await TransporterService.findByName(name);

			if (existingTransporter) {
				return SystemHelper.throwError(req, res, 400, 'Name already exists', 'DUPLICATE_NAME');
			}

			// Generate a unique ID for the new transporter
			const id = uuidv4();
			const createdAt = new Date();
			const updatedAt = new Date();

			const newTransporter = new Transporter(id, name, userId, createdAt, userId, updatedAt, false);

			// Save the new transporter to the database
			await TransporterService.createTransporter(newTransporter);

			return SystemHelper.sendResponse(req, res, 200, { transporter: newTransporter });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error creating transporter', 'CREATE_ROLE_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Get a transporter by ID
	public static async getTransporterById(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch transporter from the database
			const transporter = await TransporterService.getTransporterById(id);

			if (!transporter) {
				return SystemHelper.throwError(req, res, 404, 'Transporter not found', 'TRANSPORTER_NOT_FOUND');
			}

			return SystemHelper.sendResponse(req, res, 200, { transporter });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching transporter', 'FETCH_TRANSPORTER_ERROR', {
					errorMeta: err.message,
				});
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Update a transporter by ID
	public static async updateTransporter(req: Request, res: Response) {
		try {
			const userId = req?.user?.id || '-1';
			const { id } = req.params;
			const { name } = req.body;

			// Check if the name already exists
			const existingTransporter = await TransporterService.findByName(name);

			if (existingTransporter && existingTransporter.id !== id) {
				return SystemHelper.throwError(req, res, 400, 'Name already in use', 'DUPLICATE_NAME');
			}
			// Fetch transporter from the database
			const transporter = await TransporterService.getTransporterById(id);

			if (!transporter) {
				return SystemHelper.throwError(req, res, 404, 'Transporter not found', 'ROLE_NOT_FOUND');
			}

			// Update transporter properties
			transporter.name = name || transporter.name;
			transporter.updatedBy = userId;
			transporter.updatedAt = new Date();

			// Save the updated transporter to the database
			await TransporterService.updateTransporter(transporter);

			return SystemHelper.sendResponse(req, res, 200, { transporter });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error updating transporter', 'UPDATE_TRNSPORTER_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Delete a transporter by ID
	public static async deleteTransporter(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch transporter from the database
			const transporter = await TransporterService.getTransporterById(id);

			if (!transporter) {
				return SystemHelper.throwError(req, res, 404, 'Transporter not found', 'TRNSPORTER_NOT_FOUND');
			}

			// Delete transporter from the database
			await TransporterService.deleteTransporter(id);

			return SystemHelper.sendResponse(req, res, 200, { message: 'Transporter deleted successfully' });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error deleting transporter', 'DELETE_TRNSPORTER_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// List all transporters
	public static async listTransporters(req: Request, res: Response) {
		try {
			// Fetch all transporters from the database
			const transporters = await TransporterService.listTransporters();

			return SystemHelper.sendResponse(req, res, 200, { transporters });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching transporters', 'FETCH_TRNSPORTERS_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}
}
