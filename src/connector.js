
import { scrubRoom } from './util/scrubRoom';

const API_ENDPOINT = 'https://34m4mho8me.execute-api.us-east-1.amazonaws.com';

export const getEvents = async () => {
  const response = await fetch(API_ENDPOINT + `/events`);
  return await response.json();
};

export const getCategories = async () => {
  const response = await fetch(API_ENDPOINT + `/categories`);
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

