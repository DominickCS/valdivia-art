import { useEffect, useState } from "react"
import api from '../api/AxiosInstance';
import ArtworkCard from '../components/ArtworkCard'
import type { Artwork } from "../types/definitions";

export default function ArchivePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [allArtwork, setAllArtwork] = useState([]);

  useEffect(() => {
    setIsLoading(true)
    const fetchAllArtwork = async () => {
      const response = await api.get('/api/artwork')
      setAllArtwork(await response.data)
    }
    fetchAllArtwork()
    setIsLoading(false)
  }, []);

  if (!allArtwork && isLoading) {
    return (
      <>
        <div className="px-4 text-center"></div>
        <h1 className="font-extrabold text-3xl">LOADING...</h1>
      </>
    )
  }

  else if (allArtwork.length > 0 && !isLoading) {
    return (
      <>
        <div>
          {allArtwork.map((artwork: Artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </>
    )
  }
  else if (allArtwork.length == 0 && !isLoading) {
    return (
      <>
        <div className="px-4 text-center">
          <h1 className="font-extrabold text-3xl">There is no artwork to display.</h1>
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <div className="px-4 text-center">
          <h1 className="font-extrabold text-3xl">There was an error fetching the archive.</h1>
        </div>
      </>
    )
  }
}

