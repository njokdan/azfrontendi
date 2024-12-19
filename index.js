import { DefaultAzureCredential } from '@azure/identity';
import fetch from 'node-fetch';

async function getAccessToken() {
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken('api://0c284651-7008-47ab-96ba-96fe1c5a7650/.default');
    return tokenResponse.token;
}

async function callBackend() {
    const token = await getAccessToken();

    const response = await fetch('https://webappbackendi.azurewebsites.net/api/callout?', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
}

callBackend().catch(err => console.error(err));