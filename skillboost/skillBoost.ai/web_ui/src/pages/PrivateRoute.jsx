

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:5000/api/me", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAuth(true);
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    }

    checkAuth();
  }, [navigate]);

  if (isAuth === null) return <p>Checking authentication...</p>;

  return isAuth ? children : null;
}

export default PrivateRoute;
