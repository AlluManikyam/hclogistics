import TripController from '@Controllers/trip.controller'; // Adjust import path as necessary
import Auth from '@Middlewares/auth.middleware'; // Adjust import path as necessary
import express from 'express';

const router = express.Router();

// Request schemas
const CreateTripSchema = {
	slno: { type: 'string' },
	vehicleNo: { type: 'string' },
	pickupLocation: { type: 'string' },
	transporterName: { type: 'string' },
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
	transporterName: { type: 'string', optional: true },
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
router.post('/create', new Auth(CreateTripSchema).validate, TripController.createTrip);

// List all trips
router.get('/list', TripController.listTrips);

// Get a trip by SLNo
router.get('/:slno', TripController.getTripBySlno);

// Update a trip status by SLNo
router.post('/update/trip-status/:slno', new Auth(UpdateTripSchema).validate, TripController.updateTripStatus);

// Update a trip by SLNo
router.post('/update/:slno', TripController.updateTrip);

// Delete a trip by SLNo
router.post('/delete/:slno', TripController.deleteTrip);

export default router;
