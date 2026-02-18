const fetch = require('node-fetch');

async function testLeadershipQuery() {
  try {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Who is the CEO?',
        sessionId: 'test-leadership'
      })
    });

    const data = await response.json();
    console.log('Leadership Query Response:');
    console.log(data.response);
  } catch (error) {
    console.error('Error testing leadership query:', error);
  }
}

testLeadershipQuery();