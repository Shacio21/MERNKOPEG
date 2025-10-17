import React, { useState } from "react";
import "../../../style/Transaksi/pembelian.css";

interface AddPembelianProps {
  onClose: () => void;
  onSubmit: (newData: any) => void;
}

const AddPembelian: React.FC<AddPembelianProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    Kode_Item: "",
    Nama_Item: "",
    Jenis: "",
    Jumlah: "",
    Satuan: "",
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
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="addpembelian-overlay">
      <div className="addpembelian-container">
        <h2>Tambah Data Pembelian</h2>
        <form onSubmit={handleSubmit} className="addpembelian-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Kode Item</label>
              <input
                type="number"
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
              <label>Jenis</label>
              <input
                type="text"
                name="Jenis"
                value={formData.Jenis}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Jumlah</label>
              <input
                type="number"
                name="Jumlah"
                value={formData.Jumlah}
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
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPembelian;
