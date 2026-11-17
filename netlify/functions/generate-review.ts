import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { businessName, category = 'general', selectedTags = [] } = payload;

    if (!businessName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing businessName' })
      };
    }

    const tagsSentence = selectedTags.length > 0 
      ? `the ${selectedTags.join(' and ')}` 
      : 'the great service';

    const suggestions = [
      {
        vibe: 'enthusiastic',
        text: `Had an amazing experience at ${businessName}! What stood out most was ${tagsSentence}. Everything was top notch from start to finish. Will definitely be returning soon!`
      },
      {
        vibe: 'concise',
        text: `Great experience with ${businessName}! Really appreciated ${tagsSentence}. Highly recommend to anyone!`
      },
      {
        vibe: 'detailed',
        text: `Visited ${businessName} today and was thoroughly impressed. The attention to detail and ${tagsSentence} made a huge impression. Professional, courteous, and dependable.`
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        businessName,
        category,
        suggestions
      })
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
