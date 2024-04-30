const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000 ;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sahed96.5o5zjc5.mongodb.net/?retryWrites=true&w=majority&appName=Sahed96`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftCollection = client.db('craftDB').collection('crafts')
    const craftCollection2 = client.db('craftDB').collection('categoryData')

    app.get('/addCraft', async (req, res) =>{
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    
    app.get('/categoryCraft', async (req, res) =>{
        const cursor = craftCollection2.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    
    app.post('/addCraft', async (req, res) =>{
      const newCraft = req.body
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })

    app.get('/myCraft/:email', async (req, res) =>{
      const newCraft = req.params.email
      console.log(newCraft);
      const result = await craftCollection.find({email: newCraft}).toArray();
      res.send(result);
    })

    app.get('/categoryCraft/:subcategory_name', async (req, res) =>{
      const categoryCraft = req.params.subcategory_name
      console.log(newCraft);
      const result = await craftCollection.find({subcategory_name: categoryCraft}).toArray();
      res.send(result);
    })

    app.delete('/addCraft/:id', async (req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result)
      console.log(result);
    })

    
    app.patch('/addCraft/:id', async (req, res)=>{
      const updateCraft =req.body;
      const id = req.params.id
      const filter = {_id : new ObjectId(id)}
      const craft = {
        $set:{
          item_name: updateCraft.item_name,
          image: updateCraft.item_name,
          price: updateCraft.price,
          short_description: updateCraft.short_description,
          rating: updateCraft.rating,
          time: updateCraft.time,
          subcategory_name: updateCraft.subcategory_name,
          customization: updateCraft.customization,
          stock_status: updateCraft.stock_status
        }
      }
      const result = await craftCollection.updateOne(filter, craft);
      res.send(result)
    })

    app.get('/addCraft/:id', async (req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await craftCollection.findOne(query);
      res.send(result)
      console.log(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Arts & Craft is running')
})

app.listen(port, () =>{
    console.log(`Arts & Craft server running on port: ${port} `);
})