/** @license MIT */
import express from 'express';

const app = express();
const port = 42069;

app.use(express.static(process.cwd()));
app.listen(port, () => {
  console.log(`Dev at: http://localhost:${port}/widget.dev.html`);
});
