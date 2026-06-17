import { useGetStats, getGetStatsQueryKey, useGetAuditLog, getGetAuditLogQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck, TerminalSquare, BookOpen, FileText, Activity, Server, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function HomeTab({ setTab }: { setTab: (tab: string) => void }) {
  const { data: stats, isLoading: statsLoading } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: auditLog, isLoading: logLoading } = useGetAuditLog({ query: { queryKey: getGetAuditLogQueryKey() } });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Hero Section */}
      <motion.div variants={item} className="relative rounded-2xl border border-border bg-card/30 overflow-hidden isolate">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        
        <div className="relative p-8 md:p-12 flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-info"></span>
            Open Source · Research · 2026
          </div>
          
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Prompt<span className="text-primary">Guard</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              An elite security operations center for AI prompt injection research. 
              Simulate attacks, test defensive layers, and run live red-team sessions against Claude.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a href="https://github.com/promptguard/promptguard" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 border border-border text-sm font-medium transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <Badge variant="outline" className="px-4 py-2 text-sm bg-card">MIT License</Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full bg-card" />)
        ) : (
          <>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Attacks Simulated</CardTitle>
                <Activity className="h-4 w-4 text-info" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-white">{stats?.attacksSimulated || 0}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Defenses Tested</CardTitle>
                <ShieldCheck className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-white">{stats?.defensesTested || 0}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Vulnerabilities Found</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-white">{stats?.vulnerabilitiesFound || 0}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Defenses</CardTitle>
                <Server className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-white">{stats?.activeDefenses || 0}</div>
              </CardContent>
            </Card>
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Links */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-primary" /> Lab Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="group hover:border-destructive/50 transition-colors cursor-pointer bg-card border-border" onClick={() => setTab("simulator")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="w-5 h-5" /> Attack Simulator
                </CardTitle>
                <CardDescription>Launch predefined injection payloads against unprotected models to observe failure modes.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:border-success/50 transition-colors cursor-pointer bg-card border-border" onClick={() => setTab("defense")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <ShieldCheck className="w-5 h-5" /> Defense Lab
                </CardTitle>
                <CardDescription>Configure mitigation strategies and test their effectiveness against various attack vectors.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:border-warning/50 transition-colors cursor-pointer bg-card border-border" onClick={() => setTab("redteam")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <TerminalSquare className="w-5 h-5" /> Live Red-Team
                </CardTitle>
                <CardDescription>Engage in free-form adversarial conversation with real-time threat analysis.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:border-info/50 transition-colors cursor-pointer bg-card border-border" onClick={() => setTab("cases")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-info">
                  <BookOpen className="w-5 h-5" /> Case Studies
                </CardTitle>
                <CardDescription>Review historical prompt injection vulnerabilities and their real-world impact.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </motion.div>

        {/* Live Audit Log */}
        <motion.div variants={item} className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> System Audit Log
          </h2>
          <Card className="bg-card border-border flex flex-col h-[400px]">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">REAL-TIME EVENTS</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3 font-mono text-xs">
              {logLoading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full bg-secondary" />)
              ) : auditLog && auditLog.length > 0 ? (
                auditLog.slice(0, 10).map((log) => (
                  <div key={log.id} className="p-2 rounded bg-secondary/50 border border-border/50 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{format(new Date(log.timestamp), 'HH:mm:ss')}</span>
                      {log.defenseTriggered ? (
                        <span className="text-success flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> BLOCKED</span>
                      ) : (
                        <span className="text-destructive flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> PERMITTED</span>
                      )}
                    </div>
                    <div className="text-white truncate" title={log.action}>{log.action}</div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No events recorded yet.</div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
