// En LandingPage/page.tsx
import NavBar from './Components/NavBar';
import Hero from './Components/Hero';
import WhyUs from './Components/WhyUs';
import History from './Components/History';
import Pricing from './Components/Pricing';
import Gallery from './Components/Gallery';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
import Preloader from './Components/Preloader';


const LandingPage = () => {
  return (
    <div className="font-sans">
      <Preloader />
      <NavBar />
      <Hero />
      <WhyUs />
      <History />
      <Pricing />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;