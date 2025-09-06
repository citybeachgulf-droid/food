import { HeroButton } from "@/components/ui/hero-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MapPin, Calendar, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useGenderBasePath } from "@/hooks/use-gender-path";
import heroImage from "@/assets/hero-dinner.jpg";

const Home = () => {
  const base = useGenderBasePath({ defaultToSelect: true });
  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <Badge className="mb-6 gradient-sunset text-white px-6 py-2 text-lg animate-float">
              ✨ اكتشف أصدقاء جدد حول مائدة العشاء
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              لقاءات عشاء 
              <span className="gradient-primary bg-clip-text text-transparent"> اجتماعية</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              انضم إلى مجموعات صغيرة من الأشخاص المتوافقين معك واستمتع بأمسيات عشاء لا تُنسى في أفضل مطاعم مدينتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={`${base}/discover`}>
                <HeroButton variant="primary" className="min-w-48">
                  <Heart className="ml-2 h-5 w-5" />
                  ابدأ رحلتك الاجتماعية
                </HeroButton>
              </Link>
              <Link to={`${base}/profile`}>
                <HeroButton variant="secondary" className="min-w-48">
                  <Users className="ml-2 h-5 w-5" />
                  تعرف على التطبيق
                </HeroButton>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={heroImage} 
              alt="أشخاص يستمتعون بالعشاء معاً"
              className="rounded-3xl shadow-card w-full max-w-4xl mx-auto animate-float"
            />
            <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-glow animate-bounce">
              <Star className="h-8 w-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            كيف يعمل التطبيق؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-warm transition-smooth border-0 bg-gradient-warm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">إنشاء الملف الشخصي</h3>
                <p className="text-muted-foreground leading-relaxed">
                  أنشئ ملفك الشخصي وأجب على اختبار الشخصية القصير لنجد لك الأشخاص الأنسب للتفاعل معهم
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-warm transition-smooth border-0 bg-gradient-warm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-sunset rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">اختيار المطعم</h3>
                <p className="text-muted-foreground leading-relaxed">
                  نختار لك مطعماً مناسباً في مدينتك بناءً على تفضيلاتك الغذائية وميزانيتك المحددة
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-warm transition-smooth border-0 bg-gradient-warm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">لقاء العشاء</h3>
                <p className="text-muted-foreground leading-relaxed">
                  التق بخمسة أشخاص جدد كل أسبوع واستمتع بمحادثات شيقة وتجارب طعام رائعة
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-12">
            <Shield className="h-16 w-16 gradient-primary rounded-2xl p-4 mx-auto mb-6 shadow-glow" />
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              الأمان والخصوصية أولويتنا
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              نحن ملتزمون بتوفير بيئة آمنة ومريحة لجميع المستخدمين مع حماية كاملة لخصوصيتك
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card shadow-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">التحقق من الهوية</h3>
              <p className="text-muted-foreground">جميع المستخدمين يخضعون للتحقق من الهوية قبل المشاركة</p>
            </div>
            <div className="p-6 rounded-2xl bg-card shadow-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">حماية البيانات</h3>
              <p className="text-muted-foreground">لا نشارك بياناتك الشخصية مع أي جهات خارجية</p>
            </div>
            <div className="p-6 rounded-2xl bg-card shadow-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">الإبلاغ والدعم</h3>
              <p className="text-muted-foreground">فريق دعم متاح 24/7 للتعامل مع أي مشاكل أو استفسارات</p>
            </div>
            <div className="p-6 rounded-2xl bg-card shadow-card">
              <h3 className="text-xl font-semibold mb-3 text-foreground">لقاءات في أماكن عامة</h3>
              <p className="text-muted-foreground">جميع اللقاءات تتم في مطاعم عامة معروفة وآمنة</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-sunset">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            جاهز لبدء رحلتك الاجتماعية؟
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            انضم إلى آلاف الأشخاص الذين يكتشفون صداقات جديدة كل أسبوع
          </p>
          <Link to={`${base}/personality-test`}>
            <HeroButton variant="secondary" className="bg-white text-primary hover:bg-white/90 min-w-60">
              <Heart className="ml-2 h-5 w-5" />
              ابدأ الآن مجاناً
            </HeroButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;