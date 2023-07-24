const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x6iur0l.mongodb.net/?retryWrites=true&w=majority`;

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

//    await client.connect();
   const collegeCollection = client.db('collegeInformation').collection('colleges');
   const reviewCollection = client.db('collegeInformation').collection('reviews');
   const feedbackCollection = client.db('collegeInformation').collection('feedback');
   const myCollection = client.db('collegeInformation').collection('myCollege');
   const usersCollection =  client.db('collegeInformation').collection('users');

    
   
    app.get('/users', async(req,res)=>{
      const result = await usersCollection.find().toArray()
      res.send(result)
    })
   app.get('/users/:email', async(req,res)=>{
    const userEmail = req.params.email;
    const result = await usersCollection.findOne({email:userEmail})
    res.send(result)
   })

app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  console.log(id, user)
  const filter = { _id: new ObjectId(id) }
  const option = { upsert: true }
  const updateDoc = {
    $set: {
      photo: user.photo,
       name: user.name

    },
  }
  const result = await usersCollection.updateOne(filter, updateDoc, option)
  res.json(result)
})

    app.post('/users', async (req, res) => {
      const user = req.body;
      // console.log(user)
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'user already exist' })
      }
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    
    app.get('/college', async(req,res)=>{
      const result = await collegeCollection.find().toArray()
      res.send(result)
    })
    // app.get('/colleges/:text', async (req, res) => {
    //   const searchText = req.params.text;
    //   const result = await collegeCollection.find({
    //     $or: [
    //       { college_name: { $regex: searchText, $options: 'i' } }
    //     ]
    //   }).toArray()
    //   res.json(result)
    // })

    app.get('/college/details/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await collegeCollection.findOne(query)
      res.send(result)
    })
 
    app.get('/college/card', async(req,res)=>{
      const result = await collegeCollection.find().limit(3).toArray()
      res.send(result)
    })

    app.get('/reviews', async(req,res)=>{
      const result = await reviewCollection.find().limit(3).toArray()
      res.send(result)
    })
  app.post('/reviews', async (req,res)=>{
       const feedback = req.body;
       const result = await reviewCollection.insertOne(feedback)
       res.send(result)
  })
  app.post('/feedback', async (req, res) => {
    try {
      const feedback = req.body;
      const result = await feedbackCollection.insertOne(feedback);
      res.json({ modifiedCount: result.insertedCount });
    } catch (error) {
      console.error('Error posting feedback:', error);
      res.status(500).json({ modifiedCount: 0 });
    }
  });
  
  // my collage 
  app.get('/myCollege', async(req,res)=>{
    const result = await myCollection.find().toArray()
    res.send(result)
  })
  app.post('/myCollege',async(req,res)=>{
    const myCollege = req.body;
    const result = await myCollection.insertOne(myCollege)
    res.send(result)
  })
  // review 
 
   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Server is running now')
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
