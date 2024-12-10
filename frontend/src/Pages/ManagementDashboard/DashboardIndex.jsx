const DashboardIndex = () => {
  return (
    <div>
      {/* TotalData */}
      <div className='flex flex-wrap items-center justify-center gap-4'>
        <div className='flex w-full sm:w-1/4 h-40 bg-white border-gray-500 shadow-lg items-center justify-around text-stone-500 font-medium text-sm md:text-base'>
          <p>Total Product</p>
        </div>
        <div className='flex w-full sm:w-1/4 h-40 bg-white border-gray-500 shadow-lg items-center justify-around text-stone-500 font-medium text-sm md:text-base'>
          <p>Total Booking</p>
        </div>
        <div className='flex w-full sm:w-1/4 h-40 bg-white border-gray-500 shadow-lg items-center justify-around text-stone-500 font-medium text-sm md:text-base'>
          <p>Total User</p>
        </div>
      </div>

      {/* Display Total Sales and Total Revenue */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-bold">Total Sales</h2>
        <h2 className="text-xl font-bold">Total Revenue</h2>
      </div>
    </div>
  );
};

export default DashboardIndex;
