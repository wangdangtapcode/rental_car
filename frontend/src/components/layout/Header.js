import { Link } from "react-router";
import { LiaCarSideSolid } from "react-icons/lia";
export const Header = () => {
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

      <div className="ml-auto">
        <Link to="/login">
          <button className="bg-white text-blue-600 px-4 py-1 rounded-lg mr-2 hover:bg-gray-200">
            Login
          </button>
        </Link>
      </div>
    </header>
  );
};
