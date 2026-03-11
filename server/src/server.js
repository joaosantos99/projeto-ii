import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.status(200).json({status: "ok"});
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
