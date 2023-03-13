import { Amplify, Auth, API } from 'aws-amplify'; 
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);


async function listGroups() { 
  let apiName = 'AdminQueries';
  let path = '/listGroups';
  let myInit = { 
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      } 
  }
  return await API.post(apiName, path, myInit);
}


async function addToGroup() { 
  let apiName = 'AdminQueries';
  let path = '/addUserToGroup';
  let myInit = {
      body: {
        "username" : "richard",
        "groupname": "Editors"
      }, 
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      } 
  }
  return await API.post(apiName, path, myInit);
}

export {
  listGroups,
  addToGroup
}

