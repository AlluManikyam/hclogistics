import LocationController from '@Controllers/location.controller';
import { validateUser } from '@Middlewares/api.middleware';
import Auth from '@Middlewares/auth.middleware';
import express from 'express';

const router = express.Router();

// Request schemas
const CreateLocationSchema = {
	name: { type: 'string' },
};

const UpdateLocationSchema = {
	name: { type: 'string', optional: true },
};

// Create a new location
router.post('/create', validateUser, new Auth(CreateLocationSchema).validate, LocationController.createLocation);

// List all locations
router.get('/list', validateUser, LocationController.listLocations);

// Get a location by ID
router.get('/:id', validateUser, LocationController.getLocationById);

// Update a location by ID
router.post('/:id', validateUser, new Auth(UpdateLocationSchema).validate, LocationController.updateLocation);

// Delete a location by ID
router.post('/delete/:id', validateUser, LocationController.deleteLocation);

export default router;
