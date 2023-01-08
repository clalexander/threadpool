import { Colorway } from './colorway';

export interface Art {
  ID: number;
  ColorCount: number;
  Colors: string[];
  OriginalColorway: Colorway;
  StitchCount: number | null;
  TrimCount: number | null;
  GalleryId: number | null;
  CategoryIds: number[];
  Name: string;
  Type: Art.Type;
  Keywords: string;
  FixedSvg: boolean;
  Digitized: boolean;
  CanScreenPrint: boolean;
  FullName: string;
  ExternalReferenceID: string;
  Width: number | null;
  Height: number | null;
  Notes: string;
  FileExt: string;
  ImageUrl: string;
  ThumbUrl: string;
  ThumbUrlArt: string;
  OriginalUrl: string;
  UploadedUrl: string;
  UploadedOn: Date;
  IsActive: boolean;
  Colorways: Colorway[];
  UniqueId: string | null;
  MatchFileColor: boolean;
}

export namespace Art {
  export type Type = 'vector' | 'raster' | 'emb';
}
