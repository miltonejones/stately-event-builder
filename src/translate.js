
const API_ENDPOINT = 'https://69ksjlqa37.execute-api.us-east-1.amazonaws.com';


export const translateText = async (target, value) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: 'en',
      value,
      target: [target]
    }),
  };
  const response = await fetch(API_ENDPOINT, requestOptions );
  return await response.json();
};
 