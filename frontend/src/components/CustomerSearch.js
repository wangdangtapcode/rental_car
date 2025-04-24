// src/pages/admin/rental/CustomerRentalPage.jsx (Viết trực tiếp, không dùng component con)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- Giả lập API (Bạn nên tách ra file riêng nếu dự án lớn) ---
// Dữ liệu mẫu (Cần có sẵn ở đây hoặc import từ file khác)
const fakeCustomers = [
  {
    id: 1,
    user: {
      id: 101,
      fullName: "Nguyễn Văn Test",
      phoneNumber: "0901112233",
      email: "test1@example.com",
      address: "1 Đường Demo, Q. Hoàn Kiếm, Hà Nội",
      userType: "CUSTOMER",
      status: "ACTIVE",
    },
  },
  {
    id: 2,
    user: {
      id: 102,
      fullName: "Trần Thị Mẫu",
      phoneNumber: "0918887766",
      email: "test2@example.com",
      address: "2 Phố Ví Dụ, Q. Ba Đình, Hà Nội",
      userType: "CUSTOMER",
      status: "ACTIVE",
    },
  },
  {
    id: 3,
    user: {
      id: 103,
      fullName: "Lê Văn Khách",
      phoneNumber: "0989998877",
      email: "test3@example.com",
      address: "3 Ngõ Thí Nghiệm, Q. Đống Đa, Hà Nội",
      userType: "CUSTOMER",
      status: "INACTIVE",
    },
  },
  {
    id: 4,
    user: {
      id: 104,
      fullName: "Nguyễn Thị Mẫu",
      phoneNumber: "0902223344",
      email: "mau.nguyen@example.com",
      address: "4 Đại Lộ Mẫu, Q. Hai Bà Trưng, Hà Nội",
      userType: "CUSTOMER",
      status: "ACTIVE",
    },
  },
];

// Hàm tìm kiếm (Giả lập)
const findCustomersByName = async (name) => {
  console.log(`API: Searching customers with name containing "${name}"`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (!name) return [];
  const lowerCaseName = name.toLowerCase();
  return fakeCustomers.filter(
    (c) =>
      c.user.status === "ACTIVE" &&
      c.user.fullName.toLowerCase().includes(lowerCaseName)
  );
};

// Hàm thêm khách hàng mới (Giả lập)
const addCustomerAPI = async (customerData) => {
  console.log("API: Adding customer", customerData);
  await new Promise((resolve) => setTimeout(resolve, 400));
  const newId = Date.now();
  const newUser = {
    id: newId + 1000,
    fullName: customerData.fullName,
    phoneNumber: customerData.phoneNumber,
    email: customerData.email || "", // Đảm bảo email có giá trị
    address: customerData.address || "", // Đảm bảo address có giá trị
    userType: "CUSTOMER",
    status: "ACTIVE",
  };
  const newCustomer = { id: newId, user: newUser };
  fakeCustomers.push(newCustomer); // Thêm vào mảng giả lập
  return newCustomer;
};
// --- Kết thúc API giả lập ---

function CustomerRentalPage() {
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
    phoneNumber: "",
    email: "",
    address: "",
  });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [addError, setAddError] = useState(""); // Lỗi riêng cho form thêm

  // --- Xử lý Tìm kiếm ---
  // Sử dụng useEffect để debounce (tránh gọi API liên tục khi gõ)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        setSearchError(null);
        setSearchResults([]); // Xóa kết quả cũ
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
  }, [searchTerm]); // Chỉ chạy lại khi searchTerm thay đổi

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // --- Xử lý Chọn Khách hàng ---
  const handleSelectCustomer = (customer) => {
    console.log("Selected customer:", customer);
    navigate(`/rental/vehicles/${customer.id}`, { state: { customer } });
  };

  // --- Xử lý Modal Thêm Khách hàng ---
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setAddError(""); // Reset lỗi form khi mở modal
    setNewCustomerData({
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
    }); // Reset form
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddFormChange = (event) => {
    const { name, value } = event.target;
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddFormSubmit = async (event) => {
    event.preventDefault(); // Ngăn form submit mặc định
    setAddError(""); // Reset lỗi

    // Kiểm tra dữ liệu cơ bản
    if (!newCustomerData.fullName || !newCustomerData.phoneNumber) {
      setAddError("Vui lòng nhập Họ tên và Số điện thoại.");
      return;
    }

    setIsAddingCustomer(true);
    try {
      const addedCustomer = await addCustomerAPI(newCustomerData);
      setShowAddModal(false); // Đóng modal
      // Chuyển trang với khách hàng vừa thêm
      navigate(`/rental/vehicles/${addedCustomer.id}`, {
        state: { customer: addedCustomer },
      });
    } catch (err) {
      setAddError("Lỗi khi thêm khách hàng. Vui lòng thử lại.");
      console.error("Add customer error:", err);
      setIsAddingCustomer(false); // Dừng loading nếu lỗi
    }
    // Không cần setIsAddingCustomer(false) nếu navigate thành công
  };

  // --- JSX Render ---
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        Bước 1: Tìm hoặc Thêm Khách Hàng Thuê Xe
      </h1>

      {/* =========================================== */}
      {/* Phần Tìm kiếm Khách hàng (Viết trực tiếp) */}
      {/* =========================================== */}
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-3">Tìm Khách Hàng Hiện Có</h2>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            placeholder="Nhập tên khách hàng..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Có thể thêm nút tìm kiếm nếu không dùng debounce */}
        </div>

        {/* Hiển thị trạng thái Loading hoặc Lỗi tìm kiếm */}
        {isSearching && <p className="text-gray-500">Đang tìm kiếm...</p>}
        {searchError && <p className="text-red-500 text-sm">{searchError}</p>}

        {/* Hiển thị Kết quả tìm kiếm */}
        {!isSearching && searchTerm.trim() && searchResults.length === 0 && (
          <div className="mt-3 text-center text-gray-600">
            <p>Không tìm thấy khách hàng nào khớp với "{searchTerm}".</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-3 max-h-60 overflow-y-auto border rounded">
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* =========================================== */}
      {/* Nút Mở Modal Thêm Khách Hàng */}
      {/* =========================================== */}
      <div className="text-center">
        <button
          onClick={handleOpenAddModal} // Gọi hàm mở modal
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          + Thêm Khách Hàng Mới
        </button>
      </div>

      {/* =========================================== */}
      {/* Modal Thêm Khách hàng (Viết trực tiếp) */}
      {/* =========================================== */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
          onClick={handleCloseAddModal}
        >
          {" "}
          {/* Đóng khi click nền */}
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            {/* Ngăn đóng khi click vào form */}
            <h2 className="text-xl font-semibold mb-4">Thêm Khách Hàng Mới</h2>
            {addError && (
              <p className="text-red-500 text-sm mb-3">{addError}</p>
            )}
            <form onSubmit={handleAddFormSubmit} className="space-y-3">
              {/* Input Họ và Tên */}
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
                  onChange={handleAddFormChange} // Cập nhật state khi nhập
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* Input Số Điện Thoại */}
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
              {/* Input Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newCustomerData.email}
                  onChange={handleAddFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* Input Địa chỉ */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Địa chỉ
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={newCustomerData.address}
                  onChange={handleAddFormChange}
                  rows="2"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              {/* Nút Submit và Hủy */}
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseAddModal} // Gọi hàm đóng modal
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  disabled={isAddingCustomer} // Vô hiệu hóa khi đang lưu
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={isAddingCustomer} // Vô hiệu hóa khi đang lưu
                >
                  {isAddingCustomer ? "Đang lưu..." : "Lưu Khách Hàng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Kết thúc Modal */}
    </div>
  );
}

export default CustomerRentalPage;
