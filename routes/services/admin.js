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
//functions to extract BIM 360 Admin data
//projects, companies, account users, project users

const config = require('../../config');
//We may only need GET when exporting records
const { get } = require('./fetch_common');
const utility = require('../utility');
const asyncPool = require('tiny-async-pool')

//export BIM 360 projects, recursive function
async function exportProjects(accountid, limit, offset, allProjects, pageIndex) {
  try {
    pageIndex++
    const endpoint = `${config.httpRequest.ForgeBaseUrl}/hq/v1/accounts/${accountid}/projects?limit=${limit}&offset=${offset}`
    const headers = config.httpRequest.httpHeaders(config.credentials.token_2legged)
    const response = await get(endpoint, headers);
    if (response.length > 0) {
      console.log(`getting account projects ${offset} to ${offset + limit}`)
      allProjects = allProjects.concat(response);
      await utility.delay(utility.DELAY_MILISECOND * pageIndex)
      return exportProjects(accountid, limit, allProjects.length, allProjects, pageIndex);
    } else
      return allProjects
  } catch (e) {
    console.error(`getBIMProjects failed: ${e}`)
  }
}

//export BIM 360 account companies , recursive function
async function exportAccountCompanies(accountid, limit, offset, allCompanies, pageIndex) {
  try {
    pageIndex++
    const endpoint = `${config.httpRequest.ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies?limit=${limit}&offset=${offset}`
    const headers = config.httpRequest.httpHeaders(config.credentials.token_2legged)
    const response = await get(endpoint, headers);
    if (response.length > 0) {
      console.log(`getting account companies ${offset} to ${offset + limit}`)
      allCompanies = allCompanies.concat(response);
      await utility.delay(utility.DELAY_MILISECOND * pageIndex)
      return exportAccountCompanies(accountid, limit, allCompanies.length, allCompanies, pageIndex);
    } else
      return allCompanies
  } catch (e) {
    console.error(`getBIMCompanies failed: ${e}`)
  }
}

//export BIM 360 account users , recursive function
async function exportAccountUsers(accountid, limit, offset, allUsers, pageIndex) {
  try {
    pageIndex++
    const endpoint = `${config.httpRequest.ForgeBaseUrl}/hq/v1/accounts/${accountid}/users?limit=${limit}&offset=${offset}`
    const headers = config.httpRequest.httpHeaders(config.credentials.token_2legged)
    const response = await get(endpoint, headers);
    if (response.length > 0) {
      console.log(`getting account users ${offset} to ${offset + limit}`)
      allUsers = allUsers.concat(response);
      await utility.delay(utility.DELAY_MILISECOND * pageIndex)
      return exportAccountUsers(accountid, limit, allUsers.length, allUsers, pageIndex);
    } else
      return allUsers
  } catch (e) {
    console.error(`getBIMAccountUsers failed: ${e}`)
  }
}

async function exportAllUsersbyProjects(accountId) {
  try {
    var allProjects = [];
    var pageIndex = 0
    allProjects = await exportProjects(accountId, 100, 0, allProjects, pageIndex);

    //build params of project lists (id and name)
    const queryParams = allProjects.map((proj, index) => {
      return {
        accountId: accountId,
        projectId: proj.id,
        projectName: proj.name,
        index: index
      }
    }) 

    let promiseCreator = (async (param) => {
      console.log(param.projectName);
      //await utility.delay(param.index * utility.DELAY_MILISECOND)
      var oneProjectUsers = [];
      var pageIndex = 0
      oneProjectUsers = await exportUsersInProject(accountId, param.projectId, param.projectName, 100, 0, oneProjectUsers, pageIndex);
      return oneProjectUsers;
    });

    console.log('start getting users of one project');
    var res = await asyncPool(2, queryParams, promiseCreator);
    const allUsers = utility.flatDeep(res, Infinity)
    console.log('getting one project users done:');
    return allUsers

  } catch (e) {
    console.error(`exportAllUsersbyProjects exception:${e}`)
    return []
  }
}


//export BIM 360 project users , recursive function
async function exportUsersInProject(accountid, projectId, projectName, limit, offset, allUsers, pageIndex) {
  try {
    pageIndex++
    const endpoint = `${config.httpRequest.ForgeBaseUrl}/bim360/admin/v1/projects/${projectId}/users?limit=${limit}&offset=${offset}`
    const headers = config.httpRequest.httpHeaders(config.credentials.token_2legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting project ${projectName} users ${offset} to ${offset + limit}`)
      allUsers = allUsers.concat(response.results);
      //await utility.delay(utility.DELAY_MILISECOND * pageIndex)
      return exportUsersInProject(accountid, projectId, projectName, limit, allUsers.length, allUsers, pageIndex);
    } else {

      const allProjectRoles = await exportProjectsRoles(accountid, projectId, projectName)

      //now, sort it out with the explicit data of company name, access level, and accessible services of this user
      var promiseCreator = async (u) => {

        //let promiseArr = allUsers.map(async (u, index) => {
        //must delay to avoid to hit rate limit
        //await utility.delay(utility.DELAY_MILISECOND)

        var eachUser = {}
        eachUser.project =  projectName
        eachUser.name = u.name
        eachUser.autodeskId = u.autodeskId
        eachUser.id = u.id
        eachUser.email = u.email

        eachUser.jobTitle = u.jobTitle
        eachUser.industry = u.industry

        eachUser.project = projectName;
        eachUser.company = u.companyId ? await getOneCompany(accountid, u.companyId) : '';
        //better use exportProjectsCompanies and find item from the list

        eachUser.accessLevels_accountAdmin = u.accessLevels.accountAdmin
        eachUser.accessLevels_projectAdmin = u.accessLevels.projectAdmin
        eachUser.accessLevels_executive = u.accessLevels.executive

        if (u.services) {
          let service_index = u.services.findIndex(ele => ele.serviceName == 'documentManagement')
          eachUser.services_documentManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'projectAdministration')
          eachUser.services_projectAdministration = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'projectManagement')
          eachUser.services_projectManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'costManagement')
          eachUser.services_costManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'assets')
          eachUser.services_assets = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'designCollaboration')
          eachUser.services_designCollaboration = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'fieldManagement')
          eachUser.services_fieldManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'insight')
          eachUser.services_insight = service_index > -1 ? u.services[service_index].access : 'none'
        } 

        //orgnize the string of roles
        if (u.roleIds && u.roleIds.length > 0) {
          let roles = ''
          u.roleIds.forEach(async (rid) => {
            //get meaningful name of the role
            const findRole = allProjectRoles.find(i => i.id == rid)
            if (findRole) {
              roles += findRole.name + '\n'
            }
          });

          eachUser.roles = roles
        } else {
          eachUser.roles = null
        }
        return eachUser;
      }//);

      var res = await asyncPool(2, allUsers, promiseCreator);
      return res;
    }
  } catch (e) {
    console.error(`exportProjectsUsers ${projectName} failed: ${e}`)
    return []
  }
}

//export BIM 360 project companies , recursive function
async function exportProjectsCompanies(accountid, projectId, projectName, limit, offset, allCompanies, pageIndex) {
  try {
    pageIndex++
    const endpoint = `${config.httpRequest.ForgeBaseUrl}/hq/v1/accounts/${accountid}/projects/${projectId}/companies?limit=${limit}&offset=${offset}`
    const headers = config.httpRequest.httpHeaders(config.credentials.token_2legged)
    const response = await get(endpoint, headers);

    if (response && response.length > 0) {
      console.log(`getting project ${projectName} companies ${offset} to ${offset + limit}`)
      allCompanies = allCompanies.concat(response);
      await utility.wait(utility.DELAY_MILISECOND * index)
      return exportProjectsCompanies(accountid, projectId, projectName, limit, allCompanies.length, allCompanies, pageIndex);
    } else {

      //now, sort it out with the explicit data of company name, access level, and accessible services of this user
      let promiseArr = allCompanies.map(async (c, index) => {
        //must delay to avoid to hit rate limit
        await utility.delay(index * utility.DELAY_MILISECOND)

        var eachCompany = {}
        eachCompany.project = projectName;
        eachCompany.autodeskId = c.member_group_id // note: the special name for company
        eachCompany.id = c.id
        eachCompany.name = c.name
        eachCompany.city = c.city
        eachCompany.country = c.country
        return eachCompany;
      });

      return Promise.all(promiseArr).then((resultsArray) => {
        resultsArray = utility.flatDeep(resultsArray, Infinity)
        return resultsArray;
      }).catch(function (err) {
        console.log(`exception when Promise.all sorting out companies: ${err}`);
        return []
      })
    }
  } catch (e) {
    console.error(`exportProjectsCompanies ${projectName} failed: ${e}`)
    return []
  }
}

//export BIM 360 project roles. This endpoint does not need pagination. One call only
async function exportProjectsRoles(accountid, projectId, projectName) {
  try {
    const endpoint = `${config.httpRequest.ForgeBaseUrl}/hq/v2/accounts/${accountid}/projects/${projectId}/industry_roles`
    const headers = config.httpRequest.httpHeaders(config.credentials.token_2legged)
    const response = await get(endpoint, headers);

    if (response && response.length > 0) {
      console.log(`getting project ${projectName} roles`)
      return response;
    } else {
      return []
    }
  } catch (e) {
    console.error(`exportProjectsRoles ${projectName} failed: ${e}`)
    return []
  }
}


//get one company data
async function getOneCompany(accountid, companyId) {
  try {
    const endpoint = `${config.httpRequest.ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies/${companyId}`
    const headers = config.httpRequest.httpHeaders(config.credentials.token_2legged)
    const response = await get(endpoint, headers);
    if (response) {
      return response.name;
    } else {
      console.log(`get one company info failed`)
    }
  } catch (e) {
    console.log(`getOneCompany failed: ${e}`)
  }
}

module.exports = {
  exportAccountUsers,
  exportUsersInProject,
  exportAllUsersbyProjects
};