import { configureStore } from "@reduxjs/toolkit";
import productSlice from './productSlice.js'


const Store = configureStore({
    reducer: {
        products: productSlice,
    }
});


export default Store;