import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/AxiosInstance";
import type { Artwork } from "../types/definitions";
import ArtworkDetailCard from "../components/ArtworkDetailCard";

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    api.get(`/api/artwork/listing/${id}`).then(res => setArtwork(res.data));
  }, [id]);

  if (!artwork) return <p>Loading...</p>;

  console.log(artwork)
  return (
    <ArtworkDetailCard key={artwork.id} artwork={artwork} />
  );
}
