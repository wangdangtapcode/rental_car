import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
export const CustomerSearch = () => {
  const navigate = useNavigate();
  // --- State cho Tìm kiếm Khách hàng ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  // --- State cho Modal Thêm Khách hàng ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    status: "ACTIVE",
    userType: "CUSTOMER",
  });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [addError, setAddError] = useState("");
  //
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        setSearchError(null);
        setSearchResults([]);
        try {
          const data = await findCustomersByName(searchTerm);
          setSearchResults(data);
        } catch (err) {
          setSearchError("Lỗi tìm kiếm khách hàng.");
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]); // Xóa kết quả nếu input rỗng
      }
    }, 500); // Chờ 500ms sau khi ngừng gõ

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout khi component unmount hoặc searchTerm thay đổi
  }, [searchTerm]);

  const findCustomersByName = async (name) => {
    if (!name) return [];

    try {
      const response = await axios.get(
        `http://localhost:8081/api/management/customer/search?fullName=${name}`
      );

      if (Array.isArray(response.data)) {
        console.log(response.data);
        return response.data;
      } else {
        console.error(`API Error: ${response.status}`);
        return [];
      }
    } catch (error) {
      //   setSearchError("Lỗi tìm kiếm khách hàng.");
      console.error("Error fetching customers:", error);
      return [];
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setAddError("");
    setNewCustomerData({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      status: "ACTIVE",
      userType: "CUSTOMER",
    });
  };
  //
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };
  //
  const handleAddFormChange = (event) => {
    const { name, value } = event.target;
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //
  const handleAddFormSubmit = async (event) => {
    event.preventDefault();
    setAddError("");
    setIsAddingCustomer(true);

    try {
      console.log(newCustomerData);
      const response = await axios.post(
        "http://localhost:8081/api/management/customer/add",
        newCustomerData
      );
      console.log(response.data);
      if (response.data) {
        setShowAddModal(false);
        // navigate(`/rental/vehicles/${response.data.id}`, {
        //   state: { customer: response.data }, // Chuyển dữ liệu khách hàng đến trang mới
        // });
      }
    } catch (err) {
      setAddError("Lỗi khi thêm khách hàng. Vui lòng thử lại.");
      console.error("Add customer error:", err);
    } finally {
      setIsAddingCustomer(false);
    }
  };
  //
  const handleSelectCustomer = (customer) => {
    console.log("Selected customer:", customer);
    navigate(`/rental/vehicles/${customer.id}`, { state: { customer } });
  };
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Chọn Khách Hàng Thuê Xe</h1>

      <div className="p-4 border rounded shadow-sm bg-white">
        <div className="flex justify-between items-center m-5">
          <h2 className="text-xl font-semibold mb-3">Tìm Khách Hàng </h2>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm text-center"
          >
            + Thêm Khách Hàng
          </button>
        </div>

        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            placeholder="Nhập tên khách hàng..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isSearching && <p className="text-gray-500">Đang tìm kiếm...</p>}
        {searchError && <p className="text-red-500 text-sm">{searchError}</p>}

        {!isSearching && searchTerm.trim() && searchResults.length === 0 && (
          <div className="mt-3 text-center text-gray-600">
            <p>Không tìm thấy khách hàng nào khớp với "{searchTerm}".</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-3 max-h-80 overflow-y-auto border rounded">
            <ul className="divide-y">
              {searchResults.map((customer) => (
                <li
                  key={customer.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div>
                    <p className="font-medium">{customer.user.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {customer.user.phoneNumber} - {customer.user.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {customer.user.address}
                    </p>
                  </div>
                  <FaAngleRight className="h-5 w-5 text-blue-500" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          onClick={handleCloseAddModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Thêm Khách Hàng Mới</h2>
            {addError && (
              <p className="text-red-500 text-sm mb-3">{addError}</p>
            )}
            <form onSubmit={handleAddFormSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={newCustomerData.fullName}
                  onChange={handleAddFormChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  value={newCustomerData.email}
                  onChange={handleAddFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  required
                  type="password"
                  id="password"
                  name="password"
                  value={newCustomerData.password}
                  onChange={handleAddFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Số Điện Thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={newCustomerData.phoneNumber}
                  onChange={handleAddFormChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Địa chỉ
                </label>
                <textarea
                  required
                  id="address"
                  name="address"
                  value={newCustomerData.address}
                  onChange={handleAddFormChange}
                  rows="2"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  disabled={isAddingCustomer}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={isAddingCustomer}
                >
                  {isAddingCustomer ? "Đang lưu..." : "Lưu Khách Hàng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
