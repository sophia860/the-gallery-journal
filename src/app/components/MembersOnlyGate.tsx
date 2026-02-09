import { Lock } from 'lucide-react';

export function MembersOnlyGate() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-8">
      <div className="max-w-2xl text-center">
        {/* Lock Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E11D48]/10 mb-8">
          <Lock className="w-10 h-10 text-[#E11D48]" />
        </div>

        {/* Heading */}
        <h1 className="font-['Cardo'] text-6xl text-[#2C2C2C] mb-6 italic">
          Members Only
        </h1>

        {/* Message */}
        <p className="font-['Libre_Baskerville'] text-xl text-[#717171] leading-relaxed italic mb-12">
          This is a private space for our writing community.
          <br />
          Sign in to enter the gallery.
        </p>

        <div className="border-t border-b border-[#E0D8D0] py-8 mb-12">
          <p className="font-['Libre_Baskerville'] text-base text-[#717171] leading-relaxed">
            Like a velvet rope at an intimate literary salon,
            <br />
            we keep this space sacred for our members.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signin"
            className="px-8 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm tracking-wider shadow-lg hover:shadow-xl"
          >
            SIGN IN
          </a>
          <a
            href="/signup"
            className="px-8 py-4 border-2 border-[#E0D8D0] text-[#2C2C2C] hover:border-[#C4918A] transition-colors font-['Courier_New'] text-sm tracking-wider"
          >
            JOIN THE GALLERY
          </a>
        </div>

        <div className="mt-12">
          <a
            href="/"
            className="text-sm text-[#717171] hover:text-[#E11D48] transition-colors font-['Inter']"
          >
            ← Return to The Gallery
          </a>
        </div>
      </div>
    </div>
  );
}
