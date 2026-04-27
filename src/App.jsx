import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { darkThemeColors, lightThemeColors } from "./theme/colors";
import { THEME_STORAGE_KEY, ThemeContext, getInitialThemeMode } from "./theme/themeContext";
import { WISHLIST_STORAGE_KEY, WishlistContext, getInitialWishlistIds } from "./lib/wishlistContext";
import { CART_STORAGE_KEY, CartContext, getInitialCartItemIds } from "./lib/cartContext";
import {
  ADMIN_AUTH_STORAGE_KEY,
  AUTH_PROFILE_STORAGE_KEY,
  AUTH_STORAGE_KEY,
  AuthContext,
  getInitialAuthProfile,
  getInitialIsAdminAuthenticated,
  getInitialIsAuthenticated,
  useAuth,
} from "./lib/authContext";
import { validateAdminCredentials } from "./lib/adminAuth";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import ProductReviewsPage from "./pages/ProductReviewsPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
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
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminWebsiteContentPage from "./pages/admin/AdminWebsiteContentPage";
import AdminCareersPage from "./pages/admin/AdminCareersPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminCatalogPage from "./pages/admin/AdminCatalogPage";

function AdminLoginPageGate() {
  const { isAdminAuthenticated } = useAuth();
  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return <AdminLoginPage />;
}

function RequireAdmin({ children }) {
  const { isAdminAuthenticated } = useAuth();
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  const { pathname } = useLocation();
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [wishlistProductIds, setWishlistProductIds] = useState(getInitialWishlistIds);
  const [cartItemIds, setCartItemIds] = useState(getInitialCartItemIds);
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialIsAuthenticated);
  const [authProfile, setAuthProfile] = useState(getInitialAuthProfile);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(getInitialIsAdminAuthenticated);

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
    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, isAdminAuthenticated ? "signed-in" : "guest");
  }, [isAdminAuthenticated]);

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
      isAdminAuthenticated,
      displayName: isAuthenticated ? authProfile.displayName : "Guest",
      email: isAuthenticated ? authProfile.email : "",
      signOut: () => {
        window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
        window.localStorage.removeItem(CART_STORAGE_KEY);
        window.localStorage.removeItem(THEME_STORAGE_KEY);
        window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
        setIsAuthenticated(false);
        setIsAdminAuthenticated(false);
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
      signInAdmin: ({ email, password } = {}) => {
        if (validateAdminCredentials(email, password)) {
          setIsAdminAuthenticated(true);
          return { ok: true };
        }
        return { ok: false, message: "Invalid email or password." };
      },
      signOutAdmin: () => {
        setIsAdminAuthenticated(false);
      },
    }),
    [authProfile, isAuthenticated, isAdminAuthenticated],
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
            <Route path="/checkout" element={<CheckoutPage />} />
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
            <Route path="/about-us" element={<Navigate to="/company" replace />} />
            <Route path="/purchase-protection" element={<PurchaseProtectionPage />} />
            <Route path="/privacy" element={<PolicyCenterPage />} />
            <Route path="/terms" element={<PolicyCenterPage />} />
            <Route path="/admin/login" element={<AdminLoginPageGate />} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
            <Route path="/admin/products" element={<RequireAdmin><AdminProductsPage /></RequireAdmin>} />
            <Route path="/admin/catalog" element={<RequireAdmin><AdminCatalogPage /></RequireAdmin>} />
            <Route path="/admin/orders" element={<RequireAdmin><AdminOrdersPage /></RequireAdmin>} />
            <Route path="/admin/users" element={<RequireAdmin><AdminUsersPage /></RequireAdmin>} />
            <Route path="/admin/reviews" element={<RequireAdmin><AdminReviewsPage /></RequireAdmin>} />
            <Route path="/admin/website-content" element={<RequireAdmin><AdminWebsiteContentPage /></RequireAdmin>} />
            <Route path="/admin/careers" element={<RequireAdmin><AdminCareersPage /></RequireAdmin>} />
            <Route path="/admin/settings" element={<RequireAdmin><AdminSettingsPage /></RequireAdmin>} />
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
