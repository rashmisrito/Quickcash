const { mongoose} = require("mongoose");
const { Card } = require('../models/cards.model');
const { Currency } = require('../models/currency.model');

module.exports = {
  // This is used for add card details into the card table
  addCard: async(req,res) => {
    const ObjectId = mongoose.Types.ObjectId;
    const {name,user,cardnumber,cvv,expiry,Account,currency} = req.body;
    try {
      if(name == "" || cardnumber == "" || cvv == "" || expiry == "") {
        return res.status(401).json({
          status: 401,
           message: "All fields are mandatory",
          data: null
        })
      }

      const CardExists = await Card.findOne({cardNumber:cardnumber});

      if(CardExists) {
        return res.status(401).json({
          status: 401,
          message: "Card number is already added in our record",
          data: null
        })
      }

      const CurrencyWithSameAccount = await Card.findOne({ currency: currency, user: new ObjectId(user) });

      if(CurrencyWithSameAccount) {
        return res.status(401).json({
          status: 401,
          message: "Same Currency Account is already added in our record",
          data: null
        });
      }
    
      const card = await Card.create({
        user,
        name,
        cardNumber:cardnumber,
        cvv,
        pin: Math.floor(Math.random() * 1000),
        expiry,
        status:true,
        Account:Account,
        currency
      })
    
      if(!card) {
        return res.status(401).json({
          status: 401,
          message: "Error while inserting or inserting card data",
          data: null
        })
      }
                 
      return res.status(200).json({
        status: 201,
        message: "Card is added Successfully!!!",
        data:card
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
  // This is used for add card details into the card table (Mobile API)
  addCardApi: async(req,res) => {
    const ObjectId = mongoose.Types.ObjectId;
    const {name,user,currency} = req.body;
    try {

      if(user == "") {
        return res.status(401).json({
          status: 401,
           message: "User Id is missing",
          data: null
        })
      }

      if(name == "" || currency == "") {
        return res.status(401).json({
          status: 401,
          message: "Name,Currency fields are required",
          data: null
        })
      }

      var valueGen = Math.floor(Math.random() * 9999999999999999);

       // Check Card with generated card number is already exists
      const CardExists = await Card.findOne({cardNumber:valueGen});

      if(CardExists) {
        return res.status(401).json({
          status: 401,
          message: "Card number is already added in our record",
          data: null
        })
      }

      // Check Card with requested currency is alreadt exists
      const CurrencyWithSameAccount = await Card.findOne({ currency: currency, user: new ObjectId(user) });

      if(CurrencyWithSameAccount) {
        return res.status(401).json({
          status: 401,
          message: "Same Currency Account is already added in our record",
          data: null
        });
      }

      // Check Requested currency is added in our currency list

      const currencyExistsInOurRecord = await Currency.findOne({ base_code: currency });

      if(!currencyExistsInOurRecord) {
        return res.status(401).json({
          status: 401,
          message: `You are not allowed to create card from ${currency} currency account`,
          data: null
        });
      }
    
      const card = await Card.create({
        user,
        name,
        cardNumber:valueGen,
        cvv: "123",
        pin: Math.floor(Math.random() * 1000),
        expiry: "12/30",
        status:true,
        currency
      })
    
      if(!card) {
        return res.status(401).json({
          status: 401,
          message: "Error while inserting card data",
          data: null
        })
      }
                 
      return res.status(200).json({
        status: 201,
        message: "Card is added Successfully!!!",
        data:card
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
  // This is used for fetching card details from the card table
  cardList: async(req,res) => {
      
      const user_id = req.params.id; 
      const title = req.query.title || '';
      const ObjectId = mongoose.Types.ObjectId;

      try {
            
        if(!user_id) {
          return res.status(402).json({
            status: 402,
            message: "User Id is missing",
            data: null
          })
        }

        const cardDetails = await Card.find({user: new ObjectId(user_id)})

        if(!cardDetails) {
          return res.status(402).json({
            status: 402,
            message: "Error while fetching card list!!!",
            data: null,
          })
        }
 
          return res.status(201).json({
            status:201,
            message: "Card list is Successfully fetched",
            data: cardDetails,
          });

       } catch (error) {
          console.log(error);
          return res.status(500).json({
            status: 500,
            message: "Error while fetching card list!!!",
            data: error
          })
       }
  },
  // This is used for fetching card details by their card from the card table
  cardById: async(req,res) => {
      
    try {
    
      const card_id = req.params.id;
  
      if(!card_id) {
        return res.status(402).json({
          status: 402,
          message: "Card Id is missing",
          data: null
        })
      }
  
      const details = await Card.findOne({_id: card_id});
  
      if(!details) {
        return res.status(402).json({
          status: 402,
          message: "Error while fetching card details!!!",
          data: null
        })
      }
  
      return res.status(201).json({
        status:201,
        message: "Card details is Successfully fetched",
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
  // This is used for update card details from the card table
  updateCard: async(req,res) => {
   try {
              
    const {name,card_id,user_id,cardnumber,cvv,expiry,status,country,currency} = req.body;
              
    if(name == "" || user_id == "" || cardnumber == "" || cvv == "" || expiry == "") {
      return res.status(401).json({
        status: 401,
        message: "All red star mark * fields are mandatory!!!",
        data: null
      })
    }
    
    const UpdateData = await Card.findByIdAndUpdate(
    {
      _id:card_id
    },
    {
      user:user_id,
      name,
      cardnumber,
      cvv,
      expiry:expiry,
      status:status,
      country,
      currency
    },
    {
      new: true,
    })
      
    if(!UpdateData) {
      console.log(UpdateData);
      return res.status(401).json({
        status:401,
        message: "Error while updating card details!",
        data:null
      })
    }
      
    return res.status(201).json({
      status:201,
      message: "User Card details has been updated successfully"
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
  // This is used for update card details from the card table (Mobile API)
  updateCardApi: async(req,res) => {
    try {
     const ObjectId = mongoose.Types.ObjectId;
     const card_id = req?.params?.id;
               
     const {name,user_id,cvv,status} = req.body;
               
     if(name == "" || user_id == "" || cvv == "") {
       return res.status(401).json({
         status: 401,
         message: "All red star mark * fields are mandatory!!!",
         data: null
       })
     }
     
     const UpdateData = await Card.findByIdAndUpdate(
     {
      _id:new ObjectId(card_id)
     },
     {
      user:user_id,
      name,
      cvv,
      status:status
     },
     {
      new: true,
     })
       
     if(!UpdateData) {
       console.log(UpdateData);
       return res.status(401).json({
        status:401,
        message: "Error while updating card details!",
        data:null
       })
     }
       
     return res.status(201).json({
      status:201,
      message: "User Card details has been updated successfully"
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
  // This is used to change/update card pin
  changePin: async(req,res) => {
    const {pin,cardId} = req.body;
    if(pin == "" || cardId == "") {
      return res.status(401).json({
        status: 401,
        message: "Make sure Pin value has been filled!!!",
        data: null
      })
    }

    try {
      
    const UpdateData = await Card.findByIdAndUpdate(
    {
      _id:cardId
    },
    {
      pin
    },
    {
      new: true,
    })
      
    if(!UpdateData) {
      console.log(UpdateData);
      return res.status(401).json({
        status:401,
        message: "Error while updating card pin!",
        data:null
      })
    }
      
    return res.status(201).json({
      status:201,
      message: "User Card Pin has been updated successfully"
    });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status:500,
        message: "Something went wrong!",
        data:null
      })
    }

  },
  // This is used for delete card
  deleteCard: async(req,res) => {
      
    try {
            
     const card_id = req.params.id;
           
    if(card_id == "") {
      return res.status(401).json({
        status: 401,
        message: "Card Id is missing",
        data: null
      })
    }

    const deletedData = await Card.deleteOne({_id: card_id});

    if(!deletedData) {
      return  res.status(401).json({
        status:401,
        message: "Error while updating card details!",
        data:null
      })
    }
      
    return res.status(201).json({
      status:201,
      message: "User Card Data has been deleted successfully"
    })
  } catch (error) {
     console.log("Error", error);
     return  res.status(401).json({
      status:401,
      message: error,
      data:null
    })    
   }
  }
}
