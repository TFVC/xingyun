import Hero from '../../components/Layout/Hero';
import CoreConcept from '../../components/Home/CoreConcept';
import TechShowcase from '../../components/Home/TechShowcase';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <CoreConcept />
        <TechShowcase />
      </main>
    </div>
  );
};

export default Home;
