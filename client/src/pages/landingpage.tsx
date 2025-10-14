import React from 'react'
import Navbar from '../components/landingpage/Navbar'
import HeroSection from '../components/landingpage/HeroSection'
import InformationSection from '../components/landingpage/InformationSection'
import AnggotaSection from '../components/landingpage/AnggotaSection'
import KeuntunganKerugianSection from '../components/landingpage/KeuntunganKerugianSection'
import ProductSection from '../components/landingpage/ProductSection'
import "../style/landingpage.css"

const LandingPage: React.FC = () => {
  return (
    <div className='landing-page'>
      <Navbar />
      <HeroSection />
      <InformationSection />
      <AnggotaSection />
      <KeuntunganKerugianSection />
      <ProductSection />
    </div>
  )
}

export default LandingPage;
