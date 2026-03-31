import { useEffect, useState } from "react"
import NavigationBar from "./components/NavigationBar"
import api from './api/AxiosInstance';
import ArtworkCard from './components/ArtworkCard'

export default function Home() {
  const [allArtwork, setAllArtwork] = useState([]);

  useEffect(() => {
    const fetchAllArtwork = async () => {
      const response = await api.get('/api/artwork/active')
      console.log(response.data)
      setAllArtwork(await response.data)
    }
    fetchAllArtwork()
  }, []);


  if (allArtwork.length > 0) {
    return (
      <>
        <NavigationBar />
        <div>
          {allArtwork.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <NavigationBar />
        <div className="min-h-screen content-center text-center">
          <h1 className="font-extrabold text-3xl">No art is for sale currently.</h1>
        </div>
      </>
    )
  }
}
