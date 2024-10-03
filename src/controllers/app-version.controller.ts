import { Request, Response } from 'express';
import { AppVersion } from '@Models/app-version.model';
import { SystemHelper } from '@Utility/system-helper';
import { v4 as uuidv4 } from 'uuid';
import AppVersionService from '@ServiceHelpers/app-version.service.helper';

export default class AppVersionController {
	constructor() {}

	// Create a new version
	public static async createAppVersion(req: Request, res: Response) {
		try {
			const userId = req?.user?.id || '-1';
			const { title, description, version, additionalInfo } = req.body;

			// Check if the version already exists
			const existingVersion = await AppVersionService.findByVersion(version);

			if (existingVersion) {
				return SystemHelper.throwError(req, res, 400, 'Version already exists', 'DUPLICATE_VERSION');
			}

			// Generate a unique ID for the new version
			const id = uuidv4();
			const createdAt = new Date();
			const updatedAt = new Date();

			const newVersion = new AppVersion(id, title, description, version, additionalInfo, userId, createdAt, userId, updatedAt, false);

			// Save the new version to the database
			await AppVersionService.createAppVersion(newVersion);

			return SystemHelper.sendResponse(req, res, 200, { appVersion: newVersion });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error creating version', 'CREATE_VERSION_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Get app version by ID
	public static async getAppVersionById(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch app version from the database
			const appVersion = await AppVersionService.getAppVersionById(id);

			if (!appVersion) {
				return SystemHelper.throwError(req, res, 404, 'App version not found', 'APP_VERSION_NOT_FOUND');
			}

			return SystemHelper.sendResponse(req, res, 200, { appVersion });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching app version', 'FETCH_APP_VERSION_ERROR', {
					errorMeta: err.message,
				});
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Update app version by ID
	public static async updateAppVersion(req: Request, res: Response) {
		try {
			const userId = req?.user?.id || '-1';
			const { id } = req.params;
			const { title, description, version, additionalInfo } = req.body;

			// Check if the version already exists
			const existingVersion = await AppVersionService.findByVersion(version);

			if (existingVersion && existingVersion.id !== id) {
				return SystemHelper.throwError(req, res, 400, 'Version already in use', 'DUPLICATE_VERSION');
			}
			// Fetch version from the database
			const appVersion = await AppVersionService.getAppVersionById(id);

			if (!appVersion) {
				return SystemHelper.throwError(req, res, 404, 'App version not found', 'APP_VERSION_NOT_FOUND');
			}

			// Update app version properties
			appVersion.title = title || appVersion.title;
			appVersion.description = description || appVersion.description;
			appVersion.version = version || appVersion.version;
			appVersion.additionalInfo = additionalInfo || appVersion.additionalInfo;
			appVersion.updatedBy = userId;
			appVersion.updatedAt = new Date();

			// Save the updated app version to the database
			await AppVersionService.updateAppVersion(appVersion);

			return SystemHelper.sendResponse(req, res, 200, { appVersion });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error updating app version', 'UPDATE_VERSION_ERROR', {
					errorMeta: err.message,
				});
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// Delete app version by ID
	public static async deleteAppVersion(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch app version from the database
			const appVersion = await AppVersionService.getAppVersionById(id);

			if (!appVersion) {
				return SystemHelper.throwError(req, res, 404, 'App version not found', 'APP_VERSION_NOT_FOUND');
			}

			// Delete app version from the database
			await AppVersionService.deleteAppVersion(id);

			return SystemHelper.sendResponse(req, res, 200, { message: 'App version deleted successfully' });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error deleting app version', 'DELETE_APP_VERSION_ERROR', {
					errorMeta: err.message,
				});
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// List all app versions
	public static async listAppVersions(req: Request, res: Response) {
		try {
			// Fetch all app versions from the database
			const appVersions = await AppVersionService.listAppVersions();

			return SystemHelper.sendResponse(req, res, 200, { appVersions });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching app versions', 'FETCH_APP_VERSIONS_ERROR', {
					errorMeta: err.message,
				});
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', {
					errorMeta: 'An unknown error occurred',
				});
			}
		}
	}

	// List all app versions
	public static async getLatestAppVersion(req: Request, res: Response) {
		try {
			// Fetch latest app version from the database
			const appVersion = await AppVersionService.getLatestAppVersion();

			return SystemHelper.sendResponse(req, res, 200, { appVersion });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching latest app version', 'FETCH_LATEST_APP_VERSION_ERROR', {
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
