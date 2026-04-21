import React from 'react'
import TableStok from '../../components/stok/total/StokTable'
import SidebarStok from '../../components/stok/SidebarStok'
import "../../style/stok/stok.css"

const Stok: React.FC = () => {
  return (
    <div className='landing-page'>
      <TableStok />
      <SidebarStok />
    </div>
  )
}

export default Stok;
