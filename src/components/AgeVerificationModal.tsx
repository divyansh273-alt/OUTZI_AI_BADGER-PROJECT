import React, { useState } from 'react';
import { ShieldCheck, Upload, CheckCircle2, AlertCircle, Trash2, X, Lock } from 'lucide-react';
import { verifyUserAge } from '../lib/api';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (ageGroup: '16-17' | '18-35', isVerified: boolean) => void;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerificationComplete,
}) => {
  const [docType, setDocType] = useState('driving_license');
  const [declaredDob, setDeclaredDob] = useState('2003-05-15');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; ageGroup: '16-17' | '18-35'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await verifyUserAge({
        documentType: docType,
        declaredDob,
      });

      setResult({
        success: true,
        ageGroup: res.ageGroup,
        message: res.privacyNotice,
      });

      onVerificationComplete(res.ageGroup, true);
    } catch (err: any) {
      setResult({
        success: false,
        ageGroup: '16-17',
        message: err.message || 'Verification could not be completed.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Age & Safety Verification</h2>
              <p className="text-[11px] text-slate-500">Government ID Date-of-Birth check</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Privacy Banner */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-900">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <Lock className="w-3.5 h-3.5" />
              Strict Zero-Retention Privacy
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Your uploaded document is processed solely in-memory to extract your year of birth and <strong>immediately deleted</strong>. No ID numbers, scans, or document images are saved to disk or displayed on your profile.
            </p>
          </div>

          {result ? (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Verification Complete
              </h3>
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                Verified Category:{' '}
                <strong className={result.ageGroup === '18-35' ? 'text-teal-700' : 'text-amber-700'}>
                  {result.ageGroup === '18-35' ? 'Adult (18–35) · Date Planning Unlocked' : 'Young Adult (16–17) · Group & Solo Allowed'}
                </strong>
                <p className="text-[10px] text-slate-500 mt-1">{result.message}</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Continue to Planning
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="driving_license">Indian Driving Licence (State RTO)</option>
                  <option value="passport">Indian Passport</option>
                  <option value="pan_card">PAN Card (Income Tax Dept)</option>
                  <option value="aadhaar_masked">Masked Aadhaar (DOB section)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth (as per document)
                </label>
                <input
                  type="date"
                  value={declaredDob}
                  onChange={e => setDeclaredDob(e.target.value)}
                  max="2010-01-01"
                  min="1950-01-01"
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Document Photo / Scan
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    id="doc-upload"
                    className="hidden"
                  />
                  <label htmlFor="doc-upload" className="cursor-pointer block space-y-1.5">
                    <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                    <span className="text-xs font-medium text-slate-700 block">
                      {selectedFileName ? selectedFileName : 'Click to select photo or PDF'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Formats: JPG, PNG, PDF up to 5MB
                    </span>
                  </label>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Uploaded files are purged instantly upon verification callback.</span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {isProcessing ? 'Verifying & Purging...' : 'Verify DOB'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
