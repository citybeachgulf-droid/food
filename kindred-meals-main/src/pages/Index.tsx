import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredGender } from "@/hooks/use-gender";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const gender = getStoredGender();
    if (!gender) {
      navigate("/select", { replace: true });
      return;
    }
    navigate(gender === "men" ? "/men/home" : "/women/home", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-warm">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">جارٍ التحميل...</p>
      </div>
    </div>
  );
};

export default Index;
