export interface Artwork {
  id: number;
  title: string;
  artworkObjectKey: string;
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
  lineItem: StripeLineItem
  artwork: Artwork
}

export interface StripeLineItem {
  id: string;
  object: string;
  discountAmount: string | null;
  paymentMethodOptions: string | null;
  productCode: string | null;
  productName: string | null;
  quantity: number | null;
  tax: {
    total_tax_amount: number | null;
  };
  unitCost: number | 0;
  unitOfMeasure: string | null;
}

export interface User {
  id: string;
  username: string;
  roles: [string]
}
