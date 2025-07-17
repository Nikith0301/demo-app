// 'use client';
import { userAgent } from 'next/server';
import React from 'react'


let reviews = [
 { id: "this is some good stuff"},
  {id: "Not satisfied"},
  {id: "I am happy"}
];

// const reviews = [
//   { id:1,name: 'Leanne', review: 'This is some good stuff' },
//   {id:2, name: 'Ervin', review: 'Not satisfied' },
//   {id:3, name: 'Clementine', review: 'I am happy' },
//   {id:4, name: 'Patricia', review: 'Could be better' }
// ];

// console.log(reviews)
export default async function page({params}:{params:Promise<{userid:string}>}) {

console.log ( (await params).userid )
let name=(await params).userid 

  return (
    <>
    <h1>All Reviews</h1>
{/* {reviews.map(review=>(<h3 key={review.id}>{review.name} says {review.review}</h3>))} */}

{reviews.map(r=>(<li>{name} says {r.id}</li>))}

    </>
  )
}
