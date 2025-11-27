import React, { useState } from "react";
import "../../../style/Transaksi/pembelian.css";

interface AddPengembalianProps {
  onClose: () => void;
  onSubmit: (newData: any) => void;
}

const AddPengembalian: React.FC<AddPengembalianProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    Kode_Item: "",
    Nama_Item: "",
    Jml: "",
    Satuan: "",
    Harga: "",
    "Pot. %": "",
    Total_Harga: "",
    Bulan: "",
    Tahun: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ubah tipe angka agar sesuai
    const newData = {
      ...formData,
      Jml: Number(formData.Jml),
      Harga: Number(formData.Harga),
      ["Pot. %"]: Number(formData["Pot. %"]),
      Total_Harga: Number(formData.Total_Harga),
      Tahun: Number(formData.Tahun),
    };

    onSubmit(newData);
    onClose();
  };

  return (
    <div className="addpembelian-overlay">
      <div className="addpembelian-container">
        <h2>Tambah Data Pengembalian</h2>
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
              <label>Harga (Rp)</label>
              <input
                type="number"
                name="Harga"
                value={formData.Harga}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Potongan (%)</label>
              <input
                type="number"
                name="Pot. %"
                value={formData["Pot. %"]}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Total Harga (Rp)</label>
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
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPengembalian;
