import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma"; 



export async function POST(req:NextRequest){

    const { filter = {}, sort = {}, pagination = {} } = await req.json();

    const {
        leadName,
        leadPhone,
        leadStatus,
        leadSource,
        leadEmail
    }=filter;
    // const result=await prisma.order.findMany({where :{status:'COMPLETED'}})
    // const result=await prisma.serviceInOrder.findMany({where :{name:{contains:'cleaning',mode:"insensitive"}}})
//     const result = await prisma.serviceInOrder.findMany({
//   where: {
//     name: { contains: 'cleaning', mode: 'insensitive' },
//     order: {
//       customer_id: '4060674f-018f-4a1e-90a2-0e581c5db665'
//     }
//   },
//   include:{
//     order:{
//         include:{customer:true}
//     },
//     subServices:true
//   }
// });
let leadCond:any={};    
let serviceCond:any={};
let orderContd:any={};

if(leadName)leadCond.name={}
leadCond.name=leadName

if(leadPhone)leadCond.phone=leadPhone
if(leadStatus)leadCond.lead_status=leadStatus
if(leadSource)leadCond.source=leadSource
if(leadEmail)leadCond.email=leadEmail

serviceCond.totalAmount={}
serviceCond.totalAmount.lt=9000
serviceCond.order=orderContd

orderContd.status="PENDING"
orderContd.customer=leadCond

const result=await prisma.subServiceInOrder.findMany({
    where:{
        amount:{gte:1000},
        service:serviceCond
    }
})


    return Response.json({result})
}