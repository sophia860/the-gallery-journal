export function DebugPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-['Cardo'] text-4xl text-[#2C2C2C] mb-8">Debug Info</h1>
        
        <div className="bg-white p-6 rounded-lg mb-6 border-2 border-[#E0D8D0]">
          <h2 className="font-['Inter'] text-xl font-semibold mb-4">App Status</h2>
          <p className="font-['Inter'] text-green-600 text-lg">✅ React is running!</p>
          <p className="font-['Inter'] text-sm text-[#717171] mt-2">
            If you see this page, the React app is working correctly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg mb-6 border-2 border-[#E0D8D0]">
          <h2 className="font-['Inter'] text-xl font-semibold mb-4">Cache Clear Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 font-['Inter'] text-sm text-[#2C2C2C]">
            <li>Open your browser's DevTools (F12 or Right-click → Inspect)</li>
            <li>Go to the "Application" or "Storage" tab</li>
            <li>Find "Cache Storage" and clear all caches</li>
            <li>Also clear "Local Storage" and "Session Storage"</li>
            <li>Close DevTools</li>
            <li>Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)</li>
          </ol>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-[#E0D8D0]">
          <h2 className="font-['Inter'] text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                alert('Storage cleared! Now hard refresh the page (Ctrl+Shift+R)');
              }}
              className="block w-full px-6 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Inter'] rounded"
            >
              Clear Local Storage
            </button>
            
            <a
              href="/"
              className="block w-full px-6 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] transition-colors font-['Inter'] rounded text-center"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
