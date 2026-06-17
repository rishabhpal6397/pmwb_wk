// src/pages/project-info/ProjectInfoPage.jsx
import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import InputField from '../components/forms/InputField';
import DateField from '../components/forms/DateField';
import SelectField from '../components/forms/SelectField';
import PageHeader from '../components/layout/PageHeader';
import ConfirmModal from '../components/common/ConfirmModal';
import Toast from '../components/common/Toast';
import Button from '../components/common/Button';
import DynamicTable from '../components/tables/DynamicTable';
import { infostatusOptions, infocategoryOptions, infotypeOptions } from '../data/dropdownOptions';
import { PATTERNS } from '../utils/constants';
import { useFormValidation } from '../utils/useFormValidation';

const ProjectInfoPage = () => {
  const { projectInfo, projectExtended, updateProjectInfo, updateProjectExtended, versionHistory, addVersionEntry, updateVersionEntry, removeVersionEntry, offshoreEfforts, onsiteEfforts, getTotalCumulativeEffort,
  getTotalPlannedEffort,getActualOffshoreFTEs,
  getActualOnsiteFTEs, } = useAppStore();

  const [toast, setToast] = React.useState(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState({ isOpen: false, index: null });
  // Define validation rules for projectInfo fields
  const validationRules = {
    name: {
      required: true,
      pattern: PATTERNS.ALPHABETS_SPACES,
      message: 'Project name can only contain letters and spaces',
      label: 'Project Name',
    },
    code: {
      pattern: PATTERNS.ALPHANUMERIC_SPACES,
      message: 'Project code can only contain letters, numbers, and spaces',
      label: 'Project Code / PIN',
    },
    customer: {
      pattern: PATTERNS.ALPHABETS_SPACES,
      message: 'Customer name can only contain letters and spaces',
      label: 'Customer Name',
    },
    primaryContact: {
      pattern: PATTERNS.TEXT_WITH_PUNCTUATION,
      message: 'Only letters, spaces, and basic punctuation allowed',
      label: 'Primary Contact',
    },
  };

  // Use the hook with projectInfo as initial values
  const { values: formValues, errors, handleChange, setFieldValue, validateAll } = useFormValidation(projectInfo, validationRules);

  // Wrapper to update the store when a field is validated and changed
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);
    
    if (!errors[name]) {
      updateProjectInfo({ [name]: value });
    } else {
      // Optionally show a toast or ignore – data not saved.
      console.warn(`Invalid ${name}, not updating store`);
    }
  };

  const handleDateChange = (name, date) => {
    updateProjectInfo({ [name]: date });
    setFieldValue(name, date);
  };

  const handleExtendedChange = (e) => {
    const { name, value } = e.target;
    updateProjectExtended({ [name]: value });
  };

  const actualEffortConsumed = getTotalCumulativeEffort();

  const approvedEffort = useMemo(() => (projectInfo.estimatedEffort * 0.9).toFixed(2), [projectInfo.estimatedEffort]);
  const remainingEffort = approvedEffort - actualEffortConsumed;

  const actualOnsiteFTEs = getActualOnsiteFTEs();
  // useMemo(() => {
  //   const onsiteActual = Object.values(onsiteEfforts).reduce((sum, cat) => sum + (cat.cumulativeActual || 0), 0);
  //   return (onsiteActual / 8).toFixed(2);
  // }, [onsiteEfforts]);

  const actualOffshoreFTEs = getActualOffshoreFTEs();
  // useMemo(() => {
  //   const offshoreActual = Object.values(offshoreEfforts).reduce((sum, cat) => sum + (cat.cumulativeActual || 0), 0);
  //   return (offshoreActual / 8).toFixed(2);
  // }, [offshoreEfforts]);

  const versionColumns = [
    { field: 'date', header: 'Date', editable: true, type: 'date' },
    { field: 'versionNo', header: 'Version No.', editable: true, type: 'text' },
    { field: 'changes', header: 'Changes', editable: true, type: 'text' },
    { field: 'updatedBy', header: 'Updated by', editable: true, type: 'text' },
  ];

  const handleVersionCellChange = (rowId, field, newValue) => updateVersionEntry(rowId, { [field]: newValue });
  
  const handleAddVersion = () => {
    addVersionEntry({
      date: new Date().toISOString().split('T')[0],
      versionNo: '',
      changes: '',
      updatedBy: '',
    });
    setToast({ message: 'Version added successfully', type: 'success' });
  };
  const handleDeleteVersionClick = (index) => {
    setDeleteConfirm({ isOpen: true, index });
  };

  const confirmDeleteVersion = () => {
    removeVersionEntry(deleteConfirm.index);
    setDeleteConfirm({ isOpen: false, index: null });
    setToast({ message: 'Version deleted successfully', type: 'success' });
  };

  return (
    <div>
    <PageHeader
        title="Project Information"
        subtitle="Manage project details and extended attributes"
        actions={[<Button key="save" variant="primary" onClick={() => setToast({ message: 'Changes saved automatically', type: 'success' })}>Save (Auto)</Button>]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column – Main Project Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h2>
          <div className="space-y-4">
            <InputField label="Project Name" name="name" value={formValues.name} onChange={handleInfoChange} pattern={PATTERNS.ALPHABETS_SPACES} patternErrorMessage="Project name can only contain letters and spaces" required error={errors.name} />
            <InputField label="Project Code / PIN" name="code" value={formValues.code} onChange={handleInfoChange} pattern={PATTERNS.ALPHANUMERIC_SPACES} patternErrorMessage="Project code can only contain letters, numbers, and spaces" error={errors.code} />
            <SelectField label="Status" name="status" options={infostatusOptions} value={projectInfo.status} onChange={handleInfoChange} />
            <SelectField label="Project Category" name="category" options={infocategoryOptions} value={projectInfo.category} onChange={handleInfoChange} />
            <SelectField label="Project Type" name="type" options={infotypeOptions} value={projectInfo.type} onChange={handleInfoChange} />
            <InputField label="Customer Name" name="customer" value={formValues.customer} onChange={handleInfoChange} pattern={PATTERNS.ALPHABETS_SPACES} patternErrorMessage="Customer name can only contain letters and spaces" error={errors.customer} />
            <InputField label="Customer Line of Business" name="customerLOB" value={projectInfo.customerLOB} onChange={handleInfoChange} />
            <InputField label="Primary Contact" name="primaryContact" value={formValues.primaryContact} onChange={handleInfoChange} pattern={PATTERNS.TEXT_WITH_PUNCTUATION} patternErrorMessage="Only letters, spaces, and basic punctuation allowed" error={errors.primaryContact} />
          </div>
        </div>

        {/* Right Column – Dates & Effort */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Schedule & Effort</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DateField label="Project Start Date (SOW)" name="startDateSOW" selected={projectInfo.startDateSOW} onChange={(e) => handleDateChange(e.target.name, e.target.value)} />
              <DateField label="Project End Date (SOW)" name="endDateSOW" selected={projectInfo.endDateSOW} onChange={(e) => handleDateChange(e.target.name, e.target.value)} />
              <DateField label="Plan Start Date" name="planStart" selected={projectInfo.planStart} onChange={(e) => handleDateChange(e.target.name, e.target.value)} />
              <DateField label="Plan Completion Date" name="planEnd" selected={projectInfo.planEnd} onChange={(e) => handleDateChange(e.target.name, e.target.value)} />
              <DateField label="Revised Plan Start Date" name="revisedPlanStart" selected={projectInfo.revisedPlanStart} onChange={(e) => handleDateChange(e.target.name, e.target.value)} />
              <DateField label="Revised Plan Completion Date" name="revisedPlanEnd" selected={projectInfo.revisedPlanEnd} onChange={(e) => handleDateChange(e.target.name, e.target.value)} />
              <DateField label="Actual Start Date" name="actualStart" selected={projectInfo.actualStart} onChange={(e) => handleDateChange(e.target.name, e.target.value)} />
              <DateField label="Actual Completion Date" name="actualEnd" selected={projectInfo.actualEnd} onChange={(e) => handleDateChange(e.target.name, e.target.value)} />
            </div>
            <InputField label="Estimated Effort (Hrs)" name="estimatedEffort" type="number" value={projectInfo.estimatedEffort} onChange={(e) => updateProjectInfo({ estimatedEffort: e.target.value })} />
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Approved Effort (Hrs)</label><div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700">{approvedEffort}</div></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-2 rounded"><label className="block text-sm font-medium text-gray-500">Actual Effort Consumed (Hrs)</label><p className="text-lg font-semibold">{actualEffortConsumed}</p></div>
              <div className="bg-gray-50 p-2 rounded"><label className="block text-sm font-medium text-gray-500">Remaining Effort (Hrs)</label><p className="text-lg font-semibold">{remainingEffort >= 0 ? remainingEffort : 0}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="SOW Onsite FTEs" name="onsiteFTEs" type="number" value={projectInfo.onsiteFTEs} onChange={(e) => updateProjectInfo({ onsiteFTEs: e.target.value })} />
              <InputField label="SOW Offshore FTEs" name="offshoreFTEs" type="number" value={projectInfo.offshoreFTEs} onChange={(e) => updateProjectInfo({ offshoreFTEs: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-2 rounded"><label className="block text-sm font-medium text-gray-500">Actual Onsite FTEs</label><p className="text-lg font-semibold">{actualOnsiteFTEs}</p></div>
              <div className="bg-gray-50 p-2 rounded"><label className="block text-sm font-medium text-gray-500">Actual Offshore FTEs</label><p className="text-lg font-semibold">{actualOffshoreFTEs}</p></div>
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
            onDeleteRow={handleDeleteVersionClick}
          />        
          </div>
      </div>
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, index: null })}
        onConfirm={confirmDeleteVersion}
        title="Confirm Delete"
        message="Are you sure you want to delete this version entry?"
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProjectInfoPage;