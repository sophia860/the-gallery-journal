import { useState } from 'react';
import { Sprout, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

const GENRE_TAGS = [
  'Poetry',
  'Fiction',
  'Creative Nonfiction',
  'Memoir',
  'Experimental',
  'Flash',
  'Essays',
  'Hybrid',
  'Literary Fiction',
  'Short Stories',
  'Lyric Essay',
  'Prose Poetry',
];

const FEATURED_WRITERS = [
  { id: '1', name: 'Ocean Vuong', genre: 'Poetry' },
  { id: '2', name: 'Carmen Maria Machado', genre: 'Fiction' },
  { id: '3', name: 'Claudia Rankine', genre: 'Poetry' },
  { id: '4', name: 'George Saunders', genre: 'Fiction' },
  { id: '5', name: 'Maggie Nelson', genre: 'Essays' },
  { id: '6', name: 'Jenny Offill', genre: 'Fiction' },
  { id: '7', name: 'Ross Gay', genre: 'Poetry' },
  { id: '8', name: 'Leslie Jamison', genre: 'Essays' },
  { id: '9', name: 'Hanif Abdurraqib', genre: 'Essays' },
  { id: '10', name: 'Lydia Davis', genre: 'Flash' },
  { id: '11', name: 'Natalie Diaz', genre: 'Poetry' },
  { id: '12', name: 'Brandon Taylor', genre: 'Fiction' },
];

export function SetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [followedWriters, setFollowedWriters] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const toggleWriter = (writerId: string) => {
    if (followedWriters.includes(writerId)) {
      setFollowedWriters(followedWriters.filter(w => w !== writerId));
    } else {
      setFollowedWriters([...followedWriters, writerId]);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Save preferences and redirect to garden
    window.location.href = '/garden';
  };

  const handleSkip = () => {
    window.location.href = '/garden';
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-12">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#A3C4A0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#D4B896]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#C48B8B]/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Logo & Skip */}
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <Sprout className="w-8 h-8 text-[#7A9E7E]" />
            <span className="font-['Lora'] text-3xl font-semibold text-[#2C2C2C] lowercase italic">
              garden
            </span>
          </a>
          <button
            onClick={handleSkip}
            className="font-['Inter'] text-sm text-[#9B9B9B] hover:text-[#2C2C2C] transition-colors"
          >
            Skip for now →
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-['Inter'] text-sm font-medium text-[#2C2C2C]">
              Step {currentStep} of 3
            </span>
            <span className="font-['Inter'] text-sm text-[#9B9B9B]">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          <div className="h-2 bg-[#E5E0DA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7A9E7E] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-8 md:p-12 shadow-sm">
          {/* STEP 1: Genre Selection */}
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F0F7F0] rounded-full mb-4">
                  <svg className="w-8 h-8 text-[#7A9E7E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <h2 className="font-['Lora'] text-3xl font-semibold text-[#2C2C2C] mb-3">
                  What do you love to read?
                </h2>
                <p className="font-['Inter'] text-base text-[#6B6B6B]">
                  Select genres that inspire your writing
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {GENRE_TAGS.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2.5 font-['Inter'] text-sm font-medium rounded-full border-2 transition-all ${
                      selectedGenres.includes(genre)
                        ? 'bg-[#7A9E7E] border-[#7A9E7E] text-white'
                        : 'bg-white border-[#E5E0DA] text-[#6B6B6B] hover:border-[#7A9E7E] hover:text-[#7A9E7E]'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-center font-['Inter'] text-sm text-[#9B9B9B]">
                {selectedGenres.length === 0 ? 'Select at least one genre' : `${selectedGenres.length} selected`}
              </p>
            </div>
          )}

          {/* STEP 2: Writers to Follow */}
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FBF7F0] rounded-full mb-4">
                  <svg className="w-8 h-8 text-[#D4B896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h2 className="font-['Lora'] text-3xl font-semibold text-[#2C2C2C] mb-3">
                  Writers you admire
                </h2>
                <p className="font-['Inter'] text-base text-[#6B6B6B]">
                  Follow writers to discover similar voices
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {FEATURED_WRITERS.map((writer) => (
                  <button
                    key={writer.id}
                    onClick={() => toggleWriter(writer.id)}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      followedWriters.includes(writer.id)
                        ? 'bg-[#F0F7F0] border-[#7A9E7E]'
                        : 'bg-white border-[#E5E0DA] hover:border-[#7A9E7E]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-['Lora'] text-base font-semibold text-[#2C2C2C]">
                          {writer.name}
                        </p>
                        <p className="font-['Inter'] text-xs text-[#9B9B9B] mt-1">
                          {writer.genre}
                        </p>
                      </div>
                      {followedWriters.includes(writer.id) && (
                        <Check className="w-5 h-5 text-[#7A9E7E] flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <p className="mt-6 text-center font-['Inter'] text-sm text-[#9B9B9B]">
                {followedWriters.length === 0 ? 'Follow writers you admire' : `Following ${followedWriters.length} writers`}
              </p>
            </div>
          )}

          {/* STEP 3: Garden Ready */}
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F0F7F0] to-[#FBF7F0] rounded-full mb-6 animate-pulse">
                  <Sparkles className="w-10 h-10 text-[#7A9E7E]" />
                </div>
                <h2 className="font-['Lora'] text-4xl font-semibold text-[#2C2C2C] mb-3">
                  Your garden is ready
                </h2>
                <p className="font-['Inter'] text-lg text-[#6B6B6B] mb-8">
                  Time to plant your first seed
                </p>
              </div>

              {/* Garden Preview Animation */}
              <div className="relative bg-gradient-to-br from-[#F0F7F0] to-[#FAF8F5] border-2 border-[#E5E0DA] rounded-2xl p-8 mb-8">
                <div className="flex items-end justify-center gap-6 mb-6">
                  {/* Animated Seeds */}
                  <div className="text-center animate-bounce" style={{ animationDelay: '0ms', animationDuration: '2s' }}>
                    <div className="w-12 h-12 bg-[#FBF7F0] border-2 border-[#D4B896] rounded-full flex items-center justify-center mb-2">
                      <div className="w-4 h-4 bg-[#D4B896] rounded-full"></div>
                    </div>
                    <p className="font-['Inter'] text-xs text-[#9B7E4F]">Seed</p>
                  </div>

                  {/* Animated Sprout */}
                  <div className="text-center animate-bounce" style={{ animationDelay: '200ms', animationDuration: '2s' }}>
                    <div className="w-14 h-14 bg-[#F0F7F0] border-2 border-[#A3C4A0] rounded-full flex items-center justify-center mb-2">
                      <svg className="w-7 h-7 text-[#A3C4A0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22v-8m0-4V2m0 8c-2.5-2-5-2-7 0m7 0c2.5-2 5-2 7 0" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="font-['Inter'] text-xs text-[#5A7E58]">Sprout</p>
                  </div>

                  {/* Animated Bloom */}
                  <div className="text-center animate-bounce" style={{ animationDelay: '400ms', animationDuration: '2s' }}>
                    <div className="w-16 h-16 bg-[#FAF2F2] border-2 border-[#C48B8B] rounded-full flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-[#C48B8B]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c-1.5 4-1.5 6 0 8 1.5-2 1.5-4 0-8zm0 8c-4 1.5-6 1.5-8 0 2 1.5 4 1.5 8 0zm0 0c4 1.5 6 1.5 8 0-2 1.5-4 1.5-8 0zm0 0c-1.5 4-1.5 6 0 8 1.5-2 1.5-4 0-8z" opacity="0.5"/>
                        <circle cx="12" cy="12" r="2.5"/>
                      </svg>
                    </div>
                    <p className="font-['Inter'] text-xs text-[#9E5A5A]">Bloom</p>
                  </div>
                </div>

                <div className="h-1 bg-gradient-to-r from-transparent via-[#E5E0DA] to-transparent mb-4"></div>
                
                <p className="font-['Inter'] text-sm text-[#9B9B9B] text-center italic">
                  Watch your ideas grow from seeds to blooms
                </p>
              </div>

              {/* Setup Summary */}
              <div className="bg-[#FAF8F5] rounded-lg p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#7A9E7E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-['Inter'] text-sm font-medium text-[#2C2C2C]">
                      {selectedGenres.length} genres selected
                    </p>
                    <p className="font-['Inter'] text-xs text-[#9B9B9B] mt-0.5">
                      {selectedGenres.slice(0, 3).join(', ')}
                      {selectedGenres.length > 3 && ` +${selectedGenres.length - 3} more`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#7A9E7E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-['Inter'] text-sm font-medium text-[#2C2C2C]">
                      Following {followedWriters.length} writers
                    </p>
                    <p className="font-['Inter'] text-xs text-[#9B9B9B] mt-0.5">
                      Discover similar voices in your garden
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#E5E0DA] text-[#6B6B6B] hover:border-[#7A9E7E] hover:text-[#7A9E7E] transition-all font-['Inter'] font-semibold rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-semibold rounded-lg shadow-sm ml-auto"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] transition-all font-['Inter'] font-bold rounded-lg shadow-sm ml-auto"
            >
              Enter Your Garden
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
