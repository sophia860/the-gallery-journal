import { Shuffle } from 'lucide-react';

export function RandomPoemButton() {
  const handleClick = () => {
    window.location.href = '/collection-gallery';
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#2C1810] text-[#FAF8F5] flex items-center justify-center hover:bg-[#1A1A1A] transition-all"
      aria-label="Random Poem"
      title="Random Poem"
    >
      <Shuffle className="w-5 h-5" />
    </button>
  );
}
