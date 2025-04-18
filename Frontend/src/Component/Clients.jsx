import React, { useState } from "react";
import MakingAvatar from "./MakeingAvtar";

const getName = (username) => {
  const parts = username.split(" ");
  let ans = parts[0];

  if (parts.length > 1 && parts[1]) {
    ans += " " + parts[1][0]; // adds first character of second name
  }

  return ans;
};

function Clients({username}) {
    const shortUserName=getName(username);

    

  return (
    <div>
      <MakingAvatar name={username} size={55}/>
      <h4>{shortUserName}</h4>
      
    </div>
  );
}

export default Clients;
