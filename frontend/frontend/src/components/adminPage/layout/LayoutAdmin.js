import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const LayoutAdmin = () => {
  return (
    <>
      <div className="relative w-screen h-screen flex flex-col ">
        <Topbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 ml-60 mt-16 p-10 ">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};
