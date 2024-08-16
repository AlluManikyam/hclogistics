import { Request, Response } from 'express';
import { Role } from '@Models/role.model'; // Adjust import path as necessary
import { SystemHelper } from '@Utility/system-helper'; // Adjust import path as necessary
import { v4 as uuidv4 } from 'uuid';
import RoleService from '@ServiceHelpers/role.service.helper'; // Adjust import path as necessary

export default class RoleController {
	constructor() {}

	// Create a new role
	public static async createRole(req: Request, res: Response) {
		try {
			const { name } = req.body;

			// Check if the name already exists
			const existingRole = await RoleService.findByName(name);

			if (existingRole) {
				return SystemHelper.throwError(req, res, 400, 'Name already exists', 'DUPLICATE_NAME');
			}

			// Generate a unique ID for the new role
			const id = uuidv4();
			const createdAt = new Date();
			const updatedAt = new Date();

			const newRole = new Role(id, name, undefined, createdAt, undefined, updatedAt, false);

			// Save the new role to the database
			await RoleService.createRole(newRole);

			return SystemHelper.sendResponse(req, res, 200, { role: newRole });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error creating role', 'CREATE_ROLE_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// Get a role by ID
	public static async getRoleById(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch role from the database
			const role = await RoleService.getRoleById(id);

			if (!role) {
				return SystemHelper.throwError(req, res, 404, 'Role not found', 'ROLE_NOT_FOUND');
			}

			return SystemHelper.sendResponse(req, res, 200, { role });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching role', 'FETCH_ROLE_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// Update a role by ID
	public static async updateRole(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { name } = req.body;

			// Check if the name already exists
			const existingRole = await RoleService.findByName(name);

			if (existingRole && existingRole.id !== id) {
				return SystemHelper.throwError(req, res, 400, 'Name already in use', 'DUPLICATE_NAME');
			}
			// Fetch role from the database
			const role = await RoleService.getRoleById(id);

			if (!role) {
				return SystemHelper.throwError(req, res, 404, 'Role not found', 'ROLE_NOT_FOUND');
			}

			// Update role properties
			role.name = name || role.name;
			role.updatedBy = role.updatedBy;
			role.updatedAt = new Date();

			// Save the updated role to the database
			await RoleService.updateRole(role);

			return SystemHelper.sendResponse(req, res, 200, { role });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error updating role', 'UPDATE_ROLE_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// Delete a role by ID
	public static async deleteRole(req: Request, res: Response) {
		try {
			const { id } = req.params;

			// Fetch role from the database
			const role = await RoleService.getRoleById(id);

			if (!role) {
				return SystemHelper.throwError(req, res, 404, 'Role not found', 'ROLE_NOT_FOUND');
			}

			// Delete role from the database
			await RoleService.deleteRole(id);

			return SystemHelper.sendResponse(req, res, 200, { message: 'Role deleted successfully' });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error deleting role', 'DELETE_ROLE_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}

	// List all roles
	public static async listRoles(req: Request, res: Response) {
		try {
			// Fetch all roles from the database
			const roles = await RoleService.listRoles();

			return SystemHelper.sendResponse(req, res, 200, { roles });
		} catch (err) {
			if (err instanceof Error) {
				return SystemHelper.throwError(req, res, 500, 'Error fetching roles', 'FETCH_ROLES_ERROR', { errorMeta: err.message });
			} else {
				return SystemHelper.throwError(req, res, 500, 'Unknown error occurred', 'UNKNOWN_ERROR', { errorMeta: 'An unknown error occurred' });
			}
		}
	}
}
