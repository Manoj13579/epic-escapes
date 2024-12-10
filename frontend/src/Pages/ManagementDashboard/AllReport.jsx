import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";
import Loader from "../../Utils/Loader";
import { toast } from "react-toastify";
import axiosInstance from "../../Utils/axiosInstance";

const AllReport = () => {
  const [timePeriod, setTimePeriod] = useState("month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  // Fetch and transform data when timePeriod changes
  //max value in chart auto created by recharts

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/booking/get-all-bookings");
        if (response.data.success) {
          toast.success(response.data.message);

          // Initialize an array for 12 months (Jan to Dec) or 7 days of the week
          const now = new Date();
          let transformedData = [];

          if (timePeriod === "month") {
            // Prepare a data structure for all months
            /* { length: 12 } create 12 array with empty slots. */
            transformedData = Array.from({ length: 12 }, (_, index) => {/*callback function that gets executed for each item of the array. runs 12 timess for 0 to 11 each. The callback has two parameters: _ (which means we’re not using this value, and it’s often used as a placeholder) and index (which represents the position or index of each element in the array like in map).Array.from({ length: 12 }) creates an empty array of length 12 (12 slots). from 0 to 11 */
              const monthDate = new Date(now.getFullYear(), index); // use current year and index for month
              return {
                name: monthDate.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric", // fix year to "numeric" for display
                }),
                TotalSales: 0,
                TotalRevenue: 0,
              };
            });            
            // Populate monthly data
            /* forEach same as map but doesnot create copy of array or new array. only modifies existing array. forEach() is used instead of map() because the goal is to modify an existing array (transformedData) rather than creating a new array. It does not return a value, so you can't use it to generate a new array from the original data*/
            response.data.data.forEach((item) => {
              const date = new Date(item.bookStartDate);
              const monthIndex = date.getMonth();
              //add TotalSales that is 0 to value of TotalSales from response to particular month
              transformedData[monthIndex].TotalSales += item.totalPrice;
              transformedData[monthIndex].TotalRevenue +=
                item.totalPrice * 0.5; // 50% of totalPrice
            });
          } else if (timePeriod === "week") {
            // Prepare a data structure for the latest 7 days
            const latest7Days = Array.from({ length: 7 }, (_, index) => {
              const date = new Date();
              date.setDate(now.getDate() - index - 1); // Exclude today.get 7 data but from yesterday
              return {
                name: date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
                TotalSales: 0,
                TotalRevenue: 0,
              };
            }).reverse();//reverse array so get latest date/yesterday first so 18-24 not 24-18

            // Populate weekly data
            response.data.data.forEach((item) => {
              const date = new Date(item.bookStartDate);
              const dateKey = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              const dayData = latest7Days.find((day) => day.name === dateKey);
              if (dayData) {
                dayData.TotalSales += item.totalPrice;
                dayData.TotalRevenue += item.totalPrice * 0.5; // 50% of totalPrice
              }
            });

            transformedData = latest7Days;
          }

          // Set transformed data to state
          setData(transformedData);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login"); 
          return;
        }
        toast.error("Error fetching bookings! Try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod]); // Re-fetch data when timePeriod changes

  // Calculate total sales and total revenue
  const totalSales = data.reduce((acc, curr) => acc + curr.TotalSales, 0);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.TotalRevenue, 0);

  return (
    <section>
      {/* Show loader while data is loading */}
      {loading && <Loader />}

      {/* Buttons to toggle between month and week */}
      <div className="flex justify-center mb-4">
        <button
          className={`mx-2 px-4 py-2 ${
            timePeriod === "month"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 dark:bg-gray-800"
          }`}
          onClick={() => setTimePeriod("month")}
        >
          Month
        </button>
        <button
          className={`mx-2 px-4 py-2 ${
            timePeriod === "week"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 dark:bg-gray-800"
          }`}
          onClick={() => setTimePeriod("week")}
        >
          Week
        </button>
      </div>

      {/* Display Total Sales and Total Revenue */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">
          Total Sales: ${totalSales.toFixed(2)}
        </h2>
        <h2 className="text-xl font-bold">
          Total Revenue: ${totalRevenue.toFixed(2)}
        </h2>
      </div>

      {/* Line chart */}
      <div className="h-72 w-full bg-white shadow-lg">
        <ResponsiveContainer className="h-full w-full">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Takes "name" from data={data} above LineChart */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Lines displaying by dataKey. stroke for line color */}
            <Line
              type="monotone"
              dataKey="TotalSales"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="TotalRevenue" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="h-72 w-full bg-white shadow-lg mt-4">
        <ResponsiveContainer className="h-full w-full">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="TotalSales"
              fill="#8884d8"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Bar
              dataKey="TotalRevenue"
              fill="#82ca9d"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default AllReport;