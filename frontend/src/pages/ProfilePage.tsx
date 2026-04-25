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
        <h1 className="text-center font-extrabold text-4xl underline underline-offset-8">ORDERS</h1>

        <div className="grid grid-cols-3 gap-24 px-8">
          {orders.map((order: Order) => (
            <div key={order.artwork.id} className="text-center flex flex-col max-w-xl mx-auto my-8 w-full h-full">
              <img src={order.artwork.imageURL} className="mx-auto overflow-hidden max-h-60 max-w-60 object-contain" />
              <div className="my-2">
                <h2 className="italic font-extrabold text-3xl underline underline-offset-4">{order.lineItem.productName}</h2>
              </div>
              <div className="flex [&>div]:mx-8 content-center text-center justify-evenly py-4">
                <div>
                  <p className="font-extrabold">QTY</p>
                  <p className="font-thin italic">{order.lineItem.quantity}</p>
                </div>
                <div>
                  <p className="font-extrabold">AMOUNT PAID </p>
                  <p className="font-thin italic">${(order.lineItem.unitCost / 100).toFixed(2)}</p>
                </div>
              </div>
              <div className="border-b-2 border-r-2 rounded-br-full border-black/30">
                <h3 className="font-extrabold">TRACKING INFORMATION</h3>
                <div className="my-2">
                  <p className="font-thin italic">TRACKING #</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
