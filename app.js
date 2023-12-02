const express = require('express');
const app = express();
const cors = require('cors');
const stripe = require('stripe')('sk_test_51OGxqwSA044I0aiR3ufe2jgVXP8MxpYRXg4htYhqsfBI9T61b9R0jx1D2HshYWqCinvyab5Jvn2w8KK9qWzztR0b00EkW0Y4Tm');

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
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/cancel`,
      });
      res.json({id:session.id})
})

app.listen(7000,()=>{
    console.log('listening on 7000 port');
})