import AWS from 'aws-sdk';

import config from '../config.js';

export async function invokeApig({ path, method = 'get', body }) {
  const url = `${config.apiGateway.URL}${path}`;
  const stringBody = body ? JSON.stringify(body) : body;
  const results = await fetch(url, {
    method,
    body: stringBody
  });

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
};

