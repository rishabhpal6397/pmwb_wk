// src/pages/verification/VerificationSummaryPage.jsx
import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';

const VerificationSummaryPage = () => {
  const { verificationEntries = [] } = useAppStore();

  // Helper: build summary for internal or external entries
  const buildSummary = (entries, type) => {
    const filtered = entries.filter(e => e.type === type);
    const phases = [
      'Analysis and Design',
      'Coding and unit testing',
      'System Integration testing',
      'User acceptance testing',
      'Production deployment',
      'Post production support',
    ];

    const summary = phases.map(phase => {
      const phaseEntries = filtered.filter(e => e.phase === phase);
      // Separate review and testing
      const review = phaseEntries.filter(e => e.verificationActivity?.toLowerCase().includes('review'));
      const testing = phaseEntries.filter(e => !e.verificationActivity?.toLowerCase().includes('review'));

      const reviewAgg = review.reduce(
        (acc, e) => {
          acc.effort += e.actualEffort || 0;
          acc.major += e.majorDefects || 0;
          acc.minor += e.minorDefects || 0;
          acc.trivial += e.trivialDefects || 0;
          acc.rework += e.actualRework || 0;
          acc.totalSize += e.totalPlannedEffort || 0;
          return acc;
        },
        { effort: 0, major: 0, minor: 0, trivial: 0, rework: 0, totalSize: 0 }
      );

      const testingAgg = testing.reduce(
        (acc, e) => {
          acc.effort += e.actualEffort || 0;
          acc.major += e.majorDefects || 0;
          acc.minor += e.minorDefects || 0;
          acc.trivial += e.trivialDefects || 0;
          acc.rework += e.actualRework || 0;
          acc.totalSize += e.totalPlannedEffort || 0;
          return acc;
        },
        { effort: 0, major: 0, minor: 0, trivial: 0, rework: 0, totalSize: 0 }
      );

      return { phase, review: reviewAgg, testing: testingAgg };
    });

    // Only include phases that have any data
    return summary.filter(
      p => p.review.effort > 0 || p.testing.effort > 0 || p.review.major > 0 || p.testing.major > 0
    );
  };

  const internalSummary = useMemo(() => buildSummary(verificationEntries, 'Internal'), [verificationEntries]);
  const externalSummary = useMemo(() => buildSummary(verificationEntries, 'External'), [verificationEntries]);

  // Calculate totals
  const calcTotals = (summary) => {
    return summary.reduce(
      (acc, p) => {
        acc.review.effort += p.review.effort;
        acc.review.major += p.review.major;
        acc.review.minor += p.review.minor;
        acc.review.trivial += p.review.trivial;
        acc.review.rework += p.review.rework;
        acc.review.totalSize += p.review.totalSize;
        acc.testing.effort += p.testing.effort;
        acc.testing.major += p.testing.major;
        acc.testing.minor += p.testing.minor;
        acc.testing.trivial += p.testing.trivial;
        acc.testing.rework += p.testing.rework;
        acc.testing.totalSize += p.testing.totalSize;
        return acc;
      },
      {
        review: { effort: 0, major: 0, minor: 0, trivial: 0, rework: 0, totalSize: 0 },
        testing: { effort: 0, major: 0, minor: 0, trivial: 0, rework: 0, totalSize: 0 },
      }
    );
  };

  const renderTable = (title, summaryData) => {
    if (summaryData.length === 0) return null;
    const totals = calcTotals(summaryData);

    return (
      <div className="mb-10 bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold p-3 bg-gray-100 border-b">{title}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th rowSpan="2" className="border p-2 align-middle">Phase</th>
                <th colSpan="7" className="border p-2 text-center">Review</th>
                <th colSpan="7" className="border p-2 text-center">Testing</th>
              </tr>
              <tr>
                <th className="border p-2">Verification effort</th>
                <th className="border p-2">Total Size</th>
                <th className="border p-2">Major</th>
                <th className="border p-2">Minor</th>
                <th className="border p-2">Trivial</th>
                <th className="border p-2">Total defects</th>
                <th className="border p-2">Rework effort</th>
                <th className="border p-2">Testing effort</th>
                <th className="border p-2">Total Size</th>
                <th className="border p-2">Major</th>
                <th className="border p-2">Minor</th>
                <th className="border p-2">Trivial</th>
                <th className="border p-2">Total defects</th>
                <th className="border p-2">Rework effort</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row) => (
                <tr key={row.phase} className="hover:bg-gray-50">
                  <td className="border p-2 font-medium">{row.phase}</td>
                  {/* Review columns */}
                  <td className="border p-2 text-right">{row.review.effort}</td>
                  <td className="border p-2 text-right">{row.review.totalSize}</td>
                  <td className="border p-2 text-right">{row.review.major}</td>
                  <td className="border p-2 text-right">{row.review.minor}</td>
                  <td className="border p-2 text-right">{row.review.trivial}</td>
                  <td className="border p-2 text-right font-semibold">
                    {row.review.major + row.review.minor + row.review.trivial}
                  </td>
                  <td className="border p-2 text-right">{row.review.rework}</td>
                  {/* Testing columns */}
                  <td className="border p-2 text-right">{row.testing.effort}</td>
                  <td className="border p-2 text-right">{row.testing.totalSize}</td>
                  <td className="border p-2 text-right">{row.testing.major}</td>
                  <td className="border p-2 text-right">{row.testing.minor}</td>
                  <td className="border p-2 text-right">{row.testing.trivial}</td>
                  <td className="border p-2 text-right font-semibold">
                    {row.testing.major + row.testing.minor + row.testing.trivial}
                  </td>
                  <td className="border p-2 text-right">{row.testing.rework}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td className="border p-2">Total</td>
                <td className="border p-2 text-right">{totals.review.effort}</td>
                <td className="border p-2 text-right">{totals.review.totalSize}</td>
                <td className="border p-2 text-right">{totals.review.major}</td>
                <td className="border p-2 text-right">{totals.review.minor}</td>
                <td className="border p-2 text-right">{totals.review.trivial}</td>
                <td className="border p-2 text-right">{totals.review.major + totals.review.minor + totals.review.trivial}</td>
                <td className="border p-2 text-right">{totals.review.rework}</td>
                <td className="border p-2 text-right">{totals.testing.effort}</td>
                <td className="border p-2 text-right">{totals.testing.totalSize}</td>
                <td className="border p-2 text-right">{totals.testing.major}</td>
                <td className="border p-2 text-right">{totals.testing.minor}</td>
                <td className="border p-2 text-right">{totals.testing.trivial}</td>
                <td className="border p-2 text-right">{totals.testing.major + totals.testing.minor + totals.testing.trivial}</td>
                <td className="border p-2 text-right">{totals.testing.rework}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Summary"
        subtitle="Summary of defects and efforts from reviews and testing, separated by internal and external verification"
      />

      {renderTable('Internal Verification Defects', internalSummary)}
      {renderTable('External Verification Defects', externalSummary)}

      {verificationEntries.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No verification data available. Please add verification entries first.
        </div>
      )}
    </div>
  );
};

export default VerificationSummaryPage;