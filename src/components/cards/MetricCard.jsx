import React from 'react';

const MetricCard = ({ label, value, target, unit, trend }) => {
  const trendIcon = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●';
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {unit && <p className="ml-1 text-sm text-gray-500">{unit}</p>}
      </div>
      {target && (
        <p className="mt-2 text-sm text-gray-600">Target: {target}</p>
      )}
      {trend && (
        <p className={`mt-1 text-sm ${trendColor}`}>
          {trendIcon} {trend}
        </p>
      )}
    </div>
  );
};

export default MetricCard;