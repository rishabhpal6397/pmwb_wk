import React, { useState } from 'react';

const TableHeader = ({ columns, sortable = false, onSort, onDeleteRow }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (!sortable) return;
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  };

  return (
    <thead className="bg-gray-100">
      <tr>
        {columns.map((col) => (
          <th
            key={col.field}
            className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b cursor-pointer hover:bg-gray-200"
            onClick={() => handleSort(col.field)}
          >
            {col.header}
            {sortable && sortField === col.field && (
              <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
            )}
          </th>
        ))}
        {onDeleteRow && <th style={{ width: '50px' }}>Actions</th>}
      </tr>
    </thead>
  );
};

export default TableHeader;