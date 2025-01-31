// authPersist.js
import { loginSuccess, logoutSuccess } from "./authSlice";
import { authAPI } from "./authAPI";

export const loadStoredAuth = async (store) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      store.dispatch(logoutSuccess());
      return false;
    }

    try {
      const response = await authAPI.verify();

      if (response.data?.isAuthenticated && response.data?.user) {
        store.dispatch(
          loginSuccess({
            token,
            user: response.data.user,
          })
        );
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      localStorage.removeItem("token");
      store.dispatch(logoutSuccess());
      return false;
    }
  } catch (error) {
    console.error("Auth initialization failed:", error);
    localStorage.removeItem("token");
    store.dispatch(logoutSuccess());
    return false;
  }
};

export { logoutSuccess };
