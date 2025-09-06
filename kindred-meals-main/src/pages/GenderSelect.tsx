import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useGender } from "@/hooks/use-gender";

const GenderSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setGender } = useGender();

  const handleSelect = (value: "men" | "women") => {
    setGender(value);
    const next = value === "men" ? "/men/home" : "/women/home";
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    navigate(redirect || next, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-card border-0 bg-card">
        <CardHeader>
          <CardTitle className="text-center text-2xl">اختر الواجهة المناسبة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button className="gradient-primary" onClick={() => handleSelect("women")}>واجهة السيدات</Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" onClick={() => handleSelect("men")}>
              واجهة الرجال
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            لضمان بيئة منفصلة ومريحة، ستكون التجربة مخصصة حسب الاختيار.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenderSelect;

