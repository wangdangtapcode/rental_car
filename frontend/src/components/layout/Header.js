import { Link } from "react-router";
import { LiaCarSideSolid } from "react-icons/lia";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/userSlice";
import { useNavigate } from "react-router";
import { useEffect } from "react";
export const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  console.log("User in Header:", user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center">
      <Link to="/">
        <div className="flex mx-2 items-center justify-center">
          <LiaCarSideSolid className="text-3xl font-bold mx-2" />
          <h1 className="text-2xl font-bold">Thuê Xe</h1>
        </div>
      </Link>

      <nav className="flex space-x-6 ml-10">
        <Link to="/vehicles" className="hover:text-gray-300 font-medium">
          Danh sách xe
        </Link>
      </nav>
      <nav className="flex space-x-6 ml-10">
        <Link to="/booking" className="hover:text-gray-300 font-medium">
          Đặt xe
        </Link>
      </nav>
      <div className="ml-auto">
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded-lg mr-2 hover:bg-gray-200"
          >
            Logout {user.fullname}
          </button>
        ) : (
          <Link to="/login">
            <button className="bg-white text-blue-600 px-4 py-1 rounded-lg mr-2 hover:bg-gray-200">
              Login
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};
