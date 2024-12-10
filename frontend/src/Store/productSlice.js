import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statusCode from "../Utils/statusCode";
import axios from "axios";




const initialState = {
    data: [],
    status: statusCode.IDLE,
}
const getProducts = createAsyncThunk('products/get', async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/get-products`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action) => {
            const { _id, productName, description, image, price,  location, availableDates} = action.payload;
            state.data.push({ _id, productName, description, image, price, location, availableDates});
          },
    deleteProduct: (state, action) => {
        state.data = state.data.filter(item => item._id !== action.payload)
    },
    updateProduct: (state, action) => {
        const productToUpdate = state.data.find(item => item._id === action.payload._id);
        // this approach good.works in complex n nested data too.
        if (productToUpdate) {
            // Update the found product
            productToUpdate.productName = action.payload.productName;
            productToUpdate.description = action.payload.description;
            productToUpdate.image = action.payload.image;
            productToUpdate.price = action.payload.price;
            productToUpdate.location = action.payload.location;
        }
    }, 
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state, action) => {
                state.status = statusCode.LOADING;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = statusCode.IDLE;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.status = statusCode.ERROR;
            });
    }
});

export { getProducts };
export const { addProduct, deleteProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;
