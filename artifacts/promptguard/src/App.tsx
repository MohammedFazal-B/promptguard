import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ShieldAlert, ShieldCheck, TerminalSquare, BookOpen, FileText } from "lucide-react";

import HomeTab from "@/components/tabs/home-tab";
import AttackSimulatorTab from "@/components/tabs/attack-simulator-tab";
import DefenseLabTab from "@/components/tabs/defense-lab-tab";
import RedTeamTab from "@/components/tabs/red-team-tab";
import CaseStudiesTab from "@/components/tabs/case-studies-tab";
import DocumentationTab from "@/components/tabs/documentation-tab";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function MainDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans dark">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">PromptGuard</h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">AI Prompt Injection Security Lab</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-xs font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <TabsList className="bg-secondary/50 border border-border p-1 overflow-x-auto flex w-full justify-start md:justify-center rounded-lg">
            <TabsTrigger value="home" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:text-primary">
              <Shield className="w-4 h-4" /> Home
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:text-destructive">
              <ShieldAlert className="w-4 h-4" /> Attack Simulator
            </TabsTrigger>
            <TabsTrigger value="defense" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:text-success">
              <ShieldCheck className="w-4 h-4" /> Defense Lab
            </TabsTrigger>
            <TabsTrigger value="redteam" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:text-warning">
              <TerminalSquare className="w-4 h-4" /> Live Red-Team
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:text-info">
              <BookOpen className="w-4 h-4" /> Case Studies
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:text-foreground">
              <FileText className="w-4 h-4" /> Documentation
            </TabsTrigger>
          </TabsList>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TabsContent value="home" className="m-0 focus-visible:outline-none">
              <HomeTab setTab={setActiveTab} />
            </TabsContent>
            <TabsContent value="simulator" className="m-0 focus-visible:outline-none">
              <AttackSimulatorTab />
            </TabsContent>
            <TabsContent value="defense" className="m-0 focus-visible:outline-none">
              <DefenseLabTab />
            </TabsContent>
            <TabsContent value="redteam" className="m-0 focus-visible:outline-none">
              <RedTeamTab />
            </TabsContent>
            <TabsContent value="cases" className="m-0 focus-visible:outline-none">
              <CaseStudiesTab />
            </TabsContent>
            <TabsContent value="docs" className="m-0 focus-visible:outline-none">
              <DocumentationTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
