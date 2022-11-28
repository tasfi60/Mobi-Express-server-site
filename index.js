const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config();
const stripe = require("stripe")('sk_test_51M95RRCGJ92yXcF7wgGtNXvxeiQRJTYhVcZvSPnmzXKxaMxrJ6OB8QAjKZQqBWZnBcZS5nK5uor9gA3Qed7nTe7300xXBtpUmn');
const app = express();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.idbesa6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//iJQ4FlrhIIts7TbV



async function run(){
  try{
        const categoryCollection = client.db('Mobile_Express').collection('category');
        const categorydetailsCollection = client.db('Mobile_Express').collection('category_details');
        const bookingsCollection = client.db('Mobile_Express').collection('bookings');
        const usersCollection = client.db('Mobile_Express').collection('users');
        const addCollection = client.db('Mobile_Express').collection('addvertisement');
        const wishlistCollection = client.db('Mobile_Express').collection('wishlist');

       

       //Category
        

        app.get('/category', async(req,res) =>{
          const query = {};
          const cursor = categoryCollection.find(query);
          const category = await cursor.toArray();
          res.send(category); 
        });

        app.post('/category', async (req, res) => {
          const product = req.body;
          const result = await categorydetailsCollection.insertOne(product);
          res.send(result);
      })

     


      app.get('/category/category_details',async(req,res) => {
            
          const displayName = req.query.displayName;
          console.log(displayName);
          const query = { displayName:displayName };
          const cursor = await categorydetailsCollection.find(query);
          const users = await cursor.toArray();
          res.send(users);

    });


    
      


        app.get('/category/:category_id',async(req,res) => {
            
          const category_id = req.params.category_id;
          const query = {category_id: category_id};
          const cursor = await categorydetailsCollection.find(query);
          const single_category = await cursor.toArray();
          res.send(single_category);

        });

       
          //bookings


          app.post('/bookings', async(req,res) =>{
            const booking =  req.body;
            console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result); 
          });

          app.get('/bookings', async (req, res) => {
          const email = req.query.email;
          console.log(email);
          const query = { email:email };
          const cursor = await bookingsCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        });

        //users
       
        app.post('/users', async(req,res) =>{
          const users =  req.body;
          console.log(users);
          const result = await usersCollection.insertOne(users);
          res.send(result); 
        });


        
        app.get('/users', async(req,res) =>{
          const query = {};
          const cursor =  usersCollection.find(query);
          const allusers = await cursor.toArray();
          res.send(allusers); 
        });

        app.get('/users', async(req,res) =>{
          const email = req.query.email;
          console.log(email);
          const query = { email:email };
          const cursor = await usersCollection.find(query);
          const users = await cursor.toArray();
          res.send(users);
        });

        // app.put('/users', async(req,res) =>{
        //   const user =  req.body;
        //   console.log(user);
        //   const option = {upsert:true};
        //   const updateUser = {
        //     $set: {
        //       name : user.displayName,
        //       email: user.email,
        //       photoURL: user.photoURL,
        //       usertype: user.usertype
        //     }
        //   }
        //   const result = await addCollection.updateOne(user,updateUser,option);
        //   res.send(result); 
        // });

      //   app.put('/users',async(req,res) =>{
      //     const email = req.params.email;
      //     const filter = {email: email};
      //     const user = req.body;
      //     const option = {upsert: true}; 
          
      //       const Updateduser = {
      //         $set: {
      //           name: user.displayName,
      //           email: user.email,
      //           photoURL: user.photoURL,
      //           usertype: user.usertype
      //         }
      //       }
      //       const result = await usersCollection.updateOne(filter,Updateduser,option);
      //       res.send(result);
           
            
      // });


      app.delete('/users/:email',async(req,res) =>{
        const email = req.params.email;
        const query = {email: email};
        const result = await usersCollection.deleteOne(query);
        res.send(result);
        console.log('trying to delete',email);
    }); 


      //Advertisement


        app.put('/addCollection', async(req,res) =>{
          const addvertise =  req.body;
          console.log(addvertise);
          const option = {upsert:true};
          const Updateadd = {
            $set: {
              img: addvertise.img,
              saleprice: addvertise.saleprice,
              condition: addvertise.condition,
              product: addvertise.product
            }
          }
          const result = await addCollection.updateOne(addvertise,Updateadd,option);
          res.send(result); 
        });

        app.get('/addCollection', async(req,res) =>{
          const query = {};
          const cursor =  addCollection.find(query);
          const add = await cursor.toArray();
          res.send(add); 
        });

        //Admin

        app.get('/users/admin/:email', async (req, res) => {
          const email = req.params.email;
          const query = { email: email }
          const user = await usersCollection.findOne(query);
          res.send({ isAdmin: user?.role === "admin" });
        
      })

      app.get('/users/seller/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);
        res.send({ isSeller: user?.role === 'seller' || user?.usertype === 'seller' });
    })


    
      app.put('/users/seller/:id', async (req, res) => {

        // const decodedEmail = req.decoded.email;
        // const query = { email: decodedEmail };
        // const user = await usersCollection.findOne(query);

        // if (user?.role !== 'admin') {
        //     return res.status(403).send({ message: 'forbidden access' })
        // }

        const id = req.params.id;
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                role: 'seller'
            }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
    });

    

    

    app.delete('/category/:category_id',async(req,res) =>{
      const category_id = req.params.category_id;
      console.log('trying to delete',category_id);
      const query = {category_id: category_id};
      const result = await categorydetailsCollection.deleteOne(query);
      res.send(result);
      
  }); 

   ///wishlist

   app.put('/wishlist', async(req,res) =>{
    const wishlist =  req.body;
    console.log(wishlist);
    const option = {upsert:true};
    const Updateadd = {
      $set: {
        img: wishlist.img,
        saleprice: wishlist.saleprice,
        description: wishlist.description,
        condition: wishlist.condition,
        product: wishlist.product
      }
    }
    const result = await wishlistCollection.updateOne(wishlist,Updateadd,option);
    res.send(result); 
  });

  app.get('/wishlist/:uid', async(req,res) =>{
    const uid = req.params.uid;
    console.log(uid);
    const query = { uid:uid };
    const cursor =  wishlistCollection.find(query);
    const result = await cursor.toArray();
    res.send(result);
  });
    
  //payment

  app.get('/bookings/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: ObjectId(id) };
    const result = await bookingsCollection.findOne(query)
    res.send(result);
  });

    // app.post('/create-payment-intent', async(req,res) => {
    //     const booking = req.body;
    //     const price = booking.price;
    //     const amount = price * 100;

    //     const paymentIntent = await stripe.paymentIntents.create({
    //       currency: 'usd',
    //       amount: amount,
    //       "payment_method_types":[
    //         "card"
    //       ]
    //     });
    //     res.send({
    //         clientSecret: paymentIntent.client_secret,
    //     });
    // })



       



       
  }
  finally{

  }

}

run().catch(err => console.error(err));


// const category = require('./data/category.json');
// const categorydetails = require('./data/categorydetails.json');

// app.get('/category', (req,res) => {
//   res.send( category);
  
// })
// app.get('/category/:id', (req,res) => {
//     const id = req.params.id;
//     const category_details = categorydetails.filter(n => n._id === id);
//     res.send(category_details );
  
// })



app.get('/',(req,res) => {
    res.send('Simple node Server is Running');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
