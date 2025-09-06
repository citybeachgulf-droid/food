import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, MapPin, Calendar, Users, Heart, Star } from "lucide-react";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      <Navbar />
      <div className="container mx-auto max-w-4xl p-4 pt-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">الملف الشخصي</h1>
          <p className="text-muted-foreground">اجعل ملفك الشخصي يعكس شخصيتك الحقيقية</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="shadow-card border-0 bg-card">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-2xl gradient-primary text-white">أح</AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 gradient-primary h-10 w-10 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-2">أحمد محمد</h2>
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>الرياض، السعودية</span>
              </div>
              
              <div className="flex justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">لقاء</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-muted-foreground">تقييم</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">8</div>
                  <div className="text-sm text-muted-foreground">أصدقاء</div>
                </div>
              </div>

              <Button 
                onClick={() => setIsEditing(!isEditing)}
                className="w-full gradient-primary"
              >
                {isEditing ? "حفظ التغييرات" : "تعديل الملف الشخصي"}
              </Button>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="shadow-card border-0 bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">الاسم</Label>
                    <Input 
                      id="name" 
                      defaultValue="أحمد محمد" 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">العمر</Label>
                    <Input 
                      id="age" 
                      defaultValue="28" 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">نبذة شخصية</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="اكتب نبذة قصيرة عن نفسك..."
                    defaultValue="مهندس برمجيات أحب اكتشاف المطاعم الجديدة والتعرف على أشخاص من خلفيات ثقافية متنوعة. أستمتع بالمحادثات العميقة والضحك."
                    disabled={!isEditing}
                    className="mt-1 min-h-20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="shadow-card border-0 bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">الاهتمامات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["الطبخ", "السفر", "التقنية", "الكتب", "الرياضة", "الموسيقى", "الفن", "الطبيعة"].map((interest) => (
                    <Badge key={interest} variant="secondary" className="px-3 py-1">
                      {interest}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" className="mt-4">
                    <span className="ml-2">+</span>
                    إضافة اهتمام جديد
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="shadow-card border-0 bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">التفضيلات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>النظام الغذائي</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">لا توجد قيود</Badge>
                  </div>
                </div>
                
                <div>
                  <Label>الميزانية المفضلة</Label>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">50-100 ريال</Badge>
                  </div>
                </div>
                
                <div>
                  <Label>اللغات</Label>
                  <div className="flex gap-2 mt-2">
                    <Badge className="gradient-primary text-white">العربية</Badge>
                    <Badge variant="outline">الإنجليزية</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card border-0 bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">عشاء في مطعم الأصالة</p>
                      <p className="text-sm text-muted-foreground">قبل 3 أيام</p>
                    </div>
                    <div className="mr-auto flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Heart className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">أضفت صديقًا جديدًا</p>
                      <p className="text-sm text-muted-foreground">قبل أسبوع</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;