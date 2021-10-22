//columns defs for version 2 of get assets
const projectUsersColumns = [
    { id: 'project', propertyName: 'project', columnTitle: 'project', columnWidth: 8, locked: true },

    { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 8, locked: true },
    { id: 'email', propertyName: 'email', columnTitle: 'email', columnWidth: 8, locked: true },
    { id: 'jobTitle', propertyName: 'jobTitle', columnTitle: 'jobTitle', columnWidth: 6, locked: false },
    { id: 'company', propertyName: 'company', columnTitle: 'company', columnWidth: 6, locked: false },
    { id: 'roles', propertyName: 'roles', columnTitle: 'roles', columnWidth: 6, locked: false },
    { id: 'industry', propertyName: 'industry', columnTitle: 'industry', columnWidth: 6, locked: false },

    { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 6, locked: false },
    { id: 'autodeskId', propertyName: 'autodeskId', columnTitle: 'autodeskId', columnWidth: 6, locked: false },

    { id: 'accountAdmin', propertyName: 'accessLevels_accountAdmin', columnTitle: 'accountAdmin', columnWidth: 6, locked: false },
    { id: 'projectAdmin', propertyName: 'accessLevels_projectAdmin', columnTitle: 'projectAdmin', columnWidth: 6, locked: false },
    { id: 'executive', propertyName: 'accessLevels_executive', columnTitle: 'executive', columnWidth: 6, locked: false },

    { id: 'documentManagement', propertyName: 'services_documentManagement', columnTitle: 'documentManagement', columnWidth: 6, locked: false },
    { id: 'projectAdministration', propertyName: 'services_projectAdministration', columnTitle: 'projectAdministration', columnWidth: 6, locked: false },
    { id: 'costManagement', propertyName: 'services_costManagement', columnTitle: 'costManagement', columnWidth: 6, locked: false },
    { id: 'assets', propertyName: 'services_assets', columnTitle: 'assets', columnWidth: 6, locked: false },
    { id: 'designCollaboration', propertyName: 'services_designCollaboration', columnTitle: 'designCollaboration', columnWidth: 6, locked: false },
    { id: 'fieldManagement', propertyName: 'services_fieldManagement', columnTitle: 'fieldManagement', columnWidth: 6, locked: false },
    { id: 'insight', propertyName: 'services_insight', columnTitle: 'insight', columnWidth: 6, locked: false },

 
 ];
 
 module.exports = {
    projectUsersColumns 
};