'use client';

import React, { useState } from 'react'

export default function Counter() {
   const [count,incCount]= useState(0);
   
  return (
    <>
    <h1>Count is {count}</h1>
    <button onClick={()=>{incCount(count+1)}}>counter</button>
    </>
  )
}
