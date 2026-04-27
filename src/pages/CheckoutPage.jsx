import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiCreditCard, FiLock, FiPackage, FiShoppingBag, FiTruck } from "react-icons/fi";
import { SiRevolut } from "react-icons/si";
import AppLayout from "../components/AppLayout";
import ThemedSurface from "../components/ThemedSurface";
import { Country, City } from "country-state-city";
import ThemedButton from "../components/ThemedButton";
import ThemedTextField from "../components/ThemedTextField";
import ThemedSelect from "../components/ThemedSelect";
import ThemedCheckbox from "../components/ThemedCheckbox";
import { getProductCardImageUrl } from "../lib/productImages";
import { activeProducts, price } from "../lib/storeData";
import { useAuth } from "../lib/authContext";
import { useCart } from "../lib/cartContext";
import { createRow, listTable, updateRow } from "../lib/crudApi";
import { allAddresses, allUsers } from "../lib/funziesDataset";
import { useTheme } from "../theme/themeContext";
import CustomRadioButton from "../components/CustomRadioButton";

const DELIVERY_SPEED = {
  standard: { label: "Standard Shipping", hint: "2-3 Business Days", amount: 5 },
  express: { label: "Express Shipping", hint: "Next Day", amount: 12 },
  overnight: { label: "Overnight Shipping", hint: "Next morning", amount: 25 },
};

const DELIVERY_SPEED_ORDER = ["standard", "express", "overnight"];

const TAX_RATE = 0.076;

function buildCartItems(cartItemIds) {
  const productCounts = cartItemIds.reduce((counts, productId) => {
    counts.set(productId, (counts.get(productId) ?? 0) + 1);
    return counts;
  }, new Map());

  return [...productCounts.entries()]
    .map(([productId, quantity]) => {
      const product = activeProducts.find((item) => item.ID === productId);
      if (!product) {
        return null;
      }
      return { product, quantity };
    })
    .filter(Boolean);
}

function SectionHeading({ children, className = "" }) {
  const { colors } = useTheme();
  return (
    <h2 className={`text-xl font-semibold md:text-2xl ${className}`.trim()} style={{ color: colors.text }}>
      {children}
    </h2>
  );
}

function SelectableTile({ active, onClick, children, className = "", colors, backgroundColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 cursor-pointer gap-4 rounded-lg border-2 p-4 text-left transition-colors ${
        active ? "shadow-sm" : "border-base-300 opacity-95 hover:opacity-100"
      } ${className}`.trim()}
      style={{
        ...(active ? { borderColor: colors.primary } : {}),
        ...(backgroundColor ? { backgroundColor } : {}),
      }}
    >
      {children}
    </button>
  );
}

export default function CheckoutPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { email: authEmail, isAuthenticated, signIn } = useAuth();
  const { cartItemIds, clearCart } = useCart();

  const cartItems = useMemo(() => buildCartItems(cartItemIds), [cartItemIds]);
  const itemCount = cartItems.reduce((n, item) => n + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.Price * item.quantity, 0);

  const [shippingMode, setShippingMode] = useState("delivery");
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [smsConsent, setSmsConsent] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [showAddressLine2, setShowAddressLine2] = useState(false);
  const [billingShowAddressLine2, setBillingShowAddressLine2] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [countryCode, setCountryCode] = useState("MT");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [billingCountryCode, setBillingCountryCode] = useState("MT");
  const [billingCity, setBillingCity] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [promoInput, setPromoInput] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitErrors, setSubmitErrors] = useState({});

  const availableCities = useMemo(() => {
    return countryCode ? City.getCitiesOfCountry(countryCode) || [] : [];
  }, [countryCode]);

  const availableBillingCities = useMemo(() => {
    return billingCountryCode ? City.getCitiesOfCountry(billingCountryCode) || [] : [];
  }, [billingCountryCode]);

  const userRow = useMemo(() => {
    const normalized = (authEmail || "").trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    return allUsers.find((u) => String(u.Email ?? "").trim().toLowerCase() === normalized) ?? null;
  }, [authEmail]);

  const userId = userRow ? Number(userRow.ID) : null;

  const [addressRows, setAddressRows] = useState(/** @type {any[]} */ ([]));
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(/** @type {string | null} */ (null));
  const [addressMode, setAddressMode] = useState(/** @type {"existing" | "new"} */ ("new"));
  const [selectedAddressId, setSelectedAddressId] = useState("new");

  const userAddresses = useMemo(() => {
    return [...addressRows].sort(
      (a, b) => (Number(b.Def) || 0) - (Number(a.Def) || 0) || (Number(a.ID) || 0) - (Number(b.ID) || 0),
    );
  }, [addressRows]);

  const defaultAddress = userAddresses.find((a) => Number(a.Def) === 1) ?? userAddresses[0] ?? null;

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || !userId) {
        setAddressRows([]);
        setSelectedAddressId("new");
        setAddressMode("new");
        return;
      }
      setAddressLoading(true);
      setAddressError(null);
      try {
        const r = await listTable("address", { all: 1 });
        const all = Array.isArray(r.data) ? r.data : [];
        setAddressRows(all.filter((a) => Number(a.User) === userId && Number(a.Deleted ?? 0) === 0));
      } catch (e) {
        setAddressError(e instanceof Error ? e.message : "Could not load addresses");
        setAddressRows(allAddresses.filter((a) => Number(a.User) === userId && Number(a.Deleted ?? 0) === 0));
      } finally {
        setAddressLoading(false);
      }
    };
    run();
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (authEmail) {
      setEmail((current) => (current.trim() ? current : authEmail));
    }
  }, [authEmail]);

  // If user has a default address and the form is empty, preselect it.
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!defaultAddress) return;
    const hasAnyAddressInput = Boolean(
      firstName.trim() || lastName.trim() || address1.trim() || address2.trim() || city.trim() || zip.trim(),
    );
    if (!hasAnyAddressInput && selectedAddressId === "new") {
      setSelectedAddressId(String(defaultAddress.ID));
      setAddressMode("existing");
    }
  }, [isAuthenticated, defaultAddress, firstName, lastName, address1, address2, city, zip, selectedAddressId]);

  // If there are no saved addresses, force new-address mode.
  useEffect(() => {
    if (!isAuthenticated) return;
    if (userAddresses.length === 0) {
      setAddressMode("new");
      setSelectedAddressId("new");
    } else if (addressMode === "existing" && selectedAddressId === "new") {
      // Ensure some address is selected when choosing existing mode.
      const fallback = defaultAddress?.ID ?? userAddresses[0]?.ID;
      if (fallback) setSelectedAddressId(String(fallback));
    }
  }, [isAuthenticated, userAddresses, addressMode, selectedAddressId, defaultAddress]);

  // Apply selected saved address to the form.
  useEffect(() => {
    if (!isAuthenticated) return;
    if (selectedAddressId === "new") return;
    const id = Number(selectedAddressId);
    if (!id) return;
    const row = userAddresses.find((a) => Number(a.ID) === id);
    if (!row) return;

    const street = String(row.Street ?? "").trim();
    const parts = street.split(",").map((p) => p.trim()).filter(Boolean);
    const s1 = parts[0] ?? "";
    const s2 = parts.slice(1).join(", ");

    setFirstName(String(row.Name ?? "").trim() || firstName);
    setLastName(String(row.Surname ?? "").trim() || lastName);
    setAddress1(s1);
    setAddress2(s2);
    setShowAddressLine2(Boolean(s2));
    setCity(String(row.City ?? ""));
    setZip(String(row.ZipCode ?? ""));
    // Country is locked to MT in this checkout flow; keep it consistent.
    setCountryCode("MT");
  }, [isAuthenticated, selectedAddressId, userAddresses]); // intentionally not depending on first/lastName to avoid loops

  // If billing == shipping, mirror values for consistency.
  useEffect(() => {
    if (!billingSameAsShipping) {
      return;
    }
    setBillingAddress1(address1);
    setBillingAddress2(address2);
    setBillingShowAddressLine2(Boolean(address2));
    setBillingCity(city);
    setBillingZip(zip);
    setBillingCountryCode(countryCode);
  }, [billingSameAsShipping, address1, address2, city, zip, countryCode]);

  const shippingAmount =
    shippingMode === "pickup" ? 0 : DELIVERY_SPEED[deliverySpeed]?.amount ?? DELIVERY_SPEED.standard.amount;

  const discountedSubtotal = Math.max(0, subtotal - promoDiscount);
  const tax = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
  const orderTotal = Math.round((discountedSubtotal + shippingAmount + tax) * 100) / 100;

  const orderId = useMemo(() => {
    const part = Math.floor(100000 + Math.random() * 900000);
    return `#${part}`;
  }, []);

  const orderDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date()),
    [],
  );

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === "SM2021") {
      setPromoDiscount(10);
    } else if (code) {
      setPromoDiscount(0);
    }
  };

  const validateCheckout = () => {
    const nextErrors = {};
    const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
    const emailValue = (email || authEmail || "").trim();
    const phoneValue = (phone || "").trim();
    const zipValue = (zip || "").trim();
    const cardNumberValue = (cardNumber || "").trim();
    const cardExpiryValue = (cardExpiry || "").trim();
    const cardCvvValue = (cardCvv || "").trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digitsOnly = (value) => String(value).replace(/\D/g, "");
    const phoneDigits = digitsOnly(phoneValue);
    const zipRegex = /^[A-Za-z0-9][A-Za-z0-9 -]{2,12}[A-Za-z0-9]$/;
    const cardNumberDigits = digitsOnly(cardNumberValue);
    const expiryRegex = /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/;
    const cvvRegex = /^\d{3,4}$/;

    if (cartItems.length === 0) nextErrors.cart = "Your cart is empty.";

    if (!hasValue(emailValue)) nextErrors.email = "Email address is required.";
    else if (!emailRegex.test(emailValue)) nextErrors.email = "Enter a valid email address.";

    if (!hasValue(phoneValue)) nextErrors.phone = "Phone number is required.";
    else if (phoneDigits.length < 7) nextErrors.phone = "Enter a valid phone number.";

    if (shippingMode === "delivery") {
      if (isAuthenticated && addressMode === "existing") {
        if (selectedAddressId === "new") {
          nextErrors.addressPick = "Select an existing address or choose New address.";
        }
      }
      if (!hasValue(firstName)) nextErrors.firstName = "First name is required.";
      if (!hasValue(lastName)) nextErrors.lastName = "Last name is required.";
      if (!hasValue(address1)) nextErrors.address1 = "Address is required.";
      if (!hasValue(countryCode)) nextErrors.countryCode = "Country is required.";
      if (!hasValue(city)) nextErrors.city = "City is required.";
      if (!hasValue(zipValue)) nextErrors.zip = "Zip code is required.";
      else if (!zipRegex.test(zipValue)) nextErrors.zip = "Enter a valid zip code.";
    }

    if (!billingSameAsShipping) {
      const bZipValue = (billingZip || "").trim();
      if (!hasValue(billingAddress1)) nextErrors.billingAddress1 = "Billing address is required.";
      if (!hasValue(billingCountryCode)) nextErrors.billingCountryCode = "Billing country is required.";
      if (!hasValue(billingCity)) nextErrors.billingCity = "Billing city is required.";
      if (!hasValue(bZipValue)) nextErrors.billingZip = "Billing zip code is required.";
      else if (!zipRegex.test(bZipValue)) nextErrors.billingZip = "Enter a valid billing zip code.";
    }

    if (paymentMethod === "card") {
      if (!hasValue(cardNumberValue)) nextErrors.cardNumber = "Card number is required.";
      else if (cardNumberDigits.length < 12 || cardNumberDigits.length > 19)
        nextErrors.cardNumber = "Enter a valid card number.";

      if (!hasValue(cardExpiryValue)) nextErrors.cardExpiry = "Expiration is required.";
      else if (!expiryRegex.test(cardExpiryValue)) nextErrors.cardExpiry = "Use MM/YY.";

      if (!hasValue(cardCvvValue)) nextErrors.cardCvv = "CVV is required.";
      else if (!cvvRegex.test(cardCvvValue)) nextErrors.cardCvv = "Enter a valid CVV.";
    }

    return nextErrors;
  };

  const completeOrder = async () => {
    setSubmitAttempted(true);
    const nextErrors = validateCheckout();
    setSubmitErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return;
    }

    // If user is signed in and used a new address, persist it so it shows under Account → Addresses.
    if (isAuthenticated && userId && shippingMode === "delivery" && addressMode === "new") {
      try {
        const Street = [address1, address2].map((s) => String(s || "").trim()).filter(Boolean).join(", ");
        const Name = String(firstName || "").trim();
        const Surname = String(lastName || "").trim();
        const City = String(city || "").trim();
        const ZipCode = String(zip || "").trim();
        const shouldBeDefault = userAddresses.length === 0;

        if (shouldBeDefault) {
          // Clear existing defaults before creating the new default.
          for (const a of userAddresses) {
            if (Number(a.Def) === 1) {
              // eslint-disable-next-line no-await-in-loop
              await updateRow("address", a.ID, { Def: 0 });
            }
          }
        }

        await createRow("address", {
          Street,
          City,
          ZipCode,
          Region: "Malta",
          User: userId,
          Def: shouldBeDefault ? 1 : 0,
          Deleted: 0,
          Name,
          Surname,
          Mobile: String(phone || "").trim(),
        });

        // Refresh saved addresses so subsequent checkout steps reflect the new row.
        const r = await listTable("address", { all: 1 });
        const all = Array.isArray(r.data) ? r.data : [];
        setAddressRows(all.filter((a) => Number(a.User) === userId && Number(a.Deleted ?? 0) === 0));
      } catch {
        // If saving fails, still allow checkout to complete (demo UX / offline).
      }
    }

    const orderDetails = {
      orderId,
      date: orderDateLabel,
      subtotal: discountedSubtotal,
      shipping: shippingAmount,
      tax,
      total: orderTotal,
      itemCount,
      cartItems: cartItems.map(item => ({
        id: item.product.ID,
        name: item.product.Name,
        price: item.product.Price,
        image: item.product.Thumbnail || item.product.Image,
        quantity: item.quantity
      })),
      customer: {
        email: email || authEmail,
        name: `${firstName} ${lastName}`.trim(),
        address: `${address1} ${address2}`.trim(),
        city,
        zip,
        country: countryCode,
        phone,
      },
      paymentMethod
    };
    navigate("/order-confirmed", { state: { order: orderDetails } });
  };

  if (cartItems.length === 0) {
    return <Navigate to="/viewcart" replace />;
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-8">
          {submitAttempted && Object.keys(submitErrors).length > 0 && (
            <ThemedSurface bordered className="p-4">
              <p className="font-semibold text-base-content">Please complete the required fields before placing your order.</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-base-content/80">
                {Object.values(submitErrors).map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </ThemedSurface>
          )}
          {!isAuthenticated && !showLoginForm && (
            <ThemedSurface className="flex flex-wrap items-center gap-1.5 p-5 text-base">
              <span className="text-base-content">Already have an account?</span>
              <button
                type="button"
                onClick={() => setShowLoginForm(true)}
                className="font-medium hover:underline"
                style={{ color: colors.primary }}
              >
                Log In
              </button>
              <span className="text-base-content">for faster checkout!</span>
            </ThemedSurface>
          )}

          {!isAuthenticated && showLoginForm && (
            <ThemedSurface className="space-y-4 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <SectionHeading className="!text-lg">Log In to Your Account</SectionHeading>
                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  className="text-sm font-medium hover:underline"
                  style={{ color: colors.primary }}
                >
                  Cancel
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ThemedTextField
                  className="w-full"
                  label="Email Address"
                  type="email"
                  placeholder="example@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <ThemedTextField
                  className="w-full"
                  label="Password"
                  type="password"
                  placeholder="***********"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <ThemedButton
                type="button"
                variant="primary"
                onClick={() => {
                  if (loginEmail.trim() && loginPassword) {
                    signIn({ displayName: "Nadine", email: loginEmail.trim() });
                  }
                }}
              >
                Log In
              </ThemedButton>
            </ThemedSurface>
          )}

          <ThemedSurface className="space-y-4 p-5 md:p-6">
            <SectionHeading colors={colors}>Customer Details</SectionHeading>
            <div className="grid gap-4 md:grid-cols-2">
              <ThemedTextField
                className="w-full"
                label="First name"
                required={shippingMode === "delivery"}
                autoComplete="given-name"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={submitAttempted && Boolean(submitErrors.firstName)}
                helperText={submitAttempted ? submitErrors.firstName : ""}
              />
              <ThemedTextField
                className="w-full"
                label="Last name"
                required={shippingMode === "delivery"}
                autoComplete="family-name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={submitAttempted && Boolean(submitErrors.lastName)}
                helperText={submitAttempted ? submitErrors.lastName : ""}
              />
            </div>
            <ThemedTextField
              className="w-full"
              label="Email Address"
              required
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={submitAttempted && Boolean(submitErrors.email)}
              helperText={submitAttempted ? submitErrors.email : ""}
            />
            <ThemedTextField
              className="w-full"
              label="Phone Number"
              required
              type="tel"
              autoComplete="tel"
              placeholder="+1 (415) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={submitAttempted && Boolean(submitErrors.phone)}
              helperText={submitAttempted ? submitErrors.phone : ""}
            />
            <ThemedCheckbox
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              label="I consent to receive text messages for order updates"
            />
          </ThemedSurface>

          <ThemedSurface className="space-y-4 p-5 md:p-6">
            <SectionHeading colors={colors}>Shipping</SectionHeading>
            <div className="flex flex-col gap-4 sm:flex-row">
              <SelectableTile
                active={shippingMode === "delivery"}
                onClick={() => setShippingMode("delivery")}
                colors={colors}
                backgroundColor={colors.panel}
              >
                <FiPackage
                  className="mt-0.5 shrink-0 text-xl"
                  style={{ color: shippingMode === "delivery" ? colors.primary : "currentColor" }}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: shippingMode === "delivery" ? colors.primary : undefined }}>
                    Deliver to me
                  </p>
                  <p className="text-sm text-base-content/60">{price.format(DELIVERY_SPEED.standard.amount)}</p>
                </div>
              </SelectableTile>
              <SelectableTile
                active={shippingMode === "pickup"}
                onClick={() => setShippingMode("pickup")}
                colors={colors}
                backgroundColor={colors.panel}
              >
                <FiShoppingBag className="mt-0.5 shrink-0 text-xl text-base-content/70" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-base-content">Store pickup</p>
                  <p className="text-sm text-base-content/60">Free shipping</p>
                </div>
              </SelectableTile>
            </div>

            {shippingMode === "delivery" && (
              <div className="space-y-3">
                <p className="text-xl font-semibold text-base-content/50">Delivery options</p>
                <div className="flex flex-col gap-3">
                  {DELIVERY_SPEED_ORDER.map((key) => {
                    const opt = DELIVERY_SPEED[key];
                    const selected = deliverySpeed === key;
                    return (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 ${
                          selected ? "" : "border-base-300"
                        }`}
                        style={{
                          ...(selected ? { borderColor: colors.primary } : {}),
                          backgroundColor: colors.panel,
                        }}
                      >
                        <CustomRadioButton
                          name="delivery-speed"
                          checked={selected}
                          onChange={() => setDeliverySpeed(key)}
                        />
                        <div className="flex min-w-0 flex-1 justify-between gap-2">
                          <span className="text-sm font-normal text-base-content md:text-base">{opt.label}</span>
                          <span className="shrink-0 text-sm text-base-content/60 md:text-base">{opt.hint}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </ThemedSurface>

          {shippingMode === "delivery" && (
            <ThemedSurface className="space-y-4 p-5 md:p-6">
              <SectionHeading colors={colors}>Delivery information</SectionHeading>
              {isAuthenticated && userAddresses.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="flex items-center gap-2">
                      <CustomRadioButton
                        name="address-mode"
                        checked={addressMode === "existing"}
                        onChange={() => setAddressMode("existing")}
                      />
                      <span className="text-sm text-base-content">Use existing address</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <CustomRadioButton
                        name="address-mode"
                        checked={addressMode === "new"}
                        onChange={() => {
                          setAddressMode("new");
                          setSelectedAddressId("new");
                        }}
                      />
                      <span className="text-sm text-base-content">Enter new address</span>
                    </label>
                  </div>

                  {addressMode === "existing" ? (
                    <>
                      <ThemedSelect
                        className="w-full"
                        label="Saved address"
                        value={selectedAddressId}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        helperText={
                          submitAttempted && submitErrors.addressPick
                            ? submitErrors.addressPick
                            : addressLoading
                              ? "Loading saved addresses…"
                              : addressError
                                ? `API: ${addressError}`
                                : "Select an address to use for this order."
                        }
                      >
                        <option value="new">Select an address…</option>
                        {userAddresses.map((a) => {
                          const street = String(a.Street ?? "").trim();
                          const cityZip = [a.City, a.ZipCode].filter(Boolean).join(" ").trim();
                          const region = String(a.Region ?? "").trim();
                          const label = [street, cityZip, region].filter(Boolean).join(", ").trim() || `Address #${a.ID}`;
                          const suffix = Number(a.Def) === 1 ? " (default)" : "";
                          return (
                            <option key={a.ID} value={String(a.ID)}>
                              {label}
                              {suffix}
                            </option>
                          );
                        })}
                      </ThemedSelect>
                    </>
                  ) : null}
                </div>
              ) : null}

              {(!isAuthenticated || addressMode === "new" || userAddresses.length === 0) && (
                <>
                  <ThemedTextField
                    className="w-full"
                    label="Address"
                    required
                    autoComplete="street-address"
                    placeholder="1234 Main Street"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    error={submitAttempted && Boolean(submitErrors.address1)}
                    helperText={submitAttempted ? submitErrors.address1 : ""}
                  />
                  {!showAddressLine2 ? (
                    <button
                      type="button"
                      className="btn btn-link h-auto min-h-0 px-0 no-underline hover:underline"
                      style={{ color: colors.primary }}
                      onClick={() => setShowAddressLine2(true)}
                    >
                      Add Address line
                    </button>
                  ) : (
                    <ThemedTextField
                      className="w-full"
                      label="Address line 2"
                      autoComplete="address-line2"
                      placeholder="Apt, suite, unit"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  )}
                  <ThemedSelect
                    className="w-full"
                    label="Country"
                    required
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      setCity("");
                    }}
                    helperText={submitAttempted ? submitErrors.countryCode : ""}
                  >
                    {Country.getAllCountries()
                      .filter((c) => c.isoCode === "MT")
                      .map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                  </ThemedSelect>

                  <div className="grid gap-4 md:grid-cols-2">
                    {availableCities.length > 0 ? (
                      <ThemedSelect
                        className="w-full"
                        label="City"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        helperText={submitAttempted ? submitErrors.city : ""}
                      >
                        <option value="">Select City</option>
                        {availableCities.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </ThemedSelect>
                    ) : (
                      <ThemedTextField
                        className="w-full"
                        label="City"
                        required
                        autoComplete="address-level2"
                        placeholder="City Name"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        error={submitAttempted && Boolean(submitErrors.city)}
                        helperText={submitAttempted ? submitErrors.city : ""}
                      />
                    )}

                    <ThemedTextField
                      className="w-full"
                      label="Zip Code"
                      required
                      autoComplete="postal-code"
                      placeholder="94102"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      error={submitAttempted && Boolean(submitErrors.zip)}
                      helperText={submitAttempted ? submitErrors.zip : ""}
                    />
                  </div>
                  <ThemedTextField
                    className="w-full"
                    label="Additional Notes (Optional)"
                    multiline
                    rows={5}
                    placeholder="Add Note"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </>
              )}
            </ThemedSurface>
          )}

          <ThemedSurface className="space-y-4 p-5 md:p-6">
            <SectionHeading colors={colors}>Payment</SectionHeading>
            <div className="flex flex-col gap-3 lg:flex-row">
              <SelectableTile
                active={paymentMethod === "card"}
                onClick={() => setPaymentMethod("card")}
                className="lg:min-h-[4.5rem] lg:items-center"
                colors={colors}
                backgroundColor={colors.panel}
              >
                <FiCreditCard
                  className="mt-0.5 shrink-0 text-xl"
                  style={{ color: paymentMethod === "card" ? colors.primary : "currentColor" }}
                  aria-hidden
                />
                <p className="text-sm font-semibold" style={{ color: paymentMethod === "card" ? colors.primary : undefined }}>
                  Pay with card
                </p>
              </SelectableTile>
              <SelectableTile
                active={paymentMethod === "revolut"}
                onClick={() => setPaymentMethod("revolut")}
                className="lg:min-h-[4.5rem] lg:items-center"
                colors={colors}
                backgroundColor={colors.panel}
              >
                <SiRevolut
                  className="mt-0.5 shrink-0 text-xl"
                  style={{ color: paymentMethod === "revolut" ? colors.primary : "currentColor" }}
                  aria-hidden
                />
                <p className="text-sm font-semibold" style={{ color: paymentMethod === "revolut" ? colors.primary : undefined }}>
                  Pay with Revolut
                </p>
              </SelectableTile>
              <SelectableTile
                active={paymentMethod === "cod"}
                onClick={() => setPaymentMethod("cod")}
                className="lg:min-h-[4.5rem] lg:items-center"
                colors={colors}
                backgroundColor={colors.panel}
              >
                <FiTruck
                  className="mt-0.5 shrink-0 text-xl"
                  style={{ color: paymentMethod === "cod" ? colors.primary : "currentColor" }}
                  aria-hidden
                />
                <p className="text-sm font-semibold" style={{ color: paymentMethod === "cod" ? colors.primary : undefined }}>
                  Cash on Delivery
                </p>
              </SelectableTile>
            </div>

            {paymentMethod === "card" && (
              <div className="grid gap-4 md:grid-cols-3">
                <ThemedTextField
                  className="w-full md:col-span-1"
                  label="Card number"
                  required
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4440 4432 3432"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  error={submitAttempted && Boolean(submitErrors.cardNumber)}
                  helperText={submitAttempted ? submitErrors.cardNumber : ""}
                />
                <ThemedTextField
                  className="w-full"
                  label="Expiration"
                  required
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  error={submitAttempted && Boolean(submitErrors.cardExpiry)}
                  helperText={submitAttempted ? submitErrors.cardExpiry : ""}
                />
                <ThemedTextField
                  className="w-full"
                  label="CVV"
                  required
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  error={submitAttempted && Boolean(submitErrors.cardCvv)}
                  helperText={submitAttempted ? submitErrors.cardCvv : ""}
                />
              </div>
            )}

            <ThemedCheckbox
              checked={billingSameAsShipping}
              onChange={(e) => setBillingSameAsShipping(e.target.checked)}
              label="Use shipping address as billing address"
            />

            {!billingSameAsShipping ? (
              <div className="mt-2 space-y-3">
                <p className="text-sm font-semibold text-base-content/80">Billing address</p>
                <ThemedTextField
                  className="w-full"
                  label="Billing address"
                  required
                  autoComplete="billing street-address"
                  placeholder="1234 Main Street"
                  value={billingAddress1}
                  onChange={(e) => setBillingAddress1(e.target.value)}
                  error={submitAttempted && Boolean(submitErrors.billingAddress1)}
                  helperText={submitAttempted ? submitErrors.billingAddress1 : ""}
                />
                {!billingShowAddressLine2 ? (
                  <button
                    type="button"
                    className="btn btn-link h-auto min-h-0 px-0 no-underline hover:underline"
                    style={{ color: colors.primary }}
                    onClick={() => setBillingShowAddressLine2(true)}
                  >
                    Add Address line
                  </button>
                ) : (
                  <ThemedTextField
                    className="w-full"
                    label="Billing address line 2"
                    autoComplete="billing address-line2"
                    placeholder="Apt, suite, unit"
                    value={billingAddress2}
                    onChange={(e) => setBillingAddress2(e.target.value)}
                  />
                )}
                <ThemedSelect
                  className="w-full"
                  label="Billing country"
                  required
                  value={billingCountryCode}
                  onChange={(e) => {
                    setBillingCountryCode(e.target.value);
                    setBillingCity("");
                  }}
                  helperText={submitAttempted ? submitErrors.billingCountryCode : ""}
                >
                  {Country.getAllCountries()
                    .filter((c) => c.isoCode === "MT")
                    .map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                </ThemedSelect>

                <div className="grid gap-4 md:grid-cols-2">
                  {availableBillingCities.length > 0 ? (
                    <ThemedSelect
                      className="w-full"
                      label="Billing city"
                      required
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      helperText={submitAttempted ? submitErrors.billingCity : ""}
                    >
                      <option value="">Select City</option>
                      {availableBillingCities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </ThemedSelect>
                  ) : (
                    <ThemedTextField
                      className="w-full"
                      label="Billing city"
                      required
                      autoComplete="billing address-level2"
                      placeholder="City Name"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      error={submitAttempted && Boolean(submitErrors.billingCity)}
                      helperText={submitAttempted ? submitErrors.billingCity : ""}
                    />
                  )}

                  <ThemedTextField
                    className="w-full"
                    label="Billing zip code"
                    required
                    autoComplete="billing postal-code"
                    placeholder="94102"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    error={submitAttempted && Boolean(submitErrors.billingZip)}
                    helperText={submitAttempted ? submitErrors.billingZip : ""}
                  />
                </div>
              </div>
            ) : null}
          </ThemedSurface>
        </div>

        <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-4 lg:self-start lg:w-[min(100%,380px)]">
          <ThemedSurface className="space-y-4 p-5 shadow-md md:p-6">
            <div className="flex items-center justify-between gap-2">
              <SectionHeading className="text-lg font-semibold">Order Summary</SectionHeading>
              <Link
                to="/viewcart"
                className="hover-accent shrink-0 text-base font-normal no-underline hover:underline"
                style={{ color: colors.primary }}
              >
                Edit Order
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-base-300 p-3 shadow-sm" style={{ backgroundColor: colors.panel }}>
              <div>
                <p className="text-sm text-base-content/60">Order ID</p>
                <p className="text-lg font-semibold text-base-content">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Order Date</p>
                <p className="text-lg font-semibold text-base-content">{orderDateLabel}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">
                  {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </p>
                <p className="text-lg font-semibold text-base-content">{price.format(subtotal)}</p>
              </div>
            </div>

            <ul
              className={`space-y-2 pr-1${cartItems.length > 5 ? " max-h-80 overflow-y-auto" : ""}`}
            >
              {cartItems.map((item) => (
                <li
                  key={item.product.ID}
                  className="flex gap-3 rounded-lg border border-base-300 p-2 shadow-sm"
                  style={{ backgroundColor: colors.panel }}
                >
                  <img
                    src={getProductCardImageUrl(item.product)}
                    alt={item.product.Name.trim()}
                    className="h-14 w-14 shrink-0 rounded object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-2">
                      <p className="min-w-0 flex-1 truncate text-sm text-base-content">{item.product.Name.trim()}</p>
                      <span className="shrink-0 text-sm font-semibold text-base-content">×{item.quantity}</span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: colors.primary }}>
                      {price.format(item.product.Price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-2 px-1 text-base text-base-content">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{price.format(discountedSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingAmount === 0 ? "Free" : price.format(shippingAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{price.format(tax)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold" style={{ borderColor: colors.primary }}>
                <span>Order Total</span>
                <span className="text-xl text-base-content">{price.format(orderTotal)}</span>
              </div>
            </div>

            <ThemedButton
              type="button"
              variant="primary"
              size="md"
              className="w-full !min-h-12 !text-lg"
              onClick={completeOrder}
            >
              Complete Order
            </ThemedButton>

            <p className="rounded-lg p-2 text-center text-sm text-base-content/60" style={{ backgroundColor: colors.panel }}>
              Available payment methods:
              <br />
              Credit Card, Revolut, Cash on Delivery
            </p>

            <div className="border-t border-base-300 pt-4">
              <p className="mb-2 text-sm font-medium text-base-content">Promo code</p>
              <div className="flex flex-wrap items-center gap-2">
                <ThemedTextField
                  size="sm"
                  className="min-w-0 flex-1"
                  placeholder="SM2021"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  aria-label="Promo code"
                />
                <ThemedButton type="button" variant="primary" size="md" className="shrink-0" onClick={applyPromo}>
                  Apply
                </ThemedButton>
              </div>
              {promoDiscount > 0 && (
                <p className="mt-2 text-sm text-success">Promo applied: −{price.format(promoDiscount)}</p>
              )}
            </div>
          </ThemedSurface>

          <div className="flex items-center justify-center gap-2 text-sm text-base-content/70">
            <FiLock size={16} aria-hidden />
            <span>Secure Checkout</span>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
