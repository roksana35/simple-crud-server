const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port=process.env.PORT || 5000;


// roksanaakter7235
// HR6nQPTBEOhYrNAy

// middlewar
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://roksanaakter7235:HR6nQPTBEOhYrNAy@cluster0.qmgfwvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
    const userCollection = client.db("userDB").collection('users');
    // const userDatabase = database.collection("users");

    app.get('/users',async(req,res)=>{
      const cursor=userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const quary={_id:new ObjectId(id)}
      const user= await userCollection.findOne(quary);
      res.send(user)
    })

    app.post("/users",async(req,res)=>{
      const user =req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
      console.log('new user:',user)
    })
    app.put('/users/:id',async(req,res)=>{
      const id=req.params.id;
      const user=req.body;
      const filter={_id:new ObjectId(id)}
      console.log(user,id)
      const options={upsert:true}
      const updateuser={
        $set:{
          name:user.name,
          email:user.email
        }
      }
      const result=await userCollection.updateOne(filter,updateuser,options);
      res.send(result)
    })

    app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id;
      const quary={_id:new ObjectId(id)}
      const result=await userCollection.deleteOne(quary);
      res.send(result)
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


app.get('/',(req,res)=>{
    res.send('simple crud server is runing')
})
app.listen(port,()=>{
    console.log(`port is runing:${port}`)
})