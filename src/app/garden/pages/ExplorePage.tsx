import { GardenNav } from '../components/GardenNav';
import { GardenFooter } from '../components/GardenFooter';
import { ParallaxStarfield } from '../../components/ParallaxStarfield';

export function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#0d1525] text-[#f5f0e8] relative">
      <ParallaxStarfield />
      <GardenNav />
      
      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-['Cardo'] text-6xl text-[#f5f0e8] italic mb-6">
            Explore
          </h1>
          <p className="font-['Cormorant_Garamond'] text-xl text-[#8b9dc3] mb-12">
            Discover writing from the Garden community.
          </p>
          
          <div className="p-12 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
            <p className="font-['Cormorant_Garamond'] text-lg text-[#8b9dc3] text-center">
              Explore features coming soon...
            </p>
          </div>
        </div>
      </div>
      
      <GardenFooter />
    </div>
  );
}
