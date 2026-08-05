import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
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
import CommercialPropertyVideoSydney from "@/pages/commercial-property-video-sydney";
import IndustrialWarehousePropertyVideo from "@/pages/industrial-warehouse-property-video";
import CommercialPhotographyDrone from "@/pages/commercial-photography-drone";
import HotelHospitalityVideo from "@/pages/hotel-hospitality-video";
import CaseStudies from "@/pages/case-studies";
import CaseStudyDetail from "@/pages/case-study-detail";
import CommercialOfficeVideo from "@/pages/commercial-office-video";
import DevelopmentMarketingVideo from "@/pages/development-marketing-video";
import DroneAerialVideo from "@/pages/drone-aerial-video";
import BlogCommercialPropertyVideo from "@/pages/blog-commercial-property-video";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

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
      <Route path="/development-marketing-video-sydney" component={DevelopmentMarketingVideo} />
      <Route path="/drone-aerial-property-video-sydney" component={DroneAerialVideo} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/commercial-property-video-production-sydney" component={BlogCommercialPropertyVideo} />
      <Route path="/commercial-property-video-production-sydney" component={CommercialPropertyVideoSydney} />
      <Route path="/industrial-warehouse-property-video" component={IndustrialWarehousePropertyVideo} />
      <Route path="/commercial-property-photography-drone" component={CommercialPhotographyDrone} />
      <Route path="/hotel-hospitality-property-video" component={HotelHospitalityVideo} />
      <Route path="/case-studies/:slug" component={CaseStudyDetail} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTop />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
