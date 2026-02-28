import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Chatbot from "@/pages/Chatbot";
import Eligibility from "@/pages/Eligibility";
import Calculator from "@/pages/Calculator";
import AppLayout from "@/components/layout/AppLayout";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chat" component={Chatbot} />
        <Route path="/eligibility" component={Eligibility} />
        <Route path="/calculator" component={Calculator} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
