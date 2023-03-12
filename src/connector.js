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
  const response = await fetch(API_ENDPOINT + `/users`);
  return await response.json();
};
 
export const getRooms = async () => {
  const response = await fetch(API_ENDPOINT + `/rooms`);
  return await response.json();
};
 
export const getEvent = async (id) => {
  const response = await fetch(API_ENDPOINT + `/event/${id}`);
  return await response.json();
};


export const commitUser = async (options) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response = await fetch(API_ENDPOINT + '/users', requestOptions );
  return await response.json();
};


export const searchEvents = async (options) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  };
  const response = await fetch(API_ENDPOINT + '/event', requestOptions );
  return await response.json();
};

