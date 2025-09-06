import { Navigate, useLocation } from "react-router-dom";
import { getStoredGender } from "@/hooks/use-gender";

type Props = { to: "home" | "profile" | "discover" | "personality-test" };

const RootRedirect = ({ to }: Props) => {
  const gender = getStoredGender();
  const location = useLocation();
  if (!gender) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/select?redirect=${redirect}`} replace />;
  }
  const base = gender === "men" ? "/men" : "/women";
  return <Navigate to={`${base}/${to}`} replace />;
};

export default RootRedirect;

