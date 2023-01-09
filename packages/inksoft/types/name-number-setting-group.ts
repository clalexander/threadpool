import { NameNumberFontSetting } from './name-number-font-setting';

export interface NameNumberSettingGroup {
  Name: NameNumberFontSetting;
  Number: NameNumberFontSetting;
  ProductStyleId: number;
  ArtId: number | null;
  DesignId: number | null;
  CartRetailItemId: number | null;
  PrintCost: number | null;
}
