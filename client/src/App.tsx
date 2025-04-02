import { Switch, Route } from "wouter";
import Dashboard from "@/pages/dashboard";
import Certificates from "@/pages/certificates";
import Users from "@/pages/users";
import AccessPolicies from "@/pages/access-policies";
import Schedules from "@/pages/schedules";
import AuditLogs from "@/pages/audit-logs";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/certificates" component={Certificates} />
      <Route path="/users" component={Users} />
      <Route path="/access-policies" component={AccessPolicies} />
      <Route path="/schedules" component={Schedules} />
      <Route path="/audit-logs" component={AuditLogs} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
