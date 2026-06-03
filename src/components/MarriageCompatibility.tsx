'use client';

import React, { useState } from 'react';

// ─── constants ────────────────────────────────────────────────────────────────

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const RASIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// Rasi derived from nakshatra midpoint longitude — matches backend calculation
const nakToRasi = (nak: number) => Math.floor(((nak + 0.5) * (360 / 27)) / 30);

// ─── types ────────────────────────────────────────────────────────────────────

interface PoruthamResult {
  name: string;
  compatible: boolean;
  description: string;
  critical?: boolean;
}

interface CompatibilityData {
  boy:            { nakshatra: string; rasi: string };
  girl:           { nakshatra: string; rasi: string };
  score:          number;
  percentage:     number;
  recommendation: string;
  poruthams:      PoruthamResult[];
  rajjuDosha:     boolean;
  summaryTamil:   string;
  summaryEnglish: string;
}

// ─── sub-components ───────────────────────────────────────────────────────────

const ScoreRing: React.FC<{ percentage: number; score: number; rajjuDosha: boolean }> = ({
  percentage, score, rajjuDosha,
}) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const fill = circ * (percentage / 100);
  const color = rajjuDosha ? '#ef4444' : percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';
  const textColor = rajjuDosha ? 'text-red-500' : percentage >= 70 ? 'text-emerald-500' : percentage >= 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10"
          className="dark:stroke-gray-700" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={circ - fill} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${textColor}`}>{score}<span className="text-lg text-gray-400">/10</span></span>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{percentage}%</span>
      </div>
    </div>
  );
};

const RecommendationBadge: React.FC<{ recommendation: string; rajjuDosha: boolean }> = ({
  recommendation, rajjuDosha,
}) => {
  const styles: Record<string, string> = {
    'Excellent Match':  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
    'Good Match':       'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700',
    'Average Match':    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700',
    'Not Recommended':  'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700',
  };
  const icons: Record<string, string> = {
    'Excellent Match': '✦', 'Good Match': '✓', 'Average Match': '◈', 'Not Recommended': '✗',
  };
  const label = rajjuDosha ? 'Not Recommended' : recommendation;
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${styles[label] ?? styles['Not Recommended']}`}>
      <span>{icons[label]}</span>{label}
    </span>
  );
};

const NakshtraSelect: React.FC<{
  label: string; value: number; onChange: (v: number) => void; accent: string;
}> = ({ label, value, onChange, accent }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
    <select
      value={value}
      onChange={e => onChange(parseInt(e.target.value, 10))}
      className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
        bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm
        focus:outline-none focus:ring-2 ${accent} focus:border-transparent transition`}
    >
      {NAKSHATRAS.map((n, i) => (
        <option key={i} value={i}>{n}</option>
      ))}
    </select>
  </div>
);

const RasiDisplay: React.FC<{ rasi: string }> = ({ rasi }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
      Rasi <span className="text-xs text-gray-400">(auto-detected)</span>
    </label>
    <div className="w-full px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-600
      bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 text-sm">
      {rasi}
    </div>
  </div>
);

// ─── main component ───────────────────────────────────────────────────────────

const MarriageCompatibility: React.FC = () => {
  const [boyNak,  setBoyNak]  = useState(0);
  const [girlNak, setGirlNak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<CompatibilityData | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const boyRasi  = RASIS[nakToRasi(boyNak)];
  const girlRasi = RASIS[nakToRasi(girlNak)];

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/matchmaking?boyNakshatra=${boyNak}&girlNakshatra=${girlNak}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Calculation failed');
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── header ── */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-3xl">🪐</span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              AstroJyothi
            </h1>
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Marriage Compatibility — 10 Porutham Analysis
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Traditional South Indian Jyotish matchmaking
          </p>
        </div>

        {/* ── form card ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100
          dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-5">
            Enter Birth Star Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* boy */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-500 text-xl">♂</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">Boy</span>
              </div>
              <NakshtraSelect
                label="Birth Star (Nakshatra)"
                value={boyNak}
                onChange={setBoyNak}
                accent="focus:ring-blue-400"
              />
              <RasiDisplay rasi={boyRasi} />
            </div>

            {/* girl */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-pink-500 text-xl">♀</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">Girl</span>
              </div>
              <NakshtraSelect
                label="Birth Star (Nakshatra)"
                value={girlNak}
                onChange={setGirlNak}
                accent="focus:ring-pink-400"
              />
              <RasiDisplay rasi={girlRasi} />
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl font-semibold text-white text-sm
              bg-gradient-to-r from-orange-500 to-amber-500
              hover:from-orange-600 hover:to-amber-600
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-200 shadow hover:shadow-md active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Calculating…
              </span>
            ) : 'Check Compatibility'}
          </button>

          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30
              border border-red-200 dark:border-red-700 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* ── results ── */}
        {result && (
          <>
            {/* score card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border
              border-gray-100 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreRing
                  percentage={result.percentage}
                  score={result.score}
                  rajjuDosha={result.rajjuDosha}
                />
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {result.boy.nakshatra} ({result.boy.rasi})
                    {' '}×{' '}
                    {result.girl.nakshatra} ({result.girl.rasi})
                  </p>
                  <RecommendationBadge
                    recommendation={result.recommendation}
                    rajjuDosha={result.rajjuDosha}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {result.score} of 10 poruthams matched
                  </p>
                </div>
              </div>
            </div>

            {/* rajju dosha alert */}
            {result.rajjuDosha && (
              <div className="flex items-start gap-4 px-5 py-4 rounded-2xl
                bg-red-50 dark:bg-red-900/25
                border border-red-200 dark:border-red-700">
                <span className="text-2xl mt-0.5">⚠️</span>
                <div>
                  <p className="font-bold text-red-700 dark:text-red-400">Rajju Dosha Detected</p>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-0.5">
                    Traditional astrology does not recommend this match.
                    Both partners share the same Rajju group, which is considered
                    highly inauspicious and may lead to separation or loss.
                  </p>
                </div>
              </div>
            )}

            {/* porutham table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border
              border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-800 dark:text-white">10 Porutham Details</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/60">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500
                        dark:text-gray-400 uppercase tracking-wider w-40">
                        Porutham
                      </th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500
                        dark:text-gray-400 uppercase tracking-wider w-28">
                        Status
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500
                        dark:text-gray-400 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {result.poruthams.map((p, i) => (
                      <tr
                        key={i}
                        className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40
                          ${p.critical && !p.compatible
                            ? 'bg-red-50/60 dark:bg-red-900/10'
                            : ''}`}
                      >
                        {/* name */}
                        <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-200">
                          <span>{p.name}</span>
                          {p.critical && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-orange-100
                              dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 font-medium">
                              critical
                            </span>
                          )}
                        </td>

                        {/* status badge */}
                        <td className="px-4 py-3.5 text-center">
                          {p.compatible ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                              text-xs font-semibold
                              bg-green-100 text-green-700
                              dark:bg-green-900/40 dark:text-green-400">
                              ✓ Pass
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                              text-xs font-semibold
                              bg-red-100 text-red-700
                              dark:bg-red-900/40 dark:text-red-400">
                              ✗ Fail
                            </span>
                          )}
                        </td>

                        {/* description */}
                        <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">
                          {p.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* score footer */}
                  <tfoot>
                    <tr className="bg-gray-50 dark:bg-gray-700/60 border-t border-gray-200
                      dark:border-gray-600">
                      <td colSpan={2} className="px-5 py-3 font-semibold text-gray-700
                        dark:text-gray-200 text-sm">
                        Total Score
                      </td>
                      <td className="px-5 py-3 font-bold text-gray-800 dark:text-white">
                        {result.score} / 10 &nbsp;
                        <span className="text-gray-400 font-normal">({result.percentage}%)</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border
              border-gray-100 dark:border-gray-700 p-6">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-4">Summary</h2>
              <div className="space-y-3">
                <div className="px-4 py-3.5 rounded-xl
                  bg-amber-50 dark:bg-amber-900/20
                  border border-amber-100 dark:border-amber-800/50">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400
                    uppercase tracking-wider mb-1.5">
                    தமிழ்
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {result.summaryTamil}
                  </p>
                </div>
                <div className="px-4 py-3.5 rounded-xl
                  bg-blue-50 dark:bg-blue-900/20
                  border border-blue-100 dark:border-blue-800/50">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400
                    uppercase tracking-wider mb-1.5">
                    English
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {result.summaryEnglish}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4">
          AstroJyothi · Results are for reference only
        </p>
      </div>
    </div>
  );
};

export default MarriageCompatibility;
