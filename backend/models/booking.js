import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
  products: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  users: { type: mongoose.Schema.Types.ObjectId,
// id should be valid or present in Users collection coz ref: "Users"
    ref: "Users", 
    required: true
 },
  bookStartDate: {
     type: Date, 
     required: true
     },
  bookEndDate: { 
    type: Date,
     required: true
     },
  totalPrice: { 
    type: Number, 
    required: true
 },
},
{
  timestamps: true,
}
);

const Bookings = mongoose.model("Bookings", bookingSchema);
export default Bookings;
