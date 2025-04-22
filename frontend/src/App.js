import React from "react";

import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/web/Login";
import { Home } from "./pages/web/Home";
import { Register } from "./pages/web/Register";
import { LayoutDefault } from "./components/layout/LayoutDefault";
import { Dashboard } from "./pages/admin/Dashboard";
import { LayoutAdmin } from "./components/adminPage/layout/LayoutAdmin";
import { CustomerStatistics } from "./pages/admin/CustomerStatistics";
import { NotFound } from "./pages/web/NotFound";
import { CustomerManagement } from "./pages/admin/CustomerManagement";
import { AddCustomer } from "./pages/admin/CustomerManagement/AddCustomer";
import { DetailCustomer } from "./pages/admin/CustomerManagement/DetailCustomer";
import { EditCustomer } from "./pages/admin/CustomerManagement/EditCustomer";
import { CustomerInvoiceDetails } from "./pages/admin/CustomerStatistics/detail";
import { VehicleManagement } from "./pages/admin/VehicleManagement";
import { AddVehicle } from "./pages/admin/VehicleManagement/AddVehicle";
import { EditVehicle } from "./pages/admin/VehicleManagement/EditVehicle";
import { DetailVehicle } from "./pages/admin/VehicleManagement/DetailVehicle";
import { ViewVehicle } from "./pages/web/ViewVehicle";
import { VehicleList } from "./pages/web/VehicleLists";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutDefault />}>
          {/*Home*/}
          <Route path="/" element={<Home />} />
          {/*ViewVehicle*/}
          <Route path="/vehicle/view/:id" element={<ViewVehicle />} />

          <Route path="/vehicles" element={<VehicleList />} />
        </Route>

        <Route element={<LayoutAdmin />}>
          {/*Dashboard*/}
          <Route path="/admin" element={<Dashboard />} />
          {/*Management*/}
          {/*Customer Management*/}
          <Route
            path="/admin/management/customer"
            element={<CustomerManagement />}
          />
          <Route
            path="/admin/management/customer/add"
            element={<AddCustomer />}
          />
          <Route
            path="/admin/management/customer/detail/:id"
            element={<DetailCustomer />}
          />
          <Route
            path="/admin/management/customer/edit/:id"
            element={<EditCustomer />}
          />
          {/*Vehicle Management*/}
          <Route
            path="admin/management/vehicle"
            element={<VehicleManagement />}
          />
          <Route path="admin/management/vehicle/add" element={<AddVehicle />} />
          <Route
            path="admin/management/vehicle/edit/:id"
            element={<EditVehicle />}
          />
          <Route
            path="admin/management/vehicle/detail/:id"
            element={<DetailVehicle />}
          />
          {/*Statistics*/}
          {/*Customer Statistics*/}
          <Route
            path="/admin/statistics/customer"
            element={<CustomerStatistics />}
          />
          <Route
            path="/admin/statistics/customer/:id"
            element={<CustomerInvoiceDetails />}
          />
        </Route>
        {/*Login*/}
        <Route path="/login" element={<Login />} />
        {/*Register*/}
        <Route path="/register" element={<Register />} />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
