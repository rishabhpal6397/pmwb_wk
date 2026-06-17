

export const projectStatusOptions = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'On Hold', label: 'On Hold' },
];

// Risk Management Options 
export const riskCategoryOptions = [
  { value: 'Process or Method', label: 'Process or Method' },
  { value: 'People or Man', label: 'People or Man' },
  { value: 'Infrastructure or Machine', label: 'Infrastructure or Machine' },
  { value: 'Supplier or Material', label: 'Supplier or Material' },
  { value: 'External Environment or Mother Nature', label: 'External Environment or Mother Nature' },
];

export const riskSourceOptions = [
  { value: 'External/Internal (Project Requirements)', label: 'External/Internal (Project Requirements)' },
  { value: 'External (Stakeholder / Governance)', label: 'External (Stakeholder / Governance)' },
  { value: 'External (Client Dependency)', label: 'External (Client Dependency)' },
  { value: 'Internal', label: 'Internal' },
];

export const processIdentifiedOptions = [
  { value: 'Kick off/ Bootcamp', label: 'Kick off/ Bootcamp' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Execution', label: 'Execution' },
  { value: 'Monitoring & Control', label: 'Monitoring & Control' },
  { value: 'Closure', label: 'Closure' },
  { value: 'Risk Review', label: 'Risk Review' },
];

export const relevanceOptions = [
  { value: 'ISMS', label: 'ISMS' },
  { value: 'QMS', label: 'QMS' },
  { value: 'Both', label: 'Both' },
];

export const riskOwnerOptions = [
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Risk Owner', label: 'Risk Owner' },
  { value: 'Quality Manager', label: 'Quality Manager' },
  { value: 'Security Manager', label: 'Security Manager' },
  { value: 'Delivery Manager', label: 'Delivery Manager' },
];

export const probabilityOptions = [
  { value: 0.9, label: 'Almost Certain (0.9)' },
  { value: 0.7, label: 'Often (0.7)' },
  { value: 0.5, label: 'Likely (0.5)' },
  { value: 0.3, label: 'Possible (0.3)' },
  { value: 0.1, label: 'Rare (0.1)' },
];

export const impactOptions = [
  { value: 0, label: 'Not Applicable (0)' },
  { value: 1, label: 'Insignificant (1)' },
  { value: 3, label: 'Minor (3)' },
  { value: 5, label: 'Moderate (5)' },
  { value: 7, label: 'Major (7)' },
  { value: 9, label: 'Catastrophic (9)' },
];

export const riskTreatmentOptions = [
  { value: 'Accept', label: 'Accept' },
  { value: 'Mitigate', label: 'Mitigate' },
  { value: 'Avoid', label: 'Avoid' },
  { value: 'Transfer', label: 'Transfer' },
];

export const riskStatusOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'Occurred & Open', label: 'Occurred & Open' },
  { value: 'Closed', label: 'Closed' },
  { value: "Didn't occur & Closed", label: "Didn't occur & Closed" },
];

export const externalInternalOptions = [
  { value: 'Internal', label: 'Internal' },
  { value: 'External (Impacts Customer)', label: 'External (Impacts Customer)' },
];

//  Resource Page Options 
export const RESOURCE_LEVELS = [
  { value: 'L1', label: 'L1' }, { value: 'L2', label: 'L2' }, { value: 'L3', label: 'L3' },
  { value: 'L4', label: 'L4' }, { value: 'L5', label: 'L5' }, { value: 'L6', label: 'L6' },
  { value: 'L7', label: 'L7' }, { value: 'L8', label: 'L8' }, { value: 'L9', label: 'L9' },
  { value: 'L10', label: 'L10' },
];

export const RESOURCE_TYPES = [
  { value: 'SEG', label: 'SEG (Project Team)' },
  { value: 'CTT', label: 'CTT (Testing Team)' },
  { value: 'GRA', label: 'GRA (Graphics)' },
  { value: 'TWR', label: 'TWR (Tech Writer)' },
  { value: 'QAG', label: 'QAG (QA)' },
  { value: 'ORG', label: 'ORG (Organizational)' },
  { value: 'PMS', label: 'PMS (PM)' },
  { value: 'ARC', label: 'ARC (Architecture)' },
  { value: 'BAS', label: 'BAS (Business Analyst)' },
  { value: 'PMO', label: 'PMO' },
];

export const RESOURCE_AVAILABILITY_STATUS = [
  { value: 'Available', label: 'Available' },
  { value: 'Not Available', label: 'Not Available' },
  { value: 'Resigned', label: 'Resigned' },
];


// Verification Data options
//  Dropdown Options 
export const PHASE_OPTIONS = [
  { value: 'Analysis and Design', label: 'Analysis and Design' },
  { value: 'Coding and unit testing', label: 'Coding and unit testing' },
  { value: 'System Integration testing', label: 'System Integration testing' },
  { value: 'User acceptance testing', label: 'User acceptance testing' },
  { value: 'Production deployment', label: 'Production deployment' },
  { value: 'Post production support', label: 'Post production support' },
];

export const VERIFICATION_ACTIVITY_OPTIONS = [
  { value: 'Review-Peer review inspection', label: 'Review - Peer review inspection' },
  { value: 'Review-Walkthrough', label: 'Review - Walkthrough' },
  { value: 'Review-Inspection', label: 'Review - Inspection' },
  { value: 'Testing-Unit Testing', label: 'Testing - Unit Testing' },
  { value: 'Testing-Integration Testing', label: 'Testing - Integration Testing' },
  { value: 'Testing-System Testing', label: 'Testing - System Testing' },
  { value: 'Testing-UAT', label: 'Testing - UAT' },
  { value: 'Testing-Regression', label: 'Testing - Regression' },
];

export const TYPE_OPTIONS = [
  { value: 'Internal', label: 'Internal' },
  { value: 'External', label: 'External' },
];


// Opportunty Tracker Dropdown Options (unchanged) 
export const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Deferred', label: 'Deferred' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export const EXTERNAL_INTERNAL_OPTIONS = [
  { value: 'Internal', label: 'Internal' },
  { value: 'External (Impacts Customer)', label: 'External (Impacts Customer)' },
];

export const PROCESS_OPTIONS = [
  { value: 'Kick off/ Bootcamp', label: 'Kick off/ Bootcamp' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Execution', label: 'Execution' },
  { value: 'Monitoring & Control', label: 'Monitoring & Control' },
  { value: 'Closure', label: 'Closure' },
  { value: 'Quality Audit', label: 'Quality Audit' },
  { value: 'Customer Review', label: 'Customer Review' },
  { value: 'Risk Review', label: 'Risk Review' },
  { value: 'Status Meeting', label: 'Status Meeting' },
];

export const OWNER_OPTIONS = [
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Delivery Manager', label: 'Delivery Manager' },
  { value: 'Business Analyst', label: 'Business Analyst' },
  { value: 'Tech Lead', label: 'Tech Lead' },
  { value: 'Quality Manager', label: 'Quality Manager' },
  { value: 'Sales Team', label: 'Sales Team' },
  { value: 'Customer', label: 'Customer' },
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Product Owner', label: 'Product Owner' },
];


// Issue Management Dropdown options (shared)
export const ISSUE_STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Deferred', label: 'Deferred' },
  { value: 'Cancelled', label: 'Cancelled' },
];
export const ASSIGNEE_OPTIONS = [
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Tech Lead', label: 'Tech Lead' },
  { value: 'Delivery Manager', label: 'Delivery Manager' },
  { value: 'Quality Manager', label: 'Quality Manager' },
  { value: 'Business Analyst', label: 'Business Analyst' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Tester', label: 'Tester' },
  { value: 'Customer', label: 'Customer' },
  { value: 'Vendor', label: 'Vendor' },
];
export const RAISED_BY_OPTIONS = [
  { value: 'Internal Team', label: 'Internal Team' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Customer', label: 'Customer' },
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Quality Audit', label: 'Quality Audit' },
  { value: 'Security Audit', label: 'Security Audit' },
];


// Training Page dropdown options
export const TRAINING_STATUS_OPTIONS = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Waiting for inputs', label: 'Waiting for inputs' },
  { value: 'Deferred', label: 'Deferred' },
];

export const TRAINING_TYPE_OPTIONS = [
  { value: 'Process', label: 'Process' },
  { value: 'Domain', label: 'Domain' },
  { value: 'Soft Skills', label: 'Soft Skills' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Induction', label: 'Induction' },
  { value: 'Other', label: 'Other' },
];


// Project Info Page dropdown
export const infostatusOptions = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Closed', label: 'Closed' },
  { value: 'On Hold', label: 'On Hold' },
];

export const infocategoryOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
];

export const infotypeOptions = [
  { value: 'Development', label: 'Development' },
  { value: 'Maintenance & Support', label: 'Maintenance & Support' },
  { value: 'Testing', label: 'Testing' },
  { value: 'Documentation', label: 'Documentation' },
];


// Performance Metrics Page Dropdown Options 
export const PERFORMANCE_ROLE_OPTIONS = [
  { value: 'DM', label: 'DM (Delivery Manager)' },
  { value: 'PM', label: 'PM (Project Manager)' },
  { value: 'BSA', label: 'BSA (Business Analyst)' },
  { value: 'SME', label: 'SME (Subject Matter Expert)' },
  { value: 'Architect', label: 'Architect' },
  { value: 'Tech Lead', label: 'Tech Lead' },
  { value: 'Module Lead', label: 'Module Lead' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Sr. Developer', label: 'Sr. Developer' },
  { value: 'QE Head', label: 'QE Head' },
  { value: 'QE', label: 'QE (Quality Engineer)' },
  { value: 'UI/UX Dev', label: 'UI/UX Dev' },
  { value: 'Consultant', label: 'Consultant' },
  { value: 'Contractor', label: 'Contractor' },
];