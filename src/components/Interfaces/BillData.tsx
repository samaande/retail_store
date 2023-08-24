
export interface BillData {

  cartDetails: {

    custId: string;

    productId: number;

    productName: string;

    costPerItem: number;

    quantity: number;

    totalCost: number;

  }[];

 

  id: number;

}

 