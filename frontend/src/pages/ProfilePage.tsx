import { useAuth } from "../context/AuthContext";
import api from '../api/AxiosInstance';
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAllOrders = async () => {
      const response = await api.get('/api/artwork/orders')
      console.log(await response)
      setOrders(await response.data)
    }
    fetchAllOrders()
  }, []);

  console.log(user)

  return (
    <>
      <div>
        <p className="text-center font-bold text-xl">hello {user.username}</p>
      </div>
      <div className="pt-8">
        <h1 className="text-center font-extrabold text-2xl">ORDERS</h1>

        {orders.map((order => {
          return (
            <div className="flex max-w-md mx-auto justify-evenly px-8">
              <p>{order.productName}</p>
              <p>Qty: {order.quantity}</p>
              <p>Price: ${(order.unitCost / 100).toFixed(2)}</p>
            </div>
          )
        }))}
      </div>
    </>
  )
}
