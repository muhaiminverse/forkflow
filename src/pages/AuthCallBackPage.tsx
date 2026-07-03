import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallBackPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { createUser } = useCreateMyUser();

  const hasCreatedUser = useRef(false);
  useEffect(() => {
    if (!isAuthenticated || isLoading || hasCreatedUser.current) {
      return;
    }

    if (user?.sub && user?.email) {
      void createUser({ auth0Id: user.sub, email: user.email });
      hasCreatedUser.current = true;
      navigate("/");
    }
  }, [createUser, isAuthenticated, isLoading, navigate, user?.email, user?.sub]);

  return <>Loading...</>
}

export default AuthCallBackPage;