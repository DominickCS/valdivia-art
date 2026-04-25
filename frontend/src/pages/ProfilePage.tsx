import { useAuth } from "../context/AuthContext";
import api from '../api/AxiosInstance';
import { useEffect, useState } from "react";
import type { Order } from "../types/definitions";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllOrders = async () => {
      const response = await api.get('/api/artwork/orders')
      setOrders(await response.data)
    }
    fetchAllOrders()
  }, []);

  return (
    <>
      <div>
        <p className="text-center font-bold text-xl">hello {user?.username}</p>
      </div>
      <div className="pt-8">
        <h1 className="text-center font-extrabold text-2xl">ORDERS</h1>

        {orders.map((order: Order) => (
          <div key={order.artwork.id} className="flex flex-col max-w-md mx-auto py-8">
            <img src={order.artwork.imageURL} height={50} />
            <div className="flex [&>p]:px-8 content-center text-center justify-evenly py-4">
              <p>Qty: {order.lineItem.quantity}</p>
              <p>{order.lineItem.productName}</p>
              <p>Price: ${(order.lineItem.unitCost / 100).toFixed(2)}</p>
              <p>TRACKING NUMBER: </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
