class UserTableView {

  constructor() { 
    this._pageLimit = 25
    this._pageOffset = 0 

    this._data ={
      accountUsersTable:[], 
      allProjectsUsersTable:[]  
    } 

    this._tableFixComlumns = {
      parent:this,
      accountUsersTable: function () {
        return [
          { field: 'id', title: "id", align: 'center' },
          { field: 'name', title: "name", align: 'center' },
          { field: 'role', title: "role", align: 'center' },
          { field: 'company_name', title: "company_name", align: 'left' },
          { field: 'website_url', title: "website_url", align: 'left' },
          { field: 'last_sign_in', title: "last_sign_in", align: 'center' },
          { field: 'email', title: "email", align: 'left' },
          { field: 'uid', title: "uid", align: 'left' },
          { field: 'city', title: "city", align: 'left' },
          { field: 'country', title: "country", align: 'center' },
          { field: 'created_at', title: "created_at", align: 'left' },
          { field: 'job_title', title: "job_title", align: 'left' }  
          ]
      },

      allProjectsUsersTable: function () {
        return [
          //{ field: 'project', title: "project", align: 'center' },

          { field: 'id', title: "id", align: 'center' },
          { field: 'name', title: "name", align: 'center' },
          { field: 'autodeskId', title: "autodeskId", align: 'center' },
          { field: 'email', title: "email", align: 'left' },
          { field: 'jobTitle', title: "jobTitle", align: 'left' },
          { field: 'industry', title: "industry", align: 'left' },
          { field: 'company', title: "company", align: 'left' }, 

          { field: 'accessLevels_accountAdmin', title: "accessLevels_accountAdmin", align: 'center' },
          { field: 'accessLevels_projectAdmin', title: "accessLevels_projectAdmin", align: 'left' },
          { field: 'accessLevels_executive', title: "accessLevels_executive", align: 'left' },
             
          { field: 'services_documentManagement', title: "services_documentManagement", align: 'center' },
          { field: 'services_projectAdministration', title: "services_projectAdministration", align: 'left' },
          { field: 'services_costManagement', title: "services_costManagement", align: 'left' },
          { field: 'services_assets', title: "services_assets", align: 'left' },
          { field: 'services_designCollaboration', title: "services_designCollaboration", align: 'left' },
          { field: 'services_fieldManagement', title: "services_fieldManagement", align: 'left' }

        ]
      }  
    }
  }

  resetData(){
    this._data ={
      accountUsersTable:[], 
      allProjectsUsersTable:[] 
    }  
  }
 
  initTable(domId,isRaw) {

    $(`#${domId}`).bootstrapTable('destroy');
    const columns  = this._tableFixComlumns[domId](isRaw)
    $(`#${domId}`).bootstrapTable({
      parent:this,
      data: [],
      editable: false,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: true,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 10,
      pageNumber: 1,
      uniqueId: 'id',
      striped: true,
      search: true,
      showRefresh: true,
      minimumCountColumns: 2,
      smartDisplay: true,
      columns: columns 
    });
  } 

  async refreshTable(domId) {
     
    $(`#${domId}`).bootstrapTable('destroy'); 

    var fixCols = this._tableFixComlumns[domId]() 
     
    $(`#${domId}`).bootstrapTable({
      data: this._data[domId],
      editable: false,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: true,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 5,
      pageNumber: 1,
      uniqueId: 'id',
      striped: true,
      search: true,
      showRefresh: true,
      minimumCountColumns: 2,
      smartDisplay: true,
      columns: fixCols 
    });
  }

  async getAccountUsers(accountId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/admin/accountUsers/${accountId}`,
        type: 'GET',
        success: (data) => {
          //post request, the extraction will start to run on server side
          //socket will notify the client when it is done
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  } 

  async getAllProjectsUsers(accountId,projectId) {
    var _this = this
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/forge/admin/projectUsers/${accountId}/${projectId}`,
        type: 'GET',
        success: (data) => {
          //post request, the extraction will start to run on server side
          //socket will notify the client when it is done
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  } 

  

 

 

}