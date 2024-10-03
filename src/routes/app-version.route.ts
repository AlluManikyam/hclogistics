import AppVersionController from '@Controllers/app-version.controller';
import { validateUser } from '@Middlewares/api.middleware';
import Auth from '@Middlewares/auth.middleware';
import express from 'express';
import { version } from 'os';

const router = express.Router();

// Request schemas
const CreateAppVersionSchema = {
	title: { type: 'string' },
	version: { type: 'string' },
};

const UpdateAppVersionSchema = {
	title: { type: 'string', optional: true },
	version: { type: 'string' },
};

// Create new app version
router.post('/create', validateUser, new Auth(CreateAppVersionSchema).validate, AppVersionController.createAppVersion);

// List all app versions
router.get('/list', validateUser, AppVersionController.listAppVersions);

// Get latest app version by ID
router.get('/latest', validateUser, AppVersionController.getLatestAppVersion);

// Get app version by ID
router.get('/:id', validateUser, AppVersionController.getAppVersionById);

// Update app version by ID
router.post('/:id', validateUser, new Auth(UpdateAppVersionSchema).validate, AppVersionController.updateAppVersion);

// Delete app version by ID
router.post('/delete/:id', validateUser, AppVersionController.deleteAppVersion);

export default router;
