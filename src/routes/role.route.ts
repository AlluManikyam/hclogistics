import RoleController from '@Controllers/role.controller'; // Adjust import path as necessary
import Auth from '@Middlewares/auth.middleware'; // Adjust import path as necessary
import express from 'express';

const router = express.Router();

// Request schemas
const CreateRoleSchema = {
	name: { type: 'string' },
};

const UpdateRoleSchema = {
	name: { type: 'string', optional: true },
};

// Create a new role
router.post('/create', new Auth(CreateRoleSchema).validate, RoleController.createRole);

// List all roles
router.get('/list', RoleController.listRoles);

// Get a role by ID
router.get('/:id', RoleController.getRoleById);

// Update a role by ID
router.post('/:id', new Auth(UpdateRoleSchema).validate, RoleController.updateRole);

// Delete a role by ID
router.post('/delete/:id', RoleController.deleteRole);

export default router;
