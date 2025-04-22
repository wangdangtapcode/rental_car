import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
export const CustomerManagement = () => {
  const [searchKey, setSearchKey] = useState("");
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const fetchSearchCustomer = async () => {
    try {
      const response = await axios.get(
        searchKey
          ? `http://localhost:8081/api/management/customer/search?fullName=${searchKey}`
          : "http://localhost:8081/api/management/customer/search/all"
      );
      console.log(response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
  const deleteCustomer = async (id) => {
    const confirm = window.confirm(
      "Bạn có chắc chắn muốn xoá khách hàng này không?"
    );
    if (!confirm) return;
    try {
      const reponse = await axios.delete(
        `http://localhost:8081/api/management/customer/del/${id}`
      );

      if (reponse.data === true) {
        console.log("Xóa khách hàng thành công");
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      console.log("Xóa khách hàng thất bại. Vui lòng thử lại.");
    }
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl text-center font-bold mb-10">
          Quản lý khách hàng
        </h1>
        <div className="flex justify-between items-center mb-4 w-full">
          <div className="flex  items-center w-1/2">
            <input
              value={searchKey}
              type="text"
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Tìm kiếm tên khách hàng"
              className="border border-gray-300 rounded-lg px-4 py-2 w-2/3"
            />
            <button
              onClick={() => {
                fetchSearchCustomer();
              }}
              className="bg-blue-500 text-white border border-gray-300 px-4 py-2 rounded-lg mx-2"
            >
              Tìm
            </button>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            <Link to="/admin/management/customer/add">Thêm khách hàng</Link>
          </button>
        </div>
        <div className="overflow-x-auto mt-10">
          <table className="border border-gray-300 w-full text-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className=" px-4 py-2">Tên</th>
                <th className=" px-4 py-2">Số điện thoại</th>
                <th className=" px-4 py-2">Địa chỉ</th>
                <th className=" px-4 py-2">Trạng thái</th>
                <th className=" px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  
                  onClick={() =>
                    navigate(
                      `/admin/management/customer/detail/${customer.id}`,
                      {
                        state: { customer },
                      }
                    )
                  }
                  className="hover:bg-gray-100 text-center divide-x divide-gray-300 cursor-pointer"
                >
                  <td className="px-4 py-2 ">{customer.fullName}</td>
                  <td className="px-4 py-2">{customer.phoneNumber}</td>
                  <td className="px-4 py-2">{customer.address}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        customer.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex items-center justify-center space-x-2">
                    <FaRegEdit
                      className=" text-yellow-500 cursor-pointer text-2xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/admin/management/customer/edit/${customer.id}`,
                          {
                            state: { customer },
                          }
                        );
                      }}
                    />
                    <AiOutlineDelete
                      className=" text-red-500 cursor-pointer text-2xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomer(customer.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
