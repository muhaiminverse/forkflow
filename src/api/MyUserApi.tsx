import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import type { User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get MyUser API

export const useGetMyUser = () =>{
  const { getAccessTokenSilently, isAuthenticated, isLoading: isAuthLoading } = useAuth0();

  const getMyUserRequest = async (): Promise<User> => {
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

  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["fetchCurrentUser"],
    queryFn: getMyUserRequest,
    enabled: isAuthenticated && !isAuthLoading,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return { currentUser, isLoading };
};

// Create MyUser API
type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyUserRequest = async (user: CreateUserRequest) => {
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

  const {
    mutateAsync: createUser,
    isPending: isLoading,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: createMyUserRequest, // Pass your function here as an object property
  });

  return {
    createUser,
    isLoading,
    isError,
    isSuccess,
  };
};

// Update MyUser API
type UpdateMyUserRequest = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

export const useUpdateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyUserRequest = async (formData: UpdateMyUserRequest) => {
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

  const {
    mutateAsync: updateUser,
    isPending: isLoading,
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
  
  return { updateUser, isLoading };
};