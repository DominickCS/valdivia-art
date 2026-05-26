export interface Artwork {
  id: number;
  title: string;
  artworkObjectKey: string;
  images: ArtworkImage[];
  imageURL: string;
  price: number;
  yearCompleted: string;
  forSale: boolean;
  active: boolean;
  stripeProductID: string;
  stripePriceID: string;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

// Lean per-artwork summary nested inside OrderResponse
export interface ArtworkSummary {
  id: number;
  title: string;
  imageUrl: string; // lowercase 'l' — matches Java record serialization
}

export interface Order {
  id: number;
  stripeSessionId: string;
  artworks: ArtworkSummary[];
  amountTotal: number;
  currency: string;
  status: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippingName: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostalCode: string;
  shippingCountry: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkImage {
  id: string;
  imageURL: string;
  artworkObjectKey: string;
}

export interface User {
  username: any | null;
  fullName: any | null;
  roles: [any] | null;
  id: any | null;
}
