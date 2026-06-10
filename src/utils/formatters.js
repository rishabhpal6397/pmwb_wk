export const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
export const formatNumber = (num, decimals = 2) => num !== undefined && num !== null ? Number(num).toFixed(decimals) : '';
export const formatPercentage = (value) => value !== undefined && value !== null ? `${Number(value).toFixed(1)}%` : '';
export const formatCurrency = (value) => value !== undefined && value !== null ? `$${Number(value).toFixed(2)}` : '';