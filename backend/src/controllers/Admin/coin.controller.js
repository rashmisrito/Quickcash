const { mongoose} = require("mongoose");
const { Coin } = require('../../models/Admin/coin.model');

module.exports = {
  addCoin: async(req,res) => {
    
    try {
      const {coin,name,network,withdrawFee,withdrawMinimum,withdrawMaximum} = req.body;
      if(coin == "" || name == "") {
        return res.status(401).json({
          status: 401,
          message: "Coin and name fields are mandatory",
          data: null
        })
      }

      const CoinExists = await Coin.findOne({coin:coin});

      if(CoinExists) {
        return res.status(401).json({
          status: 401,
          message: "Coin is already added in our record",
          data: null
        })
      }
    
      const coinq = await Coin.create({
        coin,name,network,withdrawFee,withdrawMinimum,withdrawMaximum
      })
    
      if(!coinq) {
        return res.status(401).json({
          status: 401,
          message: "Error while inserting or inserting coin data",
          data: null
        })
      }
                 
      return res.status(200).json({
        status: 201,
        message: "Coin is added Successfully!!!",
        data:coinq
      })

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Something went wrong with api",
        data: error
      })
    }
  },
  coinList: async(req,res) => {

  const title = req.query.title || '';
  const ObjectId = mongoose.Types.ObjectId;

  try {

   const coinDetails = await Coin.find({});

   if(!coinDetails) {
     return res.status(402).json({
       status: 402,
       message: "Error while fetching card list!!!",
       data: null,
     })
   }
 
    return res.status(201).json({
      status:201,
      message: "Coin list is Successfully fetched",
      data: coinDetails,
    })

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Error while fetching card list!!!",
        data: error
      })
    }
   },
  coinById: async(req,res) => {
      
  try {
    const coin_id = req.params.id;
    if(!user_id) {
     return res.status(402).json({
      status: 402,
      message: "Coin Id is missing",
      data: null
    })
  }
  
  const details = await Coin.findOne({_id: coin_id});
  if(!details) {
    return res.status(402).json({
      status: 402,
      message: "Error while fetching coin details!!!",
      data: null
    })
  }
  
  return res.status(201).json({
    status:201,
    message: "Coin details is Successfully fetched",
    data: details
  })
} catch (error) {
    return res.status(500).json({
      status:500,
      message: "Something went wrong with api",
      data: error
    })
  }
  },
  updateCoin: async(req,res) => {
    const {coin,name,network,withdrawFee,withdrawMinimum,withdrawMaximum} = req.body;

    try {
             
    if(coin == "" || coin_id == "" || name == "") {
      return res.status(401).json({
       status: 401,
       message: "All red star mark * fields are mandatory!!!",
       data: null
      })
    }
    
    const UpdateData = await Coin.findByIdAndUpdate(
    {
     _id:coin_id
    },
    {
     coin,name,network,withdrawFee,withdrawMinimum,withdrawMaximum
    },
    {
     new: true,
    })
      
    if(!UpdateData) {
     console.log(UpdateData);
     return  res.status(401).json({
      status:401,
      message: "Error while updating coin details!",
      data:null
    })
  }
      
  return res.status(201).json({
    status:201,
    message: "Coin details has been updated successfully"
  })
 } catch (error) {
    console.log("Error", error);
    return  res.status(401).json({
      status:401,
      message: error,
      data:null
    })    
  }
  },
  deleteCoin: async(req,res) => {
  try {
    const coin_id = req.params.id;
             
    if(coin_id == "") {
      return res.status(401).json({
        status: 401,
        message: "Coin Id is missing",
        data: null
      })
    }

    const deletedData = await Coin.deleteOne({_id: coin_id});

    if(!deletedData) {
      return  res.status(401).json({
        status:401,
        message: "Error while updating coin details!",
        data:null
      })
    }
      
    return res.status(201).json({
      status:201,
      message: "Coin data has been deleted successfully"
    })
  } catch (error) {
    console.log("Error", error);
    return  res.status(401).json({
      status:401,
      message: error,
      data:null
    })    
   }
  },
}
