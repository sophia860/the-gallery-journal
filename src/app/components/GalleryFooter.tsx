export function GalleryFooter() {
  return (
    <footer className="bg-[#f5f0e8] py-16 px-8">
      <div className="text-center space-y-3">
        <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.3em] text-[#1B1B3A]/40">
          EVERYWHERE AND NOWHERE, BABY
        </p>
        <p className="font-['Courier_New'] text-[10px] uppercase tracking-[0.25em] text-[#1B1B3A]/30">
          Supported by gardeners
        </p>
        <p className="font-['Courier_New'] text-[9px] uppercase tracking-[0.2em] text-[#1B1B3A]/20">
          © {new Date().getFullYear()} PAGE
        </p>
      </div>
    </footer>
  );
}