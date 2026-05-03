export interface Artwork {
  id: number;
  title: string;
  artworkObjectKey: string;
  images: [];
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

export interface Order {
  amountTotal: number;
  artworkId: number;
  artworkImageUrl: string;
  artworkTitle: string;
  createdAt: string;
  updatedAt: string;
  currency: string;
  id: number;
  shippingCity: string | null;
  shippingCountry: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingName: string;
  shippingPostalCode: string;
  shippingState: string | null;
  status: string;
  stripeSessionId: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
}

export interface ArtworkImage {
  id: string;
  imageURL: string;
  artworkObjectKey: string;
}
