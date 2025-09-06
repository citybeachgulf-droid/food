import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PersonalityTest from "./pages/PersonalityTest";
import Discover from "./pages/Discover";
import NotFound from "./pages/NotFound";
import GenderSelect from "./pages/GenderSelect";
import GenderGuard from "@/components/GenderGuard";
import RootRedirect from "@/components/RootRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/select" element={<GenderSelect />} />
          {/* Legacy root routes -> redirect to gendered paths */}
          <Route path="/home" element={<RootRedirect to="home" />} />
          <Route path="/profile" element={<RootRedirect to="profile" />} />
          <Route path="/discover" element={<RootRedirect to="discover" />} />
          <Route path="/personality-test" element={<RootRedirect to="personality-test" />} />
          <Route path="/men" element={<GenderGuard allowed="men" />}>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="personality-test" element={<PersonalityTest />} />
            <Route path="discover" element={<Discover />} />
          </Route>
          <Route path="/women" element={<GenderGuard allowed="women" />}>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="personality-test" element={<PersonalityTest />} />
            <Route path="discover" element={<Discover />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
