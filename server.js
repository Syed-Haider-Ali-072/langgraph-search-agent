import express from "express";
import { generate } from "./chatbot.js";
import cors from 'cors';
const app = express();
const port = 30001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to CHATDPT!')
});

app.post('/chat', async (req, res) => {
    const { message , threadid} = req.body;

    // todo: validation above fields
    if (!message || !threadid) {
         res.status(400).json({message: 'All fields are required'});
         return;
    }
    console.log('Message', message);

    const result = await generate(message,threadid);
    res.json({ message: result });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
});
