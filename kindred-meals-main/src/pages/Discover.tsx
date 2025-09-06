import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Users, Star, Heart, Calendar, Utensils } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLocation } from "react-router-dom";

const mockRestaurants = [
  {
    id: 1,
    name: "مطعم الأصالة العربية",
    cuisine: "مأكولات عربية",
    rating: 4.8,
    priceRange: "100-150 ريال",
    location: "حي الملز، الرياض",
    image: "/api/placeholder/300/200",
    availability: "غداً الساعة 7:00 مساءً"
  },
  {
    id: 2,
    name: "بيت الباستا الإيطالي",
    cuisine: "مأكولات إيطالية",
    rating: 4.6,
    priceRange: "80-120 ريال",
    location: "شارع التحلية، الرياض",
    image: "/api/placeholder/300/200",
    availability: "الخميس الساعة 8:00 مساءً"
  }
];

const mockGroupsWomen = [
  {
    id: 1,
    restaurant: "مطعم الأصالة العربية",
    date: "غداً",
    time: "7:00 مساءً",
    members: [
      { name: "سارة أحمد", avatar: "س", interests: ["الطبخ", "السفر"] },
      { name: "فاطمة خالد", avatar: "ف", interests: ["الكتب", "الفن"] },
      { name: "منى يوسف", avatar: "م", interests: ["الموسيقى", "التصوير"] },
      { name: "ريم صالح", avatar: "ر", interests: ["الطبيعة", "القراءة"] },
    ],
    spotsLeft: 1
  }
];

const mockGroupsMen = [
  {
    id: 1,
    restaurant: "بيت الباستا الإيطالي",
    date: "الخميس",
    time: "8:00 مساءً",
    members: [
      { name: "محمد علي", avatar: "م", interests: ["التقنية", "الرياضة"] },
      { name: "أحمد محمود", avatar: "أ", interests: ["الموسيقى", "التصوير"] },
      { name: "خالد سعيد", avatar: "خ", interests: ["الكتب", "الطبخ"] },
      { name: "سالم ناصر", avatar: "س", interests: ["السفر", "الأفلام"] },
    ],
    spotsLeft: 2
  }
];

const Discover = () => {
  const location = useLocation();
  const isWomen = location.pathname.startsWith("/women");
  const groups = isWomen ? mockGroupsWomen : mockGroupsMen;
  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      <Navbar />
      <div className="container mx-auto max-w-6xl p-4 pt-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">اكتشف لقاءاتك القادمة</h1>
          <p className="text-muted-foreground">المطاعم والمجموعات المقترحة لك بناءً على اهتماماتك</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recommended Groups */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">المجموعات المقترحة</h2>
              <Badge className="gradient-primary text-white px-3 py-1">
                توافق 95%
              </Badge>
            </div>

            {groups.map((group) => (
              <Card key={group.id} className="shadow-card border-0 bg-card mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{group.restaurant}</h3>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{group.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{group.time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">
                      {group.spotsLeft} مقعد متبقي
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-3">أعضاء المجموعة:</p>
                    <div className="flex items-center gap-3">
                      {group.members.map((member, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="gradient-primary text-white text-sm">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{member.name}</p>
                            <div className="flex gap-1">
                              {member.interests.slice(0, 2).map((interest, i) => (
                                <Badge key={i} variant="secondary" className="text-xs px-2 py-0">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-primary text-primary">
                        <span className="text-lg">+</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="gradient-primary flex-1">
                      <Heart className="ml-2 h-4 w-4" />
                      انضم للمجموعة
                    </Button>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      تفاصيل أكثر
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommended Restaurants */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">مطاعم مقترحة</h2>
            
            {mockRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="shadow-card border-0 bg-card mb-4">
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Utensils className="h-12 w-12 text-muted-foreground" />
                  </div>
                  
                  <h3 className="font-bold text-foreground mb-2">{restaurant.name}</h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      <span>{restaurant.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{restaurant.priceRange}</Badge>
                    <Badge className="gradient-sunset text-white">{restaurant.availability}</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    عرض التفاصيل
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            <Card className="shadow-card border-0 bg-gradient-primary text-white">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">لا تجد ما يناسبك؟</h3>
                <p className="text-sm mb-4 opacity-90">
                  اقترح مطعماً جديداً أو وقتاً مختلفاً
                </p>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  اقتراح جديد
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;