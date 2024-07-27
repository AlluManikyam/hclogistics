import UserController from '@Controllers/tenant.controller';
import Auth from '@Middlewares/auth.middleware';
import express from 'express';
const router = express.Router();

// Request schema
const TenantSchema = {
	name: { type: 'string' },
	description: { type: 'string' },
	image: { type: 'string', optional: true },
};

router.post('/', new Auth(TenantSchema).validate, UserController.checkTenant);

export default router;
