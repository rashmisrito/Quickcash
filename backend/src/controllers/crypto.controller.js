const fs = require('fs');
const path = require('path');
const { mongoose} = require("mongoose");
const { default: axios } = require("axios");
const { User } = require("../models/user.model");
const baseUrl = "https://sandbox-api.fireblocks.io";
const { FireblocksSDK } = require('fireblocks-sdk');
const { Crypto } = require('../models/crypto.model');
const { Account } = require("../models/account.model");
const { Revenue } = require("../models/revenue.model");
const { SwapOrder } = require("../models/swaporder.model");
const { Transaction } = require("../models/transaction.model");
const { addNotification } = require("../middlewares/notification.middleware");
const { WalletAddressRequest } = require("../models/walletAddressRequest.model");

//const productionbaseUrl = "https://api.fireblocks.io";
const apiSecret = fs.readFileSync(path.resolve("fireblocks_secret.key"), "utf8");
let fireblocks = new FireblocksSDK(apiSecret, process.env.FIREBLOCK_SECRET_KEY, baseUrl);

module.exports = {
  // add Transactions 
  addTransaction: async(req,res) => {
    const {user,amount,paymentType,coin,noOfCoins,side,fee,status,walletAddress,currencyType} = req.body;
    try {
      if(user == "" || noOfCoins == "" || amount == "" || paymentType == "" || currencyType == "") {
        return res.status(401).json({
          status: 401,
          message: "All fields are mandatory",
          data: null
        })
      }

      if(walletAddress == "") {
        return res.status(401).json({
          status: 401,
          message: "Wallet Address is missing",
          data: null
        })
      }

      const checkBalance = await Account.findOne({currency:currencyType, user:user});

      if(!checkBalance) {
        return res.status(401).json({
          status: 401,
          message: "User doesn't have account related to this currency",
          data: null
        })
      }

      if(checkBalance?.amount < amount) {
        return res.status(401).json({
          status: 401,
          message: "User doesn't have sufficient balance",
          data: null
        })
      }
    
      const crypto = await Crypto.create({
        user,
        account: checkBalance?._id,
        noOfCoins,
        coin,
        side,
        amount,
        paymentType,
        walletAddress,
        currencyType,
        fee,
        status: status
      })
    
      if(!crypto) {
        return res.status(401).json({
          status: 401,
          message: "Error while inserting or inserting crypto data",
          data: null
        })
      }

      await addNotification(user,title=`New Crypto Order has been placed by the ${req?.user?.name} `,tags=`Crypto, ${req?.user?.name}`,message="New Crypto Order has been placed",notifyFrom="user",notifyType="crypto",attachment="",info=`Crypto Coin ${coin} ${side} - order placed by the ${req?.user?.name} `);
                 
      return res.status(200).json({
        status: 201,
        message: "Crypto Transactions successfully !!!",
        data:crypto
      })

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Crypto Transactions Failed",
        data: error
      })
    }
  },
  sellCrypto: async(req,res) => {
    const ObjectId = mongoose.Types.ObjectId;
    const {user,coin,amount,noOfCoins,side,currencyType,fee,status} = req.body;
    try {
      if(user == "" || noOfCoins == "" || amount == "" || currencyType == "") {
        return res.status(401).json({
          status: 401,
          message: "All fields are mandatory",
          data: null
        });
      }
      
      const checkBalance = await Account.findOne({ user: new ObjectId(user), currency:currencyType});

      if(!checkBalance) {
        return res.status(401).json({
          status: 401,
          message: "User doesn't have an account related to this currency",
          data: null
        });
      }
    
      const cryptos = await Crypto.create({
        user,
        account: checkBalance?._id,
        noOfCoins,
        coin,
        side,
        amount,
        fromAmount: amount,
        currencyType,
        fromCurrency:currencyType,
        fee,
        status: status
      });
    
      if(!cryptos) {
        return res.status(401).json({
          status: 401,
          message: "Error while inserting crypto data",
          data: null
        });
      }

      const revenueDetails = await Crypto.findOne({_id: cryptos?._id});
        
      if(revenueDetails?.fromCurrency == "USD") {
        var convertAmountRev = revenueDetails?.fee;
      } else {
        var convertAmountRev = await convertCurrencyAmount(revenueDetails?.currencyType,"USD",revenueDetails?.fee);
      }

      await Transaction.create({
        user: revenueDetails?.user,
        source_account:revenueDetails?.account,
        transfer_account:revenueDetails?.account,
        info:`Crypto ${revenueDetails?.side} Transaction`,
        trans_type: "Crypto",
        from_currency:revenueDetails?.currencyType,
        amount: parseFloat(revenueDetails?.amount) - parseFloat(revenueDetails?.fee),
        tr_type: 'Crypto',
        extraType: "credit",
        postBalance: (parseFloat(checkBalance?.amount) + parseFloat(revenueDetails?.amount)) - parseFloat(revenueDetails?.fee),
        status: "Success",
        fee:revenueDetails?.fee,
        to_currency: revenueDetails?.currencyType,
        addedBy:"",
        amountText:"",
        conversionAmount: 0,
        conversionAmountText:'',
        trx:Math.floor(Math.random() * 999999999999),
        ttNumber: Math.floor(Math.random() * 999999999999),
        dashboardAmount: revenueDetails?.currencyType == "USD" ? Math.abs(parseFloat(revenueDetails?.amount) - parseFloat(revenueDetails?.fee)) : await convertCurrencyAmount(revenueDetails?.currencyType,"USD",parseFloat(revenueDetails?.amount) - parseFloat(revenueDetails?.fee))
      });
        
      console.log("USD RATE",revenueDetails?.currencyType != "USD" ? await getCurrencyRate(revenueDetails?.currencyType,"USD") : 0);

      await Revenue.create({
        user:revenueDetails?.user,
        fee:revenueDetails?.fee,
        fromCurrency:revenueDetails?.currencyType,
        toCurrency:revenueDetails?.currencyType,
        amount:parseFloat(revenueDetails?.amount) - parseFloat(revenueDetails?.fee),
        info:"Crypto "+revenueDetails?.side,
        usdRate: revenueDetails?.currencyType != "USD" ? await getCurrencyRate(revenueDetails?.currencyType,"USD") : 0,
        trans_type:"Crypto",
        convertAmount:convertAmountRev,
        status: "Success"
      });

      const previousWalletData = await WalletAddressRequest.findOne({user: new ObjectId(user), coin: revenueDetails?.coin});

      await WalletAddressRequest.findOneAndUpdate(
      {
        user: new ObjectId(user),
        coin: revenueDetails?.coin
      },
      {
        noOfCoins: parseFloat(previousWalletData?.noOfCoins) - parseFloat(revenueDetails?.noOfCoins)
      },
      {
        new: true,
      }
      )

      await Account.findOneAndUpdate(
      {
        user: new ObjectId(user),
        currency:revenueDetails?.currencyType
      },
      {
        amount: (parseFloat(checkBalance?.amount) + parseFloat(revenueDetails?.amount)) - parseFloat(revenueDetails?.fee)
      },
      {
        new: true,
      });

      const UpdateCryptoTransaction = await Crypto.findOneAndUpdate(
      {
        _id: cryptos?._id
      },
      {
        status: "completed"
      },
      {
        new: true
      });
            
      if(!UpdateCryptoTransaction) {
        return res.status(401).json({
          status: 401,
          message: "Error while updating crypto data",
          data: null
        });
      }   

      await addNotification(user,title=`Crypto Coin ${coin?.replace("_TEST","")} Sell by the user`,tags=`Crypto, ${status}`,message="Crypto Sell by the user",notifyFrom="user",notifyType="crypto",attachment="",info=`Crypto Sell by the User`)
             
      return res.status(200).json({
        status: 201,
        message: "Crypto Transactions Successfully updated!!!",
        data:cryptos
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Crypto Transactions Failed",
        data: error
      });
    }
  },
  // List of all transactions
  list: async(req,res) => {

   const user_id = req.params.id; 
   const ObjectId = mongoose.Types.ObjectId;
     
   try {
    if(!user_id) {
      return res.status(402).json({
        status: 402,
        message: "User Id is missing",
        data: null
      })
    }

  const listDetails = await Crypto.aggregate([
  {
    $match: {
      user: new ObjectId(user_id)
    }
  },
  {
    $lookup: {
     "from": "users",
     "localField": "user",
     "foreignField": "_id",
     "as": "userDetails"
    }
  },
  {$sort: {updatedAt: -1}},
  {
    $project: {
      _id:1,
      user:1,
      coin:1,
      walletAddress:1,
      noOfCoins:1,
      paymentType:1,
      fee:1,
      side:1,
      amount:1,
      status:1,
      currencyType:1,
      createdAt:1,
      userDetails: {
      _id: 1,
      name: 1,
      email: 1,
      mobile: 1,      
      address: 1,
      city: 1,
      country: 1,
      defaultCurrency: 1,
      status:1,
    }
   }
  },
 ])

  if(!listDetails) {
    return res.status(402).json({
      status: 402,
      message: "Error while fetching Crypto list!!!",
      data: null,
    });
  }
 
  return res.status(201).json({
    status:201,
    message: "crypto list are fetched Successfully",
    data: listDetails,
  });

  } catch (error) {
    console.log(error);
     return res.status(500).json({
      status: 500,
      message: "Error while fetching crypto list!!!",
      data: error
    });
  }
  },
  listByCoinId: async(req,res) => {

    const coinId = req.params.id; 
    const ObjectId = mongoose.Types.ObjectId;
      
    try {
     if(!coinId) {
       return res.status(402).json({
         status: 402,
         message: "Coin Id is missing",
         data: null
       })
     }
 
   const listDetails = await Crypto.aggregate([
   {
     $match: {
      user: new ObjectId(req?.user?._id),
      coin: coinId
     }
   },
   {
     $lookup: {
      "from": "users",
      "localField": "user",
      "foreignField": "_id",
      "as": "userDetails"
     }
   },
   {$sort: {updatedAt: -1}},
   {
     $project: {
        _id:1,
        user:1,
        coin:1,
        walletAddress:1,
        noOfCoins:1,
        paymentType:1,
        fee:1,
        side:1,
        amount:1,
        status:1,
        currencyType:1,
        createdAt:1,
        userDetails: {
        _id: 1,
        name: 1,
        email: 1,
        mobile: 1,      
        address: 1,
        city: 1,
        country: 1,
        defaultCurrency: 1,
        status:1,
       }
      }
     },
    ])
 
   if(!listDetails) {
     return res.status(402).json({
       status: 402,
       message: "Error while fetching Crypto list!!!",
       data: null,
     })
   }

   console.log("Coin Transaction Data", listDetails);
  
   return res.status(201).json({
     status:201,
     message: "crypto list are fetched Successfully",
     data: listDetails,
   })
 
   } catch (error) {
     console.log(error);
      return res.status(500).json({
       status: 500,
       message: "Error while fetching crypto list!!!",
       data: error
     })
   }
  },
  updateTransaction: async(req,res) => {
    const {status,amount,currencyType,userid,id} = req.body;
    const ObjectId = mongoose.Types.ObjectId;
    console.table(req.body);
    try {

      if(status == "" || userid == "") {
        return res.status(401).json({
          status: 401,
          message: "Either status is missing or user Id mandatory",
          data: null
        })
      }

      const CryptoTransactionDetails = await Crypto.findOne({_id:id});

      if(!CryptoTransactionDetails) {
        return res.status(401).json({
          status: 401,
          message: "Something wrong with api",
          data: null
        })
      }
    
      if(status == "completed") {

        const checkBalance = await Account.findOne({currency:CryptoTransactionDetails?.currencyType, user:userid});

        if(parseFloat(checkBalance?.amount) + parseFloat(CryptoTransactionDetails?.fee) < amount) {
          return res.status(401).json({
            status: 401,
            message: "User doesn't have sufficient balance",
            data: null
          });
        }

        const revenueDetails = await Crypto.findOne({_id: id});
        
        if(revenueDetails?.currencyType == "USD") {
          var convertAmountRev = revenueDetails?.fee;
        } else {
          var convertAmountRev = await convertCurrencyAmount(revenueDetails?.currencyType,"USD",revenueDetails?.fee);
        }

        await Transaction.create({
          user: revenueDetails?.user,
          source_account:revenueDetails?.account,
          transfer_account:revenueDetails?.account,
          info:`Crypto ${revenueDetails?.side} Transaction`,
          trans_type: "Crypto",
          from_currency:revenueDetails?.currencyType,
          amount:revenueDetails?.amount,
          tr_type: 'Crypto',
          extraType: "debit",
          postBalance: (parseFloat(checkBalance?.amount)) - (parseFloat(revenueDetails?.amount) + parseFloat(revenueDetails?.fee)),
          status: "Success",
          fee:revenueDetails?.fee,
          to_currency: revenueDetails?.currencyType,
          addedBy:"",
          amountText:"",
          conversionAmount: 0,
          conversionAmountText:'',
          trx:Math.floor(Math.random() * 999999999999),
          ttNumber: Math.floor(Math.random() * 999999999999),
          dashboardAmount: revenueDetails?.currencyType == "USD" ? Math.abs(parseFloat(revenueDetails?.amount)) : await convertCurrencyAmount(revenueDetails?.currencyType,"USD",revenueDetails?.amount)
        });
        
        await Revenue.create({
          user:revenueDetails?.user,
          fee:revenueDetails?.fee,
          fromCurrency:revenueDetails?.currencyType,
          toCurrency:revenueDetails?.currencyType,
          amount:revenueDetails?.amount,
          info:"Crypto "+revenueDetails?.side,
          trans_type:"Crypto",
          usdRate: revenueDetails?.currencyType != "USD" ? await getCurrencyRate(revenueDetails?.currencyType,"USD") : 0,
          convertAmount:convertAmountRev,
          status: "Success"
        });

        const previousWalletData = await WalletAddressRequest.findOne({user: new ObjectId(userid), coin: revenueDetails?.coin});

        await WalletAddressRequest.findOneAndUpdate(
        {
          user: userid,
          coin: revenueDetails?.coin
        },
        {
          noOfCoins: parseFloat(previousWalletData?.noOfCoins) + parseFloat(revenueDetails?.noOfCoins)
        },
        {
         new: true,
        }
        )

        await Account.findOneAndUpdate(
        {
          user: new ObjectId(userid),
          currency:revenueDetails?.currencyType
        },
        {
          amount: parseFloat(checkBalance?.amount) - (parseFloat(revenueDetails?.amount)+parseFloat(revenueDetails?.fee))
        },
        {
          new: true,
        });

      }

      const UpdateCryptoTransaction = await Crypto.findOneAndUpdate(
      {
        _id: id
      },
      {
        status: status
      },
      {
        new: true
      });
            
      if(!UpdateCryptoTransaction) {
        return res.status(401).json({
          status: 401,
          message: "Error while updating crypto data",
          data: null
        });
      }  

      await addNotification(userid,title=`Crypto Order for Coin ${CryptoTransactionDetails?.coin?.replace("_TEST","")} status has been updated by the admin`,tags=`Crypto, ${status}`,message="Crypto status has been updated by the admin",notifyFrom="admin",notifyType="crypto",attachment="",info=`Crypto status ${status} has been updated by the admin`)
             
      return res.status(200).json({
        status: 201,
        message: "Crypto Fiat Transactions Successfully updated!!!",
        data:Crypto
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Crypto Fiat Transactions Failed",
        data: error
      });
    }
  },
  // list of all transactions for admin
  adminlist: async(req,res) => {
     
  try {
   //const listDetails = await Crypto.find({});

   const ObjectId = mongoose.Types.ObjectId;
   const listDetails = await Crypto.aggregate([
     {
      $lookup: {
       "from": "users",
       "localField": "user",
       "foreignField": "_id",
       "as": "userDetails"
      }
     },
     {$sort: {createdAt: -1}},
     {
      $project: {
       _id:1,
       user:1,
       coin:1,
       walletAddress:1,
       noOfCoins:1,
       fee:1,
       side:1,
       amount:1,
       status:1,
       currencyType:1,
       createdAt:1,
       userDetails: {
       _id: 1,
       name: 1,
       email: 1,
       mobile: 1,      
       address: 1,
       city: 1,
       country: 1,
       defaultCurrency: 1,
       status:1,
      }
     }
    },
   ])

   if(!listDetails) {
     return res.status(402).json({
       status: 402,
       message: "Error while fetching Crypto list!!!",
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
       message: "Error while fetching crypto list!!!",
       data: error
     })
   }
  },
  adminlistbyid: async(req,res) => {
     
    try {

     const ObjectId = mongoose.Types.ObjectId;
     const listDetails = await Crypto.aggregate([
     {
      $match: {
       _id: new ObjectId(req?.params?.id)
      }
     },
     {
      $lookup: {
       "from": "users",
       "localField": "user",
       "foreignField": "_id",
       "as": "userDetails"
      }
     },
     {
      $lookup: {
       "from": "accounts",
       "localField": "account",
       "foreignField": "_id",
       "as": "accountDetails"
      }
     },
     {
      $project: {
       _id:1,
       user:1,
       coin:1,
       walletAddress:1,
       noOfCoins:1,
       fee:1,
       side:1,
       amount:1,
       status:1,
       currencyType:1,
       createdAt:1,
       userDetails: {
       _id: 1,
       name: 1,
       email: 1,
       mobile: 1,      
       address: 1,
       city: 1,
       country: 1,
       defaultCurrency: 1,
       status:1,
      },
      accountDetails: {
        _id: 1,
        name: 1,
        iban:1,
        ibanText:1,
        bic_code:1,
        status:1,
      }
     }
    },
    ])

    if(!listDetails) {
     return res.status(402).json({
      status: 402,
      message: "Error while fetching Crypto list!!!",
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
       message: "Error while fetching crypto list!!!",
       data: error
     })
    }
  },
  // get wallet address for all coins
  getWalletAddress: async(req,res) => {
    try {

      const checkVaultAccountIdExists = await User.findOne({email: req.params.email});
      var vaultAccountId = '1';

      if(checkVaultAccountIdExists?.vaultAccountId) {
        vaultAccountId = checkVaultAccountIdExists?.vaultAccountId;
      }

      const coinExists = await WalletAddressRequest.findOne({  coin: req.params.id , user: checkVaultAccountIdExists?._id });

      if(!coinExists) {
        return res.status(401).json({
          status:401,
          message: "Wallet Address is not available please request wallet address",
          data: null,
        })
      }

      const assetId = req.params.id;
      const myNewVault = await fireblocks.getPaginatedAddresses(vaultAccountId,assetId);
      
      if(myNewVault.addresses.length == 0) {
        return res.status(401).json({
          status:401,
          message: "Wallet Address is not available please request wallet address",
          data: myNewVault,
        })
      }

      return res.status(200).json({
        status:200,
        message: "Response",
        data: myNewVault,
      });

    } catch (error) {
      console.log(error);
      return res.status(402).json({
        status:402,
        message: "Response",
        data: error
      })
    }
  },
  // Insert New Wallet address for particular coin requested by the user
  createWalletAddress: async(req,res) => {
    const {vaultAccountId,assetId} = req.body;
    const createWalletAdd = await createVaultWalletAddress(vaultAccountId,assetId);
    if(createWalletAdd) {
      return res.status(200).json({
        status:200,
        message: "Response",
        data: createWalletAdd,
      })
    } else {
      return res.status(401).json({
        status:401,
        message: "Error while requesting wallet address",
        data: null,
      })
    }
  },
  // Place a order buy/sell for limit order , market order and stop loss order
  addSwapOrder: async(req,res) => {
    const {user,coinPair,amount,account,orderType,side,status,currencyType,marketPrice,limitPrice,stopPrice} = req.body;
    
    try {
      if(user == "" || amount == "" || currencyType == "") {
        return res.status(401).json({
          status: 401,
          message: "All fields are mandatory",
          data: null
        })
      }

      const checkBalance = await Account.findOne({currency:currencyType});

      if(!checkBalance) {
        return res.status(401).json({
          status: 401,
          message: "User doesn't have account related to this currency",
          data: null
        })
      }

      if(checkBalance?.amount < amount) {
        return res.status(401).json({
          status: 401,
          message: "User doesn't have sufficient balance",
          data: null
        })
      }
    
      const crypto = await SwapOrder.create({
        user,
        account: checkBalance?._id,
        coinPair,
        side,
        amount,
        noOfCoins: side == "BUY" ? amount / marketPrice : amount,
        currency:currencyType,
        orderType,
        marketPrice,
        limitPrice,
        stopPrice,
        status: status
      });

      if(!crypto) {
        return res.status(401).json({
          status: 401,
          message: "Error while inserting crypto data",
          data: null
        })
      }

      // const transaction = await Transaction.create({
      //   user,
      //   source_account:account,
      //   receipient,
      //   info,
      //   iban,
      //   bic,
      //   trans_type: tr_type == "rbank-transfer" ? "External Transfer" : "Beneficiary Transfer Money",
      //   tr_type: tr_type == "rbank-transfer" ? "bank-transfer" : tr_type,
      //   country,
      //   from_currency,
      //   status,
      //   transfer_account:account,
      //   to_currency,
      //   addedBy,
      //   trx:Math.floor(Math.random() * 999999999999),
      //   amount: parseFloat(amount),
      //   amountText: req?.body?.amountText,
      //   postBalance: parseFloat(remainingBalance?.amount),
      //   extraType: 'debit',
      //   fee: req?.body?.fee,
      //   conversionAmount: req?.body?.conversionAmount,
      //   conversionAmountText: req?.body?.conversionAmountText,
      //   dashboardAmount: from_currency == "USD" ? Math.abs(parseFloat(req?.body?.amount)) : await convertCurrencyAmount(from_currency,"USD",req?.body?.amount)
      // });

      const updatedBalance = await Account.findOneAndUpdate(
      {
        currency:currencyType
      },
      {
        amount: checkBalance?.amount - amount
      },
      {
        new: true,
      });
                 
      return res.status(200).json({
        status: 201,
        message: "Crypto Fiat Transaction added successfully !!!",
        data:Crypto,
        accountBalance:updatedBalance?.amount
      })

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Crypto Fiat Transaction has been Failed",
        data: error
      })
    }
  },
  // Get Open Orders List API
  openSwapOrders: async(req,res) => {
    const userId = req.params.id;
    if(!userId) {
      return res.status(401).json({
        status: 401,
        message: "User Id is missing",
        data: null
      })
    }

    const ordersList = await SwapOrder.find({user: userId});

    if(!ordersList) {
      return res.status(401).json({
        status: 401,
        message: "Error while fetching open orders list",
        data: null
      })
    }

    return res.status(201).json({
      status: 201,
      message: "All fields are mandatory",
      data: ordersList
    })

  },
  calculateCrypto: async(req,res) => {
    try {

      const {amount,currency,coin,side} = req.body;

      if(amount == 0 || currency == '' || coin == '') {
        return res.status(401).json({
          status: 401,
          message: "Make sure you have fill amount,currency and coin",
          data: null
        })
      }

      let currencySymbol = '';

      if(currency == "EUR" || currency == "GBP" || currency == "AUD" || currency == "JPY") {
        currencySymbol = coin+currency;
      } else {
        currencySymbol = coin+'USDT';
      }

      const fetchPriceOfCrypto = await fetchCryptoSymbolPrice(currencySymbol);

      if(fetchPriceOfCrypto == 0) {
        return res.status(401).json({
          status: 401,
          message: "Selected Currency is not available for trade in this coin",
          data: null
        }); 
      } else {

        let rate = 0;
        let totalFees = 0;
        let cryptoFees = 0;
        let exChangeFees = 0;
        let convertedAmount = 0;

        if(currency == "EUR" || currency == "GBP") {
          convertedAmount  = parseFloat(amount)/parseFloat(fetchPriceOfCrypto);
        } else {
          rate = await convertCurrencyAmount(currency,"USD",1);
          convertedAmount  = parseFloat(amount*rate) / parseFloat(fetchPriceOfCrypto);
          if(currency == "USD") {
            exChangeFees = 0;
          } else {
            exChangeFees = await fetchFees("Exchange",amount);
          }
        }

        cryptoFees = await fetchFees(side == "buy" ? 'Crypto_Buy' : 'Crypto_Sell',amount);

        return res.status(201).json({
          status: 201,
          message: "Success",
          data: {
            "rate": 1/parseFloat(fetchPriceOfCrypto),
            "numberofCoins": convertedAmount,
            "fees": cryptoFees+exChangeFees,
            "cryptoFees": cryptoFees,
            "exchangeFees": exChangeFees
          }
        }); 
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Something went wrong with the API",
        data: null
      }); 
    }
  },
  fetchNoOfCoins:  async(req,res) => {
    
    const coinId = req.params.id; 
    const ObjectId = mongoose.Types.ObjectId;

    try {
     if(!coinId) {
       return res.status(402).json({
         status: 402,
         message: "Coin Id is missing",
         data: null
       })
     }
 
   const listDetails = await WalletAddressRequest.findOne({ coin : coinId , user: new ObjectId(req?.user._id) });
 
   if(!listDetails) {
     return res.status(402).json({
      status: 402,
      message: "No of Coins not found",
      data: null,
     });
   }

   return res.status(201).json({
    status:201,
    message: "crypto coins are fetched Successfully",
    data: listDetails?.noOfCoins,
   });
 
   } catch (error) {
     console.log(error);
      return res.status(500).json({
      status: 500,
      message: "Error while fetching crypto list!!!",
      data: error
     })
   }
  },
  calculateSymbolPrice: async(req,res) => {
    try {

      const {coin,currency,noOfCoins} = req.body;

      if(noOfCoins < 0 || currency == '' || coin == '') {
        return res.status(401).json({
          status: 401,
          message: "Make sure you have fill number of amounts,currency and coin",
          data: null
        })
      }

      let currencySymbol = '';

      if(currency == "EUR" || currency == "GBP" || currency == "AUD" || currency == "JPY") {
        currencySymbol = coin+currency;
      } else {
        currencySymbol = coin+'USDT';
      }

      const fetchPriceOfCrypto = await fetchCryptoSymbolPrice(currencySymbol);

      console.log("fetchPriceOfCrypto", fetchPriceOfCrypto);

      if(fetchPriceOfCrypto == 0) {
        return res.status(401).json({
          status: 401,
          message: "Selected Currency is not available for trade in this coin",
          data: null
        }); 
      } else {

        let rate = 0;
        let cryptoFees = 0;
        let exChangeFees = 0;
        let convertedAmount = 0;

        let getValueAmount = noOfCoins*fetchPriceOfCrypto;

        if(currency == "EUR" || currency == "GBP") {
          convertedAmount  = parseFloat(noOfCoins)*parseFloat(fetchPriceOfCrypto);
        } else {
          rate = await convertCurrencyAmount("USD",currency,1);
          if(currency == "USD") {
            exChangeFees = 0;
            convertedAmount  = parseFloat(getValueAmount);
          } else {
            convertedAmount  = parseFloat(getValueAmount) * parseFloat(rate);
            exChangeFees = await fetchFees("Exchange",getValueAmount);
          }
        }

        cryptoFees = await fetchFees('Crypto_Sell',getValueAmount);

        return res.status(201).json({
          status: 201,
          message: "Success",
          data: {
            "amount": parseFloat(convertedAmount).toFixed(2),
            "fees": cryptoFees+exChangeFees,
            "cryptoFees": cryptoFees,
            "exchangeFees": exChangeFees
          }
        }); 
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Something went wrong with the API",
        data: null
      }); 
    }
  },
  fetchExchangeValues: async(req,res) => {

    const ObjectId = mongoose.Types.ObjectId;
    try {

      const {user,amount,fromCurrency,toCurrency} = req.body;

      if(user == "" || amount == 0 || fromCurrency == '' || toCurrency == '') {
        return res.status(401).json({
          status: 401,
          message: "Make sure you have fill amount,fromCurrency and toCurrency",
          data: null
        });
      }

      const sourceAccountInfo   = await Account.findOne({ user: new ObjectId(user), currency: fromCurrency });
      const transferAccountInfo = await Account.findOne({ user: new ObjectId(user), currency: toCurrency });

      let rate = 0;
      let totalFees = 0;
      let convertedAmount = 0;
        
      totalFees = await fetchFees("Exchange",amount);
      rate = await convertCurrencyAmount(fromCurrency,toCurrency,1);
      convertedAmount = amount * rate;

      if(parseFloat(sourceAccountInfo?.amount) < (parseFloat(totalFees)+parseFloat(amount))) {
        return res.status(401).json({
          status: 401,
          message: "We regret to inform you that you have not sufficient amount of balance in your account, please make sure Total amount should be less than or equal to current balance amount",
          data: null
        });
      }

      return res.status(201).json({
        status: 201,
        message: "Success",
        data: {
          "rate": rate,
          "totalFees": totalFees,
          "totalCharge": parseFloat(totalFees)+parseFloat(amount),
          "convertedAmount": convertedAmount,
          "sourceAccountBalance": sourceAccountInfo?.amount,
          "sourceAccuntCountryCode": sourceAccountInfo?.currency,
          "sourceAccountNo": sourceAccountInfo?.iban,
          "transferAccountCountryCode": transferAccountInfo?.currency,
          "transferAccountNo": transferAccountInfo?.iban
        }
      }); 

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Something went wrong with the API",
        data: null
      }); 
    }
  },
  benefetchExchangeValues: async(req,res) => {

    const ObjectId = mongoose.Types.ObjectId;
    try {

      const {user,amount,fromCurrency,toCurrency} = req.body;

      if(user == "" || amount == 0 || fromCurrency == '' || toCurrency == '') {
        return res.status(401).json({
          status: 401,
          message: "Make sure you have fill amount,fromCurrency and toCurrency",
          data: null
        });
      }

      const sourceAccountInfo   = await Account.findOne({ user: new ObjectId(user), currency: fromCurrency });

      let rate = 0;
      let totalFees = 0;
      let convertedAmount = 0;
        
      totalFees = await fetchFees("debit",amount);
      rate = await convertCurrencyAmount(fromCurrency,toCurrency,1);
      convertedAmount = amount * rate;

      if(parseFloat(sourceAccountInfo?.amount) < (parseFloat(totalFees)+parseFloat(amount))) {
        return res.status(401).json({
          status: 401,
          message: "We regret to inform you that you have not sufficient amount of balance in your account, please make sure Total amount should be less than or equal to current balance amount",
          data: null
        });
      }

      return res.status(201).json({
        status: 201,
        message: "Success",
        data: {
          "rate": rate,
          "totalFees": totalFees,
          "totalCharge": parseFloat(totalFees)+parseFloat(amount),
          "convertedAmount": convertedAmount,
          "sourceAccountBalance": sourceAccountInfo?.amount,
          "sourceAccuntCountryCode": sourceAccountInfo?.currency,
          "sourceAccountNo": sourceAccountInfo?.iban,
          "sourceAccountId": sourceAccountInfo?._id
        }
      }); 

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Something went wrong with the API",
        data: null
      }); 
    }
  }
}

// function for crypto symbol price
async function fetchCryptoSymbolPrice(symbolPass) {
  const result = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbolPass}`)
     .then(result => {
      if(result?.status == 200) {
        return result?.data?.price;
      }
    })
    .catch(error => {
      console.log("errord", error);
      return 0;
    });

  return result; 
}

// function for fetch transaction fees
async function fetchFees(type,amount) {
  const result = await axios.get(`${process.env.BASE_URL3}/api/v1/admin/feetype/type?type=${type}`)
    .then(result => {
     if(result?.status == 201) {
      if(result.data.data.length > 0) {
        if(result?.data?.data?.[0]?.feedetails?.[0].commissionType == "percentage") {
          var charges = parseFloat(amount) * parseFloat(result?.data?.data?.[0]?.feedetails?.[0].value) / 100;
          if(charges < result?.data?.data?.[0]?.feedetails?.[0].minimumValue) {
           return charges = result?.data?.data?.[0]?.feedetails?.[0].minimumValue;
          } else {
           return charges;
          }
        } else {
          var charges = result?.data?.data?.[0]?.feedetails?.[0].value;
          return charges;
        }
       }
     }
    })
    .catch(error => {
      console.log("error", error);
      return 0;
    });

    return result; 
}

// function for create vault wallet address through FireBlocks API
async function createVaultWalletAddress(vaultAccountId,assetId) {
  const vaultAccount = await fireblocks.createVaultAsset(vaultAccountId, assetId);
  if(vaultAccount) {
    // it will return wallet address
    return vaultAccount?.address;
  }
}

// function for convert amount of one currency to another currency
async function convertCurrencyAmount(from,to,amount) {
  if(from && to && amount) {
    const options = {
      method: 'GET',
      url: 'https://currency-converter18.p.rapidapi.com/api/v1/convert',
      params: {
        from: from,
        to: to,
        amount: amount
      },
      headers: {
       'X-RapidAPI-Key': process.env.RAPID_API_KEY,
       'X-RapidAPI-Host': process.env.RAPID_API_HOST
      }
    };
     
    try {
      const response = await axios.request(options);
      if(response.data.success) {
        return response.data.result.convertedAmount;
      } else {
        return 0;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

// function for get rate of currency (e.g., INR to USD, USD to INR)
async function getCurrencyRate(from,to) {
  if(from && to) {
    const options = {
      method: 'GET',
      url: 'https://currency-converter18.p.rapidapi.com/api/v1/convert',
      params: {
        from: from,
        to: to,
        amount: 1
      },
      headers: {
       'X-RapidAPI-Key': process.env.RAPID_API_KEY,
       'X-RapidAPI-Host': process.env.RAPID_API_HOST
      }
    };
     
    try {
      const response = await axios.request(options);
      if(response.data.success) {
        return parseFloat(response.data.result.convertedAmount).toFixed(3)
      } else {
        return 0;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
