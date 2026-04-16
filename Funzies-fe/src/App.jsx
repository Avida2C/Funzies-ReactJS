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
import HelpCenterPage from "./pages/HelpCenterPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import PurchaseProtectionPage from "./pages/PurchaseProtectionPage";
import ShippingInformationPage from "./pages/ShippingInformationPage";
import ReturnRefundPolicyPage from "./pages/ReturnRefundPolicyPage";
import TrustSafetyPage from "./pages/TrustSafetyPage";
import LegalCenterPage from "./pages/LegalCenterPage";
import PolicyCenterPage from "./pages/PolicyCenterPage";
import CompanyPage from "./pages/CompanyPage";
import AboutUsPage from "./pages/AboutUsPage";
import CareersPage from "./pages/CareersPage";
import CareerRolePage from "./pages/CareerRolePage";
import CareerApplicationPage from "./pages/CareerApplicationPage";
import CareerApplicationReceivedPage from "./pages/CareerApplicationReceivedPage";
import ContactPage from "./pages/ContactPage";
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

  // DaisyUI semantic classes (bg-base-100, text-base-content, etc.) read from <html data-theme="…">.
  // Without this, only ThemeContext inline colors update — cards stay on the wrong palette in light mode.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
    document.documentElement.style.colorScheme = themeMode === "dark" ? "dark" : "light";
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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:roleId" element={<CareerRolePage />} />
        <Route path="/careers/:roleId/apply" element={<CareerApplicationPage />} />
        <Route path="/careers/:roleId/application-received" element={<CareerApplicationReceivedPage />} />
        <Route path="/legal" element={<LegalCenterPage />} />
        <Route path="/trust-safety" element={<TrustSafetyPage />} />
        <Route path="/return-refund-policy" element={<ReturnRefundPolicyPage />} />
        <Route path="/shipping-information" element={<ShippingInformationPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/purchase-protection" element={<PurchaseProtectionPage />} />
        <Route path="/privacy" element={<PolicyCenterPage />} />
        <Route path="/terms" element={<PolicyCenterPage />} />
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
