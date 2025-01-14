const express = require('express');
const router = express.Router();
const { 
  addMoney,
  list, 
 } = require('../controllers/wallet.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
router.route('/add').post(verifyToken,addMoney);
router.route('/list/:id/:account_id').get(verifyToken,list);
module.exports = router;

