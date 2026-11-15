import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

import StorefrontLayout from "./components/StorefrontLayout.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import ReturnPolicy from "./pages/ReturnPolicy.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/register.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Shop from "./pages/Shop.jsx";
import Checkout from "./pages/CheckOut.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Profile from "./pages/Profile.jsx";
import Wishlist from "./pages/Wishlist.jsx";

import AdminLayout from "./admin/layout/AdminLayout.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/admindashboard.jsx";
import AdminUsers from "./admin/AdminUser.jsx";
import AdminProducts from "./admin/AdmnProducts.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AddProduct from "./admin/AddProducts.jsx";
import EditProduct from "./admin/EditProducts.jsx";

const LegacyEditRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/admin/products/${id}/edit`} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Storefront */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Navigate to="/shop" replace />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/return" element={<ReturnPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />

          {/* Legacy admin URLs */}
          <Route
            path="add-product"
            element={<Navigate to="/admin/products/new" replace />}
          />
          <Route path="edit-product/:id" element={<LegacyEditRedirect />} />
          <Route
            path="user"
            element={<Navigate to="/admin/users" replace />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
