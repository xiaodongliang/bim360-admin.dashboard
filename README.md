# bim360-admin.dashboard


## Description
This sample demonstrates the following use cases:

* Export account users, list them in table view, and render two pie charts
* Export all users of all projects, list them in table view. Render two pie charts (TBD) 


## Thumbnail
![thumbnail](/help/main.png) 


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


## Use Cases

1. Open the browser: [http://localhost:3000](http://localhost:3000). 
 
2. After user logging, select a hub(account) node in the three. The code will start extracting the accounts users and all project. After it is done, the table views will list the users data. Two pie charts are produced based on account users data. you can also modify the function refresh_stat_one and refresh_stat_two of [user.dashboard.view.js](./public/js/user.dashboard.view.js) to produce the chart you need.

3. if you need to produce charts based on project users data, enable the two lines of 45,46, [socket_modules.js](./public/js/socket_modules.js). and in the functions refresh_stat_one and refresh_stat_two, decide what stats you want to produce. [user.dashboard.view.js](./public/js/user.dashboard.view.js).

