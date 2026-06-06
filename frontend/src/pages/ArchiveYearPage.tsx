import { useEffect, useState } from "react"
import api from '../api/AxiosInstance';
import ArtworkCard from '../components/ArtworkCard'
import type { Artwork } from "../types/definitions";
import { Link, useParams } from "react-router-dom";

export default function ArchiveYearPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [allArtwork, setAllArtwork] = useState([]);
  const years = [2014, 2024, 2025, 2026]
  const { year } = useParams<{ year: string }>()

  useEffect(() => {
    setIsLoading(true)
    const fetchAllArtworkForSpecifiedYear = async () => {
      const response = await api.get(`/api/artwork/year/${year}`)
      setAllArtwork(await response.data)
    }
    fetchAllArtworkForSpecifiedYear()
    setIsLoading(false)
  }, [year]);

  if (!allArtwork && isLoading) {
    return (
      <>
        <div className="mt-4 flex sm:flex-row flex-col text-center justify-center [&>a]:mx-16 [&>a]:hover:font-extrabold [&>a]:hover:scale-110 [&>a]:transition-all [&>a]:duration-500">
          {years.map(y => (
            <Link key={y} to={`/archive/year/${y}`} className={year == y.toString() ? "font-extrabold" : ""}>{y}</Link>
          ))}
        </div>
        <h1 className="font-bold text-2xl">LOADING...</h1>
      </>
    )
  }

  else if (allArtwork.length > 0 && !isLoading) {
    return (
      <>
        <div className="mt-4 flex sm:flex-row flex-col text-center justify-center [&>a]:mx-16 [&>a]:hover:font-extrabold [&>a]:hover:scale-110 [&>a]:transition-all [&>a]:duration-500">
          {years.map(y => (
            <Link key={y} to={`/archive/year/${y}`} className={year == y.toString() ? "font-extrabold" : ""}>{y}</Link>
          ))}
        </div>
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
        <div className="mt-4 flex sm:flex-row flex-col text-center justify-center [&>a]:mx-16 [&>a]:hover:font-extrabold [&>a]:hover:scale-110 [&>a]:transition-all [&>a]:duration-500">
          {years.map(y => (
            <Link key={y} to={`/archive/year/${y}`} className={year == y.toString() ? "font-extrabold" : ""}>{y}</Link>
          ))}
        </div>
        <div className="px-8 min-h-svh content-center text-center">
          <h1 className="font-bold text-2xl">There is no artwork to display.</h1>
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <div className="mt-4 flex sm:flex-row flex-col text-center justify-center [&>a]:mx-16 [&>a]:hover:font-extrabold [&>a]:hover:scale-110 [&>a]:transition-all [&>a]:duration-500">
          {years.map(y => (
            <Link key={y} to={`/archive/year/${y}`} className={year == y.toString() ? "font-extrabold" : ""}>{y}</Link>
          ))}
        </div>
        <div className="px-8 min-h-svh content-center text-center">
        </div>
        <div className="px-8 min-h-svh content-center text-center">
          <h1 className="font-bold text-2xl">There was an error fetching the archive.</h1>
        </div>
      </>
    )
  }
}
