import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { darkThemeColors, lightThemeColors } from "./theme/colors";
import { THEME_STORAGE_KEY, ThemeContext, getInitialThemeMode } from "./theme/themeContext";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CheckoutLikePage from "./pages/CheckoutLikePage";
import ViewCartPage from "./pages/ViewCartPage";
import LegalPage from "./pages/LegalPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

function App() {
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const themeContextValue = useMemo(
    () => ({
      mode: themeMode,
      colors: themeMode === "dark" ? darkThemeColors : lightThemeColors,
      toggleTheme: () => setThemeMode((current) => (current === "dark" ? "light" : "dark")),
      isSidebarOpen: false,
      openSidebar: () => {},
      closeSidebar: () => {},
    }),
    [themeMode],
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product-page/:productId" element={<ProductPage />} />
        <Route path="/viewcart" element={<ViewCartPage />} />
        <Route path="/checkout" element={<CheckoutLikePage title="Checkout" description="Complete your order details and confirm purchase." actionText="Confirm order" />} />
        <Route path="/account" element={<CheckoutLikePage title="My Account" description="Manage your account information." actionText="Update profile" />} />
        <Route path="/create-account" element={<CheckoutLikePage title="Create Account" description="Create a new customer account." actionText="Create account" />} />
        <Route path="/forgot-password" element={<CheckoutLikePage title="Forgot Password" description="Request a secure password reset link." actionText="Send reset link" />} />
        <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        <Route path="/contact" element={<CheckoutLikePage title="Contact" description="Get in touch with our support team." actionText="Send message" />} />
        <Route path="/privacy" element={<LegalPage title="Privacy Policy" body="We only process store data needed to fulfill orders, maintain accounts, and improve the shopping experience. Your information is handled in accordance with the original Funzies privacy policy intent." />} />
        <Route path="/terms" element={<LegalPage title="Terms and Conditions" body="By using this store, you agree to provide accurate account and checkout details, comply with lawful purchasing behavior, and accept that product availability and pricing can change without prior notice." />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeContext.Provider>
  );
}

export default App;
