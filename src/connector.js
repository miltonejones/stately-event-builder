
import { scrubRoom } from './util/scrubRoom';

const API_ENDPOINT = 'https://34m4mho8me.execute-api.us-east-1.amazonaws.com';

export const getPropertyTypes = async () => {
  const response = await fetch(API_ENDPOINT + `/proptypes`);
  return await response.json();
};

export const getEvents = async () => {
  const response = await fetch(API_ENDPOINT + `/events`);
  return await response.json();
};

export const setCategory = async (options) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response = await fetch(API_ENDPOINT + '/categories', requestOptions );
  return await response.json();
};
 
export const dropCategory = async (id) => {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  };
  const response =  await fetch(API_ENDPOINT + '/categories/' + id, requestOptions ); 
  return await response.json(); 
};

export const getEventListCategories = async (ids) => {
  const response = await fetch(API_ENDPOINT + `/categories/${ids}`);
  return await response.json();
};

export const getCategories = async () => {
  const response = await fetch(API_ENDPOINT + `/categories`);
  return await response.json();
};

export const setReport = async (options) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response = await fetch(API_ENDPOINT + '/reports', requestOptions );
  return await response.json();
};


export const getReports = async () =>  {
  const response = await fetch(API_ENDPOINT + `/reports`);
  return await response.json();
};

export const setAmenity = async (options) =>  {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response = await fetch(API_ENDPOINT + '/amenities', requestOptions ); 
  return await response.json();
};

export const getAmenities = async () =>  {
  const response = await fetch(API_ENDPOINT + `/amenities`);
  return await response.json();
};

export const getCalendars = async () => {
  const response = await fetch(API_ENDPOINT + `/calendars`);
  return await response.json();
};


export const getUsers = async () => {
  const response = await fetch(API_ENDPOINT + `/cognito`);
  return await response.json();
};

export const getCognitoGroups = async (id) => {
  const response = await fetch(API_ENDPOINT + `/groups`);
  return await response.json();
};

export const getUserByName = async (username) => {
  const response = await fetch(API_ENDPOINT + `/cognito/name/${username}`);
  return await response.json();
};

export const getUser = async (id) => {
  const response = await fetch(API_ENDPOINT + `/cognito/${id}`);
  return await response.json();
};

export const commitUser = async (options) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response = await fetch(API_ENDPOINT + '/cognito', requestOptions );
  return await response.json();
};
 
export const setRoom = async (options) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response =  await fetch(API_ENDPOINT + '/rooms', requestOptions ); 
  return await response.json(); 
};
 
export const getRooms = async () => {
  const response = await fetch(API_ENDPOINT + `/rooms`);
  const rooms = await response.json();
  return rooms?.map(scrubRoom)
};
 
export const getEvent = async (id) => {
  const response = await fetch(API_ENDPOINT + `/event/${id}`);
  return await response.json();
};

export const searchEvents = async (options) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response =  await fetch(API_ENDPOINT + '/event', requestOptions ); 
  const rooms = await response.json();
  return rooms?.map(scrubRoom)
 // return await response.json();
};


export const saveEvent = async (options) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response =  await fetch(API_ENDPOINT + '/event', requestOptions ); 
  return await response.json();  
};


const buildAPI = (endpoint, method = 'POST') => async (options = {}) => {
  const requestOptions = {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response =  await fetch(API_ENDPOINT + endpoint, requestOptions ); 
  return await response.json();  
} 


export const createAmplifyDomain = async (id) => {
  const response = await fetch(API_ENDPOINT + `/amplify/${id}`);
  return await response.json();
};

export const getSubdomains = async (zone) => {
  const response = await fetch(API_ENDPOINT + `/domains/${zone}`);
  return await response.json();
};

export const getDomainChangeState = async (id) => {
  const response = await fetch(API_ENDPOINT + `/domains/status/${id}`);
  return await response.json();
};

export const unsetInstance = async (id) => {
  const response = await fetch(API_ENDPOINT + `/instance/${id}/CNAME`);
  return await response.json();
};

export const listAmplifyApps = async () => {
  const response = await fetch(API_ENDPOINT + `/amplify`);
  return await response.json();
};


export const getDomains = async () => {
  const response = await fetch(API_ENDPOINT + `/domains`);
  return await response.json();
};


export const setInstance = buildAPI('/instance')
export const createSubdomain = buildAPI('/domains')
export const checkDnsPropagation = buildAPI('/dns')
export const getCertificateStatus = buildAPI('/cert/status')
export const validateCertificate = buildAPI('/cert/validate')
export const requestCertificate = buildAPI('/cert/create')
