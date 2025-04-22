import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";

export const DetailCustomer = () => {
  const location = useLocation();
  const customer = location.state.customer;
  const navigate = useNavigate();
  console.log(customer);
  return (
    <div className="w-full mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white relative">
      <div className="absolute top-4 right-4">
        <FaRegEdit
          className="text-yellow-500 cursor-pointer text-2xl"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/management/customer/edit/${customer.id}`, {
              state: { customer },
            });
          }}
        />
      </div>

      <h2 className="text-2xl font-bold mb-6 ">Chi tiết khách hàng</h2>

      <div className="space-y-3 text-xl">
        <div className="flex items-center space-x-2">
          <label className="font-semibold">Họ tên:</label>
          <p>{customer.fullName}</p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold">Email:</label>
          <p>{customer.email}</p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold">Số điện thoại:</label>
          <p>{customer.phoneNumber}</p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold">Địa chỉ:</label>
          <p>{customer.address}</p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-semibold">Mật khẩu:</label>
          <p>{customer.password}</p>
        </div>

        <div>
          <label className="font-semibold">Trạng thái:</label>
          <p
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              customer.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {customer.status}
          </p>
        </div>
      </div>
    </div>
  );
};
