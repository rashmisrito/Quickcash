const express = require('express');
const router  = express.Router();
const { 
  addCoin,
  coinList, 
  coinById, 
  updateCoin,
  deleteCoin,
} = require('../../controllers/Admin/coin.controller');

const { verifyToken } = require('../../middlewares/admin.middleware');

router.route('/cointId/:id').get(verifyToken,coinById);
router.route('/add').post(verifyToken,addCoin);
router.route('/list').get(verifyToken,coinList);
router.route('/update/:id').patch(verifyToken,updateCoin);
router.route('/delete/:id').delete(verifyToken,deleteCoin);

module.exports = router;

