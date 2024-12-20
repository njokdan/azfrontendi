import express from 'express';
import { DefaultAzureCredential } from '@azure/identity';
import fetch from 'node-fetch';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set views directory

// Controller functions
const getAccessToken = async () => {
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken('api://0c284651-7008-47ab-96ba-96fe1c5a7650/.default');
    return tokenResponse.token;
};

const getHomePage = (req, res) => {
    res.render('home', { title: 'Home Page' });
};

const getHealthStatus = (req, res) => {
    res.status(200).send({ status: 'UP' });
};

const callBackendFunction = async (req, res) => {
    try {
        const token = await getAccessToken();
        const name = "Daniel";
        const response = await fetch(`https://webappbackendi.azurewebsites.net/api/callout?name=${encodeURIComponent(name)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        //console.log(response);
        const data = await response.text();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// Routes
app.get('/', getHomePage); // Home route
app.get('/health', getHealthStatus); // Health check route
app.get('/api/function-call', callBackendFunction); // Function call route

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
