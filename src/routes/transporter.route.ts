import TransporterController from '@Controllers/transporter.controller';
import { validateUser } from '@Middlewares/api.middleware';
import Auth from '@Middlewares/auth.middleware';
import express from 'express';

const router = express.Router();

// Request schemas
const CreateTransporterSchema = {
	name: { type: 'string' },
};

const UpdateTransporterSchema = {
	name: { type: 'string', optional: true },
};

// Create a new transporter
router.post('/create', validateUser, new Auth(CreateTransporterSchema).validate, TransporterController.createTransporter);

// List all transporters
router.get('/list', validateUser, TransporterController.listTransporters);

// Get a transporter by ID
router.get('/:id', validateUser, TransporterController.getTransporterById);

// Update a transporter by ID
router.post('/:id', validateUser, new Auth(UpdateTransporterSchema).validate, TransporterController.updateTransporter);

// Delete a transporter by ID
router.post('/delete/:id', validateUser, TransporterController.deleteTransporter);

export default router;
