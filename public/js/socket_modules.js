
const SocketEnum = {
  DEMO_TOPIC: 'demo topic',
  EXTRACT_ACCOUNT_USERS_DONE:'extract account users done',
  EXTRACT_ALL_PROJECTS_USERS_DONE:'extract users of all project done' 
};  

socketio = io('http://localhost:3000');
socketio.on(SocketEnum.DEMO_TOPIC, async (d) => {
  const res = JSON.parse(d)  
  const data  = res.data
  const info = res.info

  switch (res.message) {
    case SocketEnum.EXTRACT_ACCOUNT_USERS_DONE:
       
      if(info)
        $.notify(info, 'warn');  

      if(data){
        //render table and dashboard  
         user_table_view._data.accountUsersTable = data
         user_table_view.refreshTable('accountUsersTable')
         user_dashboard_view.refresh_stat_one(data,true)
         user_dashboard_view.refresh_stat_two(data,true)

      } 
      $('#progress_accountUsers').hide(); 
      console.log('export one page  done')
      break;
    case SocketEnum.EXTRACT_ALL_PROJECTS_USERS_DONE:   
       $('#progress_projectUsers').hide(); 
     
       if(info)
        $.notify(info, 'warn');  

       if(data){
        //render table and dashboard
        user_table_view._data.allProjectsUsersTable = data
        user_table_view.refreshTable('allProjectsUsersTable')
      } 

       console.log('export all project users  done') 
       break; 
  }

})