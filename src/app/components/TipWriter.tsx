import { useState } from 'react';
import { Heart, X } from 'lucide-react';

interface TipWriterProps {
  writerName: string;
  writerId: string;
  pieceTitle: string;
}

export function TipWriter({ writerName, writerId, pieceTitle }: TipWriterProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const presetAmounts = [3, 5, 10, 20];

  const handleTip = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount < 1) {
      alert('Please select or enter a tip amount');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      alert(`Thank you for supporting ${writerName} with a $${amount} tip!`);
      setShowModal(false);
      setProcessing(false);
      setSelectedAmount(null);
      setCustomAmount('');
      setMessage('');
    }, 1500);
  };

  return (
    <>
      {/* Tip Button */}
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#E11D48] text-[#E11D48] hover:bg-[#E11D48] hover:text-white transition-all font-['Cardo'] text-sm tracking-wider group"
      >
        <Heart className="w-4 h-4 group-hover:fill-current" />
        Tip Writer
      </button>

      {/* Tip Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-[#FAF8F5] max-w-md w-full rounded-lg p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-[#F5F0E8] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#8B7355]" />
            </button>

            <div className="text-center mb-6">
              <Heart className="w-12 h-12 mx-auto mb-4 text-[#E11D48]" />
              <h3 className="font-['Cardo'] text-3xl text-[#2C1810] mb-2">
                Support {writerName}
              </h3>
              <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] italic">
                for "{pieceTitle}"
              </p>
            </div>

            {/* Preset Amounts */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`py-3 rounded font-['Cardo'] text-lg transition-all ${
                    selectedAmount === amount
                      ? 'bg-[#E11D48] text-white'
                      : 'bg-white border-2 border-[#E0D8D0] text-[#2C1810] hover:border-[#E11D48]'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">
                Or enter custom amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-['Cardo'] text-lg text-[#8B7355]">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-['Cardo'] text-lg"
                />
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block font-['Courier_New'] text-xs text-[#8B7355] mb-2 uppercase tracking-wider">
                Add a message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Let the writer know what their work means to you..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-[#E0D8D0] focus:border-[#C4A265] focus:outline-none rounded font-['Libre_Baskerville'] text-sm resize-none"
              />
            </div>

            {/* Tip Info */}
            <div className="bg-white border border-[#E0D8D0] rounded p-4 mb-6">
              <p className="font-[family-name:var(--font-ui)] text-xs text-[#8B7355] leading-relaxed">
                <strong className="text-[#2C1810]">100% goes to the writer.</strong> We handle payment processing and cover all fees so your entire tip supports the artist.
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleTip}
              disabled={processing}
              className="w-full py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Cardo'] text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Send Tip${selectedAmount || customAmount ? ` ($${selectedAmount || customAmount})` : ''}`}
            </button>

            <p className="text-center text-xs text-[#8B7355] mt-4 font-[family-name:var(--font-ui)]">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      )}
    </>
  );
}
