import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white border-2 border-[#E11D48] rounded-2xl p-8">
            <h1 className="font-['Cardo'] text-4xl text-[#E11D48] mb-4">
              Something went wrong
            </h1>
            
            <div className="bg-[#E11D48]/10 p-4 rounded-lg mb-6">
              <p className="font-['Inter'] text-sm font-mono text-[#2C2C2C] whitespace-pre-wrap">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-['Libre_Baskerville'] text-[#717171]">
                This is likely a cache issue. Try these steps:
              </p>
              
              <ol className="list-decimal list-inside space-y-2 font-['Inter'] text-sm text-[#2C2C2C]">
                <li>Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)</li>
                <li>Clear your browser cache and local storage</li>
                <li>If the error persists, visit <a href="/admin/debug" className="text-[#E11D48] underline">/admin/debug</a></li>
              </ol>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                  }}
                  className="px-6 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Inter'] rounded-lg"
                >
                  Clear Cache & Reload
                </button>
                
                <a
                  href="/"
                  className="px-6 py-3 border-2 border-[#E0D8D0] text-[#2C2C2C] hover:bg-[#F5F0EB] transition-colors font-['Inter'] rounded-lg inline-block"
                >
                  Go Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
