import axios, { isAxiosError } from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBasicDetails } from "../redux/slices/Room";
import { useEffect } from "react";

export const useAuth = () => {
  const naviagate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const isAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/user`,
          {
            withCredentials: true,
          }
        );

        const user = res.data.user;
        dispatch(
          setBasicDetails({
            name: user.displayName,
            profile: user.photos[0].value,
            email: user.emails[0].value,
          })
        );
        naviagate("/dashboard");
      } catch (err) {
        if (isAxiosError(err)) {
          console.log(err.message);
        }
      }
    };
    isAuth();
  }, [dispatch, naviagate]);
};
