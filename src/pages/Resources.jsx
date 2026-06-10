import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import {RESOURCE_LEVELS, RESOURCE_TYPES, RESOURCE_AVAILABILITY_STATUS} from '../data/dropdownOptions';


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

  // Compute summary data
  const typeSummary = useMemo(() => getResourceTotalsByType(), [resources, getResourceTotalsByType]);
  const levelSummary = useMemo(() => getResourceTotalsByLevel(), [resources, getResourceTotalsByLevel]);

  // Handlers
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

  const handleDeleteResource = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      removeResource(id);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (editingResource) {
      updateResource(editingResource.id, formData);
    } else {
      addResource(formData);
    }
    setIsModalOpen(false);
  };

  // Helper: compute deviation
  const computeDeviation = (planned, actual) => {
    if (!planned || planned === 0) return '-';
    const dev = ((planned - actual) / planned) * 100;
    return dev.toFixed(1) + '%';
  };

  // Helper: compute billable %
  const computeBillablePercent = (plannedOff, actualOff, plannedOn, actualOn) => {
    const totalPlanned = parseInt(plannedOff) + parseInt(plannedOn);
    const totalActual = parseInt(actualOff) + parseInt(actualOn);
    const plannedPercent = totalPlanned / 160 * 100; 
    const actualPercent = totalActual / 160 * 100;
    return { plannedPercent: plannedPercent.toFixed(1), actualPercent: actualPercent.toFixed(1) };
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resources"
        subtitle="Manage team members, track planned/actual effort, and view summaries by type/level"
        actions={[
          <Button key="add" variant="primary" onClick={handleAddResource}>
            + Add Resource
          </Button>,
        ]}
      />

      {/* Main Resource Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Emp. Code</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Level</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Offshore Planned</th>
              <th className="px-4 py-2 text-left">Offshore Actual</th>
              <th className="px-4 py-2 text-left">Offshore Dev.</th>
              <th className="px-4 py-2 text-left">Onsite Planned</th>
              <th className="px-4 py-2 text-left">Onsite Actual</th>
              <th className="px-4 py-2 text-left">Onsite Dev.</th>
              <th className="px-4 py-2 text-left">Availability</th>
              <th className="px-4 py-2 text-left">Billable % (Planned)</th>
              <th className="px-4 py-2 text-left">Billable % (Actual)</th>
              <th className="px-4 py-2 text-left">Actions</th>
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
                    <button onClick={() => handleEditResource(r)} className="text-blue-600 hover:text-blue-800 mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteResource(r.id)} className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {resources.length === 0 && (
              <tr>
                <td colSpan="14" className="text-center py-4 text-gray-500">
                  No resources added. Click "Add Resource" to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary by Resource Type */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold px-4 pt-4">Resource Type Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Offshore Planned</th>
                <th className="px-4 py-2 text-left">Offshore Actual</th>
                <th className="px-4 py-2 text-left">Offshore Dev.</th>
                <th className="px-4 py-2 text-left">Onsite Planned</th>
                <th className="px-4 py-2 text-left">Onsite Actual</th>
                <th className="px-4 py-2 text-left">Onsite Dev.</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(typeSummary).map(([type, data]) => (
                <tr key={type}>
                  <td className="px-4 py-2">{type}</td>
                  <td className="px-4 py-2">{data.offshorePlanned}</td>
                  <td className="px-4 py-2">{data.offshoreActual}</td>
                  <td className="px-4 py-2">{computeDeviation(data.offshorePlanned, data.offshoreActual)}</td>
                  <td className="px-4 py-2">{data.onsitePlanned}</td>
                  <td className="px-4 py-2">{data.onsiteActual}</td>
                  <td className="px-4 py-2">{computeDeviation(data.onsitePlanned, data.onsiteActual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary by Resource Level */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold px-4 pt-4">Resource Level Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Level</th>
                <th className="px-4 py-2 text-left">Offshore Planned</th>
                <th className="px-4 py-2 text-left">Offshore Actual</th>
                <th className="px-4 py-2 text-left">Offshore Dev.</th>
                <th className="px-4 py-2 text-left">Onsite Planned</th>
                <th className="px-4 py-2 text-left">Onsite Actual</th>
                <th className="px-4 py-2 text-left">Onsite Dev.</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(levelSummary).map(([level, data]) => (
                <tr key={level}>
                  <td className="px-4 py-2">{level}</td>
                  <td className="px-4 py-2">{data.offshorePlanned}</td>
                  <td className="px-4 py-2">{data.offshoreActual}</td>
                  <td className="px-4 py-2">{computeDeviation(data.offshorePlanned, data.offshoreActual)}</td>
                  <td className="px-4 py-2">{data.onsitePlanned}</td>
                  <td className="px-4 py-2">{data.onsiteActual}</td>
                  <td className="px-4 py-2">{computeDeviation(data.onsitePlanned, data.onsiteActual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
          />
          <InputField label="Name" name="name" value={formData.name} onChange={handleFormChange} required />
          <SelectField label="Level" name="level" options={RESOURCE_LEVELS} value={formData.level} onChange={handleFormChange} />
          <SelectField label="Resource Type" name="type" options={RESOURCE_TYPES} value={formData.type} onChange={handleFormChange} />
          <InputField
            label="Offshore Planned (Hrs)"
            name="offshorePlanned"
            type="number"
            value={formData.offshorePlanned}
            onChange={handleFormChange}
          />
          <InputField
            label="Offshore Actual (Hrs)"
            name="offshoreActual"
            type="number"
            value={formData.offshoreActual}
            onChange={handleFormChange}
          />
          <InputField
            label="Onsite Planned (Hrs)"
            name="onsitePlanned"
            type="number"
            value={formData.onsitePlanned}
            onChange={handleFormChange}
          />
          <InputField
            label="Onsite Actual (Hrs)"
            name="onsiteActual"
            type="number"
            value={formData.onsiteActual}
            onChange={handleFormChange}
          />
          <SelectField
            label="Availability Status"
            name="availabilityStatus"
            options={RESOURCE_AVAILABILITY_STATUS}
            value={formData.availabilityStatus}
            onChange={handleFormChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ResourcesPage;