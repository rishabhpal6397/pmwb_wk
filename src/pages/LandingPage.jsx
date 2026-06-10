import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">

      {/* Header */}
      <header className="w-full px-8 py-4 bg-white shadow-sm flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span className="font-bold text-lg text-slate-800">PMWB Workbench</span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
            Project Management <span className="text-indigo-600">Workbench</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            PMWB Workbench is a centralised project management platform designed to give
            teams full visibility into effort, metrics, risks, schedules, and delivery
            health — all in one place. Track progress, manage issues, and make
            data-driven decisions with real-time insights.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">

          {/* PMWB Card */}
          <button
            onClick={() => navigate('/auth')}
            className="flex-1 bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200 hover:border-indigo-300 p-8 flex flex-col items-center gap-4 transition-all duration-200 group cursor-pointer text-left"
          >
            <div className="w-14 h-14 rounded-xl bg-indigo-100 group-hover:bg-indigo-600 flex items-center justify-center transition-colors duration-200">
              <svg className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">PMWB Dashboard</h2>
              <p className="text-sm text-slate-500">
                Access your full project workbench — metrics, effort, risks, issues and more.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
              Sign in to continue →
            </span>
          </button>

          {/* Power BI Card — placeholder */}
          <div className="flex-1 bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex flex-col items-center gap-4 opacity-50 cursor-not-allowed text-center">
            <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Power BI Dashboard</h2>
              <p className="text-sm text-slate-500">
                View advanced analytics and visualisations powered by Microsoft Power BI.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Coming soon</span>
          </div>

        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 py-4">
        © {new Date().getFullYear()} PMWB Workbench. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;