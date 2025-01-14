const { mongoose } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const coinSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: false,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  network: {
    type: String,
    default: ''
  },
  withdrawFee: {
    type: String,
    default: 0
  },
  withdrawMinimum: {
    type: String,
    default: 0
  },
  withdrawMaximum: {
    type: String,
    default: 0
  }
},
{
  timestamps: true
});

coinSchema.plugin(mongoosePaginate);
const Coin = mongoose.model("Coin", coinSchema);
module.exports = { Coin };