const port=4000;

const express = require('express');

const app = express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");

const multer=require("multer");
const path=require("path");

const cors=require("cors");
const { error } = require('console');



app.use(express.json());
app.use(cors());
// need to add mongo password and username in here for connection otherwise it can not be work 
mongoose.connect("mongodb://ecommerceMern:@cluster0-shard-00-00.ngbqq.mongodb.net:27017,cluster0-shard-00-01.ngbqq.mongodb.net:27017,cluster0-shard-00-02.ngbqq.mongodb.net:27017/ecommerce-mern?ssl=true&replicaSet=atlas-12a2sh-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0")
const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=> {
       return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload=multer({storage:storage})
app.use('/images',express.static('upload/images'))

const Product=mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }, 
})

app.get("/",(req,res)=>{
    res.send("Hello from server");
})

app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("All products fetched");
        res.send(products);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add this code to your Express server
app.get('/newcollections', async (req, res) => {

    let products = await Product.find({});
    // Get the last 8 products, excluding the first one
    let newcollection = products.slice(1).slice(-8);
    console.log("All collections fetched");
    res.send(newcollection);

});
app.get('/popularproducts', async (req, res) => {

    let products = await Product.find({category:"men"});
   
    // Get the last 8 products, excluding the first one
    let popularproducts = products.slice(0,4);
    console.log("All collections fetched");
    res.send(popularproducts);

});

const fetchUser=async (req,res,next)=> {
    const token=req.header('auth-token');

    if(!token) {
        res.status(401).send({errors:"not valid auth"})
    }else {
       try{
        const data=jwt.verify(token,'secret_ecom');
        req.user=data.user;
        next();
       }catch(error) {
        res.status(401).send({errors:"not authorized"})
       }
    }
}
app.post('/addtocart,',fetchUser,async(req,res)=> {
    let userData=await User.findOne({_id:req.user.id})
    userData.cardData[req.body.itemId]+=1;
    await User.findOneAndUpdate({_id:req.user.id},
     { cardData:userData.cardData}  
    );
    res.send("Added");
 })
 app.post('/removefromcart,',fetchUser,async(req,res)=> {
    let userData=await User.findOne({_id:req.user.id})
    if( userData.cardData[req.body.itemId]>0)
      userData.cardData[req.body.itemId]-=1;
      await User.findOneAndUpdate({_id:req.user.id},
     { cardData:userData.cardData}  
    );
    res.send("removed");
 });
 app.post('/getcart,',fetchUser,async(req,res)=> {
    let userData=await User.findOne({_id:req.user.id})
     res.json(userData.cardData)
 });
app.post("/addproduct",async(req,res)=>{
    let products=await Product.find({});
    let id;
    if (products.length>0){
        let last_product = products[products.length - 1]; 
        id = last_product.id + 1; 
    }else {
        id=1;
    }

    app.post("/upload",upload.single('product'),(req,res)=> {
        res.json({
            success:1,
            image_url:`http://localhost:${port}/images/${req.file.filename}`
        })
        })
app.post('/removeproduct',async(req,res)=> {
   await Product.findOneAndDelete({id:req.body.id});
   res.json({
       success:true,
       name:req.body.name,
   })
})
  const product=new Product({
    id:id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,
  });
  await product.save();
  res.json({
    success:true,
    name:req.body.name,

  });
});


const User = mongoose.model('User', {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cardData: { type: Object },
    date: { type: Date, default: Date.now() },
});

app.post('/signup',async (req,res)=> {
    let check=await User.findOne({email:req.body.email});
    if (check) {
        return res.status(400).json({success:false,errors:"exist"});
    }
    let cart={};
    for (let i =0;i<300;i++) {
        cart[i]=0;
    }
    const user=new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cardData:cart,
       
    })
    await user.save();
    const data={
        user:{
            id:user._id          
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})
app.post('/login',async (req,res)=> {
    let user=await User.findOne({email:req.body.email});
    if(user) {
        const passMatch=req.body.password===user.password;
        if(passMatch) {
            const data={
                user:{
                    id:user.id          
                }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }else{
            res.json ({success:false,errors:"wrong password"});
        }
    }else{
        res.json({success:false,errors:"wrong email"})
    }
})
app.listen(port,(error)=>{
    if(!error) {
        console.log("Server running on port ${port}"+port);
    }else {
        console.log("error"+error);
    }
   
})
