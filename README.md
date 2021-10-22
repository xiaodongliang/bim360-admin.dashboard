# forge-bim360.dashboard.export.excel

[![Node.js](https://img.shields.io/badge/Node.js-12.19-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-6.14.8-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/Web-Windows%20%7C%20MacOS%20%7C%20Linux-lightgray.svg)

[![BIM-360 API](https://img.shields.io/badge/BIM%20360-api-green.svg)](https://forge.autodesk.com/en/docs/bim360/v1/reference/http/)

## Description
This sample demonstrates the following use cases of BIM360:

* Export account users data, list them in table view, and render two demo pie charts. The data includes access level of the user, the default role, company and other general information.
* Export all users data of all projects, list them in table view and render two demo pie charts. The data includes the access level of the user, the roles array in the project, and services permission of the user and other general information..
* Export all users data by projects and export to excel. The users will be listed in rows by each project. 


## Thumbnail
![thumbnail](/help/main.png) 

![thumbnail](/help/excel.png) 


# Web App Setup

## Prerequisites

1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/). 
2. **BIM 360 Account**: must be Account Admin to add the app integration. [Learn about provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). 
3. **Node.js**: basic knowledge with [**Node.js**](https://nodejs.org/en/).
4. **JavaScript** basic knowledge with **jQuery**

For using this sample, you need an Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). For this new app, use **http://localhost:3000/api/forge/callback/oauth** as Callback URL. Finally take note of the **Client ID** and **Client Secret**.


## Running locally

Install [NodeJS](https://nodejs.org), version 8 or newer.

Clone this project or download it (this `nodejs` branch only). It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone https://github.com/xiaodongliang/bim360-admin.dashboard

Install the required packages using `npm install`.


**Environment variables**

Set the enviroment variables with your client ID & secret and finally start it. Via command line, navigate to the folder where this repository was cloned and use the following:


Mac OSX/Linux (Terminal)

    npm install
    export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    export FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    export FORGE_CALLBACK_URL=<<YOUR CALLBACK URL>>

    npm start

Windows (use **Node.js command line** from Start menu)

    npm install
    set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    set FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    set FORGE_CALLBACK_URL=<<YOUR CALLBACK URL>>

    npm start

OR, set enviroment variables of [launch.json](/.vscode/launch.json) for debugging.

Note: although this sample requires the user to login BIM360, some of the API calls behind the scene uses 2 legged token because some BIM360 admin API requires 2 legged token.

## Deployment

To deploy this application to Heroku, the **Callback URL** for Forge must use your `.herokuapp.com` address. After clicking on the button below, at the Heroku Create New App page, set your Client ID, Secret and Callback URL for Forge.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/xiaodongliang/bim360-admin.dashboard)


## Use Cases

1. Open the browser: [http://localhost:3000](http://localhost:3000). 
 

2. After user logging, select a hub(account) node in the three. The code will start extracting the accounts users and all project. After it is done, the table views will list the users data. Two pie charts are produced based on account users data. you can also modify the function refresh_stat_one and refresh_stat_two of [user.dashboard.view.js](./public/js/user.dashboard.view.js) to produce the chart you need.

3. if you need to produce charts based on project users data, enable the two lines of 45,46, [socket_modules.js](./public/js/socket_modules.js). and in the functions refresh_stat_one and refresh_stat_two, decide what stats you want to produce. [user.dashboard.view.js](./public/js/user.dashboard.view.js).

4. select one account, click the button **Export All Users by Projects to Excel**, it will start a process to export all users by project, and finally download an excel file. To avoid hitting rate limit, the code intentionally sets delay, so it might take time to complete the whole process. If you find it has been run for more than 1 hour, please check if there is any error on server side.


## License
This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by
Xiaodong Liang [@coldwood](https://twitter.com/coldwood), [Forge Advocate and Support](http://forge.autodesk.com)

