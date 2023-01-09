export interface File {
  type: string;
  id: number;
  url: string;
  options: File.Option[];
  hash: string;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number;
  status: File.Status;
  create: number;
  thumbnail_url: string;
  preview_url: string;
  visible: boolean;
  is_temporary: boolean;
}

export namespace File {
  export interface Option {
    id: string;
    value: string;
  }

  export type Status = 'ok' | 'waiting' | 'failed';
}
