import React from 'react'
import Prediksi from '../components/prediksi/Prediksi'
import SidebarPrediksi from '../components/prediksi/SidebarPrediksi'
import "../style/prediksi.css"

const PrediksiPage: React.FC = () => {
  return (
    <div>
      <Prediksi />
      <SidebarPrediksi />
    </div>
  )
}

export default PrediksiPage;