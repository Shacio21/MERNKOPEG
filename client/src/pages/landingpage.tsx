import React from 'react'
import Navbar from '../components/landingpage/Navbar'
import HeroSection from '../components/landingpage/HeroSection'
import "../style/landingpage.css"

const LandingPage: React.FC = () => {
  return (
    <div className='landing-page'>
      <Navbar />
      <HeroSection />
    </div>
  )
}

export default LandingPage;
