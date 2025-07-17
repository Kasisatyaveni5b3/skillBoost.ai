
import { useContext } from "react";
import UserContext from "./usercontext";

function Profile1() {
  const user = useContext(UserContext);
  return(
    <p>{user}</p>
  )
}

export default Profile1;
