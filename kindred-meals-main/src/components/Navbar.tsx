import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, User, Calendar, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGenderBasePath } from "@/hooks/use-gender-path";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const base = useGenderBasePath();

  const NavLinks = () => (
    <>
      <Link to={`${base}/discover`} className="inline-flex">
        <Button variant="ghost" className="text-foreground hover:bg-primary/10">
          <Calendar className="ml-2 h-4 w-4" />
          لقاءاتي
        </Button>
      </Link>
      <Link to={`${base}/discover`} className="inline-flex">
        <Button variant="ghost" className="text-foreground hover:bg-primary/10">
          <Heart className="ml-2 h-4 w-4" />
          الأصدقاء
        </Button>
      </Link>
      <Link to={`${base}/profile`} className="inline-flex">
        <Button variant="ghost" className="text-foreground hover:bg-primary/10">
          <User className="ml-2 h-4 w-4" />
          الملف الشخصي
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="bg-card/90 backdrop-blur-sm border-b border-border sticky top-0 z-50" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">لقاءات عشاء</h1>
              <p className="text-xs text-muted-foreground">اجتماعية</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavLinks />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Badge className="gradient-sunset text-white px-3 py-1 hidden sm:flex">
              لقاء قادم غداً
            </Badge>
            
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-sm gradient-primary text-white">أح</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">أحمد محمد</p>
                <p className="text-xs text-muted-foreground">نشط</p>
              </div>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-right">القائمة</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <NavLinks />
                  <hr className="border-border" />
                  <Button variant="ghost" className="justify-start text-foreground">
                    <Settings className="ml-2 h-4 w-4" />
                    الإعدادات
                  </Button>
                  <Button variant="ghost" className="justify-start text-destructive">
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;