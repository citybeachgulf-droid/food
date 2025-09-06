import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // توجيه المستخدم إلى الصفحة الرئيسية
    navigate("/home");
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
