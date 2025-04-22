import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const CustomerStatistics = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerStatistics, setCustomerStatistics] = useState([]);
  const fetchCustomerStatistics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/statistics/customer?startDate=${startDate}&endDate=${endDate}`
      );
      console.log(response.data);
      setCustomerStatistics(response.data);
    } catch (error) {
      console.error("Error fetching customer statistics:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-gray-800 mb-6">
          Thống kê khách hàng theo doanh thu
        </div>
        <div className="flex gap-6 border-2 p-6 rounded-xl shadow-md items-center justify-between  mb-8 w-1/2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={fetchCustomerStatistics}
            className="bg-blue-500 text-white px-6 py-2 mt-5 md:mt-0 rounded-md hover:bg-blue-600 transition shadow"
          >
            Thống kê
          </button>
        </div>
        <div className="overflow-x-auto w-full max-w-3/4">
          <table className="min-w-full table-auto border border-gray-300 bg-white shadow-sm rounded-lg">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="px-4 py-1">Mã KH</th>
                <th className="px-4 py-1">Tên KH</th>
                <th className="px-4 py-1">Địa chỉ</th>
                <th className="px-4 py-1">Số điện thoại</th>
                <th className="px-4 py-1">Số lần thuê</th>
                <th className="px-4 py-1">Tổng ngày thuê</th>
                <th className="px-4 py-1">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {customerStatistics.map((customer) => (
                <tr
                  onClick={() =>
                    navigate(`/admin/statistics/customer/${customer.userId}`, {
                      state: { customer, startDate, endDate },
                    })
                  }
                  className="border-b border-gray-200 hover:bg-gray-100 text-center cursor-pointer"
                >
                  <td className="px-4 py-2">{customer.userId}</td>
                  <td className="px-4 py-2">{customer.fullName}</td>
                  <td className="px-4 py-2">{customer.address}</td>
                  <td className="px-4 py-2">{customer.phoneNumber}</td>
                  <td className="px-4 py-2">{customer.totalRentals}</td>
                  <td className="px-4 py-2">{customer.totalRentalDays}</td>
                  <td className="px-4 py-2">{customer.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <button className="px-4 py-1 bg-gray-100 rounded hover:bg-gray-300 transition">
            1
          </button>
        </div>
      </div>
    </>
  );
};
