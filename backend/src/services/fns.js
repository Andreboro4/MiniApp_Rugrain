const axios = require('axios');

const FNS_API_URL = process.env.FNS_API_URL || 'https://api-cloud.ru/api/pb_nalog';
const FNS_API_KEY = process.env.FNS_API_KEY;

async function checkContragent(inn) {
  try {
    const response = await axios.get(`${FNS_API_URL}/check`, {
      params: { inn },
      headers: { 'X-API-Key': FNS_API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error('FNS API error:', error.message);
    return null;
  }
}

module.exports = { checkContragent };