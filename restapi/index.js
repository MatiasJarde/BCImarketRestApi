const express = require('express');
let bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const timestamp = require('time-stamp');

const app = express();
const port = 3000;

app.use(bodyParser.json());

//example items
let items = [
  {
    id: 1,
    title: "pieni orava",
    desc: "jätti",
    category: "eläin",
    location: "hesa",
    price: 500,
    date: "13.12.2020",
    deliveryType: "Pickup",
    name: "elisa",
    tel: "1234234234"
  },
  {
    id: 2,
    title: "iso kypärä",
    desc: "jätti",
    category: "",
    location: "oulu",
    price: 12,
    date: "13.12.2020",
    deliveryType: "Pickup",
    name: "Matias",
    tel: "1234234234"
  },
  {
    id: 3,
    title: "volvo 850",
    desc: "nätti kaara",
    category: "auto",
    location: "oulu",
    price: 3,
    date: "13.12.2020",
    deliveryType: "Shipping",
    name: "Matias",
    tel: "1234234234"
  },
];
//example users
let users = [
  {
    id: 1,
    name: "matias",
    email: "asd",
    password: bcrypt.hashSync("asd", 6)
  },
  {
    id: 2,
    name: "elisa",
    email: "asd@asd.fi",
    password: bcrypt.hashSync("asd", 6)
  }
];

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//get all items

app.get('/items', (req, res) => {
  res.send(items);
});

//post an item

app.post('/items', (req, res) => {
  const { title, desc, category, location, price, deliveryType, name, tel } = req.body;
  if (!title) {
    res.status(400).send('Title is required');
    return;
  }
  if (!desc) {
    res.status(400).send('Description is required');
    return;
  }
  if (!location) {
    res.status(400).send('Location is required');
    return;
  }
  if (!price) {
    res.status(400).send('Price is required');
    return;
  }
  if (!tel) {
    res.status(400).send('Phone number is required');
    return;
  }

  const item = {
    id: items.length + 1,
    title: title,
    desc: desc,
    category: category,
    location: location,
    price: price,
    date: timestamp('DD.MM.YYYY HH:mm:ss'),
    deliveryType: deliveryType,
    name: name,
    tel: tel
  };
  items.push(item);
  res.status(201).send(item);
});

//get item by id

app.get('/item/:id', (req, res) => {
  let item = items.find(c => c.id === parseInt(req.params.id));
  if (!item) res.status(404).send('Item not found');
  res.send(item);
});

//item delete

app.delete('/item/:id', (req, res) => {
  const typedId = items.findIndex((e) => e.id == req.params.id);
  if (typedId === -1) {
    res.status(404).send("Item Id Not Found");
    return;
  }

  items.splice(typedId, 1);
  res.status(200).send("Item Id: " + req.params.id + " deleted");

});

//modify item

app.put('/item/:id', (req, res) => { 
  const resultToModify = items.find(c => c.id === parseInt(req.params.id));
  if (resultToModify === undefined) {
    res.status(404).send("Item Id Not Found");
    return;
  }
  if (resultToModify.name !== req.body.name) {
    res.status(403).send("Name does not match");
    return;
  }

  let modified = false;
  for (const key in req.body) {
    if (key in resultToModify) {
      resultToModify[key] = req.body[key];
      modified = true;
    }
  }
  if (modified) {
    res.status(200).json(resultToModify);
  } else {
    res.status(400).send("Bad request");
  }
});


//user endpoints

app.post('/user/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    res.status(400).send('Name is required');
    return;
  }
  if (!email) {
    res.status(400).send('Email is required');
    return;
  }
  if (!password) {
    res.status(400).send('Password is required');
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, 6);
    let user = {
      id: users.length + 1,
      name: name,
      email: email,
      password: hashedPassword
    };
    users.push(user);
    res.status(201).send({ user });
});

app.get('/users', (req, res) => {
  res.send(users);
});

app.get('/user/:id', (req, res) => {
  let user = users.find(c => c.id === parseInt(req.params.id));
  if (!user) res.status(404).send('User not found');
  res.send(user);
});

//user LOGIN

app.get("/user/login", (req, res) => {
    
  }
);

// search

app.get('/item/:searchtype/:keyword', (req, res) => {
  if (
    req.params.searchtype.toLowerCase() !== 'location' &&
    req.params.searchtype.toLowerCase() !== 'category' &&
    req.params.searchtype.toLowerCase() !== 'date'
  ) {
    res.status(400).send("Invalid searchtype");
    return;
  }
  const results = items.filter((e) =>
    e[req.params.searchtype]
      .toLowerCase().includes(req.params.keyword.toLowerCase())
  );
  if (results.length > 0) {
    res.json({ results });
  } else {
    res.status(404).send("No results found");
  }
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});