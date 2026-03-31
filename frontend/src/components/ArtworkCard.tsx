import "../index.css"
import { useAuth } from '../context/AuthContext.js';

export default function ArtworkCard({ artwork }) {
  const { user } = useAuth();

  // const handlePurchase = async () => {
  //   if (!artwork.stripePriceId) {
  //     alert('This artwork is not yet available for purchase. Please contact support.');
  //     return;
  //   }
  //   try {
  //     const result = await createCheckoutSession(
  //       artwork.stripePriceId,
  //       artwork.title,
  //       userEmail
  //     );
  //     if (result.url) {
  //       window.location.href = result.url;
  //     } else {
  //       alert(result.error || 'Failed to create checkout session');
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.error('Error creating checkout:', error);
  //     alert('An error occurred. Please try again.');
  //     setLoading(false);
  //   }
  // };

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
              className="button-spcl mx-2 font-normal tracking-widest disabled:opacity-50 disabled:cursor-not-allowed" disabled={!user ? true : false}>
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
