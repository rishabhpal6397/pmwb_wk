import React from 'react';
import { formatDate, formatNumber, formatPercentage } from '../../utils/formatters';

const ReadonlyCell = ({ value, type }) => {
  if (value === undefined || value === null) return <span className="text-gray-400">—</span>;
  switch (type) {
    case 'date':
      return <span>{formatDate(value)}</span>;
    case 'number':
      return <span>{formatNumber(value)}</span>;
    case 'percentage':
      return <span>{formatPercentage(value)}</span>;
    case 'currency':
      return <span>${formatNumber(value)}</span>;
    default:
      return <span>{value}</span>;
  }
};

export default ReadonlyCell;