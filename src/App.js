import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import AddRestaurant from './pages/AddRestaurant';
import AddMenuItems from './pages/AddMenuItems';
import RestaurantDetails from './pages/RestaurantDetails';
import BrowseRestaurants from './pages/BrowseRestaurants';
import OrderPage from './pages/OrderPage';
import OrderSummary from './pages/OrderSummary';
import OrderStatus from './pages/OrderStatus';
import Logout from './pages/Logout';
import UserProfile from './pages/UserProfile';
import OwnerRestaurants from './pages/OwnerRestaurants';
import OwnerRestaurantProfile from './pages/OwnerRestaurantProfile';
import OwnerViewMenu from './pages/OwnerViewMenu';
import IncomingOrders from './pages/IncomingOrders';
import OwnerOrderDetails from './pages/OwnerOrderDetails';
import MyDeliveries from './pages/MyDeliveries';
import OwnerOrders from './pages/OwnerOrders';
import RestaurantOrders from './pages/RestaurantOrders';
import TrackDelivery from './pages/TrackDelivery';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/customer/:username" element={<CustomerDashboard />} />
        <Route path="/dashboard/owner/:username" element={<OwnerDashboard />} />
        <Route path="/dashboard/delivery/:username" element={<DeliveryDashboard />} />
        <Route path="/dashboard/admin/:username" element={<AdminDashboard />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/add-menu-items/:restaurantId" element={<AddMenuItems />} />
        <Route path="/restaurant/:restaurantId/details" element={<RestaurantDetails />} />
        <Route path="/browse" element={<BrowseRestaurants />} />
        <Route path="/restaurant/:restaurantId/order" element={<OrderPage />} />
        <Route path="/order/:orderId/summary" element={<OrderSummary />} />
        <Route path="/order/status" element={<OrderStatus />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile/:username" element={<UserProfile />} />
        <Route path="/owner/restaurants" element={<OwnerRestaurants />} />
        <Route path="/owner/restaurants" element={<OwnerRestaurants />} />
        <Route path="/owner/restaurant/:restaurantId/profile" element={<OwnerRestaurantProfile />} />
        <Route path="/owner/restaurant/:restaurantId/menu" element={<OwnerViewMenu />} />
        <Route path="/owner/incoming-orders" element={<IncomingOrders />} />
        <Route path="/owner/order/:orderId/details" element={<OwnerOrderDetails />} />
        <Route path="/deliveries" element={<MyDeliveries />} />
        <Route path="/owner/orders" element={<OwnerOrders />} />
        <Route path="/owner/restaurant/:restaurantId/orders" element={<RestaurantOrders />} />
        <Route path="/delivery/track" element={<TrackDelivery />} />

      </Routes>
    </Router>
  );
}

export default App;