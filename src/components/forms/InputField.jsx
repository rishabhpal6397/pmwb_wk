
import React, { useState } from 'react';

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  readOnly = false,
  pattern,        // regex pattern as string (e.g., "^[A-Za-z\\s]+$")
  patternErrorMessage = 'Invalid input format',
  ...props
}) => {
  const [error, setError] = useState('');

  const validate = (val) => {
    if (!pattern) return true;
    // Allow empty value if not required
    if (!required && val === '') return true;
    const regex = new RegExp(pattern);
    return regex.test(val);
  };

  const handleBlur = (e) => {
    const val = e.target.value;
    if (required && !val.trim()) {
      setError(`${label} is required`);
    } else if (pattern && !validate(val)) {
      setError(patternErrorMessage);
    } else {
      setError('');
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(e);
    // Clear error if current value becomes valid
    if (error) {
      if (!required || val.trim()) {
        if (!pattern || validate(val)) {
          setError('');
        }
      }
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={readOnly}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-blue-500 focus:border-blue-500`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;