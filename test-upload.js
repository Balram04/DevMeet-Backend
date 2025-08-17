const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUploadEndpoint() {
  try {
    // Test if the endpoint is accessible
    const response = await axios.get('http://localhost:3000/profile/view', {
      headers: {
        'Cookie': 'token=test' // This would need a real token
      }
    });
    console.log('Profile endpoint is accessible');
  } catch (error) {
    console.log('Profile endpoint test:', error.response?.status || error.message);
  }
}

testUploadEndpoint();
