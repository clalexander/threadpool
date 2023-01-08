export interface Colorway {
  ID: number;
  Colors: Colorway.Color[];
  Name: string;
  SvgUrl: string;
  RenderedUrl: string;
  ThumbnailUrl: string;
}

export namespace Colorway {
  export interface Color {
    Index: number;
    Color: string;
    EmbroideryThreadId: number | null;
    InkColorId: number | null;
    ColorName: string;
    PMS: string;
  }
}
