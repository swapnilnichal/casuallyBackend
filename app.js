const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const secrete_api_code = process.env.secrete_api_code + "";
const stripe = require('stripe')(secrete_api_code);
const PORT = process.env.PORT || 7000;
const base_Url = process.env.base_Url + ""  || "http://localhost:3000" ;

app.use(express.json());
app.use(cors());

// checkout Integration
app.post("/api/create-checkout-session", async(req,res)=>{
    const {products} = req.body;
    const lineItems = products.map((product)=>({
       price_data : {
         currency : "inr",
         product_data : {
            name : product.data.title
         },
         unit_amount : product.data.price * 100,
       },
       quantity : 1
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types : ["card"],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${base_Url}/success`,
        cancel_url: `${base_Url}/cancel`,
      });
      res.json({id:session.id})
})

app.listen(PORT,()=>{
    console.log('listening on 7000 port');
})