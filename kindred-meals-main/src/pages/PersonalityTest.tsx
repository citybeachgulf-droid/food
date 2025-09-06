import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MessageCircle, Star, Coffee, Music } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const questions = [
  {
    id: 1,
    question: "كيف تفضل قضاء أمسية مثالية؟",
    options: [
      { value: "social", text: "في مطعم مليء بالحيوية مع أصدقاء جدد", icon: Users },
      { value: "intimate", text: "في مكان هادئ مع محادثة عميقة", icon: MessageCircle },
      { value: "adventure", text: "تجربة مطعم جديد وغريب", icon: Star },
      { value: "comfort", text: "في مطعم مألوف مع أجواء مريحة", icon: Coffee }
    ]
  },
  {
    id: 2,
    question: "ما هو أسلوبك في التعامل مع الأشخاص الجدد؟",
    options: [
      { value: "outgoing", text: "أبدأ المحادثة وأحب التعرف على الجميع", icon: Heart },
      { value: "listener", text: "أستمع أكثر وأشارك عندما أشعر بالراحة", icon: MessageCircle },
      { value: "curious", text: "أطرح أسئلة كثيرة لفهم الآخرين", icon: Star },
      { value: "supportive", text: "أركز على جعل الآخرين يشعرون بالراحة", icon: Users }
    ]
  },
  {
    id: 3,
    question: "ما نوع المحادثات التي تستمتع بها أكثر؟",
    options: [
      { value: "deep", text: "مواضيع فلسفية وعميقة", icon: MessageCircle },
      { value: "fun", text: "نكت وقصص مضحكة", icon: Heart },
      { value: "cultural", text: "الثقافات والتقاليد المختلفة", icon: Star },
      { value: "personal", text: "تجارب شخصية وذكريات", icon: Users }
    ]
  },
  {
    id: 4,
    question: "كيف تتعامل مع المواقف الاجتماعية الجديدة؟",
    options: [
      { value: "excited", text: "أشعر بالحماس والطاقة", icon: Heart },
      { value: "cautious", text: "أكون حذراً في البداية ثم أنفتح", icon: MessageCircle },
      { value: "adaptable", text: "أتكيف بسرعة مع الأجواء", icon: Star },
      { value: "observant", text: "أراقب وأتعلم من الآخرين أولاً", icon: Coffee }
    ]
  },
  {
    id: 5,
    question: "ما الذي يجعل المساء ممتعاً بالنسبة لك؟",
    options: [
      { value: "connection", text: "تكوين صداقات حقيقية", icon: Heart },
      { value: "learning", text: "تعلم شيء جديد من الآخرين", icon: Star },
      { value: "fun", text: "الضحك والمرح", icon: Music },
      { value: "sharing", text: "مشاركة التجارب والقصص", icon: Users }
    ]
  }
];

const PersonalityTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const getPersonalityResult = () => {
    const counts = answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominant = Object.entries(counts).sort(([,a], [,b]) => b - a)[0];
    
    const personalities = {
      social: { 
        title: "المتفاعل الاجتماعي", 
        description: "تحب التفاعل مع الناس وتجلب الطاقة الإيجابية للمجموعة",
        color: "gradient-primary"
      },
      intimate: { 
        title: "المستمع الحكيم", 
        description: "تفضل المحادثات العميقة وتخلق روابط قوية مع الآخرين",
        color: "gradient-sunset"
      },
      adventure: { 
        title: "المستكشف الفضولي", 
        description: "تحب التجارب الجديدة وتشجع الآخرين على الخروج من منطقة الراحة",
        color: "bg-accent"
      },
      outgoing: { 
        title: "القائد الودود", 
        description: "تأخذ زمام المبادرة في التعرف على الناس وتجعل الجميع يشعر بالراحة",
        color: "gradient-primary"
      },
      deep: { 
        title: "المفكر العميق", 
        description: "تحب النقاشات المعمقة وتقدر الحوارات الفكرية",
        color: "gradient-sunset"
      }
    };

    return personalities[dominant[0] as keyof typeof personalities] || personalities.social;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    const result = getPersonalityResult();
    
    return (
      <div className="min-h-screen bg-gradient-warm" dir="rtl">
        <Navbar />
        <div className="container mx-auto max-w-2xl p-4 pt-8">
          <Card className="shadow-card border-0 bg-card text-center">
            <CardContent className="p-8">
              <div className={`w-24 h-24 ${result.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Heart className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                شخصيتك الاجتماعية
              </h1>
              
              <Badge className={`${result.color} text-white px-6 py-2 text-lg mb-6`}>
                {result.title}
              </Badge>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {result.description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Card className="p-4 bg-muted/50">
                  <h3 className="font-semibold text-foreground mb-2">نقاط القوة</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• تكوين علاقات إيجابية</li>
                    <li>• إثراء المحادثات</li>
                    <li>• خلق أجواء مريحة</li>
                  </ul>
                </Card>
                
                <Card className="p-4 bg-muted/50">
                  <h3 className="font-semibold text-foreground mb-2">مناسب للقاء مع</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• أشخاص مشابهين في النمط</li>
                    <li>• محبي المحادثات الشيقة</li>
                    <li>• الباحثين عن تجارب جديدة</li>
                  </ul>
                </Card>
              </div>
              
                <Link to="/discover">
                  <Button className="gradient-primary w-full h-12 text-lg">
                    <Heart className="ml-2 h-5 w-5" />
                    ابدأ البحث عن مجموعتك المثالية
                  </Button>
                </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm" dir="rtl">
      <Navbar />
      <div className="container mx-auto max-w-2xl p-4 pt-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-foreground">اختبار الشخصية الاجتماعية</h1>
            <Badge variant="outline" className="px-3 py-1">
              {currentQuestion + 1} من {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-card border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-xl text-center text-foreground">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  variant="outline"
                  className="w-full h-auto p-4 text-right justify-start hover:bg-primary/5 hover:border-primary transition-bounce"
                >
                  <div className="flex items-center gap-3 w-full">
                    <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{option.text}</span>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            أجب بصدق لنتمكن من العثور على الأشخاص المناسبين لك
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalityTest;