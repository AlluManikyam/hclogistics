import LocationController from '@Controllers/location.controller'; // Adjust import path as necessary
import Auth from '@Middlewares/auth.middleware'; // Adjust import path as necessary
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
router.post('/create', new Auth(CreateLocationSchema).validate, LocationController.createLocation);

// List all locations
router.get('/list', LocationController.listLocations);

// Get a location by ID
router.get('/:id', LocationController.getLocationById);

// Update a location by ID
router.post('/:id', new Auth(UpdateLocationSchema).validate, LocationController.updateLocation);

// Delete a location by ID
router.post('/delete/:id', LocationController.deleteLocation);

export default router;
