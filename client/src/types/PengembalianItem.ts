export interface PengembalianItem {
  _id: string;
  No: number; 
  Kode_Item: string;
  Nama_Item: string;
  Jml: number;
  Satuan: string;
  Harga: number;
  ["Pot. %"]: number;
  Total_Harga: number;
  Bulan: string;
  Tahun: number;
}
