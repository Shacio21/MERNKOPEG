import React, { useState } from "react";
import "../../../style/Transaksi/pembelian.css";
import type { PengembalianItem } from "../../../types/PengembalianItem";

interface Props {
  data: PengembalianItem;
  onClose: () => void;
  onSubmit: (updatedData: PengembalianItem) => void | Promise<void>;
}

const UpdatePengembalian: React.FC<Props> = ({ data, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PengembalianItem>({ ...data });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        ["Jml", "Harga", "Total_Harga", "Tahun"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <div className="addpembelian-overlay">
      <div className="addpembelian-container">
        <h2>Edit Data Pengembalian</h2>
        <form onSubmit={handleSubmit} className="addpembelian-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Kode Item</label>
              <input
                type="text"
                name="Kode_Item"
                value={formData.Kode_Item}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Nama Item</label>
              <input
                type="text"
                name="Nama_Item"
                value={formData.Nama_Item}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Jumlah</label>
              <input
                type="number"
                name="Jml"
                value={formData.Jml}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Satuan</label>
              <input
                type="text"
                name="Satuan"
                value={formData.Satuan}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Harga</label>
              <input
                type="number"
                name="Harga"
                value={formData.Harga}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Pot. %</label>
              <input
                type="number"
                name="Pot. %"
                value={formData["Pot. %"]}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Total Harga</label>
              <input
                type="number"
                name="Total_Harga"
                value={formData.Total_Harga}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Bulan</label>
              <input
                type="text"
                name="Bulan"
                value={formData.Bulan}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tahun</label>
              <input
                type="number"
                name="Tahun"
                value={formData.Tahun}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="submit-btn">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePengembalian;
