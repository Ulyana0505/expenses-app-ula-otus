import { useAuth } from "../auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    navigate("/");
    auth.logout();
  }, [auth, navigate]);
  return null;
}
