import React from 'react'
import Header from './Header'
import TopContent from './TopContent'
import { ParallaxProvider } from 'react-scroll-parallax';
import Footer from './Footer';

export default function Index() {

  return (
    <>
      <ParallaxProvider>
        <Header />
        <TopContent />
      </ParallaxProvider>
    </>
  )
}
