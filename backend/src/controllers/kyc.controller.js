const ejs = require("ejs");
const { mongoose} = require("mongoose");
const { Kyc } = require('../models/kyc.model');
const { User } = require("../models/user.model");
const { sendMail } = require('../middlewares/mail.middleware');
const { addNotification } = require("../middlewares/notification.middleware");

module.exports = {
  // This function is used for add/insert/save kyc data
  addKyc: async(req,res) => {
    const {user,email,primaryPhoneNumber,secondaryPhoneNumber,documentType,documentNumber,addressDocumentType,status} = req.body;
      try {
        if(user == "" || email == "" || primaryPhoneNumber == "" || documentType == "") {
          return res.status(401).json({
            status: 401,
            message: "All fields are mandatory",
            data: null
          })
        }

        let Image1  = '';
        let Image2 = '';
        let Image3 = '';

        if(req.files.documentPhotoFront) {
          Image1 = req.files.documentPhotoFront[0].filename;
        }
        if(req.files.documentPhotoBack) {
          Image2 = req.files.documentPhotoBack[0].filename;
        }
        if(req.files.addressProofPhoto) {
          Image3 = req.files.addressProofPhoto[0].filename;
        }

        const kyc = await Kyc.create({
          user,
          email,
          primaryPhoneNumber,
          secondaryPhoneNumber,
          documentType,
          documentNumber,
          addressDocumentType,
          documentPhotoFront:Image1,
          documentPhotoBack:Image2,
          addressProofPhoto:Image3,
          status: "processing"
        });
        
        const ObjectId = mongoose.Types.ObjectId;

        await User.findByIdAndUpdate(
        {
          _id: new ObjectId(user)
        },
        {
          ownerbrd:Image1,
          owneridofindividual:documentType,
          ownertaxid: documentNumber,
          mobile: primaryPhoneNumber
        },
        {
          new: true,
        });
    
        if(!kyc) {
          return res.status(401).json({
            status: 401,
            message: "Error while inserting or inserting Kyc data",
            data: null
          })
        }
                 
        return res.status(200).json({
          status: 201,
          message: "Kyc Updated !!!",
          data:kyc
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
  // This function is used for fetching kyc data by their kyc id
  getkycData: async(req,res) => {
      
    const user_id = req.params.id; 
    const ObjectId = mongoose.Types.ObjectId;

    try {
      if(!user_id) {  
      return res.status(402).json({
        status: 402,
        message: "User Id is missing",
        data: null
      });
    }

    const listDetails = await Kyc.find({
      user: new ObjectId(user_id)
    })

    if(!listDetails) {
      return res.status(402).json({
        status: 402,
        message: "Error while fetching kyc data!!!",
        data: null,
      });
    }
 
    return res.status(201).json({
      status:201,
      message: "kyc data are fetched Successfully",
      data: listDetails,
    });

  } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Error while fetching kyc data!!!",
        data: error
      });
    }
  },
  // This function is used for fetching data (for admin)
  getAdminkycData: async(req,res) => {
      
    const user_id = req.params.id; 
    const ObjectId = mongoose.Types.ObjectId;

    try {
      if(!user_id) {
      return res.status(402).json({
        status: 402,
        message: "User Id is missing",
        data: null
      });
    }

    const listDetails = await Kyc.find({
      _id: new ObjectId(user_id)
    })

    if(!listDetails) {
      return res.status(402).json({
        status: 402,
        message: "Error while fetching kyc data!!!",
        data: null,
      });
    }
 
    return res.status(201).json({
      status:201,
      message: "kyc data are fetched Successfully",
      data: listDetails,
    });

  } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Error while fetching kyc data!!!",
        data: error
      });
    }
  },
  // This function is used for update kyc data
  updateKycData: async(req,res) => {
    const {user,email,primaryPhoneNumber,secondaryPhoneNumber,documentType,documentNumber,addressDocumentType,status} = req.body;
      try {
        if(user == "" || email == "" || primaryPhoneNumber == "" || documentType == "") {
          return res.status(401).json({
            status: 401,
            message: "All fields are mandatory",
            data: null
          })
        }

        let Image1  = '';
        let Image2 = '';
        let Image3 = '';

        if(req.files?.documentPhotoFront) {
          Image1 = req.files.documentPhotoFront[0].filename;
        }
        if(req.files?.documentPhotoBack) {
          Image2 = req.files.documentPhotoBack[0].filename;
        }
        if(req.files?.addressProofPhoto) {
          Image3 = req.files.addressProofPhoto[0].filename;
        }

        const ObjectId = mongoose.Types.ObjectId;

        if(Image1) {
          await Kyc.findByIdAndUpdate(
          {
            _id:req.params.id
          },
          {
            documentPhotoFront:Image1
          },
          {
            new: true,
          });

          await User.findByIdAndUpdate(
          {
            _id: new ObjectId(user)
          },
          {
            ownerbrd:Image1,
          },
          {
            new: true,
          });
        }

        if(Image2) {
          await Kyc.findByIdAndUpdate(
          {
            _id:req.params.id
          },
          {
            documentPhotoBack:Image2
          },
          {
            new: true,
          })
        }

        if(Image3) {
          await Kyc.findByIdAndUpdate(
          {
            _id:req.params.id
          },
          {
            addressProofPhoto:Image3
          },
          {
            new: true,
          })
        }

        const Updatekyc = await Kyc.findByIdAndUpdate(
        {
          _id:req.params.id
        },
        {
          user,
          email,
          primaryPhoneNumber,
          secondaryPhoneNumber,
          documentType,
          documentNumber,
          addressDocumentType,
          status
        },
        {
          new: true,
        })

        await User.findByIdAndUpdate(
        {
          _id: new ObjectId(user)
        },
        {
          owneridofindividual:documentType,
          ownertaxid: documentNumber,
          mobile: primaryPhoneNumber
        },
        {
          new: true,
        });
  
        if(!Updatekyc) {
          return res.status(401).json({
            status:401,
            message: "Error while updating kyc data!",
            data:null
          });
        }

        await addNotification(user,title=`Kyc data has been submitted by the ${req?.user?.name} `,tags=`KYC, ${req?.user?.name}`,message="KYC info has been submitted",notifyFrom="user",notifyType="kyc",attachment="",info=`${req?.user?.name} User has been submitted kyc details`);
                 
        return res.status(200).json({
          status: 201,
          message: "Kyc Updated !!!",
          data:Updatekyc
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
  // This function is used for update kyc status
  updatekycRequestStatus: async(req,res) => {
    const {status,comment} = req.body;
    try {

      const kyc_id = req.params.id;

      if(!kyc_id) {
        return res.status(401).json({
          status: 401,
          message: "kyc id is missing",
          data: null
        });
      }

      if(status == "") {
        return res.status(401).json({
          status: 401,
          message: "status is missing",
          data: null
        });
      }

      const getUserId = await Kyc.findById({_id: kyc_id});

      if(!getUserId) {
        return res.status(401).json({
          status: 401,
          message: "user doesn't exists",
          data: null
        }); 
      }
      
      const userInfo = await User.findOne({ _id : getUserId?.user});

      const UpdateData = await Kyc.findByIdAndUpdate(
      {
       _id:kyc_id
      },
      {
       status,
       comment: comment ? comment : ''
      },
      {
       new: true,
      })
    
      if(!UpdateData) {
        return  res.status(401).json({
         status:401,
         message: "Error while updating kyc Request!",
         data:null
        })
      }

      const name = userInfo?.name;
      const email = userInfo?.email;

      const htmlBody = await ejs.renderFile(__dirname.replace('\controllers','') + "/views/KycUpdate.ejs", { name , status , comment });
      if(htmlBody) {
        const subject = "KYC Update !!!"
        sendMail(email,subject,htmlBody);
      }

      return res.status(201).json({
        status:201,
        data:UpdateData,
        message: "Kyc data has been updated successfully"
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
  // This function is used for fetching kyc list
  list: async(req,res) => {
      
   try {
    const title = req.query.status || '';
    var searchItem = '';

    if(title == "not_submitted") {
      searchItem = 'not_submitted';
    } else if(title == "") {
      searchItem = '';
    } else if(title == "pending") {
      searchItem = 'Pending';
    } else if(title == "completed") {
      searchItem = 'completed';
    } else {
      searchItem = '';
    }

    if(searchItem == "not_submitted") {
      var listDetails = await Kyc.aggregate([
        {
          $match: {
            documentPhotoFront: ''
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
          user:1,
          email:1,
          primaryPhoneNumber:1,
          secondaryPhoneNumber:1,
          documentType:1,
          documentNumber:1,
          documentPhotoFront:1,
          documentPhotoBack:1,
          addressDocumentType:1,
          addressProofPhoto:1,
          status:1,
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
    } else {
      var listDetails = await Kyc.aggregate([
        {
          $match: {
            status: {'$regex': searchItem, '$options' : 'i'}
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
          user:1,
          email:1,
          primaryPhoneNumber:1,
          secondaryPhoneNumber:1,
          documentType:1,
          documentNumber:1,
          documentPhotoFront:1,
          documentPhotoBack:1,
          addressDocumentType:1,
          addressProofPhoto:1,
          status:1,
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
    }

 if(!listDetails) {
  return res.status(402).json({
    status: 402,
    message: "Error while fetching kyc list!!!",
    data: null,
  });
 }
 
 return res.status(201).json({
  status:201,
  message: "kyc data list are fetched Successfully",
  data: listDetails,
 });

} catch (error) {
  console.log(error);
  return res.status(500).json({
    status: 500,
    message: "Error while fetching kyc data!!!",
    data: error
  });
 }
  },
  updateHistory: async(req,res) => {

  try {
   const id = req.params.id;
   if(!id) {
    return res.status(401).json({
     status: 401,
     message: "kyc id is missing",
     data: null
    });
  }

  const details = await Kyc.find({_id:id});

  if(!details) {
    return  res.status(401).json({
     status:401,
     message: "Error while fetching history!",
     data:null
    });
  }
  
  return res.status(201).json({
    status:201,
    data:details[0].history,
    message: "History has been fetched successfully"
  });

 } catch (error) {
    console.log(error);
    return res.status(500).json({
      status:500,
      data:details,
      message: "error"
    });
  }
  },
  verify: async(req,res) => {

    const {user,email,primaryPhoneNumber,secondaryPhoneNumber,emailVerified,phonePVerified,phoneSVerified,type} = req.body;

    try {

      if(user == "" || type == "") {
        return res.status(401).json({
          status: 401,
          message: "Verify type is missing",
          data: null
        });
      }

      const ObjectId = mongoose.Types.ObjectId;

      const Updatekyc = await Kyc.findByIdAndUpdate(
      {
        _id:new ObjectId(req.params.id)
      },
      {
        user,
        email,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        emailVerified,
        phonePVerified,
        phoneSVerified
      },
      {
        new: true,
      })
  
      if(!Updatekyc) {
        return  res.status(401).json({
          status:401,
          message: "Error while updating kyc data!",
          data:null
        })
      }
                 
      return res.status(200).json({
        status: 201,
        message: "Verified Successfully",
        data:Updatekyc
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Something went wrong with api",
        data: error
      });
    }
  }
}
