import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { createUser } = useCreateMyUser();

  const hasCreatedUser = useRef(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const createUserProfile = async () => {
      if (isAuthenticated && user?.sub && user?.email && !hasCreatedUser.current) {
        hasCreatedUser.current = true;

        try {
          await createUser({ auth0Id: user.sub, email: user.email });
        } catch (error) {
          console.error("Failed to create user profile", error);
        }
      }

      navigate("/");
    };

    void createUserProfile();
  }, [createUser, isAuthenticated, isLoading, navigate, user]);

  return <>Loading...</>;
};

export default AuthCallbackPage;