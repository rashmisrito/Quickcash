const { mongoose} = require("mongoose");
const { Wallet } = require('../models/wallet.model');
const { Account } = require('../models/account.model');

module.exports = {
  addMoney: async(req,res) => {
    const {user,currency,amount,transactionType,account,status} = req.body;
     try {
       if(user == "" || currency == "" || amount == "" || transactionType == "") {
          return res.status(401).json({
            status: 401,
            message: "All fields are mandatory",
            data: null
          })
       }

       const getBalanceDetails = await Account.findOne({currency: currency});

       var finalAmount = 0
       if(getBalanceDetails?.amount) {
        finalAmount = parseFloat(getBalanceDetails?.amount) + parseFloat(amount);
       }
   
       const wallet = await Wallet.create({
        user,
        account,
        currency: currency ? currency: '',
        transactionType: transactionType ? transactionType : '',
        type: 'Add Money',
        transactionFee: amount ? parseFloat(amount)*(1/100): 0,
        transactionAmount: amount,
        status: "Pending"
       })
    
       if(!wallet) {
         return res.status(401).json({
          status: 401,
          message: "Error while inserting add money data",
          data: null
         })
       }
       
        return res.status(200).json({
          status: 201,
          message: "Add money through bank transfer has been submitted !!!",
          data:wallet
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: 500,
          message: "Something went wrong with api",
          data: error
        })
      }
  },
  list: async(req,res) => {
      
    const user_id = req.params.id; 
    const account_id = req.params.account_id; 
    const ObjectId = mongoose.Types.ObjectId;

    try {
      if(!user_id) {
        return res.status(402).json({
          status: 402,
          message: "User Id is missing",
          data: null
        })
      }

      if(!account_id) {
        return res.status(402).json({
          status: 402,
          message: "Account Id is missing",
          data: null
         })
      }

      const listDetails = await Wallet.find({
        user: new ObjectId(user_id),
        account: new ObjectId(account_id),
      })

      if(!listDetails) {
        return res.status(402).json({
          status: 402,
          message: "Error while fetching add money list!!!",
          data: null,
        })
      }
 
      return res.status(201).json({
        status:201,
        message: "list are fetched Successfully",
        data: listDetails,
      })

     } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: 500,
          message: "Error while fetching add money list!!!",
          data: error
        })
     }
  }
}
