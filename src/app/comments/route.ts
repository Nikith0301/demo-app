import { NextRequest } from "next/server";
import { comments } from "./data";

export async function GET(request:NextRequest) {

  const searchParams= request.nextUrl.searchParams
  const query=searchParams.get("query")
  console.log(query)
  const filtered_comments=query ? comments.filter((d)=>d.text.includes(query)) : comments

  console.log(filtered_comments)

  return Response.json(filtered_comments);
}



export async function POST(request: Request) {
  let newdata = await request.json();
  console.log("MAHORAMA SAYS",newdata)
  let newComment = { id: comments.length + 1, text: newdata.text };

  comments.push(newComment);
  return Response.json(comments);
}


