const fs = require('fs');
const path = require('path');
const excelJS = require("exceljs");
const { mongoose} = require("mongoose");
const { User } = require("../models/user.model");
const FireblocksSDK = require('fireblocks-sdk').FireblocksSDK;
const baseUrl = "https://sandbox-api.fireblocks.io";
//const productionbaseUrl = "https://api.fireblocks.io";
const { addNotification } = require("../middlewares/notification.middleware");
const apiSecret = fs.readFileSync(path.resolve("fireblocks_secret.key"), "utf8");
const { WalletAddressRequest } = require('../models/walletAddressRequest.model');
let fireblocks = new FireblocksSDK(apiSecret, process.env.FIREBLOCK_SECRET_KEY, baseUrl);

module.exports = {
  // This function is used for add wallet request and save details to the table
  addWalletRequest: async(req,res) => {
    const {user,coin,walletAddress,status,email} = req.body;
    try {
      if(user == "" || coin == "") {
        return res.status(401).json({
          status: 401,
          message: "Please select coin",
          data: null
        })
      }

      var addressData = '';
      const userVaultAccountId = await User.findOne({_id: user});
      console.log("a1");
      if(userVaultAccountId?.vaultAccountId) {
        console.log("a2");
        addressData = await createVaultWalletAddress(user,coin,parseInt(userVaultAccountId?.vaultAccountId));
      } else {
        console.log("a3");
        var vid = await createVaultAccount(userVaultAccountId?.email);
        if(vid) {
          console.log("a4");
          addressData = await createVaultWalletAddress(user,coin,parseInt(vid));
        }
      }

      console.log("fetching address data", addressData);

      return res.status(200).json({
        status: 201,
        message: "Wallet Address data is added !!!",
        data:addressData
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
  // This function is used for request new wallet address and save details to the table
  newWalletRequest: async(req,res) => {
    const {user,coin} = req.body;
    try {
      if(user == "" || coin == "") {
        return res.status(401).json({
          status: 401,
          message: "Please select coin",
          data: null
        })
      }

      var addressData = '';
      const userVaultAccountId = await User.findOne({_id: user});
      addressData = await newVaultWalletAddress(user,coin,parseInt(userVaultAccountId?.vaultAccountId));

      if(!addressData) {
        return res.status(401).json({
          status: 401,
          message: "Please try after sometime",
          data:addressData
        });
      }

      return res.status(200).json({
        status: 201,
        message: "Wallet Address data is added !!!",
        data:addressData
      });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: 500,
          message: "Something went wrong with api",
          data: error
        });
      }
  },
  // This function is used for fetch wallet address list and save details to the table
  list: async(req,res) => {
  const userid = req?.params?.id;
  const ObjectId = mongoose.Types.ObjectId;
  try {
    const listDetails = await WalletAddressRequest.aggregate([
    {
      $match: {
        user: new ObjectId(userid)
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
    {$sort: {createdAt: -1}},
    {
      $project: {
        _id:1,
        coin:1,
        user:1,
        walletAddress:1,
        status:1,
        noOfCoins:1,
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
      message: "Error while fetching add wallet address request!!!",
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
        message: "Error while fetching wallet address request list!!!",
        data: error
      })
    }
  },
  // This function is used for fetch wallet address list and save details to the table (For Admin Panel)
  adminlist: async(req,res) => {

    try {
      const listDetails = await WalletAddressRequest.aggregate([
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
          coin:1,
          user:1,
          walletAddress:1,
          status:1,
          noOfCoins:1,
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
        message: "Error while fetching add wallet address request!!!",
        data: null,
      });
    }
   
    return res.status(201).json({
      status:201,
      message: "list are fetched Successfully",
      data: listDetails,
    });
  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: 500,
          message: "Error while fetching wallet address request list!!!",
          data: error
        });
      }
  },
  // This function is used for update wallet address request and save details to the table
  updateWalletRequestStatus: async(req,res) => {
    const {status,comment} = req.body;

    try {

        const wallet_id = req.params.id;

        if(!wallet_id) {
          return res.status(401).json({
            status: 401,
            message: "wallet id is missing",
            data: null
          })
        }

        if(status == "") {
          return res.status(401).json({
            status: 401,
            message: "status is missing",
            data: null
          })
        }

        var addressData = '';
        const ObjectId = mongoose.Types.ObjectId;
        const walletRequestDetails = await WalletAddressRequest.findOne({_id: new ObjectId(req?.params?.id)});
        const userVaultAccountId = await User.findOne({_id: walletRequestDetails?.user});

        if(status == "completed") {
          if(userVaultAccountId?.vaultAccountId) {
            var addressData = await createVaultWalletAddress(req?.params?.id,walletRequestDetails?.coin,parseInt(userVaultAccountId?.vaultAccountId));
          } else {
            var vid = await createVaultAccount(userVaultAccountId?.email);
            var addressData = await createVaultWalletAddress(req?.params?.id,walletRequestDetails?.coin,parseInt(vid));
          }
        }

        const UpdateData = await WalletAddressRequest.findByIdAndUpdate(
        {
          _id:wallet_id
        },
        {
          status,
          walletAddress:addressData,
          comment: comment ? comment : '',
          history: []
        },
        {
          new: true,
        })
    
        if(!UpdateData) {
          return  res.status(401).json({
           status:401,
           message: "Error while updating qr Wallet Address Request!",
           data:null
          });
        }

        await addNotification(walletRequestDetails?.user,title=`Wallet Address request status been updated by the Admin`,tags=`Crypto, ${walletRequestDetails?.coin}`,message=`Wallet Address request status has been updated by the Admin for coin ${walletRequestDetails?.coin}`,notifyFrom="admin",notifyType="user",attachment="",info=`Crypto Coin ${walletRequestDetails?.coin} - wallet address request status has been updated by the Admin `);
    
        return res.status(201).json({
          status:201,
          data:UpdateData,
          message: "Wallet Address Request has been updated successfully"
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
  // This function is used for update history and save details to the table
  updateHistory: async(req,res) => {
    try {
      const id = req.params.id;
      if(!id) {
        return res.status(401).json({
          status: 401,
          message: "wallet id is missing",
          data: null
        })
      }
      const details = await WalletAddressRequest.find({_id:id});

      if(!details) {
        return  res.status(401).json({
         status:401,
         message: "Error while fetching history!",
         data:null
        })
      }
  
      return res.status(201).json({
        status:201,
        data:details[0].history,
        message: "History has been fetched successfully"
      })

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status:500,
        data:details,
        message: "error"
      })
    }
  },
  // This function is used for export excel of transaction and save details to the table
  exportExcelForTransaction: async(req,res) => {
    const workbook = new excelJS.Workbook();  // Create a new workbook
    const worksheet = workbook.addWorksheet("WalletList"); // New Worksheet
    const path = "./public";  // Path to download excel
    // Column for data in excel. key must match data key
    worksheet.columns = [
    { header: "S no.", key: "s_no", width: 10 }, 
    { header: "Date", key: "createdAt", width: 20 },
    { header: "Coin", key: "coin", width: 20 },
    { header: "No Of Coins", key: "noOfCoins", width: 20 },
    { header: "Wallet Address", key: "walletAddress", width: 20 },
    { header: "Status", key: "status", width: 20 },
    ];

    const invoiceData = await WalletAddressRequest.find({user: req.params.id});

    // Looping through User data
    let counter = 1;
    invoiceData.forEach((user) => {
      user.s_no = counter;
      worksheet.addRow(user); // Add data in worksheet
      counter++;
    });

    // Making first line in excel bold
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      try {
        await workbook.xlsx.writeFile(`${path}/walletList.xlsx`)
        .then(() => {
          res.send({
            status: "success",
            message: "file successfully downloaded",
            path: `${path}/walletList.xlsx`,
          });
        });
      } catch (err) {
          res.send({
          status: "error",
          message: "Something went wrong",
        });
        }
  }
}

// With the help of this function user can create their wallet address for a particular crypto coin like SOL, BTC

// Here,
// userid means current logged in userid 
// assetId means crypto coin name in lowercase (sol, btc, doge and so on)
// vaultAccountId means vaultid which we created function name is createVaultAccount(email), or you can find vaultId from user table if user already created vault account.


async function createVaultWalletAddress(userid,assetId,vaultAccountId) {
  try {
    const vaultAccount = await fireblocks.createVaultAsset(vaultAccountId, assetId);
    const newAddress = await fireblocks.generateNewAddress(vaultAccountId, assetId);
    if(vaultAccount) {
      const ObjectId = mongoose.Types.ObjectId;
      const existsCoinAddress = await WalletAddressRequest.findOne({ user: new ObjectId(userid) , coin: assetId });
      if(!existsCoinAddress) {
        await WalletAddressRequest.create({
          user: new ObjectId(userid),
          coin:assetId,
          noOfCoins: '0.0000000',
          walletAddress: vaultAccount?.address ? vaultAccount?.address : newAddress?.address,
          status: "completed"
        });
      } else {
        await WalletAddressRequest.findOneAndUpdate(
        {
          user: new ObjectId(userid),
          coin: assetId
        },
        {
          walletAddress: vaultAccount?.address ? vaultAccount?.address : newAddress?.address
        },
        {
          new: true,
        });
      }
      return vaultAccount?.address ? vaultAccount?.address : newAddress?.address;
    } else {
      return getWalletAddress(userid,vaultAccountId, assetId);
    }
  } catch (error) {
    console.log("errorwallet",error?.response?.data);
    if(error?.response?.data?.code == "1026") {
      return getWalletAddress(userid,vaultAccountId, assetId);
    } else {
      await WalletAddressRequest.create({
        user: new ObjectId(userid),
        coin:assetId,
        noOfCoins: '0.0000000',
        walletAddress: newAddress?.address ? newAddress?.address : '',
        status: "completed"
      });
    }
  }
}

// With the help of this function user can create their wallet address for a particular crypto coin like SOL, BTC

// Here,
// userid means current logged in userid 
// assetId means crypto coin name in lowercase (sol, btc, doge and so on)
// vaultAccountId means vaultid which we created function name is createVaultAccount(email), or you can find vaultId from user table if user already created vault account.


async function newVaultWalletAddress(userid,assetId,vaultAccountId) {
  console.log(userid,assetId,vaultAccountId);
  try {
    const vaultAccount = await fireblocks.generateNewAddress(vaultAccountId, assetId);
    if(vaultAccount) {
      const ObjectId = mongoose.Types.ObjectId;
      const existsCoinAddress = await WalletAddressRequest.findOne({ user: new ObjectId(userid) , coin: assetId });
      if(!existsCoinAddress) {
        await WalletAddressRequest.create({
          user: new ObjectId(userid),
          coin:assetId,
          noOfCoins: '0.0000000',
          walletAddress: vaultAccount?.address,
          status: "completed"
        });
      } else {
        await WalletAddressRequest.findOneAndUpdate(
        {
          user: new ObjectId(userid),
          coin: assetId
        },
        {
          walletAddress: vaultAccount?.address
        },
        {
          new: true,
        });
      }
      return vaultAccount?.address;
    } else {
      return getWalletAddress(userid,vaultAccountId, assetId);
    }
  } catch (error) {
    console.log("errorwallet",error?.response?.data);
  }
}

// This function will return wallet address of crypto coin

// Here,
// user means current logged in userid 
// assetId means crypto coin name in lowercase (sol, btc, doge and so on)
// vaultAccountId means vaultid which we created function name is createVaultAccount(email), or you can find vaultId from user table if user already created vault account.

async function getWalletAddress(user,vaultAccountId,assetId) {

  try {
    const ObjectId = mongoose.Types.ObjectId;
    const myNewVault = await fireblocks.getPaginatedAddresses(vaultAccountId,assetId);
    console.log("myNewValut", myNewVault);
    if(myNewVault?.addresses) {
      if(myNewVault?.addresses?.length > 0) {
        const walletUpdate = await WalletAddressRequest.findOneAndUpdate(
        {
          user: new ObjectId(user),
          coin: assetId
        },
        {
           walletAddress: myNewVault?.addresses?.[0]?.address
        },
        {
          new: true,
        });
    
        if(!walletUpdate) {
          const wallet = await WalletAddressRequest.create({
            user,
            coin:assetId,
            noOfCoins: '0.0000000',
            walletAddress: myNewVault?.addresses?.[0]?.address,
            status: "completed"
          });
        }
        return myNewVault?.addresses?.[0]?.address;
      } else {
        const vaultAccount = await fireblocks.generateNewAddress(vaultAccountId, assetId);
        return vaultAccount?.address;
      }

    }


  } catch (error) {
     console.log("Get Address error ",error.response.data.message);
  }
}

// This function is used to create vault account for every new user, so we have to pass email in above function
// that will create new vault account with the help of this function id vault id will save in user table
// with corresponding user.

async function createVaultAccount(email) {
  const vaultAccount = await fireblocks.createVaultAccount(email, hiddenOnUI=false, customerRefId="", autoFueling=false);
  console.log("VaulAccount Result Response a", vaultAccount);
  if(vaultAccount) {
    await User.findOneAndUpdate(
    {
     email:email
    },
    {
      vaultAccountId: vaultAccount?.id
    },
    {
      new: true,
    });
  }
  console.log("Return vault account id", vaultAccount?.id);
  return vaultAccount?.id;
}

