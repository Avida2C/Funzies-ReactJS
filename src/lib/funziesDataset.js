import data from "../data/funziesData.json";
import { price } from "./storeData";

const byId = (list, getId = (row) => row.ID) => new Map(list.map((row) => [getId(row), row]));

export const funziesData = data;

export const allProducts = data.product;
export const allBrands = data.brand;
export const allCategories = data.category;
export const allOrders = data.orders;
export const allOrderStatuses = data.orderstatus;
export const allOrderProductLines = data.order_product;
export const allAddresses = data.address;
export const allUsers = data.user;
export const allRoles = data.role;
export const allReviewStatuses = data.reviewstatus;

export const productById = byId(data.product);
export const brandById = byId(data.brand);
export const categoryById = byId(data.category);
export const userById = byId(data.user);
export const orderById = byId(data.orders, (o) => o.ID);
export const orderStatusById = byId(data.orderstatus, (o) => o.ID);
export const addressById = byId(data.address, (a) => a.ID);
export const roleById = byId(data.role, (r) => r.ID);
export const reviewStatusById = byId(data.reviewstatus, (r) => r.ID);

const MS_PER_DAY = 86400000;

/**
 * @param {string} s "YYYY-MM-DD HH:mm:ss"
 * @returns {Date | null}
 */
function parseSqlishDate(s) {
  if (!s || s.startsWith("0000-00-00")) {
    return null;
  }
  const iso = s.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isOrderActive(order) {
  return order.deleted === 0;
}

/**
 * @param {number} orderId
 * @returns {number}
 */
export function computeOrderSubtotalEur(orderId) {
  const lines = allOrderProductLines.filter((row) => row.orderid === orderId);
  let subtotal = 0;
  for (const line of lines) {
    const product = productById.get(line.productid);
    if (!product) {
      continue;
    }
    subtotal += (Number(product.Price) || 0) * (Number(line.quantity) || 0);
  }
  return subtotal;
}

export function computeRevenueForActiveOrders() {
  const activeIdSet = new Set(allOrders.filter(isOrderActive).map((o) => o.ID));
  let total = 0;
  for (const line of allOrderProductLines) {
    if (!activeIdSet.has(line.orderid)) {
      continue;
    }
    const p = productById.get(line.productid);
    if (!p) {
      continue;
    }
    total += p.Price * line.quantity;
  }
  return total;
}

export function getAdminDashboardStats() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + MS_PER_DAY);
  const monthAgo = new Date(endOfToday.getTime() - 30 * MS_PER_DAY);

  const activeOrders = allOrders.filter(isOrderActive);
  const ordersToday = activeOrders.filter((o) => {
    const d = parseSqlishDate(o.created);
    return d && d >= startOfToday && d < endOfToday;
  }).length;

  const revenueEur = computeRevenueForActiveOrders();

  const newUsers = allUsers.filter((u) => u.Deleted === 0).filter((u) => {
    const d = parseSqlishDate(u.Joined);
    return d && d >= monthAgo;
  }).length;

  const lowStock = allProducts.filter((p) => p.Deleted === 0).filter((p) => p.Stock < 5).length;

  const activeUserCount = allUsers.filter((u) => u.Deleted === 0).length;
  const activeBrands = allBrands.filter((b) => b.Deleted === 0).length;
  const activeCategories = allCategories.filter((c) => c.Deleted === 0).length;

  return {
    ordersToday,
    revenueEur,
    newUsers,
    lowStock,
    productCount: allProducts.filter((p) => p.Deleted === 0).length,
    openOrderCount: activeOrders.length,
    activeUserCount,
    activeBrands,
    activeCategories,
  };
}

export function formatEurValue(value) {
  return price.format(value);
}
