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

const express = require('express');
const path = require('path');
const fs = require('fs');

const { OAuth } = require('../services/oauth');
const admin_services = require('../services/admin')
const utility = require('../utility');
const config = require('../../config');
const _excel = require('../excel/excel');

let router = express.Router();



router.use(async (req, res, next) => {
    const oauth = new OAuth(req.session);
    if (!oauth.isAuthorized()) {
        console.log('no valid authorization!')
        res.status(401).end('Please login first')
        return
    }
    req.oauth_client = oauth.getClient();
    req.oauth_token = await oauth.getInternalToken();
    var twoleggedoauth = oauth.get2LeggedClient()
    var twoleggedRes = await twoleggedoauth.authenticate()
    config.credentials.token_2legged = twoleggedRes.access_token
    //config.credentials.token_3legged = req.oauth_token.access_token 
    next();
});
 

router.get('/admin/accountUsers/:accountId', async (req, res) => {

    const accountId = req.params['accountId']
    const limit = 100 // 100 records one page   
    //tell the client ok
    res.status(200).end()


    //start to extract from first page
    var allAccountUsers = []
    allAccountUsers = await admin_services.exportAccountUsers(accountId, limit, 0,allAccountUsers, 0);

    //notify the client with the data
    //better store the data to server database or file, and client side downloads it
    //in this version of the sample, to make it simpler, send json data directly to the client
    utility.socketNotify(
        utility.SocketEnum.DEMO_TOPIC,
        utility.SocketEnum.EXTRACT_ACCOUNT_USERS_DONE,allAccountUsers,'')
    
});

router.get('/admin/projectUsers/:accountId/:projectId', async (req, res) => {
    const accountId = req.params['accountId']
    const projectId = req.params['projectId']

    const limit = 100 // 100 records one page   
    //tell the client ok
    res.status(200).end()


    //start to extract from first page
    var allProjectsUsers = []
    allProjectsUsers = await admin_services.exportUsersInProject(accountId,projectId,'',20,0,allProjectsUsers,0);

    //notify the client with the data
    //better store the data to server database or file, and client side downloads it
    //in this version of the sample, to make it simpler, send json data directly to the client
    utility.socketNotify(
        utility.SocketEnum.DEMO_TOPIC,
        utility.SocketEnum.EXTRACT_PROJECT_USERS_DONE,allProjectsUsers,'')
});

router.get('/admin/exportAllUsersbyProjects/:accountId/:accountName', async (req, res) => {
    const accountId = req.params['accountId']  
    const accountName = req.params['accountName']  

     //tell the client ok
    res.status(200).end()


    //start to extract project by project
    const allUsersbyProjects = await admin_services.exportAllUsersbyProjects(accountId,accountName); 

    const result = await _excel._export(`${accountName}`,
                                        'all_users_by_projects',
                                        ['projectUsers'],
                                        {projectUsers:allUsersbyProjects})
    
    //notify the client with the status 
    utility.socketNotify(
        utility.SocketEnum.DEMO_TOPIC,
        utility.SocketEnum.EXTRACT_ALL_PROJECT_USERS_DONE,{success:result,accountName:accountName},'')
});

router.get('/admin/downloadExcel/:name', async (req, res) => {

    var name = req.params['name']
  
    name = `${name}.xlsx`
  
    var file_full_excel_name = path.join(__dirname, '../../Excel_Exports/' + name);

    if (fs.existsSync(file_full_excel_name)) {
      res.download(file_full_excel_name);
    }
    else {
      res.status(500).json({ error: 'no such excel file!' });
    }
  });
  


module.exports = router;
