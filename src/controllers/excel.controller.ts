import { Request, Response } from 'express';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const data = [
	{ Name: 'John Doe', Age: 28, City: 'New York' },
	{ Name: 'Jane Smith', Age: 34, City: 'San Francisco' },
	{ Name: 'Michael Johnson', Age: 45, City: 'Chicago' },
];

export default class XLSXController {
	public static async downloadExcel(req: Request, res: Response) {
		const workbook = XLSX.utils.book_new();

		const worksheet = XLSX.utils.json_to_sheet(data);

		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

		const filePath = path.join(__dirname, '../../data.xlsx');

		XLSX.writeFile(workbook, filePath);

		res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

		res.download(filePath, 'data.xlsx', err => {
			if (err) {
				console.error('Error while sending file:', err);
				res.status(500).send('Error downloading file');
			} else {
				fs.unlinkSync(filePath);
			}
		});
	}
}
