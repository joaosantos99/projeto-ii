import express from 'express';

import env from './env.js';

const app = express();

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
