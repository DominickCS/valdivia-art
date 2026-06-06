import "../index.css"
import { useState } from "react";
import { toast, Bounce } from "react-toastify";
import { useAuth } from '../context/AuthContext.js';
import api from '../api/AxiosInstance.js';
import type { Artwork } from "../types/definitions.js";
import { Link } from "react-router-dom";

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
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
    <div className="flex flex-col mx-auto px-8 items-center my-32">
      <Link to={`/artwork/detail/${artwork.id}`}>
        <img
          className="shadow-artwork shadow-black/45 duration-1000"
          src={artwork.imageURL}
          height={450}
          width={450}
          alt={artwork.title + " by Daniel Valdivia"}
        />
      </Link>
      <p className="hover:scale-110 hover:opacity-40 transition-all duration-300 text-3xl mt-8 mb-2 font-extrabold tracking-wide">
        <Link to={`/artwork/detail/${artwork.id}`}>{artwork.title}</Link>
      </p>
      <div className="flex justify-center [&>p]:mx-2">
        <p className="font-extralight text-sm italic">{artwork.heightInches}in h x {artwork.widthInches}in w</p>
        {artwork.medium && artwork.medium.length > 0 ?
          <p className="font-extralight text-sm italic">{artwork.medium}</p>
          :
          null
        }
      </div>

      {artwork.forSale && artwork.availableQuantity > 0 ? (
        <p className="mt-2 font-light text-lg tracking-widest italic">${artwork.price.toFixed(2)}</p>
      ) : (
        <p className="mt-2 font-light text-sm tracking-widest italic">Not for sale</p>
      )}
      {artwork.forSale && artwork.availableQuantity > 0 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePurchase(artwork.id)}
            className="button-spcl font-normal tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!user}
          >
            {user ? "BUY NOW" : "LOGIN TO BUY"}
          </button>
          {user && (
            <button
              onClick={() => handleAddToCart(artwork.id)}
              className="button-spcl mx-2 font-normal tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cartLoading}
            >
              {cartLoading ? "ADDING..." : "ADD TO CART"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
