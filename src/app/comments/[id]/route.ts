// import comments from './data'
import { comments } from "../data";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){

    const {id}= await params;
    console.log(params)
    let what =comments.filter(c=>parseInt(id)===c.id)//filter returns array
    let comm =comments.find(c=>parseInt(id)===c.id)
    
    return Response.json(comm)
}

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){

    const body= await request.json();
    const {id}=await params

    const objIndex=comments.findIndex(o=>o.id===parseInt(id))

    comments[objIndex].text=body.text

    return Response.json(comments)


}