import { Route, Switch } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "@/pages/Home";
import BookDetail from "@/pages/BookDetail";
import NotFound from "@/pages/NotFound";
import { usePageTracking } from "@/hooks/usePageTracking";

function Router() {
  usePageTracking();

  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/book/:id"} component={BookDetail} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Router />
    </ThemeProvider>
  );
}

export default App;
