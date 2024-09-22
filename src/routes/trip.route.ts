import TripController from '@Controllers/trip.controller'; // Adjust import path as necessary
import { validateUser } from '@Middlewares/api.middleware';
import Auth from '@Middlewares/auth.middleware'; // Adjust import path as necessary
import express from 'express';

const router = express.Router();

// Request schemas
const CreateTripSchema = {
	slno: { type: 'string' },
	vehicleNo: { type: 'string' },
	pickupLocation: { type: 'string' },
	transporterId: { type: 'string' },
	productType: { type: 'string' },
	productWeight: { type: 'number' },
	productBillImage: { type: 'string', optional: true },
	pickupProductLocationImage: { type: 'string', optional: true },
	pickBy: { type: 'string', optional: true },
	dropLocation: { type: 'string', optional: true },
	dropProductLocationImage: { type: 'string', optional: true },
	dropBy: { type: 'string', optional: true },
};

const UpdateTripSchema = {
	slno: { type: 'string', optional: true },
	vehicleNo: { type: 'string', optional: true },
	pickupLocation: { type: 'string', optional: true },
	transporterId: { type: 'string', optional: true },
	productType: { type: 'string', optional: true },
	productWeight: { type: 'number', optional: true },
	productBillImage: { type: 'string', optional: true },
	pickupProductLocationImage: { type: 'string', optional: true },
	pickBy: { type: 'string', optional: true },
	dropLocation: { type: 'string', optional: true },
	dropProductLocationImage: { type: 'string', optional: true },
	dropBy: { type: 'string', optional: true },
};

// Create a new trip
router.post('/create', validateUser, new Auth(CreateTripSchema).validate, TripController.createTrip);

// List all trips
router.get('/list', validateUser, TripController.listTrips);

// Get a trip by SLNo
router.get('/:slno', validateUser, TripController.getTripBySlno);

// Update a trip status by SLNo
router.post('/update/trip-status/:slno', validateUser, new Auth(UpdateTripSchema).validate, TripController.updateTripStatus);

// Update a trip by SLNo
router.post('/update/:id', validateUser, TripController.updateTrip);

// Delete a trip by SLNo
router.post('/delete/:slno', validateUser, TripController.deleteTrip);

export default router;
