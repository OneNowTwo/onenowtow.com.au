import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Portfolio from "@/pages/portfolio";
import About from "@/pages/about";
import Enquire from "@/pages/enquire";
import Thanks from "@/pages/thanks";
import NotFound from "@/pages/not-found";
import CommercialOfficeVideo from "@/pages/commercial-office-video";
import IndustrialWarehouseVideo from "@/pages/industrial-warehouse-video";
import DevelopmentMarketingVideo from "@/pages/development-marketing-video";
import DroneAerialVideo from "@/pages/drone-aerial-video";
import BlogCommercialPropertyVideo from "@/pages/blog-commercial-property-video";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/about" component={About} />
      <Route path="/enquire" component={Enquire} />
      <Route path="/thanks" component={Thanks} />
      <Route path="/commercial-office-video-sydney" component={CommercialOfficeVideo} />
      <Route path="/industrial-warehouse-video-sydney" component={IndustrialWarehouseVideo} />
      <Route path="/development-marketing-video-sydney" component={DevelopmentMarketingVideo} />
      <Route path="/drone-aerial-property-video-sydney" component={DroneAerialVideo} />
      <Route path="/blog/commercial-property-video-production-sydney" component={BlogCommercialPropertyVideo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
