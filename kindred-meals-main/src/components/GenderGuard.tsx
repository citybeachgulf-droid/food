import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredGender, UserGender } from "@/hooks/use-gender";

type GenderGuardProps = {
  allowed: UserGender;
};

const GenderGuard = ({ allowed }: GenderGuardProps) => {
  const location = useLocation();
  const gender = getStoredGender();

  if (!gender) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/select?redirect=${redirect}`} replace />;
  }

  if (gender !== allowed) {
    const target = gender === "men" ? "/men/home" : "/women/home";
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
};

export default GenderGuard;

