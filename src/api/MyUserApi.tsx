import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import type { User } from "@/types";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// =========================================================================
// 1. GET USER HOOK
// =========================================================================
export const useGetMyUser = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  const getMyUserRequest = async (): Promise<User> => {
    if (!isAuthenticated) {
      throw new Error("User not authenticated");
    }

    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  };

  // FIX: Wrapped parameters in an options object with queryKey and queryFn
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error,
  } = useQuery({
    queryKey: ["fetchCurrentUser"],
    queryFn: getMyUserRequest,
    enabled: !isLoading && isAuthenticated,
  });

  if (error) {
    toast.error(error.toString());
  }

  return { currentUser, isLoading: isUserLoading };
};

// =========================================================================
// 2. CREATE USER HOOK
// =========================================================================
type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateMyUser = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const createMyUserRequest = async (user: CreateUserRequest) => {
    if (!isAuthenticated) {
      throw new Error("User not authenticated");
    }

    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }
  };

  // FIX: Wrapped inside object option and renamed isLoading to isPending
  const {
    mutateAsync: createUser,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: createMyUserRequest,
  });

  return {
    createUser,
    isLoading: isPending, // Maps back to the original property name for UI compatibility
    isError,
    isSuccess,
  };
};

// =========================================================================
// 3. UPDATE USER HOOK
// =========================================================================
type UpdateMyUserRequest = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

export const useUpdateMyUser = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
    if (!isAuthenticated) {
      throw new Error("User not authenticated");
    }

    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return response.json();
  };

  // FIX: Wrapped inside object option and renamed isLoading to isPending
  const {
    mutateAsync: updateUser,
    isPending,
    isSuccess,
    error,
    reset,
  } = useMutation({
    mutationFn: updateMyUserRequest,
  });

  if (isSuccess) {
    toast.success("User profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return { updateUser, isLoading: isPending };
};