import Bookings from "../models/booking.js";
import Products from "../models/products.js";
/* date is passed as string('2024-11-05'). to compare convert to Date object new Date('2024-11-05'). Date object converts string to milliseconds and compares them. '2024-11-05' is ISO format n can be passed directly. other format
like 11/15/2024 etc need to be converted before passing to Date object for comparision */



export const createBooking = async (req, res) => {

  try {
    const { productsId, bookStartDate, bookEndDate, userId } = req.body;

    // Validate if booking dates are in the past
    const today = new Date();
    // bookStartDate, bookEndDate is before today's date (< today) means booking in the past 
    if (new Date(bookStartDate) < today || new Date(bookEndDate) < today) {
      return res.status(400).json({
        success: false,
        message: 'Bookings can only be made for dates from today onward',
      });
    }

    // Find the product by ID
    const products = await Products.findById(productsId);
    if (!products) {
      return res.status(404).json({ success: false, message: 'Products not found' });
    }
 console.log(products.availableDates);
   

    // Check if the dates are available.
    const isAvailable = products.availableDates.some(
      dateRange =>
        new Date(bookStartDate) >= new Date(dateRange.startDate) &&
        new Date(bookEndDate) <= new Date(dateRange.endDate)
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Selected dates are not available',
      });
    }

    // Calculate the total price for the booking
    const daysBooked = (new Date(bookEndDate) - new Date(bookStartDate)) / (1000 * 3600 * 24);
    const totalPrice = daysBooked * products.price;

    // Create the booking
    const booking = new Bookings({
      products: productsId,
      users: userId,
      bookStartDate,
      bookEndDate,
      totalPrice,
    });

    await booking.save();

    /* 
      The updatedAvailableDates in the code is a new list of date ranges that represent the available dates after a booking has been made. Update product's availableDates by removing the booked date range or adjusting it */
    const updatedAvailableDates = products.availableDates.reduce((acc, dateRange) => {
      const rangeStart = new Date(dateRange.startDate);
      const rangeEnd = new Date(dateRange.endDate);
      const bookingStart = new Date(bookStartDate);
      const bookingEnd = new Date(bookEndDate);


      

      // Case 1: if Booking covers entire date range, return without this date range
  if (bookingStart <= rangeStart && bookingEnd >= rangeEnd) {
    return acc;
  }

      /* 
        Case 2: Booking overlaps the start of the range, modify the start.Make available date for startDate to bookingEnd. When booking ends by customer, then only it becomes available to new customer 
      */
      if (bookingStart <= rangeStart && bookingEnd < rangeEnd) {
        acc.push({ startDate: bookingEnd, endDate: rangeEnd });
        return acc;
      }

      // Case 3: Booking overlaps the end of the range, modify the end
      if (bookingStart > rangeStart && bookingEnd >= rangeEnd) {
        acc.push({ startDate: rangeStart, endDate: bookingStart });
        return acc;
      }

      // Case 4: Booking is within the range, split into two ranges
      if (bookingStart > rangeStart && bookingEnd < rangeEnd) {
        acc.push({ startDate: rangeStart, endDate: bookingStart });
        acc.push({ startDate: bookingEnd, endDate: rangeEnd });
        return acc;
      }

      // Case 5: No overlap, keep the original range
      acc.push(dateRange);
      return acc;
    }, []);

    // Save updated availableDates to the product. Now only these dates are available
    products.availableDates = updatedAvailableDates;
    await products.save();

   return res.status(201).json({
      success: true,
      message: 'Booking successful',
      data: booking,
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ success: false, error });
  }
};

// Get all bookings for a user
export const getUserBooking = async (req, res) => {
  
  try {
    /* find all bookings by this user which has _id of that user. looks for all documents(one booking) in Bookings collection where the user field matches the id of the user whose bookings you want to retrieve and returns matching document. can be more than one document but are single individual objeccts. but in return returns in an array of objects coz find in mongodb returns in that format. mongo db always stores all data in multiple documents or in collection as objects only. only array is stored inside on field in object in document like {name: test, tags[1,2..]}find, findone etc are responsible for returning as array or array object*/
    const bookings = await Bookings.find({ users: req.body.userId}).populate('products');
    return res.status(200).json({success:true, message: 'fetched bookings successfully', data:bookings});
  } catch (error) {
    return res.status(500).json({success:false, error});
  }
};

export const getAllBookings = async (req, res) => {
 /* When you define a Mongoose schema, can create relationships between different models by storing the ObjectId of one document inside another.  ObjectId is stored in schema on same name that populate here is using.
 Bookings model will store references to other documents. These references are stored as ObjectId fields, which are essentially MongoDB's way of pointing to documents in other collections. 
userId: This will be an ObjectId pointing to the User collection, specifically the user who made the booking.
products: This will be an ObjectId pointing to the Products collection, specifically the product that was booked.
The populate Method: When you run the populate method, you tell Mongoose to replace those ObjectId values with the actual data from the referenced documents. This means that when you populate('userId'), Mongoose will replace the userId field with the actual user document from the User collection that corresponds to that userId ObjectId. */ 
/* in Bookings Schema _id of document(one product) in Products collection and populate returns all info of that product fron Products collection*/
  try {
    const data = await Bookings.find()
.populate('products', 'image location')//just send image, location from products collection.
.populate('users', 'email');
    return res.status(200).json({success:true, message: 'fetched bookings successfully', data});
  } catch (error) {
   return res.status(500).json({success:false, error});
  }
};


export const deletebooking = async (req, res) => {
  const {_id} = req.body;
  if(!_id) {
     return res.status(400).json({success: false, message: 'id required deleting product'})
  };
  try {
     await Bookings.findByIdAndDelete(_id);
     return res.status(200).json({success: true, message: "Booking deleted successfully"})
  } catch (error) {
     return res.status(500).json({ success: false, error });  
  }
}