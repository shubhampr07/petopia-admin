import "server-only";
import { getToken } from "./session";

const API_BASE = (process.env.ADMIN_API_URL || "http://localhost:4000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type FetchOpts = { auth?: boolean; method?: string; body?: unknown };

async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { auth = true, method = "GET", body } = opts;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiError("Not authenticated", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(`Cannot reach the API server at ${API_BASE}. Is petopia-server running?`, 503);
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  if (!res.ok) {
    throw new ApiError((data.error as string) || res.statusText || "Request failed", res.status);
  }
  return data as T;
}

/* ------------------------------------------------------------------ Types */

export type AdminMe = { email: string; role: "admin" };

export type Customer = { name: string; email: string } | null;

export type Stats = {
  counts: {
    products: number;
    brands: number;
    users: number;
    orders: number;
    bookings: number;
    adoptPets: number;
  };
  revenue: number;
  recentOrders: {
    id: string;
    status: string;
    total: number;
    currency: string;
    customer: Customer;
    createdAt: string;
  }[];
  recentBookings: { id: string; serviceSlug: string; customer: Customer; createdAt: string }[];
};

export type Product = {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  pet: string;
  vibe: string | null;
  price: number;
  oldPrice: number | null;
  badge: string | null;
  tag: string | null;
  img: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  detailDescription: string | null;
  detailHighlights: string[];
  createdAt: string;
  updatedAt: string;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  featured: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdoptPet = {
  id: number;
  name: string;
  location: string;
  type: string;
  gender: string;
  img: string;
  tag: string;
  age: string | null;
  breed: string | null;
  size: string | null;
  medicalStatus: string | null;
  summary: string | null;
  traits: string[];
};

export type BookingService = {
  id: string;
  category: string;
  name: string;
  durationMin: number;
  price: number;
  pricingSmall: number | null;
  pricingMedium: number | null;
  pricingLarge: number | null;
  includes: string | null;
  sessions: string | null;
  locationNote: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdoptionInquiryListItem = {
  id: string;
  petId: number;
  petName: string;
  petType: string;
  fullName: string;
  email: string;
  phone: string;
  emirate: string;
  status: string;
  createdAt: string;
};

export type AdoptionInquiryDetail = {
  id: string;
  petId: number;
  pet: { id: number; name: string; type: string; img: string };
  fullName: string;
  phone: string;
  email: string;
  emiratesId: string;
  emirate: string;
  area: string;
  payload: Record<string, unknown>;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  wishlistCount: number;
  bookingCount: number;
  pawPointsBalance?: number;
  pawPointsTier?: string;
};

export type PawPointsSummary = {
  balance: number;
  balanceAed: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  tier: string;
  tierLabel: string;
  earnBonusPct: number;
  nextTier: string | null;
  nextTierLabel: string | null;
  pointsToNextTier: number;
  tierProgressPct: number;
};

export type UserDetail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  pawPoints?: PawPointsSummary;
  orders: { id: string; status: string; total: number; currency: string; createdAt: string }[];
  wishlist: { id: number; name: string; img: string; price: number }[];
  bookings: { id: string; serviceSlug: string; createdAt: string }[];
};

export type OrderListItem = {
  id: string;
  status: string;
  total: number;
  currency: string;
  itemCount: number;
  customer: Customer;
  createdAt: string;
};

export type OrderDetail = {
  id: string;
  status: string;
  total: number;
  currency: string;
  shippingAddress: unknown;
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string; email: string; phone: string | null } | null;
  items: { id: string; productId: number; name: string; quantity: number; unitPrice: number; lineTotal: number }[];
};

export type Booking = {
  id: string;
  serviceSlug: string;
  payload: unknown;
  customer: Customer;
  createdAt: string;
};

export type BookingDetail = {
  id: string;
  serviceSlug: string;
  payload: unknown;
  customer: { id: string; name: string; email: string; phone: string | null } | null;
  createdAt: string;
};

/* -------------------------------------------------------------- Endpoints */

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch<{ token: string; email: string }>("/api/admin/login", {
      auth: false,
      method: "POST",
      body: { email, password },
    }),
  me: () => apiFetch<AdminMe>("/api/admin/me"),

  // Dashboard
  stats: () => apiFetch<Stats>("/api/admin/stats"),

  // Products
  listProducts: (search?: string) =>
    apiFetch<{ products: Product[] }>(`/api/admin/products${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getProduct: (id: number) => apiFetch<{ product: Product }>(`/api/admin/products/${id}`),
  createProduct: (body: Record<string, unknown>) =>
    apiFetch<{ product: Product }>("/api/admin/products", { method: "POST", body }),
  updateProduct: (id: number, body: Record<string, unknown>) =>
    apiFetch<{ product: Product }>(`/api/admin/products/${id}`, { method: "PATCH", body }),
  deleteProduct: (id: number) => apiFetch<{ ok: true }>(`/api/admin/products/${id}`, { method: "DELETE" }),
  importProducts: (rows: Record<string, unknown>[]) =>
    apiFetch<{ created: number; updated: number; errors: { row: number; message: string }[] }>(
      "/api/admin/products/import",
      { method: "POST", body: { rows } }
    ),

  // Brands
  listBrands: () => apiFetch<{ brands: Brand[] }>("/api/admin/brands"),
  getBrand: (id: number) => apiFetch<{ brand: Brand }>(`/api/admin/brands/${id}`),
  createBrand: (body: Record<string, unknown>) =>
    apiFetch<{ brand: Brand }>("/api/admin/brands", { method: "POST", body }),
  updateBrand: (id: number, body: Record<string, unknown>) =>
    apiFetch<{ brand: Brand }>(`/api/admin/brands/${id}`, { method: "PATCH", body }),
  deleteBrand: (id: number) => apiFetch<{ ok: true }>(`/api/admin/brands/${id}`, { method: "DELETE" }),
  syncBrands: () => apiFetch<{ ok: true; synced: number }>("/api/admin/brands/sync", { method: "POST" }),

  // Adopt
  listAdopt: () => apiFetch<{ pets: AdoptPet[] }>("/api/admin/adopt"),
  getAdopt: (id: number) => apiFetch<{ pet: AdoptPet }>(`/api/admin/adopt/${id}`),
  createAdopt: (body: Record<string, unknown>) =>
    apiFetch<{ pet: AdoptPet }>("/api/admin/adopt", { method: "POST", body }),
  updateAdopt: (id: number, body: Record<string, unknown>) =>
    apiFetch<{ pet: AdoptPet }>(`/api/admin/adopt/${id}`, { method: "PATCH", body }),
  deleteAdopt: (id: number) => apiFetch<{ ok: true }>(`/api/admin/adopt/${id}`, { method: "DELETE" }),

  // Users
  listUsers: (search?: string) =>
    apiFetch<{ users: UserListItem[] }>(`/api/admin/users${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getUser: (id: string) => apiFetch<{ user: UserDetail }>(`/api/admin/users/${id}`),
  adjustUserPawPoints: (id: string, delta: number, reason?: string) =>
    apiFetch<{ ok: boolean; balance: number; wallet: PawPointsSummary }>(
      `/api/admin/users/${id}/paw-points/adjust`,
      { method: "POST", body: { delta, reason } },
    ),
  deleteUser: (id: string) => apiFetch<{ ok: true }>(`/api/admin/users/${id}`, { method: "DELETE" }),

  // Orders
  listOrders: (params?: { status?: string; search?: string; dateFrom?: string; dateTo?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status)   qs.set("status",   params.status);
    if (params?.search)   qs.set("search",   params.search);
    if (params?.dateFrom) qs.set("dateFrom", params.dateFrom);
    if (params?.dateTo)   qs.set("dateTo",   params.dateTo);
    const q = qs.toString();
    return apiFetch<{ orders: OrderListItem[] }>(`/api/admin/orders${q ? `?${q}` : ""}`);
  },
  getOrder: (id: string) => apiFetch<{ order: OrderDetail }>(`/api/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    apiFetch<{ order: { id: string; status: string } }>(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: { status },
    }),
  deleteOrder: (id: string) => apiFetch<{ ok: true }>(`/api/admin/orders/${id}`, { method: "DELETE" }),

  // Booking Services
  listBookingServices: (category?: string) =>
    apiFetch<{ services: BookingService[] }>(`/api/admin/booking-services${category ? `?category=${encodeURIComponent(category)}` : ""}`),
  getBookingService: (id: string) => apiFetch<{ service: BookingService }>(`/api/admin/booking-services/${id}`),
  createBookingService: (body: Record<string, unknown>) =>
    apiFetch<{ service: BookingService }>("/api/admin/booking-services", { method: "POST", body }),
  updateBookingService: (id: string, body: Record<string, unknown>) =>
    apiFetch<{ service: BookingService }>(`/api/admin/booking-services/${id}`, { method: "PATCH", body }),
  deleteBookingService: (id: string) => apiFetch<{ ok: true }>(`/api/admin/booking-services/${id}`, { method: "DELETE" }),

  // Adoption Inquiries
  listAdoptionInquiries: (status?: string, petId?: number) =>
    apiFetch<{ inquiries: AdoptionInquiryListItem[] }>(
      `/api/admin/adoption-inquiries${status ? `?status=${encodeURIComponent(status)}` : ""}${petId ? `${status ? "&" : "?"}petId=${petId}` : ""}`
    ),
  getAdoptionInquiry: (id: string) => apiFetch<{ inquiry: AdoptionInquiryDetail }>(`/api/admin/adoption-inquiries/${id}`),
  updateInquiryStatus: (id: string, status: string) =>
    apiFetch<{ id: string; status: string }>(`/api/admin/adoption-inquiries/${id}`, { method: "PATCH", body: { status } }),
  deleteAdoptionInquiry: (id: string) => apiFetch<{ ok: true }>(`/api/admin/adoption-inquiries/${id}`, { method: "DELETE" }),

  // Bookings
  listBookings: (service?: string) =>
    apiFetch<{ services: string[]; bookings: Booking[] }>(
      `/api/admin/bookings${service ? `?service=${encodeURIComponent(service)}` : ""}`
    ),
  getBooking: (id: string) => apiFetch<{ booking: BookingDetail }>(`/api/admin/bookings/${id}`),
  deleteBooking: (id: string) => apiFetch<{ ok: true }>(`/api/admin/bookings/${id}`, { method: "DELETE" }),
};
