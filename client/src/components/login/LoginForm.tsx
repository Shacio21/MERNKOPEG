import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "../../style/login.css";

const API_URL = import.meta.env.VITE_BASE_URL + "/api/auth/login";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login gagal! Periksa email dan password.");
      }

      const data = await response.json();

      // Simpan token & status login
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAuthenticated", "true");

      // SweetAlert success animation 🎉
      Swal.fire({
        title: "Berhasil!",
        text: "Login berhasil, selamat datang di KOPEG 👋",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        background: "#fff",
        color: "#222",
      });

      navigate("/");
    } catch (err) {
      Swal.fire({
        title: "Gagal!",
        text:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan tak dikenal.",
        icon: "error",
        confirmButtonColor: "#007bff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="login-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="login-card"
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <motion.h2
          className="login-title"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Login KOPEG
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="input-group">
            <label>Email</label>
            <motion.input
              whileFocus={{ scale: 1.03, borderColor: "#007bff" }}
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <motion.input
              whileFocus={{ scale: 1.03, borderColor: "#007bff" }}
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
          >
            {loading ? "🚀 Logging in..." : "Masuk Sekarang"}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
