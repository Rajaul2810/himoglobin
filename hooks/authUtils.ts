import useAuthStore from "@/store/authStore";

export const getUserType = () => {
    const { token } = useAuthStore((state: any) => state)
    if (token) {
      try {
        const tokenParts = token.split(".");
        const tokenPayload = tokenParts[1];
        const decodedPayload = atob(tokenPayload);
        const payloadObj = JSON.parse(decodedPayload);
  
        // console.log("User type:", payloadObj?.UserType);
  
        return {
          userType: payloadObj?.UserType || null,
          id: payloadObj?.UserId || null,
        }; // Return userType id or null if not present
      } catch (error: any) {
        console.error("Error decoding token:", error.message);
        return null; // Handle invalid token
      }
    }
    return null; // No token found
  };