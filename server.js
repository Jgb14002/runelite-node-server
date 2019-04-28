const config = require('./config/config');
const http = require('http');
const app = require('./app');

const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Started server on port: ${port}`);
});
