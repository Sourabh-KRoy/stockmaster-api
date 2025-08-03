import mongoose from 'mongoose'

const storeSchema = new mongoose.Schema({
    name:{type:String,required:true},
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
      },
    contact:{type:String,required:true},
    address:{type:String,required:true},
    isActive: {
        type: Boolean,
        default: true
    },
    lastActive:{
        type:Date,
        default:Date.now
    }

})

const Store = mongoose.model('Store',storeSchema);
export default Store;