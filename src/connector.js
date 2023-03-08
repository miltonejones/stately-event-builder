const API_ENDPOINT = 'https://34m4mho8me.execute-api.us-east-1.amazonaws.com';


export const getEvents = async () => {
  const response = await fetch(API_ENDPOINT + `/events`);
  return await response.json();
};

export const getRooms = async (id) => {
  const response = await fetch(API_ENDPOINT + `/rooms`);
  return await response.json();
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
  const response = await fetch(API_ENDPOINT + '/event', requestOptions );
  return await response.json();
};

