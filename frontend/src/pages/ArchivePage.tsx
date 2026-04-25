import { useEffect, useState } from "react"
import api from '../api/AxiosInstance';
import ArtworkCard from '../components/ArtworkCard'
import type { Artwork } from "../types/definitions";

export default function ArchivePage() {
  const [allArtwork, setAllArtwork] = useState([]);

  useEffect(() => {
    const fetchAllArtwork = async () => {
      const response = await api.get('/api/artwork')
      setAllArtwork(await response.data)
    }
    fetchAllArtwork()
  }, []);


  if (allArtwork.length > 0) {
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
  else {
    return (
      <>
        <div className="px-4 content-center text-center">
          <h1 className="font-extrabold text-3xl">LOADING</h1>
        </div>
      </>
    )
  }
}

