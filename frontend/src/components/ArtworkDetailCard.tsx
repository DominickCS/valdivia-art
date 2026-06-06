import "../index.css"
import { useState } from "react";
import { toast, Bounce } from "react-toastify";
import { useAuth } from '../context/AuthContext.js';
import api from '../api/AxiosInstance.js';
import type { Artwork } from "../types/definitions.js";
import { ArtworkCarousel } from "./ui/ArtworkCarousel.js";

export default function ArtworkDetailCard({ artwork }: { artwork: Artwork }) {
  const { user } = useAuth();
  const [cartLoading, setCartLoading] = useState(false);

  async function handlePurchase(id: number) {
    try {
      const response = await api.post(
        `/api/artwork/purchase/${id}`,
        { userID: user?.id },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        window.location.replace(response.data.url);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddToCart(artworkId: number) {
    try {
      setCartLoading(true);
      const response = await api.post(`/api/cart/add/${artworkId}?quantity=1`);
      toast.success(
        <p className="font-extrabold text-center text-lg px-4">{response.data ?? "Added to cart."}</p>,
        { position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce }
      );
    } catch (err: any) {
      toast.error(
        <p className="font-extrabold text-center text-lg px-4">
          {err?.response?.data ?? "Could not add to cart."}
        </p>,
        { position: "bottom-center", autoClose: 3000, theme: "light", transition: Bounce }
      );
    } finally {
      setCartLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xs sm:max-w-xl py-16 sm:px-0">
      <div>
        <ArtworkCarousel images={artwork.images} />
      </div>
      <div className="text-center items-center *:mx-8 min-h-full bottom-0">
        <p className="text-3xl font-extrabold tracking-wide mt-4 my-2">{artwork.title}</p>
        <div className="flex justify-center [&>p]:mx-2">
          <p className="font-extralight text-sm italic">{artwork.heightInches}in h x {artwork.widthInches}in w</p>
          {artwork.medium && artwork.medium.length > 0 ?
            <p className="font-extralight text-sm italic">{artwork.medium}</p>
            :
            null
          }
        </div>

        {artwork.description && artwork.description.length > 0 ?
          <p className="my-4 tracking-widest italic">{artwork.description}</p>
          : null}
        {artwork.forSale && artwork.availableQuantity > 0 ? (
          <div className="flex justify-center [&>p]:mx-2">
            <p className="font-light sm:text-lg tracking-widest italic">${artwork.price.toFixed(2)}</p>
            <p className="font-light sm:text-lg tracking-widest italic">·</p>
            <p className="font-light sm:text-lg tracking-widest italic">In Stock: {artwork.availableQuantity}</p>
          </div>
        ) : (
          <p className="font-light text-sm tracking-widest italic">Not for sale</p>
        )}
        {artwork.forSale && artwork.availableQuantity > 0 && (
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePurchase(artwork.id)}
              className="button-spcl w-full mx-2 font-normal tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!user}
            >
              {user ? "BUY NOW" : "LOGIN TO BUY"}
            </button>
            {user && (
              <button
                onClick={() => handleAddToCart(artwork.id)}
                className="button-spcl mx-2 w-full font-normal tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartLoading}
              >
                {cartLoading ? "ADDING..." : "ADD TO CART"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
