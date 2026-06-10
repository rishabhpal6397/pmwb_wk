import React from 'react';

const StatusCard = ({ title, status, description }) => {
  const statusColor = {
    'On Track': 'bg-green-100 text-green-800',
    'At Risk': 'bg-yellow-100 text-yellow-800',
    Delayed: 'bg-red-100 text-red-800',
    Completed: 'bg-blue-100 text-blue-800',
  }[status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h3 className="text-md font-semibold text-gray-800">{title}</h3>
      <div className={`mt-2 inline-block px-2 py-1 rounded text-sm ${statusColor}`}>{status}</div>
      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
    </div>
  );
};

export default StatusCard;