import UserController from '@Controllers/user.controller'; // Adjust import path as necessary
import Auth from '@Middlewares/auth.middleware'; // Adjust import path as necessary
import express from 'express';

const router = express.Router();

// Request schemas
const CreateUserSchema = {
	firstName: { type: 'string' },
	lastName: { type: 'string' },
	email: { type: 'string' },
	mobileNumber: { type: 'string' },
	gender: { type: 'string', optional: true },
	profilePic: { type: 'string', optional: true },
	userRole: { type: 'string', optional: true },
	accountStatus: { type: 'string', optional: true },
};

const UpdateUserSchema = {
	firstName: { type: 'string', optional: true },
	lastName: { type: 'string', optional: true },
	email: { type: 'string', optional: true },
	mobileNumber: { type: 'string', optional: true },
	gender: { type: 'string', optional: true },
	profilePic: { type: 'string', optional: true },
	userRole: { type: 'string', optional: true },
	accountStatus: { type: 'string', optional: true },
};

// Create a new user
router.post('/', new Auth(CreateUserSchema).validate, UserController.createUser);

// Get a user by ID
router.get('/:id', UserController.getUser);

// Update a user by ID
router.put('/:id', new Auth(UpdateUserSchema).validate, UserController.updateUser);

// Delete a user by ID
router.delete('/:id', UserController.deleteUser);

// List all users
router.get('/', UserController.listUsers);

export default router;
