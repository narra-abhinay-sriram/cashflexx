import express from "express"
import db from "@repo/db/client"

const app=express()
app.post("/hdfcserver",async(req:any ,res :any)=>{

    const paymentinfo :
        {token :string,
        amount:string,
        userid:string}={token:req.body.token,
                        amount:req.body.amount,
                        userid:req.body.userid}

try{
    await db.$transaction([

         db.balance.updateMany({
            where:{
                userid:Number(paymentinfo.userid)
            },
            data:{
                amount:{
                    increment:Number(paymentinfo.amount)
                }
            }
        }),
         db.onramp.updateMany({
            where:{
                   token:paymentinfo.token
            },
            data:{
                status:"success"
            }
        })
    ]),
    res.json({msg:"captured"})


}
catch(e){
    console.error(e)
    res.status(411).json({
        message:"Error while processing webhook"
    })
}

})

app.listen(3003)