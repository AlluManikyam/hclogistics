import { Request, Response } from 'express';
import { User } from '@Models/user.model'; // Adjust import path as necessary
import { SystemHelper } from '@Utility/system-helper'; // Adjust import path as necessary
import { v4 as uuidv4 } from 'uuid';
import UserService from '@ServiceHelpers/user.service.helper'; // Adjust import path as necessary

export default class UserController {
	constructor() {}

	// Create a new user
	public static async createUser(req: Request, res: Response) {
		try {
			const { name, mobileNumber, userRole } = req.body;

			// Check if the mobile number already exists
			const existingUser = await UserService.findByMobileNumber(mobileNumber);

			if (existingUser) {
				return SystemHelper.throwError(req, res, 400, 'Mobile number already exists', 'DUPLICATE_MOBILE_NUMBER');
			}

			// Generate a unique ID for the new user
			const id = uuidv4();
			const createdAt = new Date();
			const updatedAt = new Date();

			const newUser = new User(
				id,
				name,
				mobileNumber,
				userRole,
				undefined,
				undefined, // createdBy
				createdAt,
				undefined, // updatedBy
				updatedAt,
				false,
			);

			// Save the new user to the database
			await UserService.createUser(newUser);

			return SystemHelper.sendResponse(req, res, 200, { user: newUser });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error creating user', 'CREATE_USER_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// Get a user by ID
	public static async getUser(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch user from the database
			const user = await UserService.getUserById(id);

			if (!user) {
				return SystemHelper.throwError(req, res, 404, 'User not found', 'USER_NOT_FOUND');
			}

			return SystemHelper.sendResponse(req, res, 200, { user });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching user', 'FETCH_USER_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// Update a user by ID
	public static async updateUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { name, mobileNumber, userRole, accountStatus } = req.body;

			// Fetch user from the database
			const user: any = await UserService.getUserById(id);

			if (!user) {
				return SystemHelper.throwError(req, res, 404, 'User not found', 'USER_NOT_FOUND');
			}

			// Check if the mobile number already exists
			const existingUser = await UserService.findByMobileNumber(mobileNumber);

			if (existingUser && existingUser.id !== id) {
				return SystemHelper.throwError(req, res, 400, 'Mobile number already in use', 'DUPLICATE_MOBILE_NUMBER');
			}

			// Update user properties
			user.name = name || user.name;
			user.mobileNumber = mobileNumber || user.mobile_number;
			user.userRole = userRole || user.user_role;
			user.accountStatus = accountStatus || user.account_status;
			user.updatedAt = new Date();

			// Save the updated user to the database
			await UserService.updateUser(user);

			const updatedUser = await UserService.getUserById(id);

			return SystemHelper.sendResponse(req, res, 200, { user: updatedUser });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error updating user', 'UPDATE_USER_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// Delete a user by ID
	public static async deleteUser(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch user from the database
			const user = await UserService.getUserById(id);

			if (!user) {
				return SystemHelper.throwError(req, res, 404, 'User not found', 'USER_NOT_FOUND');
			}

			// Delete user from the database
			await UserService.deleteUser(id);

			return SystemHelper.sendResponse(req, res, 200, { message: 'User deleted successfully' });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error deleting user', 'DELETE_USER_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// List all users
	public static async listUsers(req: Request, res: Response) {
		try {
			// Fetch all users from the database
			const users = await UserService.listUsers();

			return SystemHelper.sendResponse(req, res, 200, { users });
		} catch (err) {
			// Disable the 'no-throw-literal' rule for this line only
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching users', 'FETCH_USERS_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}
}
