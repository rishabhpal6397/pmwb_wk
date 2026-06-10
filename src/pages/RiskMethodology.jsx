// src/pages/risks/RiskMethodologyPage.jsx
import React from 'react';
import PageHeader from '../components/layout/PageHeader';

const RiskMethodologyPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Management - Methodology"
        subtitle="Probability & Impact scales, risk index calculation, and treatment criteria"
      />

      {/* Probability Scale */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Probability Scale</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Probability</th>
                <th className="border p-2 text-left">Value</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-medium">Almost Certain</td>
                <td className="border p-2 text-center">0.9</td>
                <td className="border p-2">Very High Likelihood of occurrence (almost inevitable); occurrence is expected; It would be surprising if this does not happen; Likely to occur once in 3-6 months or known incident in last 3-6 months</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-medium">Often</td>
                <td className="border p-2 text-center">0.7</td>
                <td className="border p-2">High Likelihood of occurrence; occurrence is probable; more likely to happen than not. Likely to occur within 1 year or known incident in last 1 year</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">Likely</td>
                <td className="border p-2 text-center">0.5</td>
                <td className="border p-2">Moderate Likelihood of occurrence; occurrence is occasional; just as likely to happen as not. Likely to occur within 1-3 years or known incident in last 1-3 years</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-medium">Possible</td>
                <td className="border p-2 text-center">0.3</td>
                <td className="border p-2">Low Likelihood of occurrence; occurrence is unusual; less likely to happen than not. Likely to occur within 3-5 years or known incident in last 3-5 years</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">Rare</td>
                <td className="border p-2 text-center">0.1</td>
                <td className="border p-2">Very Low Likelihood of occurrence; occurrence is unprecedented; It would be surprising if this does happen. Likely to occur within 10 years or known incident in last 10 years or has happened in past</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Impact Scale */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Impact Scale</h2>
        <p className="text-sm text-gray-600 mb-2">Possible impact values of risk on <strong>Cost, Schedule, Scope, Quality, Regulatory</strong> are as follows:</p>
        <div className="overflow-x-auto">
          <table className=" border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-center">Impact</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border p-2 text-center">0</td><td className="border p-2">Not Applicable</td></tr>
              <tr className="bg-gray-50"><td className="border p-2 text-center">1</td><td className="border p-2">Insignificant</td></tr>
              <tr><td className="border p-2 text-center">3</td><td className="border p-2">Minor</td></tr>
              <tr className="bg-gray-50"><td className="border p-2 text-center">5</td><td className="border p-2">Moderate</td></tr>
              <tr><td className="border p-2 text-center">7</td><td className="border p-2">Major</td></tr>
              <tr className="bg-gray-50"><td className="border p-2 text-center">9</td><td className="border p-2">Catastrophic</td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
          <p className="font-semibold">Note:</p>
          <p>The <strong>Initial Probability and Impact</strong> values reflect the risk assessment as of the date the risk was identified, prior to any controls being implemented (risk calculated without controls).</p>
          <p className="mt-1">The <strong>Current Probability and Impact</strong> values represent the risk assessment as of the date the risk was reviewed or addressed, after controls have been applied (risk calculated with controls).</p>
        </div>
      </div>

      {/* Normalized Impact & Risk Index Calculation */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Risk Index Calculation</h2>
        <div className="space-y-2">
          <p><strong>Normalized Impact</strong> = Average of the five impact categories: Cost Impact, Schedule Impact, Scope Impact, Quality Impact, and Regulatory Impact.</p>
          <p><strong>Risk Index</strong> = Normalized Impact × Probability</p>
        </div>
      </div>

      {/* Risk Treatment Plan */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Risk Treatment Plan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-medium">Accept</td>
                <td className="border p-2">Formally acknowledging and accepting the residual risk based on an informed decision, where the risk level is deemed tolerable in relation to the organization’s risk criteria.</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-medium">Transfer</td>
                <td className="border p-2">Sharing or transferring the impact of a risk to a third party (e.g., through contractual arrangements, outsourcing, or insurance) while retaining accountability for managing the risk.</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">Avoid</td>
                <td className="border p-2">Eliminating the risk by discontinuing the activities that cause it or by adopting alternative, less risky processes, technologies, or policies.</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-medium">Mitigate</td>
                <td className="border p-2">Implementing risk controls to reduce the likelihood of occurrence and/or the potential impact of a risk to an acceptable level.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Acceptance Criteria */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Risk Acceptance Criteria</h2>
        <div className="p-3 bg-green-50 rounded text-sm">
          <p>Risks with a <strong>Risk Index – Current</strong> of less than <strong>1.5</strong> are considered acceptable and will not be subjected to additional risk treatment.</p>
          <p className="mt-1">Risks with a Risk Value of 1.5 or higher will be addressed through one or more of the four defined risk treatment methods: <strong>Accept, Avoid, Mitigate, Transfer</strong>.</p>
        </div>
      </div>
    </div>
  );
};

export default RiskMethodologyPage;