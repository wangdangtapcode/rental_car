import { Link } from "react-router-dom";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

export const Sidebar = () => {
  const [isStaticsDropdown, setIsStaticsDropdown] = useState(false);
  const [isManagementDropdown, setIsManagementDropdown] = useState(false);
  const toggleDropdownStatics = (e) => {
    console.log("clicked");
    e.preventDefault();
    setIsStaticsDropdown(!isStaticsDropdown);
  };
  const toggleDropdownManagement = (e) => {
    console.log("clicked");
    e.preventDefault();
    setIsManagementDropdown(!isManagementDropdown);
  };
  return (
    <>
      <div className="fixed top-16 left-0 bg-gray-800 w-60 h-[calc(100vh-4rem)] text-white">
        <div className="p-4">
          <h2 className="text-xl font-blod">Menu</h2>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className="block px-4 py-2 hover:bg-gray-700 text-md"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/rental/customer"
                className="block px-4 py-2 hover:bg-gray-700 text-md"
              >
                Rental
              </Link>
            </li>
            <li>
              <div
                className="flex justify-between items-center hover:bg-gray-700 cursor-pointer"
                onClick={toggleDropdownManagement}
              >
                <div className=" px-4 py-2 text-md">Management</div>
                <button className="text-lg px-4 py-2">
                  <RiArrowDropDownLine className="w-8 h-8" />
                </button>
              </div>
              {isManagementDropdown && (
                <ul className="pl-8 space-y-2">
                  <li>
                    <Link
                      to="/admin/management/customer"
                      className=" block px-4 py-2 hover:bg-gray-700 text-sm"
                    >
                      Customer Management
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/management/vehicle"
                      className="block px-4 py-2 hover:bg-gray-700 text-sm"
                    >
                      Vehicle Management
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <div
                className="flex justify-between items-center hover:bg-gray-700 cursor-pointer"
                onClick={toggleDropdownStatics}
              >
                <div className=" px-4 py-2 text-md">Statistics</div>
                <button className="text-lg px-4 py-2">
                  <RiArrowDropDownLine className="w-8 h-8" />
                </button>
              </div>
              {isStaticsDropdown && (
                <ul className="pl-8 space-y-2">
                  <li>
                    <Link
                      to="/admin/statistics/customer"
                      className="block px-4 py-2 hover:bg-gray-700 text-sm"
                    >
                      Customer Statistics
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/statistics/partner"
                      className="block px-4 py-2 hover:bg-gray-700 text-sm"
                    >
                      Partner Statistics
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
