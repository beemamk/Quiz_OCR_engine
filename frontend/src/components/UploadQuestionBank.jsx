import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function UploadQuestionBank() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchBanks = async () => {
    try {
      const response = await apiService.getQuestionBanks();
      setBanks(response.data);
    } catch (err) {
      console.error('Error fetching question banks:', err);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setError('Please provide a title and select a PDF file.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await apiService.uploadPdf(title, file);
      setTitle('');
      setFile(null);
      setSuccessMsg('PDF uploaded successfully! Questions parsed in background.');
      setTimeout(fetchBanks, 1000);
    } catch (err) {
      setError('Failed to upload PDF. Check backend server logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 text-slate-800">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Admin Workspace
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">Question Bank Management</h1>
          <p className="text-sm text-slate-500">Upload question sheet PDFs to auto-extract questions and manage assessments.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchBanks}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition shadow-sm flex items-center space-x-1.5"
          >
            <span>🔄</span>
            <span>Refresh Hub</span>
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl font-medium text-sm">{error}</div>}
      {successMsg && <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl font-medium text-sm">{successMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload Form */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm h-fit">
          <h3 className="text-base font-extrabold text-slate-900 mb-4 pb-3 border-b border-slate-100">Upload New PDF</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Assessment Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium text-slate-900 transition"
                placeholder="e.g., Python & Django Assessment"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">PDF File</label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition">
                <div className="flex flex-col items-center justify-center pt-4 pb-5 px-3 text-center">
                  <span className="text-xl mb-1">📄</span>
                  <p className="text-xs text-slate-600 font-medium"><span className="text-indigo-600 font-bold">Click to upload</span> or drag</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">{file ? file.name : 'PDF format only'}</p>
                </div>
                <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Processing PDF...' : 'Upload & Parse PDF'}
            </button>
          </form>
        </div>

        {/* Right Column: Question Bank List Table/Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white border border-slate-200/80 px-6 py-4 rounded-2xl shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base">Active Question Banks</h3>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
              {banks.length} Total
            </span>
          </div>

          {banks.length === 0 ? (
            <div className="bg-white border border-slate-200/80 p-12 rounded-2xl text-center shadow-sm">
              <p className="text-sm text-slate-400 italic">No question banks uploaded yet. Use the form to upload your first assessment PDF.</p>
            </div>
          ) : (
            banks.map((bank) => (
              <div key={bank.id} className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-lg">{bank.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Created: {new Date(bank.created_at).toLocaleString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">
                    {bank.questions.length} Questions Extracted
                  </span>
                </div>

                <div className="mt-4 bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3 max-h-56 overflow-y-auto">
                  {bank.questions.map((q, idx) => (
                    <div key={q.id} className="text-xs flex items-start space-x-2 pb-2.5 border-b border-slate-200/50 last:border-0 last:pb-0">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Q{idx + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{q.question_text}</p>
                        <p className="text-emerald-700 font-semibold mt-1">Answer: {q.correct_answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}