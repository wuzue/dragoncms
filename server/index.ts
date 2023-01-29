import express, {Request, Response} from 'express'
const dbConnect = require("./db/dbConnect")

const app = express();
const port = 3000;

dbConnect();

app.get('/', (req : Request, res : Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});