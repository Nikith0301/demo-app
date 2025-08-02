"use client";

import { LeadSummary} from "@/app/actions/lead-func2";
import { useState } from "react";

export default  function Page() {

  const[data,setData]=useState<any>()  
  
  console.log(data);
  return (
  
    <>
      <button
        onClick={async () => {
          let result = await LeadSummary();
          setData(result);
        }}
      >
        Fetch
      </button>
    </>
  );
}
