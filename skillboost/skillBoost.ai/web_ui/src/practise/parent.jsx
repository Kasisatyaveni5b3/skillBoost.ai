// App.js
import React, { useState } from "react";
import UserContext from "./usercontext";
import Login from "./login";

function Parent() {
  return (
    <div>
        <UserContext.Provider value="kasi">
            <h1>welcome user</h1>
            <Login/>
        </UserContext.Provider>

    </div>
  )
}

export default Parent;
