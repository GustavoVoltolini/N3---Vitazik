export interface Filamento {
  id: string;
  material: string;
  brand: string;
  colorName: string;
  colorHex: string;
  currentWeight: number;
  totalWeight: number;
}

export type StatusImpressao = "QUEUED" | "PRINTING" | "COMPLETED";

export interface Impressao {
  id: string;
  partName: string;
  weightGrams: number;
  timeHours: number;
  status: StatusImpressao;
  filamentId: string;
  filament?: Filamento;
}
