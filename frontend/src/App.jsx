// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
import React, { useState } from 'react';
import UploadQuestionBank from './components/UploadQuestionBank';
import TakeExam from './components/TakeExam';

export default function App() {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-violet-100/50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-600/30">
            🎓
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              QuizOCR Engine
            </h1>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Django + React + Celery + Tesseract</p>
          </div>
        </div>
        
        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl space-x-1 border border-gray-200/60 shadow-inner">
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'admin' 
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-gray-600 hover:text-gray-900 bg-transparent'
            }`}
          >
            🛡️ Admin Panel
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'exam' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30' 
                : 'text-gray-600 hover:text-gray-900 bg-transparent'
            }`}
          >
            ✍️ Student Exam
          </button>
        </div>
      </div>

      {activeTab === 'admin' ? <UploadQuestionBank /> : <TakeExam />}
    </div>
  );
}