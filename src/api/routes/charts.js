const express = require('express');
const router = express.Router();
const { saveChart, listCharts, getChart, deleteChart } = require('../controllers/chartsController');
const { verifyToken } = require('../middleware/auth');

router.post('/',    verifyToken, saveChart);
router.get('/',     verifyToken, listCharts);
router.get('/:id',  verifyToken, getChart);
router.delete('/:id', verifyToken, deleteChart);

module.exports = router;
