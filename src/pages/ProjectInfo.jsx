import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import InputField from '../components/forms/InputField';
import DateField from '../components/forms/DateField';
import SelectField from '../components/forms/SelectField';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import DynamicTable from '../components/tables/DynamicTable';
import {infostatusOptions, infocategoryOptions, infotypeOptions} from '../data/dropdownOptions';

const ProjectInfoPage = () => {
  const { projectInfo, projectExtended, updateProjectInfo, updateProjectExtended, versionHistory, addVersionEntry, updateVersionEntry, removeVersionEntry, offshoreEfforts, onsiteEfforts } = useAppStore();

//    --- Calculated fields from PSR data ---
  const actualEffortConsumed = useMemo(() => {
    // Sum all actual efforts from offshore + onsite (cumulative)
    const offshoreActual = Object.values(offshoreEfforts).reduce((sum, cat) => sum + (cat.actual || 0), 0);
    const onsiteActual = Object.values(onsiteEfforts).reduce((sum, cat) => sum + (cat.actual || 0), 0);
    return offshoreActual + onsiteActual;
  }, [offshoreEfforts, onsiteEfforts]);

  const approvedEffort = useMemo(() => {
  return (projectInfo.estimatedEffort * 0.9).toFixed(2);
}, [projectInfo.estimatedEffort]);

  const remainingEffort = approvedEffort - actualEffortConsumed;

  const actualOnsiteFTEs = useMemo(() => {
    const onsiteActual = Object.values(onsiteEfforts).reduce((sum, cat) => sum + (cat.actual || 0), 0);
    return (onsiteActual / 8).toFixed(2);
  }, [onsiteEfforts]);

  const actualOffshoreFTEs = useMemo(() => {
    const offshoreActual = Object.values(offshoreEfforts).reduce((sum, cat) => sum + (cat.actual || 0), 0);
    return (offshoreActual / 8).toFixed(2);
  }, [offshoreEfforts]);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    updateProjectInfo({ [name]: value });
  };

  const handleExtendedChange = (e) => {
    const { name, value } = e.target;
    updateProjectExtended({ [name]: value });
  };

  const handleDateChange = (name, date) => {
    updateProjectInfo({ [name]: date });
  };

  // Version table columns
  const versionColumns = [
    { field: 'date', header: 'Date', editable: true, type: 'date' },
    { field: 'versionNo', header: 'Version No.', editable: true, type: 'text' },
    { field: 'changes', header: 'Changes', editable: true, type: 'text' },
    { field: 'updatedBy', header: 'Updated by', editable: true, type: 'text' },
  ];

   const handleVersionCellChange = (rowId, field, newValue) => {
    // rowId is the index in the array (we store index as id)
    updateVersionEntry(rowId, { [field]: newValue });
  };

  const handleAddVersion = () => {
    addVersionEntry({
      date: new Date().toISOString().split('T')[0],
      versionNo: '',
      changes: '',
      updatedBy: '',
    });
  };

  const handleDeleteVersion = (index) => {
    removeVersionEntry(index);
  };



  return (
    <div>
      <PageHeader
        title="Project Information"
        subtitle="Manage project details and extended attributes"
        actions={[
          <Button key="save" variant="primary" onClick={() => alert('Saved automatically via localStorage')}>
            Save (Auto)
          </Button>,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column – Main Project Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h2>
          <div className="space-y-4">
            <InputField
              label="Project Name"
              name="name"
              value={projectInfo.name}
              onChange={handleInfoChange}
              required
            />
            <InputField
              label="Project Code / PIN"
              name="code"
              value={projectInfo.code}
              onChange={handleInfoChange}
            />
            <SelectField
              label="Status"
              name="status"
              options={infostatusOptions}
              value={projectInfo.status}
              onChange={handleInfoChange}
            />
            <SelectField
              label="Project Category"
              name="category"
              options={infocategoryOptions}
              value={projectInfo.category}
              onChange={handleInfoChange}
            />
            <SelectField
              label="Project Type"
              name="type"
              options={infotypeOptions}
              value={projectInfo.type}
              onChange={handleInfoChange}
            />
            <InputField
              label="Customer Name"
              name="customer"
              value={projectInfo.customer}
              onChange={handleInfoChange}
            />
            <InputField
              label="Customer Line of Business"
              name="customerLOB"
              value={projectInfo.customerLOB}
              onChange={handleInfoChange}
            />
            <InputField
              label="Primary Contact"
              name="primaryContact"
              value={projectInfo.primaryContact}
              onChange={handleInfoChange}
              placeholder="Name / Email / Phone"
            />
          </div>
        </div>

        {/* Right Column – Dates & Effort */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Schedule & Effort</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <DateField
                label="Project Start Date (SOW)"
                name="startDateSOW"
                selected={projectInfo.startDateSOW}
                onChange={(e) => handleDateChange(e.target.name, e.target.value)}
                />
                <DateField
                label="Project End Date (SOW)"
                name="endDateSOW"
                selected={projectInfo.endDateSOW}
                onChange={(e) => handleDateChange(e.target.name, e.target.value)}
                />
                <DateField
                label="Plan Start Date"
                name="planStart"
                selected={projectInfo.planStart}
                onChange={(e) => handleDateChange(e.target.name, e.target.value)}
                />
                <DateField
                label="Plan Completion Date"
                name="planEnd"
                selected={projectInfo.planEnd}
                onChange={(e) => handleDateChange(e.target.name, e.target.value)}
                />
                <DateField
                label="Revised Plan Start Date"
                name="revisedPlanStart"
                selected={projectInfo.revisedPlanStart}
                onChange={(e) => handleDateChange(e.target.name, e.target.value)}
                />
                <DateField
                label="Revised Plan Completion Date"
                name="revisedPlanEnd"
                selected={projectInfo.revisedPlanEnd}
                onChange={(e) => handleDateChange(e.target.name, e.target.value)}
                />
                <DateField
                label="Actual Start Date"
                name="actualStart"
                selected={projectInfo.actualStart}
                onChange={(e) => handleDateChange(e.target.name, e.target.value)}
                />
                <DateField
                label="Actual Completion Date"
                name="actualEnd"
                selected={projectInfo.actualEnd}
                onChange={(e) => handleDateChange(e.target.name, e.target.value)}
                />
            </div>
            {/* Effort fields */}
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Estimated Effort (Hrs)" name="estimatedEffort" type="number" value={projectInfo.estimatedEffort} onChange={handleInfoChange} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approved Effort (Hrs)
                </label>
                <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700">
                    {approvedEffort}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-sm font-medium text-gray-500">Actual Effort Consumed (Hrs)</label>
                <p className="text-lg font-semibold">{actualEffortConsumed}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-sm font-medium text-gray-500">Remaining Effort (Hrs)</label>
                <p className="text-lg font-semibold">{remainingEffort >= 0 ? remainingEffort : 0}</p>
              </div>
            </div>

            {/* FTE fields */}
            <div className="grid grid-cols-2 gap-4">
              <InputField label="SOW Onsite FTEs" name="onsiteFTEs" type="number" value={projectInfo.onsiteFTEs} onChange={handleInfoChange} />
              <InputField label="SOW Offshore FTEs" name="offshoreFTEs" type="number" value={projectInfo.offshoreFTEs} onChange={handleInfoChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-sm font-medium text-gray-500">Actual Onsite FTEs</label>
                <p className="text-lg font-semibold">{actualOnsiteFTEs}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-sm font-medium text-gray-500">Actual Offshore FTEs</label>
                <p className="text-lg font-semibold">{actualOffshoreFTEs}</p>
              </div>
            </div>
          </div>
        </div>

         {/* Version History Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Version History</h2>
          <DynamicTable
            columns={versionColumns}
            rows={versionHistory.map((v, idx) => ({ id: idx, ...v }))}
            onCellChange={handleVersionCellChange}
            onAddRow={handleAddVersion}
            onDeleteRow={handleDeleteVersion}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoPage;