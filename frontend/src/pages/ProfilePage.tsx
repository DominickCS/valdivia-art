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

  return (
    <>
      <div>
        <p className="text-center font-bold text-xl">hello {user.username}</p>
      </div>
    </>
  )
}
