const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
require('dotenv').config()
// doctorCar
// 1MAHHtyicoLMV9BV

console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.44ltncg.mongodb.net/?appName=Cluster0`;

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

   const serviceCollections = client.db('carDoctor').collection('services')
   const bookingCollections = client.db('carDoctor').collection('bookings')
  app.get('/services',async(req,res)=>{
    const cursor = serviceCollections.find();
    const result = await cursor.toArray();
    res.send(result)
  })
  app.get('/services/:id',async(req,res)=>{
   const id = req.params.id;
   const query = { _id: new ObjectId(id) };
   const result = await serviceCollections.findOne(query);
   res.send(result);
  })
  app.get('/bookings',async(req,res)=>{
    let query = {};
    if(req.query?.email){
      query = {email : req.query.email}
    }
    const cursor = bookingCollections.find(query);
    const result = await cursor.toArray();
    res.send(result);
  })
  
  app.post('/bookings',async(req,res)=>{
    const booking = req.body;
    const result = await bookingCollections.insertOne(booking);
    res.send(result);
  })
  
    app.delete('/bookings/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await bookingCollections.deleteOne(query);
      res.send(result)
    })
    app.patch('/bookings/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updatedBooking = req.body;
      console.log(updatedBooking)
      const updateDoc = {
        $set: {
          status: updatedBooking.status
        },
      };
      const result = await bookingCollections.updateOne(filter, updateDoc);
      res.send(result)


    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})