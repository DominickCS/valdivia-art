import "../index.css"
import { useAuth } from '../context/AuthContext.js';
import api from '../api/AxiosInstance.js';
import type { Artwork } from "../types/definitions.js";
import { ArtworkCarousel } from "./ui/ArtworkCarousel.js";

export default function ArtworkDetailCard({ artwork }: { artwork: Artwork }) {
  const { user } = useAuth();

  async function handlePurchase(id: number) {
    try {
      const response = await api.post(
        `/api/artwork/purchase/${id}`,
        { userID: user?.id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );


      if (response.status == 200) {
        window.location.replace(response.data.url)
      }

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mx-auto px-8 items-center my-32 max-w-sm sm:max-w-xl">
      <div className="mx-auto">
        <ArtworkCarousel images={artwork.images} />
      </div>
      <div className="text-center items-center *:mx-8 min-h-full bottom-0">
        <p className="text-3xl font-extrabold tracking-wide">{artwork.title}</p>
        {artwork.forSale && artwork.availableQuantity > 0 ?
          <p className="font-light text-lg tracking-widest italic">${artwork.price.toFixed(2)}</p>
          :
          <p className="font-light text-sm tracking-widest italic">Not for sale</p>
        }
        {artwork.availableQuantity > 0 ?
          <div className="flex justify-between">
            <button
              onClick={() => handlePurchase(artwork.id)} className="button-spcl mx-2 font-normal tracking-widest disabled:opacity-30 cursor-not-allowed" disabled={!user ? true : false}>
              {user ? "BUY NOW" : "LOGIN TO BUY"}
            </button>
            {user ?
              <button
                className="button-spcl mx-2 font-normal tracking-widest disabled:opacity-50 disabled:cursor-not-allowed" disabled={!user ? true : false}>
                ADD TO CART
              </button>
              : null}
          </div> :
          null
        }
      </div>
    </div>
  );
}

