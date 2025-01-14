const { mongoose,Schema} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const cardSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  Account: {
    type: Schema.Types.ObjectId,
    ref: "Account"
  },
  name: {
    type: String,
    required: false,
    default: null
  },
  cardNumber: {
    type: String,
    unique: true,
    default: null
  },
  cvv: {
    type: String,
    required: false,
    default:null,
  },
  expiry: {
    type: String,
    required: false,
    default:null,
  },
  currency: {
    type: String,
    required: false,
    default: '',
  },
  pin: {
    type: Number,
    required: false,
    default: 0
  },
  status: {
    type: Boolean,
    required: false,
    default: null
  }
},
{
  timestamps: true
});

cardSchema.plugin(mongoosePaginate);
const Card = mongoose.model("Card", cardSchema);
module.exports = { Card };