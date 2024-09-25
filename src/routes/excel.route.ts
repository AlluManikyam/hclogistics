// routes/excelRoutes.js
import express from 'express';

const router = express.Router();
import XLSXController from '@Controllers/excel.controller';

// Define route for downloading Excel file
router.get('/list', XLSXController.downloadExcel);

export default router;
