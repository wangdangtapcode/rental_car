import { useLocation } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const EditCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state.customer;
  const [newCustomer, setNewCustomer] = useState({
    id: customer.id,
    fullName: customer.fullName,
    email: customer.email,
    password: customer.password,
    phoneNumber: customer.phoneNumber,
    address: customer.address,
    status: customer.status,
    userType: customer.userType,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8081/api/management/customer/edit/${customer.id}`,
        newCustomer
      );

      if (response.data === true) {
        console.log("cap nhat thanh cong");

        setTimeout(() => {
          navigate("/admin/management/customer");
        }, 1500);
      } else {
        console.log("cap nhat that bai");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className=" container mx-auto p-4 w-full border rounded-lg relative text-2xl">
        <h1 className="text-2xl font-bold ">Thêm khách hàng mới</h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className=" mt-4">
            <label className="px-2 py-1">Họ và tên:</label>
            <input
              name="fullName"
              type="text"
              value={newCustomer.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
              required
            />
          </div>
          <div className="mt-4">
            <label className="px-2 py-1">Email:</label>
            <input
              name="email"
              type="email"
              value={newCustomer.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
              required
            />
          </div>
          <div className="mt-4">
            <label className="px-2 py-1">Mật khẩu:</label>
            <input
              name="password"
              type="password"
              value={newCustomer.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
              required
            />
          </div>
          <div className="mt-4">
            <label className="px-2 py-1">Số điện thoại:</label>
            <input
              name="phoneNumber"
              type="text"
              value={newCustomer.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
              required
            />
          </div>
          <div className="mt-4">
            <label className="px-2 py-1">Địa chỉ:</label>
            <input
              name="address"
              type="text"
              value={newCustomer.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
              required
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2 mt-4">
              <label className="mb-2">Trạng thái:</label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="ACTIVE"
                    checked={newCustomer.status === "ACTIVE"}
                    onChange={handleChange}
                  />
                  <span>Hoạt động</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="INACTIVE"
                    checked={newCustomer.status === "INACTIVE"}
                    onChange={handleChange}
                  />
                  <span>Ngưng hoạt động</span>
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className=" absolute right-4 bottom-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Cập nhật
          </button>
        </form>
      </div>
    </>
  );
};
