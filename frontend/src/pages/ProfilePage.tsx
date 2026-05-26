import { useAuth } from "../context/AuthContext";
import api from '../api/AxiosInstance';
import { useEffect, useState } from "react";
import type { Order } from "../types/definitions";
import { Link } from "react-router-dom";
import { ArtworkCarousel } from "../components/ui/ArtworkCarousel";

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllOrders = async () => {
      const response = await api.get('/api/artwork/orders');
      setOrders(response.data);
    };
    fetchAllOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">

      {/* Greeting */}
      <p className="text-center text-lg font-semibold tracking-wide">
        Hey, {user?.fullName}
      </p>

      {/* Orders */}
      <section>
        <h1 className="font-extrabold text-base underline text-center tracking-wide mb-6">
          ORDERS
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-sm text-black/30 py-8">No orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order: Order) => {
              // Map ArtworkSummary[] → ArtworkImage[] shape that ArtworkCarousel expects.
              // imageUrl (summary) → imageURL (carousel) — note the casing difference.
              const carouselImages = order.artworks.map(a => ({
                id: String(a.id),
                imageURL: a.imageUrl,
                artworkObjectKey: '',
              }));

              // For the order card title: single artwork shows its name,
              // multiple artworks shows a count.
              const orderLabel = order.artworks.length === 1
                ? order.artworks[0].title
                : `${order.artworks.length} artworks`;

              return (
                <div key={order.id} className="border border-black/10 rounded-lg overflow-hidden flex flex-col">

                  {/* Artwork carousel */}
                  <div className="bg-black/5 px-4 pt-4">
                    {carouselImages.length > 0 ? (
                      <ArtworkCarousel images={carouselImages} />
                    ) : (
                      <div className="aspect-square flex items-center justify-center text-xs text-black/20">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">

                    {/* Title + amount */}
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-extrabold text-sm italic truncate">{orderLabel}</h2>
                      <span className="text-sm font-semibold shrink-0">
                        ${(order.amountTotal / 100).toFixed(2)}
                      </span>
                    </div>

                    <hr className="border-black/5" />

                    {/* Shipping */}
                    <div className="space-y-0.5 text-xs text-black/50">
                      <p className="font-semibold text-black/70 uppercase tracking-wider text-[10px]">
                        Ship to
                      </p>
                      <p>{order.shippingName}</p>
                      <p>
                        {order.shippingLine1}{order.shippingLine2 ? `, ${order.shippingLine2}` : ''},{' '}
                        {order.shippingCity} {order.shippingPostalCode}, {order.shippingState} {order.shippingCountry}
                      </p>
                    </div>

                    <hr className="border-black/5" />

                    {/* Status + tracking */}
                    <div className="space-y-1.5 mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-black/40">Status</span>
                        <span className={`text-[10px] tracking-widest font-semibold px-2 py-0.5 rounded ${order.status === 'SHIPPED' ? 'bg-black/10 text-black/60' :
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                              order.status === 'REFUNDED' ? 'bg-red-100 text-red-600' :
                                'bg-yellow-50 text-yellow-700'
                          }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-black/40">Updated</span>
                        <span className="text-xs text-black/50">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {order.trackingNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-black/40">Tracking</span>
                          <Link
                            to={order.trackingUrl ?? "/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs underline text-black/60 hover:text-black transition-colors"
                          >
                            {order.trackingNumber}
                          </Link>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
