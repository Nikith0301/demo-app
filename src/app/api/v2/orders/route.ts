import { prisma } from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server";
// if(service=="WCFDC"){
  //   amt=4000
  // }
  // else if(service=="WCLC"){
  //   amt=2000
  // }
  //  else if(service=="1BHK"){
  //   amt=3000
  // }
  //  else if(service=="2BHK"){
  //   amt=6000
  // }
  //  else if(service=="WS"){
  //   amt=800
  // }
  
  // else if(service=="ES"){
  //   amt=1000
  // }
  // else if(service=="ER"){
  //   amt=400
  // }

  //  else if(service=="CWS"){
  //   amt=7000
  // }
  //  else if(service=="WCLC"){
  //   amt=1200
  // }
  //  else if(service=="CD"){
  //   amt=1300
  // }
  //  else if(service=="CIS"){
  //   amt=9000
  // }
  //  else if(service=="PVC"){
  //   amt=2000
  // }
  //  else if(service=="PSR"){
  //   amt=2000
  // }
  //  else if(service=="WLR"){
  //   amt=2000
  // }


export  async function POST(req:Request){

  const body= await req.json()

  let amt=0;
  //considering no discunts now


  const serviceMap = {
  // 🚰 PLUMBING
  "PVC": { service: "PLUMBING", subservice: "Plumbing Visiting Charge", amt: 2000 },
  "PSR": { service: "PLUMBING", subservice: "Plumbing Service Repair", amt: 2000 },
  "WLR": { service: "PLUMBING", subservice: "Water Leakage Repair", amt: 2000 },

  // ⚡ ELECTRIC
  "WS":  { service: "ELECTRIC", subservice: "Wiring Service", amt: 800 },
  "ES":  { service: "ELECTRIC", subservice: "Electrical Service", amt: 1000 },
  "ER":  { service: "ELECTRIC", subservice: "Electrical Repair", amt: 400 },

  // 🧹 CLEANING
  "WCFDC": { service: "CLEANING", subservice: "Washroom Full Deep Cleaning", amt: 4000 },
  "WCLC":  { service: "CLEANING", subservice: "Washroom Light Cleaning", amt: 2000 },
  "1BHK": { service: "CLEANING", subservice: "1BHK Full Deep Cleaning", amt: 3000 },
  "2BHK": { service: "CLEANING", subservice: "2BHK Full Deep Cleaning", amt: 6000 },

  // 🚗 CAR WASH
  "CWS": { service: "CAR WASH", subservice: "Car Wash Service", amt: 7000 },
  "CIS": { service: "CAR WASH", subservice: "Car Interior Service", amt: 9000 },
  "CD":  { service: "CAR WASH", subservice: "Car Detailing", amt: 1300 },
};

type ServiceCode = keyof typeof serviceMap;
const code = body.code as ServiceCode;
const details = serviceMap[code];

//* const details = serviceMap["SOMTHINGNOT IN serviceMap"]; //invalid
//? const details = serviceMap["CD"];// valid cuz its there in service Map

if (details) {
  const { service, subservice, amt } = details;
  console.log(service, subservice, amt);
} else {
  console.log("Invalid service code");
}

const createdOrder=await prisma.order.create({
  data:{
    lead:{
      connect:{id:body.leadId},
    },
    service:details.service,
    subservice:details.subservice,
    date:body.date,
    revenue:details.amt,
    status:body.status 
  }
})

return Response.json(createdOrder)
}




export async function GET() {
    const today = new Date();
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 30);


const upcomingOrders = await prisma.order.findMany({
  where: {
    date: {
      gte: today,       // Greater than or equal to today
      lte: nextWeek,    // Less than or equal to 7 days from now
    },
  },
});

  return Response.json(upcomingOrders);
}

