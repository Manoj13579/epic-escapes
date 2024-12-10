import Products from "../models/products.js";

const getProducts = async (req, res) => {
   try {
     const data = await Products.find();
     return res.status(200).json({ success: true, message: 'Products fetched successfully', data})
   } catch (error) {
      return res.status(500).json({ success: false, error }); 
   }
};


const addProduct = async (req, res) => {
const {productName, price, description, image, location, availableDates} = req.body;

if(!productName || !price || !description){
   return res.status(400).json({success: false, message: 'All fields required'}) ;
};
try {
   const newProduct = new Products({
    productName,
    price,
    description,
    image,
    location,
    availableDates
   }) ;
   await newProduct.save();
   return res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct})
} catch (error) {
    return res.status(500).json({ success: false, error }); 
}
};

const updateProduct = async (req, res) => {
   const {_id, productName, price, description, image, location } = req.body;
   if(!_id) {
      return res.status(400).json({success: false, message: 'id required for updating product'})
   };
   try {
      const updateProduct = await Products.findByIdAndUpdate(_id, {
         productName,
         price,
         description,
         image,
         location
      },
      { new: true });
      return res.status(200).json({ success: true, message: 'Product updated successfully', data: updateProduct})  
   } catch (error) {
      return res.status(500).json({ success: false, error });
   }
};



const deleteProduct = async (req, res) => {
   const {_id} = req.body;
   if(!_id) {
      return res.status(400).json({success: false, message: 'id required deleting product'})
   };
   try {
      await Products.findByIdAndDelete(_id);
      return res.status(200).json({success: true, message: "Product deleted successfully"})
   } catch (error) {
      return res.status(500).json({ success: false, error });  
   }
}

export {addProduct, getProducts, updateProduct, deleteProduct}