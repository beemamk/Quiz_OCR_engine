import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function TakeExam() {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [userIdentifier, setUserIdentifier] = useState('');
  const [typedAnswers, setTypedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    apiService.getQuestionBanks().then((res) => setBanks(res.data));
  }, []);

  const handleTextChange = (questionId, text) => {
    setTypedAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmitExam = async (e) => {
    e.preventDefault();
    if (!selectedBank || !userIdentifier) {
      alert('Please enter your name and select an assessment.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        question_bank: selectedBank.id,
        user_identifier: userIdentifier,
        answers: selectedBank.questions.map((q) => ({
          question: q.id,
          user_answer_text: typedAnswers[q.id] || '',
        })),
      };

      const response = await apiService.submitAnswers(payload);
      setResult(response.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit exam. Check backend logs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 text-slate-800">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Student Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">Examination & Grading</h1>
          <p className="text-sm text-slate-500">Take your assessment with instant automated text evaluation.</p>
        </div>
      </div>

      {result ? (
        <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-3xl border border-emerald-100">
            🏆
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">Assessment Evaluated Successfully</h3>
            <p className="text-xs text-slate-400 font-mono">Submission Reference ID: #{result.id}</p>
          </div>
          
          <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-xl max-w-md mx-auto text-left space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Candidate:</span>
              <span className="font-bold text-slate-900">{result.user_identifier || userIdentifier}</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-xs font-bold uppercase text-slate-500">Score Awarded:</span>
              <span className="text-xl font-black text-emerald-600">{result.total_score} pts</span>
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setSelectedBank(null); setUserIdentifier(''); setTypedAnswers({}); }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition"
          >
            Take Another Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Candidate Name</label>
              <input
                type="text"
                value={userIdentifier}
                onChange={(e) => setUserIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium text-slate-900 transition"
                placeholder="e.g., Beema Beevi"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Select Assessment</label>
              <select
                onChange={(e) => {
                  const bank = banks.find((b) => b.id === parseInt(e.target.value));
                  setSelectedBank(bank || null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium text-slate-900 transition"
                defaultValue=""
              >
                <option value="" disabled>-- Select Question Bank --</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>{b.title} ({b.questions.length} Questions)</option>
                ))}
              </select>
            </div>
          </div>

          {selectedBank && (
            <form onSubmit={handleSubmitExam} className="space-y-6">
              <div className="space-y-4">
                {selectedBank.questions.map((q, idx) => (
                  <div key={q.id} className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[11px] font-bold tracking-wider">
                        QUESTION {idx + 1} OF {selectedBank.questions.length}
                      </span>
                    </div>
                    
                    <p className="font-bold text-slate-900 text-base mb-4">{q.question_text}</p>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Your Answer
                      </label>
                      <input
                        type="text"
                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium text-slate-900 transition"
                        placeholder="Type your answer here..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-emerald-600/20 transition active:scale-[0.99]"
              >
                {submitting ? 'Evaluating Assessment...' : 'Submit Assessment & Check Score'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}