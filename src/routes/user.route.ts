import UserController from '@Controllers/user.controller'; // Adjust import path as necessary
import Auth from '@Middlewares/auth.middleware'; // Adjust import path as necessary
import express from 'express';

const router = express.Router();

// Request schemas
const CreateUserSchema = {
	name: { type: 'string' },
	mobileNumber: { type: 'string' },
	userRole: { type: 'string' },
};

const UpdateUserSchema = {
	name: { type: 'string', optional: true },
	mobileNumber: { type: 'string', optional: true },
	userRole: { type: 'string', optional: true },
};

// Create a new user
router.post('/create', new Auth(CreateUserSchema).validate, UserController.createUser);

// List all users
router.get('/list', UserController.listUsers);

// Get a user by ID
router.get('/:id', UserController.getUser);

// Update a user by ID
router.post('/:id', new Auth(UpdateUserSchema).validate, UserController.updateUser);

// Delete a user by ID
router.post('/delete/:id', UserController.deleteUser);

export default router;
