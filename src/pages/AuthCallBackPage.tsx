import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ------------------

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { createUser } = useCreateMyUser();

  const hasCreatedUser = useRef(false);

  useEffect(() => {
    const ensureUserProfile = async () => {
      if (!user?.sub || !user?.email || hasCreatedUser.current) {
        navigate("/");
        return;
      }

      hasCreatedUser.current = true;

      try {
        await createUser({ auth0Id: user.sub, email: user.email });
      } catch (error) {
        console.error("Failed to create user profile", error);
        toast.error("Could not set up your profile. Please try again.");
      } finally {
        navigate("/");
      }
    };

    ensureUserProfile();
  }, [createUser, navigate, user]);

  return <>Loading...</>;
};

export default AuthCallbackPage;