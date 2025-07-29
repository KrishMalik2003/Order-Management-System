const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/shop_orders', { useNewUrlParser: true, useUnifiedTopology: true });

const orderSchema = new mongoose.Schema({
    employeeId: String,
    customerName: String,
    items: [
      {
        name: String,
        quantity: Number
      }
    ],
    itemNames: [String], 
    status: String,
    address:String
  });
  

  orderSchema.index({
    customerName: 'text',
    itemNames: 'text',
    status: 'text'
  });  
  const Order = mongoose.model('Order', orderSchema);

app.get('/api/orders', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching orders' });
    }
  });

app.post('/api/orders', async (req, res) => {
    const { employeeId, customerName,address,  status, items } = req.body;
  
   
    const newOrder = new Order({
      employeeId,
      customerName,
      status,
      address,
      items: [] ,
      itemNames: req.body.items.map(item => item.name),
    });
  
    await newOrder.save();  
  
    
    if (Array.isArray(items) && items.length > 0) {
      await Order.updateOne(
        { _id: newOrder._id },
        { $push: { items: { $each: items } } }
      );
    }
  
    res.json({ id: newOrder._id, message: 'Order created and items pushed with $each' });
  });

app.get('/api/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

app.put('/api/orders/:id', async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, req.body);
  res.sendStatus(200);
});

app.delete('/api/orders/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});


app.get('/api/orders/search/:query', async (req, res) => {
    const query = req.params.query;
  
    try {
      const orders = await Order.find({ $text: { $search: query } });
      res.json(orders);
    } catch (error) {
      console.error('Smart text search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(3000, () => console.log('Server running on port 3000'));
