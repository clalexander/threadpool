export namespace ShoppingCart {
  export namespace Item {
    export interface AddOn {
      ID: number;
      Quantity: number;
      Name: string;
      Description: string;
      Price: number;
    }

    export interface Preview {
      SideName: string;
      ProductOnlyUrl: string;
      DesignOnlyUrl: string;
      DesignOnProductUrl: string;
      SideArtId: number | null;
    }
  }
}
