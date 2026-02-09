import { GalleryNav } from '../components/GalleryNav';
import { Footer } from '../components/Footer';
import { Heart } from 'lucide-react';

// Demo writer data
const writers = {
  '1': {
    id: '1',
    name: 'David Park',
    initials: 'DP',
    color: '#C4918A',
    bio: 'A passionate writer contributing to The Gallery community.',
    memberSince: '2025-08-15',
    works: [
      {
        id: 'w1',
        title: 'Love Letter at 3AM',
        status: 'published',
        category: 'Love & Relationships',
        excerpt: "I'm writing this at 3am because I can't sleep without telling you...",
        hearts: 24,
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Sarah Williams',
    initials: 'SW',
    color: '#A8998F',
    bio: 'A passionate writer contributing to The Gallery community.',
    memberSince: '2025-09-22',
    works: [
      {
        id: 'w2',
        title: 'After the Funeral',
        status: 'published',
        category: 'Grief, Loss & Memory',
        excerpt: 'We sit in the living room, talking about everything except the empty chair.',
        hearts: 31,
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Maya Rodriguez',
    initials: 'MR',
    color: '#8B7355',
    bio: 'A passionate writer contributing to The Gallery community.',
    memberSince: '2025-10-01',
    works: [
      {
        id: 'w3',
        title: 'Fragments of Home',
        status: 'published',
        category: 'Family & Identity',
        excerpt: 'I carry fragments of home in my pockets—a worn coin, a pressed flower...',
        hearts: 18,
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Luna Martinez',
    initials: 'LM',
    color: '#8A9A7B',
    bio: 'A passionate writer contributing to The Gallery community.',
    memberSince: '2025-11-12',
    works: [
      {
        id: 'w4',
        title: 'The Space Between',
        status: 'published',
        category: 'Time & Mortality',
        excerpt: "There's a moment between sleeping and waking when I forget everything...",
        hearts: 20,
      },
      {
        id: 'w5',
        title: 'Unfinished Symphony',
        status: 'draft',
        category: 'Love & Relationships',
        excerpt: "We are all works in progress, my love. Let's be unfinished together.",
        hearts: 11,
      }
    ]
  },
};

const statusStyles = {
  draft: 'bg-amber-500/10 text-amber-700 border-amber-500',
  submitted: 'bg-blue-500/10 text-blue-700 border-blue-500',
  published: 'bg-green-500/10 text-green-700 border-green-500',
};

const statusLabels = {
  draft: 'Draft',
  submitted: 'Submitted',
  published: 'Published',
};

interface WriterProfilePageProps {
  writerId: string;
}

export function WriterProfilePage({ writerId }: WriterProfilePageProps) {
  const writer = writers[writerId as keyof typeof writers];

  if (!writer) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <GalleryNav />
        <div className="flex-1 flex items-center justify-center px-8 py-32">
          <div className="text-center">
            <h1 className="font-['Cardo'] text-4xl text-[#2C2C2C] mb-4">
              Writer Not Found
            </h1>
            <a href="/" className="text-[#E11D48] hover:underline font-['Inter']">
              Return to The Gallery
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalHearts = writer.works.reduce((sum, work) => sum + work.hearts, 0);
  const publishedCount = writer.works.filter(w => w.status === 'published').length;
  const memberSinceDate = new Date(writer.memberSince).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <GalleryNav />

      <div className="flex-1 pt-32 pb-16 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white font-['Inter'] font-bold text-3xl mx-auto mb-6 shadow-lg"
              style={{ backgroundColor: writer.color }}
            >
              {writer.initials}
            </div>

            {/* Name */}
            <h1 className="font-['Cardo'] text-6xl text-[#2C2C2C] mb-4">
              {writer.name}
            </h1>

            {/* Bio */}
            <p className="font-['Libre_Baskerville'] text-lg text-[#717171] max-w-2xl mx-auto leading-relaxed italic mb-8">
              {writer.bio}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E11D48] font-['Inter'] mb-1">
                  {publishedCount}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#717171] font-['Inter']">
                  Published
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E11D48] font-['Inter'] mb-1">
                  {totalHearts}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#717171] font-['Inter']">
                  Total Hearts
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-[#2C2C2C] font-['Inter'] mb-1">
                  {memberSinceDate}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#717171] font-['Inter']">
                  Member Since
                </div>
              </div>
            </div>
          </div>

          {/* Works Section */}
          <div>
            <h2 className="font-['Cardo'] text-3xl text-[#2C2C2C] mb-8 pb-4 border-b-2 border-[#E0D8D0]">
              Works
            </h2>

            {writer.works.length === 0 ? (
              <div className="text-center py-12 bg-white border border-[#E0D8D0]">
                <p className="font-['Libre_Baskerville'] text-[#717171] italic">
                  No works yet
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {writer.works.map(work => (
                  <div
                    key={work.id}
                    className="bg-white border-2 border-[#E0D8D0] p-6 hover:border-[#C4918A] hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-['Libre_Baskerville'] text-xl text-[#2C2C2C] flex-1">
                        {work.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs border rounded-full ${statusStyles[work.status as keyof typeof statusStyles]} font-['Inter'] uppercase tracking-wider whitespace-nowrap ml-2`}>
                        {statusLabels[work.status as keyof typeof statusLabels]}
                      </span>
                    </div>

                    <p className="text-xs text-[#717171] font-['Inter'] mb-3">
                      {work.category}
                    </p>

                    <p className="font-['Libre_Baskerville'] text-sm text-[#2C2C2C] leading-relaxed line-clamp-3 italic mb-4">
                      {work.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-[#717171]">
                      <Heart className="w-4 h-4 fill-current text-[#E11D48]" />
                      <span className="font-['Inter'] font-medium">{work.hearts}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
