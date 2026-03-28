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

  return (
    artwork.isActive ? (
      <div className="flex flex-col mx-auto px-8 items-center my-16">
        <img
          className="shadow-artwork shadow-black/50 hover:scale-95 duration-1000"
          src={artwork.artworkImageUrl}
          height={600}
          width={600}
          alt={artwork.title + " by Daniel Valdivia"}
        />
        <p className="text-3xl mt-12 font-semibold">{artwork.title}</p>
        <p className="mt-2 font-extralight text-lg tracking-widest italic">${artwork.price.toFixed(2)}</p>
        <button
          className="m-4 font-normal tracking-widest disabled:opacity-50 disabled:cursor-not-allowed" disabled={!user ? true : false}>
          {user ? "BUY NOW" : "LOGIN TO BUY"}
        </button>
      </div>
    ) : null
  );
}
