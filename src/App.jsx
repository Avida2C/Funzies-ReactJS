import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { darkThemeColors, lightThemeColors } from "./theme/colors";
import { THEME_STORAGE_KEY, ThemeContext, getInitialThemeMode } from "./theme/themeContext";
import { WISHLIST_STORAGE_KEY, WishlistContext, getInitialWishlistIds } from "./lib/wishlistContext";
import { CART_STORAGE_KEY, CartContext, getInitialCartItemIds } from "./lib/cartContext";
import {
  AUTH_PROFILE_STORAGE_KEY,
  AUTH_STORAGE_KEY,
  AuthContext,
  getInitialAuthProfile,
  getInitialIsAuthenticated,
} from "./lib/authContext";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import ProductReviewsPage from "./pages/ProductReviewsPage";
import WishlistPage from "./pages/WishlistPage";
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
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

function App() {
  const { pathname } = useLocation();
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [wishlistProductIds, setWishlistProductIds] = useState(getInitialWishlistIds);
  const [cartItemIds, setCartItemIds] = useState(getInitialCartItemIds);
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialIsAuthenticated);
  const [authProfile, setAuthProfile] = useState(getInitialAuthProfile);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistProductIds));
  }, [wishlistProductIds]);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItemIds));
  }, [cartItemIds]);

  useEffect(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated ? "signed-in" : "guest");
  }, [isAuthenticated]);

  useEffect(() => {
    window.localStorage.setItem(AUTH_PROFILE_STORAGE_KEY, JSON.stringify(authProfile));
  }, [authProfile]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

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

  const wishlistContextValue = useMemo(
    () => ({
      wishlistProductIds,
      isWishlisted: (productId) => wishlistProductIds.includes(productId),
      toggleWishlist: (productId) => {
        setWishlistProductIds((currentIds) =>
          currentIds.includes(productId)
            ? currentIds.filter((id) => id !== productId)
            : [...currentIds, productId],
        );
      },
    }),
    [wishlistProductIds],
  );

  const cartContextValue = useMemo(
    () => ({
      cartItemIds,
      cartCount: cartItemIds.length,
      addToCart: (productId) => {
        setCartItemIds((currentIds) => [...currentIds, productId]);
      },
      setCartItemQuantity: (productId, nextQuantity) => {
        setCartItemIds((currentIds) => {
          const sanitizedQuantity = Math.max(0, Number.parseInt(String(nextQuantity), 10) || 0);
          const withoutProduct = currentIds.filter((id) => id !== productId);
          if (sanitizedQuantity === 0) {
            return withoutProduct;
          }
          return [...withoutProduct, ...Array.from({ length: sanitizedQuantity }, () => productId)];
        });
      },
      decreaseCartItem: (productId) => {
        setCartItemIds((currentIds) => {
          const indexToRemove = currentIds.indexOf(productId);
          if (indexToRemove === -1) {
            return currentIds;
          }
          return currentIds.filter((_, index) => index !== indexToRemove);
        });
      },
      removeFromCart: (productId) => {
        setCartItemIds((currentIds) => currentIds.filter((id) => id !== productId));
      },
      clearCart: () => {
        setCartItemIds([]);
      },
    }),
    [cartItemIds],
  );

  const authContextValue = useMemo(
    () => ({
      isAuthenticated,
      displayName: isAuthenticated ? authProfile.displayName : "Guest",
      email: isAuthenticated ? authProfile.email : "",
      signOut: () => {
        window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
        window.localStorage.removeItem(CART_STORAGE_KEY);
        window.localStorage.removeItem(THEME_STORAGE_KEY);
        setIsAuthenticated(false);
        setWishlistProductIds(getInitialWishlistIds);
        setCartItemIds(getInitialCartItemIds);
        setThemeMode(getInitialThemeMode);
      },
      signIn: ({ displayName, email } = {}) => {
        setAuthProfile({
          displayName: typeof displayName === "string" && displayName.trim() ? displayName.trim() : "Nadine",
          email: typeof email === "string" ? email.trim() : "",
        });
        setIsAuthenticated(true);
      },
    }),
    [authProfile, isAuthenticated],
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <AuthContext.Provider value={authContextValue}>
        <WishlistContext.Provider value={wishlistContextValue}>
          <CartContext.Provider value={cartContextValue}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/product-page/:productId" element={<ProductPage />} />
            <Route path="/product-page/:productId/reviews" element={<ProductReviewsPage />} />
            <Route path="/viewcart" element={<ViewCartPage />} />
            <Route path="/checkout" element={<CheckoutLikePage title="Checkout" description="Complete your order details and confirm purchase." actionText="Confirm order" />} />
            <Route
              path="/account"
              element={isAuthenticated ? <AccountPage /> : <Navigate to="/login" replace />}
            />
            <Route path="/login" element={<LoginPage initialMode="login" />} />
            <Route path="/create-account" element={<LoginPage initialMode="signup" />} />
            <Route path="/forgot-password" element={<LoginPage initialMode="forgot" />} />
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
          </CartContext.Provider>
        </WishlistContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
