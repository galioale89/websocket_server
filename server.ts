import app from './app';
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname +'/.env'});

let port = process.env.PORT || app.PORT;

app.server.listen(port, () => {
    console.log(`Server running in ${port}`);
});