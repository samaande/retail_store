import { Customer } from "./Customer";

export interface Cart {
  costPerItem: number;

  totalCost: number;

  productType: number;

  productName: string;

  quantity: number;

  customer: Customer;

  custId: string;

  gstRate: number;

  id: number;
}


