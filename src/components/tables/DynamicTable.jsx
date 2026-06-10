import React, { useState } from 'react';
import TableHeader from './TableHeader';
import EditableCell from './EditableCell';
import ReadonlyCell from './ReadonlyCell';

const DynamicTable = ({ columns, rows, onCellChange, onAddRow, onDeleteRow, isLoading }) => {
  const [editingCell, setEditingCell] = useState(null);

  const handleEdit = (rowId, field) => setEditingCell({ rowId, field });
  const handleSave = (rowId, field, newValue) => {
    onCellChange(rowId, field, newValue);
    setEditingCell(null);
  };
  const handleCancel = () => setEditingCell(null);

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeader columns={columns} />
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) => {
                const isEditing = editingCell?.rowId === row.id && editingCell?.field === col.field;
                const value = row[col.field];
                if (isEditing && col.editable) {
                  return (
                    <td key={col.field} className="px-4 py-2">
                      <EditableCell
                        value={value}
                        type={col.type || 'text'}
                        options={col.options}
                        onSave={(newVal) => handleSave(row.id, col.field, newVal)}
                        onCancel={handleCancel}
                      />
                    </td>
                  );
                }
                return (
                  <td
                    key={col.field}
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => col.editable && handleEdit(row.id, col.field)}
                  >
                    <ReadonlyCell value={value} type={col.type} />
                  </td>
                );
              })}
              {onDeleteRow && (
                <td className="px-4 py-2 text-center">
                  <button onClick={() => onDeleteRow(row.id)} className="text-red-600 hover:text-red-800">
                    🗑️
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {onAddRow && (
        <div className="p-2 border-t border-gray-200">
          <button onClick={onAddRow} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            + Add Row
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;