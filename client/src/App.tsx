import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Certificates from "@/pages/certificates";
import Groups from "@/pages/groups";
import Permissions from "@/pages/permissions";
import AuditLogs from "@/pages/audit-logs";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import MainLayout from "@/layouts/main-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <MainLayout><Dashboard /></MainLayout>} />
      <Route path="/certificates" component={() => <MainLayout><Certificates /></MainLayout>} />
      <Route path="/groups" component={() => <MainLayout><Groups /></MainLayout>} />
      <Route path="/permissions" component={() => <MainLayout><Permissions /></MainLayout>} />
      <Route path="/audit-logs" component={() => <MainLayout><AuditLogs /></MainLayout>} />
      <Route path="/settings" component={() => <MainLayout><Settings /></MainLayout>} />
      <Route path="/profile" component={() => <MainLayout><Profile /></MainLayout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
