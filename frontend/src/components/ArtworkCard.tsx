import "../index.css"
import { useAuth } from '../context/AuthContext.js';
import api from '../api/AxiosInstance';

export default function ArtworkCard({ artwork }) {
  const { user } = useAuth();

  async function handlePurchase(id) {
    console.log(user)
    try {
      const response = await api.post(
        `/api/artwork/purchase/${id}`,
        { userID: user.id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(await response.data)

      if (response.status == 200) {
        setTimeout(() => { window.location.replace(response.data.url) }, 5000)
      }

    } catch (err) {
      console.error(err);
    }
  }

  console.log(artwork)
  return (
    artwork.isActive ? (
      <div className="flex flex-col mx-auto px-8 items-center my-32">
        <img
          className="shadow-artwork shadow-black/45 hover:scale-105 duration-1000"
          src={artwork.imageURL}
          height={460}
          width={460}
          alt={artwork.title + " by Daniel Valdivia"}
        />
        <p className="text-3xl mt-8 font-extrabold tracking-wide">{artwork.title}</p>
        {artwork.isForSale ?
          <p className="mt-2 font-light text-lg tracking-widest italic">${artwork.price.toFixed(2)}</p>
          :
          <p className="mt-2 font-light text-lg tracking-widest italic">Not for sale</p>
        }
        {artwork.isForSale ?
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePurchase(artwork.id)} className="button-spcl mx-2 font-normal tracking-widest disabled:opacity-50 disabled:cursor-not-allowed" disabled={!user ? true : false}>
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
    ) : null
  );
}
