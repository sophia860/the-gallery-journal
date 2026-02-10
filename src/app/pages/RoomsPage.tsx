import { motion } from 'motion/react';
import { Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

// Sample writer rooms reimagined as personal anthologies
const sampleRooms = [
  {
    id: 'sample1',
    writerName: 'Pam Martin-Lawrence',
    bio: 'Curating poems that trace the constellations of love and distance.',
    atmosphere: 'warm',
    collections: ['Orbiting Love', 'Letters to August'],
    highlight: 'Your Eyes',
  },
  {
    id: 'sample2',
    writerName: 'Ella B Winters',
    bio: 'Writing at the intersection of desire, weather, and heatwave nights.',
    atmosphere: 'warm',
    collections: ['Heatwave Psalms', 'Summer Fever'],
    highlight: 'Thoughts on love during a heatwave',
  },
  {
    id: 'sample3',
    writerName: 'Indee Sehrish Watson',
    bio: 'Collector of shoreline fragments and sea glass turned lyric.',
    atmosphere: 'warm',
    collections: ['Tidal Notebooks', 'Sea Glass Psalms'],
    highlight: 'Ocean Pockets',
  },
  {
    id: 'sample4',
    writerName: 'Bhavna Jain',
    bio: 'Finding clarity and beginnings in the aftermath of storms.',
    atmosphere: 'warm',
    collections: ['After the Storm', 'Clear Sky Studies'],
    highlight: 'The Clear Sky',
  },
  {
    id: 'sample5',
    writerName: 'Leonie Rowland',
    bio: 'Celebrating the holy in the ordinary and quiet Tuesdays.',
    atmosphere: 'warm',
    collections: ['Blessings', 'Kitchen Light'],
    highlight: 'Blessings',
  },
  {
    id: 'sample6',
    writerName: 'Seth Trochtenberg',
    bio: 'Urban poet mapping crowds, solitude, and neon insomnia.',
    atmosphere: 'warm',
    collections: ['City Static', 'Neon Solitudes'],
    highlight: 'Dialogue in Times Square',
  },
  {
    id: 'sample7',
    writerName: 'Sadiya Ali',
    bio: 'Writing grief, memory, and the small sounds that linger.',
    atmosphere: 'warm',
    collections: ['Glass Bells', 'Elegy Studies'],
    highlight: 'Tinkles',
  },
  {
    id: 'sample8',
    writerName: 'Luna Bailey',
    bio: 'Mother, writer, witness to the becoming of self and daughter.',
    atmosphere: 'warm',
    collections: ['Becoming', 'Open Fields'],
    highlight: 'Her Graduation',
  },
];

export function RoomsPage() {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'writer';
  const isEditor = userRole === 'editor' || userRole === 'managing_editor';

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Navigation */}
      <GalleryNav />

      {/* Hero */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-40 pb-16 px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-['Courier_New'] text-sm tracking-[0.3em] text-[#717171] mb-6">
            THE GALLERY
          </div>
          <h1 className="font-['Cardo'] text-7xl md:text-8xl text-[#2C2C2C] mb-6">
            Writer Rooms
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xl text-[#717171] max-w-2xl mx-auto leading-relaxed">
            Personal anthology spaces for writers to curate themed collections—small chapbooks, seasonal suites, and in-progress sequences.
          </p>
        </div>
      </motion.section>

      {/* Rooms Grid */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleRooms.map((room, index) => (
              <motion.a
                key={room.id}
                href={`/room/${room.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group block p-8 border-2 border-[#E0D8D0] hover:border-[#C4918A] transition-all bg-white"
              >
                <div className="font-['Courier_New'] text-xs text-[#717171] mb-4">
                  ROOM {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="font-['Cardo'] text-3xl mb-4 text-[#2C2C2C] group-hover:text-[#C4918A] transition-colors">
                  {room.writerName}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-base leading-relaxed text-[#717171]">
                  {room.bio}
                </p>
                <div className="mt-4">
                  <div className="text-xs font-['Courier_New'] uppercase tracking-wider text-[#8B7355] mb-2">
                    Featured Collection
                  </div>
                  <p className="font-[family-name:var(--font-body)] text-sm text-[#2C2C2C] mb-3">
                    {room.highlight}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {room.collections.map((collection) => (
                      <span
                        key={collection}
                        className="px-3 py-1 bg-[#F5F0EB] text-[#717171] text-xs font-['Inter'] border border-[#E0D8D0]"
                      >
                        {collection}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#E0D8D0] font-['Courier_New'] text-xs text-[#C4918A] group-hover:text-[#E11D48] transition-colors">
                  ENTER ROOM →
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-white border-t-2 border-[#E0D8D0]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Cardo'] text-5xl mb-6 text-[#2C2C2C]">
            Start Your Own Room
          </h2>
          <p className="font-[family-name:var(--font-body)] text-xl leading-relaxed mb-8 text-[#717171]">
            Build a personal anthology: gather your poems, essays, and fragments into themed mini-collections to share with readers.
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm"
          >
            JOIN THE GALLERY
          </a>
        </div>
      </section>

      {/* Footer */}
      <GalleryFooter />
    </div>
  );
}
