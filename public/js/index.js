/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

const user_table_view = new UserTableView()
const user_dashboard_view = new UserDashboardView()


$(document).ready(function () {

  $.notify.defaults({
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut'
  });
  
  user_table_view.initTable('accountUsersTable')
  user_table_view.initTable('allProjectsUsersTable') 
 
  $('#btnExportAll').click(async function () {
    $('#progress_export_allusers').show(); 
    const accountId = $('#labelAccountId').text()
    const accountName = $('#labelAccountName').text()

    if(accountId=='' || accountName ==''){
      alert('please select one account!')
      $('#progress_export_allusers').hide();  
      return
    }
    $('#completedProIndex').text(''); 
    await user_table_view.exportAllUsersbyProjects(accountId,accountName)

    
  })

});

