const express = require('express');
const router = express.Router();
const { 
    addCard,
    cardList, 
    cardById, 
    changePin,
    addCardApi,
    updateCard,
    deleteCard,
    updateCardApi
 } = require('../controllers/card.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.route('/add').post(verifyToken,addCard);
router.route('/list/:id').get(verifyToken,cardList);
router.route('/:id').get(verifyToken,cardById);
router.route('/change-pin').patch(verifyToken,changePin);
router.route('/update/:id').patch(verifyToken,updateCard);
router.route('/delete/:id').delete(verifyToken,deleteCard);

// Mobile App route

router.route('/add-app').post(verifyToken,addCardApi);
router.route('/updateapp/:id').patch(verifyToken,updateCardApi);

module.exports = router;

