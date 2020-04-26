import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/hello', (req, res, next) => {
  res.send("Hello, world!");
  res.end()
  // res.render('index', { title: 'Express' });
});

export default router;
