export namespace Product {
  /**
   * NOTE: Product Type is not fully documented and has some conflicting documentation
   */
  export type Type = 'standard' | 'banner';

  export interface Region {
    ID: number;
    Name: string;
    X: number;
    Y: number;
    Width: number;
    Height: number;
    Rotation: number | null;
    Shape: number | null;
    Side: Region.Side;
    IsDefault: boolean;
    ProductRegionRenderSizeId: number;
    RenderWidthInches: number | null;
    RenderHeightInches: number | null;
  }

  export namespace Region {
    export type Side = 'front' | 'back' | 'sleeveleft' | 'sleeveright';
  }

  export namespace Style {
    export namespace Size {
      export interface Price {
        ProductStyleSizeId: number;
        PriceEach: number;
        CostEach: number | null;
      }
    }
  }
}
