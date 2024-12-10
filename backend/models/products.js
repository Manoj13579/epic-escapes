import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    // setting default value in array is different than others
    availableDates: [
      {
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        },
      },
    ],
    rating: {
      type: Number,
      default: 4.9,
    },
    reviews: {
      type: Number,
      default: 42,
    },
  },
  {
    timestamps: true,
  }
);


const Products = mongoose.model("Products", productsSchema);
export default Products;
