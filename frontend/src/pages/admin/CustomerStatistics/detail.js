import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";

export const CustomerInvoiceDetails = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const customer = location.state.customer;
  const startDate = location.state.startDate;
  const endDate = location.state.endDate;
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      console.log(customer);
      const response = await axios.get(
        `http://localhost:8081/api/statistics/customer/${customer.userId}?startDate=${startDate}&endDate=${endDate}`
      );
      console.log(response.data);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách hóa đơn khách hàng</h1>
      <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
        <span className="font-semibold">Khách hàng:</span> {customer.fullName} -{" "}
        {customer.phoneNumber} - {customer.address}
      </div>

      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Mã hoá đơn</th>
              <th className="border px-2 py-1">Từ ngày</th>
              <th className="border px-2 py-1">Đến ngày</th>
              <th className="border px-2 py-1">Ngày thanh toán</th>
              <th className="border px-2 py-1">Số lượng xe</th>
              <th className="border px-2 py-1">Tiền thuê</th>
              <th className="border px-2 py-1">Tiền phạt</th>
              <th className="border px-2 py-1">Tổng cộng</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="text-center hover:bg-gray-50">
                <td className="border px-2 py-1">{inv.id}</td>
                <td className="border px-2 py-1">
                  {formatDate(inv.startDate)}
                </td>
                <td className="border px-2 py-1">{formatDate(inv.endDate)}</td>
                <td className="border px-2 py-1">
                  {formatDate(inv.paymentDate)}
                </td>
                <td className="border px-2 py-1">{inv.vehicleCount}</td>
                <td className="border px-2 py-1">
                  {formatCurrency(inv.rentalAmount)}
                </td>
                <td className="border px-2 py-1">
                  {formatCurrency(inv.penaltyAmount)}
                </td>
                <td className="border px-2 py-1 font-bold text-blue-600">
                  {formatCurrency(inv.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
