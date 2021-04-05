const express = require('express');
const fs = require('fs');
const app = express(),
      bodyParser = require("body-parser");
      port = 3081;

let order = {};

const { createCanvas } = require('canvas');

const createImage = (text, color) => {
    const width = 1200;
    const height = 600;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.fillStyle = color;
    context.fillRect(0, 0, width, height);

    context.font = 'bold 70pt Menlo';
    context.textAlign = 'center';
    context.textBaseline = 'top';

    const textWidth = context.measureText(text).width;
    context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120);
    context.fillStyle = '#fff';
    context.fillText(text, 600, 170);

    const buffer = canvas.toBuffer('image/png');

    fs.writeFileSync('./image.png', buffer); 
  
};

app.use(bodyParser.json());

app.post('/api/order', (req, res) => {
  const newOrder = req.body.order;
  order = newOrder;
  res.json("order created");
  //console.log('Order updated:>>>:', {order});
  createImage(order.text, order.color);
});

app.get('/api/order', (req, res) => {
    //console.log('api/orders ', {order})
    res.json(order);
  });

app.get('/', (req,res) => {
    res.send('App alive');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});