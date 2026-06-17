// src/pages/resources/ResourcesPage.jsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import ConfirmModal from '../components/common/ConfirmModal';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import { RESOURCE_LEVELS, RESOURCE_TYPES, RESOURCE_AVAILABILITY_STATUS } from '../data/dropdownOptions';
import { PATTERNS } from '../utils/constants';
import { useFormValidation } from '../utils/useFormValidation';

// Helper for deviation and billable calculations (moved outside component for reusability)
const computeDeviation = (planned, actual) => {
  if (!planned || planned === 0) return '-';
  return (((planned - actual) / planned) * 100).toFixed(1) + '%';
};

const computeBillablePercent = (plannedOff, actualOff, plannedOn, actualOn) => {
  const totalPlanned = parseInt(plannedOff) + parseInt(plannedOn);
  const totalActual = parseInt(actualOff) + parseInt(actualOn);
  return {
    plannedPercent: (totalPlanned / 160 * 100).toFixed(1),
    actualPercent: (totalActual / 160 * 100).toFixed(1),
  };
};

// Helper to render a summary table (Type or Level)
const SummaryTable = ({ title, data, computeDeviation }) => (
  <div className="bg-white rounded-lg shadow">
    <h3 className="text-lg font-semibold px-4 pt-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">{title.includes('Type') ? 'Type' : 'Level'}</th>
            <th className="px-4 py-2 text-left">Offshore Planned</th>
            <th className="px-4 py-2 text-left">Offshore Actual</th>
            <th className="px-4 py-2 text-left">Offshore Dev.</th>
            <th className="px-4 py-2 text-left">Onsite Planned</th>
            <th className="px-4 py-2 text-left">Onsite Actual</th>
            <th className="px-4 py-2 text-left">Onsite Dev.</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, values]) => (
            <tr key={key}>
              <td className="px-4 py-2">{key}</td>
              <td className="px-4 py-2">{values.offshorePlanned}</td>
              <td className="px-4 py-2">{values.offshoreActual}</td>
              <td className="px-4 py-2">{computeDeviation(values.offshorePlanned, values.offshoreActual)}</td>
              <td className="px-4 py-2">{values.onsitePlanned}</td>
              <td className="px-4 py-2">{values.onsiteActual}</td>
              <td className="px-4 py-2">{computeDeviation(values.onsitePlanned, values.onsiteActual)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ResourcesPage = () => {
  const {
    resources,
    addResource,
    updateResource,
    removeResource,
    getResourceTotalsByType,
    getResourceTotalsByLevel,
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [formData, setFormData] = useState({
    employeeCode: '',
    name: '',
    level: 'L1',
    type: 'SEG',
    offshorePlanned: 0,
    offshoreActual: 0,
    onsitePlanned: 0,
    onsiteActual: 0,
    availabilityStatus: 'Available',
  });

  const validationRules = {
    employeeCode: {
      required: true,
      pattern: PATTERNS.ALPHANUMERIC_SPACES,
      message: 'Employee code can only contain letters, numbers, and spaces',
      label: 'Employee Code',
    },
    name: {
      required: true,
      pattern: PATTERNS.ALPHABETS_SPACES,
      message: 'Name can only contain letters and spaces',
      label: 'Name',
    },
  };

  const { validateAll, errors } = useFormValidation(validationRules);
  const typeSummary = useMemo(() => getResourceTotalsByType(), [resources, getResourceTotalsByType]);
  const levelSummary = useMemo(() => getResourceTotalsByLevel(), [resources, getResourceTotalsByLevel]);

  // Modal handlers
  const handleAddResource = () => {
    setEditingResource(null);
    setFormData({
      employeeCode: '',
      name: '',
      level: 'L1',
      type: 'SEG',
      offshorePlanned: 0,
      offshoreActual: 0,
      onsitePlanned: 0,
      onsiteActual: 0,
      availabilityStatus: 'Available',
    });
    setIsModalOpen(true);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setFormData(resource);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    removeResource(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: null });
    setToast({ message: 'Resource deleted successfully', type: 'success' });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!validateAll(formData)) return;
    if (editingResource) {
      updateResource(editingResource.id, formData);
      setToast({ message: 'Resource updated successfully', type: 'success' });
    } else {
      addResource(formData);
      setToast({ message: 'Resource added successfully', type: 'success' });
    }
    setIsModalOpen(false);
  };

  // Main resource table columns definition (for rendering consistency)
  const tableHeaders = [
    'Emp. Code', 'Name', 'Level', 'Type',
    'Offshore Planned', 'Offshore Actual', 'Offshore Dev.',
    'Onsite Planned', 'Onsite Actual', 'Onsite Dev.',
    'Availability', 'Billable % (Planned)', 'Billable % (Actual)', 'Actions'
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resources"
        subtitle="Manage team members, track planned/actual effort, and view summaries by type/level"
        actions={[<Button key="add" variant="primary" onClick={handleAddResource}>+ Add Resource</Button>]}
      />

      {/* Main Resource Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {tableHeaders.map(header => (
                <th key={header} className="px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {resources.map((r) => {
              const offDev = computeDeviation(r.offshorePlanned, r.offshoreActual);
              const onDev = computeDeviation(r.onsitePlanned, r.onsiteActual);
              const { plannedPercent, actualPercent } = computeBillablePercent(
                r.offshorePlanned, r.offshoreActual,
                r.onsitePlanned, r.onsiteActual
              );
              return (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{r.employeeCode}</td>
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.level}</td>
                  <td className="px-4 py-2">{r.type}</td>
                  <td className="px-4 py-2">{r.offshorePlanned}</td>
                  <td className="px-4 py-2">{r.offshoreActual}</td>
                  <td className="px-4 py-2">{offDev}</td>
                  <td className="px-4 py-2">{r.onsitePlanned}</td>
                  <td className="px-4 py-2">{r.onsiteActual}</td>
                  <td className="px-4 py-2">{onDev}</td>
                  <td className="px-4 py-2">{r.availabilityStatus}</td>
                  <td className="px-4 py-2">{plannedPercent}%</td>
                  <td className="px-4 py-2">{actualPercent}%</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleEditResource(r)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button onClick={() => handleDeleteClick(r.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              );
            })}
            {resources.length === 0 && (
              <tr><td colSpan={tableHeaders.length} className="text-center py-4 text-gray-500">No resources added. Click "Add Resource" to begin.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Tables – using reusable helper component */}
      <SummaryTable title="Resource Type Summary" data={typeSummary} computeDeviation={computeDeviation} />
      <SummaryTable title="Resource Level Summary" data={levelSummary} computeDeviation={computeDeviation} />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResource ? 'Edit Resource' : 'Add Resource'}
        onConfirm={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Employee Code"
            name="employeeCode"
            value={formData.employeeCode}
            onChange={handleFormChange}
            required
            error={errors.employeeCode}
          />
          <InputField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
            error={errors.name}
          />
          <SelectField label="Level" name="level" options={RESOURCE_LEVELS} value={formData.level} onChange={handleFormChange} />
          <SelectField label="Resource Type" name="type" options={RESOURCE_TYPES} value={formData.type} onChange={handleFormChange} />
          <InputField label="Offshore Planned (Hrs)" name="offshorePlanned" type="number" value={formData.offshorePlanned} onChange={handleFormChange} />
          <InputField label="Offshore Actual (Hrs)" name="offshoreActual" type="number" value={formData.offshoreActual} onChange={handleFormChange} />
          <InputField label="Onsite Planned (Hrs)" name="onsitePlanned" type="number" value={formData.onsitePlanned} onChange={handleFormChange} />
          <InputField label="Onsite Actual (Hrs)" name="onsiteActual" type="number" value={formData.onsiteActual} onChange={handleFormChange} />
          <SelectField label="Availability Status" name="availabilityStatus" options={RESOURCE_AVAILABILITY_STATUS} value={formData.availabilityStatus} onChange={handleFormChange} />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this resource? This action cannot be undone."
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ResourcesPage;