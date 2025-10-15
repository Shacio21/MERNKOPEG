import React from 'react'
import TableStock from '../components/stok/StockTable'
import "../style/rekap/laba.css"

const Rekap: React.FC = () => {
  return (
    <div className='landing-page'>
      <TableStock />
    </div>
  )
}

export default Rekap;
