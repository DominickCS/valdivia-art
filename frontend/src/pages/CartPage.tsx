import "../index.css";
import { useEffect, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../api/AxiosInstance.js";
import { useAuth } from "../context/AuthContext.js";

interface CartItemResponse {
  artworkId: number;
  title: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  availableQuantity: number;
}

interface CartResponse {
  items: CartItemResponse[];
  estimatedTotal: number;
}

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function fetchCart() {
    try {
      setIsLoading(true);
      const response = await api.get("/api/cart");
      setCart(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) fetchCart();
    else setIsLoading(false);
  }, [user]);

  async function handleRemove(artworkId: number) {
    try {
      setRemovingId(artworkId);
      await api.delete(`/api/cart/remove/${artworkId}`);
      await fetchCart();
      toast.success(
        <p className="font-extrabold text-center text-lg px-4">Item removed.</p>,
        { position: "bottom-center", autoClose: 1500, theme: "light", transition: Bounce }
      );
    } catch (err) {
      toast.error(
        <p className="font-extrabold text-center text-lg px-4">Could not remove item.</p>,
        { position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce }
      );
    } finally {
      setRemovingId(null);
    }
  }

  async function handleCheckout() {
    try {
      setCheckingOut(true);
      const response = await api.post("/api/cart/checkout");
      // session.toJson() on the backend returns a JSON string; Axios may or may not
      // auto-parse it depending on the response Content-Type — handle both.
      const session = typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;
      window.location.replace(session.url);
    } catch (err: any) {
      toast.error(
        <p className="font-extrabold text-center text-lg px-4">
          {err?.response?.data ?? "Checkout failed. Please try again."}
        </p>,
        { position: "bottom-center", autoClose: 3000, theme: "light", transition: Bounce }
      );
      setCheckingOut(false);
    }
  }

  // ── Not logged in ───────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-2xl font-extrabold tracking-wide">YOUR CART</p>
        <p className="text-sm text-black/40">Please log in to view your cart.</p>
        <Link to="/login" className="button-spcl inline-block mt-4 px-6 py-2 text-sm tracking-widest">
          LOGIN
        </Link>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-sm text-black/30 tracking-widest">Loading cart...</p>
      </div>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-2xl font-extrabold tracking-wide">YOUR CART</p>
        <p className="text-sm text-black/40">Your cart is empty.</p>
        <Link to="/" className="button-spcl inline-block mt-4 px-6 py-2 text-sm tracking-widest">
          BROWSE ARTWORK
        </Link>
      </div>
    );
  }

  // ── Cart with items ─────────────────────────────────────────────────────────
  return (
    <>
      <ToastContainer />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-6">

        <h1 className="font-extrabold text-base underline text-center tracking-wide">
          YOUR CART
        </h1>

        {/* Item list */}
        <section className="border border-black/10 rounded-lg divide-y divide-black/5">
          {cart.items.map(item => {
            const isStockWarning = item.quantity > item.availableQuantity;
            return (
              <div key={item.artworkId} className="flex items-center gap-4 p-4">

                {/* Thumbnail */}
                <Link to={`/artwork/detail/${item.artworkId}`} className="shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded border border-black/10"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <Link
                    to={`/artwork/detail/${item.artworkId}`}
                    className="text-sm font-semibold truncate block hover:opacity-60 transition-opacity"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-black/40">
                    ${item.unitPrice.toFixed(2)} × {item.quantity}
                  </p>
                  {isStockWarning && (
                    <p className="text-[10px] text-red-500 font-semibold tracking-wide">
                      Only {item.availableQuantity} available — quantity will be adjusted at checkout.
                    </p>
                  )}
                </div>

                {/* Line total + remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-sm font-semibold">${item.lineTotal.toFixed(2)}</p>
                  <button
                    onClick={() => handleRemove(item.artworkId)}
                    disabled={removingId === item.artworkId}
                    className="text-[10px] tracking-widest text-black/40 hover:text-red-600 transition-colors disabled:opacity-40"
                  >
                    {removingId === item.artworkId ? "REMOVING..." : "REMOVE"}
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* Summary + checkout */}
        <section className="border border-black/10 rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold tracking-wide">ESTIMATED TOTAL</p>
            <p className="text-sm font-extrabold">${cart.estimatedTotal.toFixed(2)}</p>
          </div>
          <p className="text-[10px] text-black/30 text-center">
            Shipping and taxes calculated at checkout.
          </p>
          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="button-spcl w-full py-3 tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingOut ? "REDIRECTING..." : "CHECKOUT"}
          </button>
        </section>

      </div>
    </>
  );
}
