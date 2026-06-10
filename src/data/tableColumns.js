export const resourceColumns = [
  { field: 'code', header: 'Employee Code', editable: true, type: 'text' },
  { field: 'name', header: 'Name', editable: true, type: 'text' },
  { field: 'level', header: 'Level', editable: true, type: 'select', options: [{value:'L1',label:'L1'},{value:'L2',label:'L2'}] },
  { field: 'offshorePlanned', header: 'Offshore Planned', editable: true, type: 'number' },
  { field: 'offshoreActual', header: 'Offshore Actual', editable: true, type: 'number' },
];

export const riskColumns = [
  { field: 'title', header: 'Risk Title', editable: true, type: 'text' },
  { field: 'category', header: 'Category', editable: true, type: 'select', options: riskCategoryOptions },
  { field: 'probability', header: 'Probability', editable: true, type: 'number' },
  { field: 'impactCost', header: 'Impact Cost', editable: true, type: 'number' },
  { field: 'riskIndex', header: 'Risk Index', editable: false, type: 'number' },
];

