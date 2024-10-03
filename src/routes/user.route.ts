import UserController from '@Controllers/user.controller';
import { validateUser } from '@Middlewares/api.middleware';
import Auth from '@Middlewares/auth.middleware';
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
router.post('/create', validateUser, new Auth(CreateUserSchema).validate, UserController.createUser);

// List all users
router.get('/list', validateUser, UserController.listUsers);

// Get a user by ID
router.get('/:id', validateUser, UserController.getUser);

// Update a user by ID
router.post('/:id', validateUser, new Auth(UpdateUserSchema).validate, UserController.updateUser);

// Delete a user by ID
router.post('/delete/:id', validateUser, UserController.deleteUser);

export default router;
