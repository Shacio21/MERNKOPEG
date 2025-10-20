import React from 'react'
import Laba from '../components/rekap/Laba'
import SidebarRekap from '../components/rekap/SidebarRekap'
import "../style/rekap/laba.css"

const Rekap: React.FC = () => {
  return (
    <div className='landing-page'>
      <Laba />
      <SidebarRekap />
    </div>
  )
}

export default Rekap;