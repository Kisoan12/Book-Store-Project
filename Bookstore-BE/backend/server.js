const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db/config'); 

const Admin = require('./models/Admin');
const User = require('./models/User');
const Seller = require('./models/Seller');
const Item = require('./models/Item');
const Order = require('./models/Order');
const Wishlist = require('./models/Wishlist');

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173', methods: ['GET','POST','PUT','DELETE'], credentials: true }));


const PORT = process.env.PORT || 4000;


app.post('/alogin', async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.json("no user");
    if (admin.password !== req.body.password) return res.json("login fail");

    return res.json({ Status: "Success", user: admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/asignup', async (req, res) => {
  try {
    const exists = await Admin.findOne({ email: req.body.email });
    if (exists) return res.json("Already have an account");

    await Admin.create(req.body);
    return res.json("Account Created");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/signup', async (req, res) => {
  console.log('SIGNUP hit with body:', req.body);
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.json("Already have an account");

    await User.create(req.body);
    res.json("Account Created");
  } catch (err) {
    console.error('SIGNUP error:', err);
    res.status(500).json({ error: err.message });
  }
});


app.post('/login', async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (!exists) return res.json("User not found");
    if (exists.password !== req.body.password) return res.json("Invalid Password");

    res.json({ Status: "Success", user: exists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/ssignup', async (req, res) => {
  try {
    const exists = await Seller.findOne({ email: req.body.email });
    if (exists) return res.json("Already have an account");

    await Seller.create(req.body);
    res.json("Account Created");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/slogin', async (req, res) => {
  try {
    const seller = await Seller.findOne({ email: req.body.email });
    if (!seller) return res.json("no user");
    if (seller.password !== req.body.password) return res.json("login fail");

    res.json({ Status: "Success", user: seller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    console.log('POST /items payload:', req.body); 
    const item = await Item.create(req.body);
    console.log('Created item:', item); 
    res.status(201).json(item);
  } catch (err) {
    console.error('Create item error:', err);
    res.status(400).json({ error: "Failed to create item" });
  }
});


app.get('/item', async (req, res) => {
  try {
    res.json(await Item.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 

app.get('/item/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/getitem/:userId', async (req, res) => {
  try {
    res.json(await Item.find({ userId: req.params.userId }));
  } catch {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.delete('/itemdelete/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

app.post('/userorder', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch {
    res.status(400).json({ error: "Failed to create order" });
  }
});

app.get('/getorders/:userId', async (req, res) => {
  try {
    res.json(await Order.find({ userId: req.params.userId }));
  } catch {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});


app.get('/orders', async (req, res) => {
  try {
    res.json(await Order.find());
  } catch {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.post('/wishlist/add', async (req, res) => {
  try {
    const { itemId, userId } = req.body;
    if (!itemId || !userId) {
      return res.status(400).json({ error: 'itemId and userId are required' });
    }

    const exists = await Wishlist.findOne({ itemId: req.body.itemId, userId: req.body.userId });
    if (exists) return res.status(400).json({ msg: "Item already in wishlist" });

    const saved = await Wishlist.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    console.error('WISHLIST add error:', err);
    res.status(500).json({ error: "Failed to add" });
  }
});


app.get('/wishlist/:userId', async (req, res) => {
  try {
    res.json(await Wishlist.find({ userId: req.params.userId }));
  } catch {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

app.post('/wishlist/remove', async (req, res) => {
  try {
    const { itemId, userId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'itemId required' });

    
    const query = {};
    
    if (req.body._id) {
      query._id = req.body._id;
    } else {
      query.itemId = itemId;
      if (userId) query.userId = userId;
    }

    const deleted = await Wishlist.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ error: 'Wishlist item not found' });

    return res.json({ ok: true, deleted });
  } catch (err) {
    console.error('WISHLIST remove error:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});


app.get('/wishlist', async (req, res) => {
  try {
    res.json(await Wishlist.find());
  } catch {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error('Delete user error', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.delete('/sellers/:id', async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error('Delete seller error', err);
    res.status(500).json({ error: 'Failed to delete seller' });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error('Delete order error', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const all = await User.find();
    res.json(all);
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/sellers', async (req, res) => {
  try {
    const all = await Seller.find();
    res.json(all);
  } catch (err) {
    console.error('GET /sellers error:', err);
    res.status(500).json({ error: 'Failed to fetch sellers' });
  }
});



app.get('/_health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
