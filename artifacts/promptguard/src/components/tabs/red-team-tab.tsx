import { useState, useRef, useEffect } from "react";
import { useRedTeamChat, useAnalyzeMessage } from "@workspace/api-client-react";
import type { ChatMessage } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TerminalSquare, Send, ShieldAlert, ShieldCheck, Activity, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RedTeamTab() {
  const chatMutation = useRedTeamChat();
  const analyzeMutation = useAnalyzeMessage();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [mode, setMode] = useState<"vulnerable" | "hardened">("vulnerable");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: "user", content: input };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");

    // Fire chat request
    chatMutation.mutate({
      data: {
        message: input,
        mode,
        history: messages
      }
    }, {
      onSuccess: (data) => {
        setMessages([...newHistory, { role: "assistant", content: data.response }]);
      },
      onError: () => {
        setMessages([...newHistory, { role: "assistant", content: "⚠️ Agent failed to respond due to API rate limits. Please wait a moment and try again." }]);
      }
    });

    // Fire analysis request in parallel
    analyzeMutation.mutate({
      data: {
        message: input,
        conversationHistory: messages.map(m => m.content)
      }
    }, {
      onSuccess: (data) => {
        setAnalysis(data);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getThreatColor = (level: string) => {
    if (level === 'CRITICAL' || level === 'HIGH') return 'text-destructive';
    if (level === 'MEDIUM') return 'text-threat';
    if (level === 'LOW') return 'text-warning';
    return 'text-success';
  };

  const clearChat = () => {
    setMessages([]);
    setAnalysis(null);
  };

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[600px] flex flex-col lg:flex-row gap-6">
      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col bg-card border-border overflow-hidden">
        <CardHeader className="border-b border-border py-3 flex flex-row items-center justify-between bg-secondary/30">
          <CardTitle className="text-lg flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-primary" /> Live Red-Team
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex p-1 rounded-md bg-secondary border border-border">
              <button
                onClick={() => setMode("vulnerable")}
                className={`px-3 py-1 text-xs font-mono rounded ${mode === 'vulnerable' ? 'bg-destructive/20 text-destructive' : 'text-muted-foreground hover:text-white'}`}
              >
                VULNERABLE MODE
              </button>
              <button
                onClick={() => setMode("hardened")}
                className={`px-3 py-1 text-xs font-mono rounded ${mode === 'hardened' ? 'bg-success/20 text-success' : 'text-muted-foreground hover:text-white'}`}
              >
                HARDENED MODE
              </button>
            </div>
            <Button variant="ghost" size="sm" onClick={clearChat} className="h-7 text-xs font-mono text-muted-foreground hover:text-white">
              CLEAR
            </Button>
          </div>
        </CardHeader>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <Shield className="w-16 h-16 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-lg font-bold">Initiate Red-Team Session</p>
                <p className="text-sm font-mono max-w-md mx-auto">
                  Engage with the agent to probe for prompt injection vulnerabilities. Toggle modes to test defenses in real-time.
                </p>
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className={`text-xs font-mono mb-1 text-muted-foreground px-1`}>
                  {msg.role === 'user' ? 'YOU' : 'AGENT'}
                </div>
                <div className={`p-3 rounded-lg text-sm font-mono whitespace-pre-wrap border ${
                  msg.role === 'user' 
                    ? 'bg-primary/10 border-primary/20 text-white rounded-tr-none' 
                    : 'bg-secondary border-border text-white/90 rounded-tl-none'
                }`}>
                  {msg.role === 'assistant' || msg.role === 'system' ? 
                    msg.content
                      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
                      .replace(/\*(.*?)\*/g, '$1')     // Remove italic
                      .replace(/__(.*?)__/g, '$1')     // Remove bold
                      .replace(/_(.*?)_/g, '$1')       // Remove italic
                      .replace(/^#+\s*(.*?)$/gm, '$1') // Remove headers
                      .replace(/`(.*?)`/g, '$1')       // Remove inline code
                      .replace(/^\s*[\*\-]\s/gm, '• ') // Replace list asterisks with bullets
                    : msg.content}
                </div>
              </motion.div>
            ))}
            
            {chatMutation.isPending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto max-w-[85%]">
                <div className="text-xs font-mono mb-1 text-muted-foreground px-1">AGENT</div>
                <div className="p-3 rounded-lg bg-secondary border border-border rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardFooter className="p-4 border-t border-border bg-secondary/30">
          <div className="flex w-full gap-2 relative">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter payload..."
              className="bg-card border-border font-mono pr-12 focus-visible:ring-primary"
              disabled={chatMutation.isPending}
            />
            <Button 
              size="icon" 
              onClick={handleSend} 
              disabled={!input.trim() || chatMutation.isPending}
              className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Sidebar Analysis Area */}
      <Card className="lg:w-80 flex flex-col bg-card border-border">
        <CardHeader className="border-b border-border py-3 bg-secondary/30">
          <CardTitle className="text-sm flex items-center gap-2 font-mono">
            <Activity className="w-4 h-4 text-info" /> Telemetry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          {analyzeMutation.isPending ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-info animate-pulse text-xs font-mono">
                <Activity className="w-4 h-4" /> SCANNING PAYLOAD...
              </div>
            </div>
          ) : analysis ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono text-muted-foreground">INJECTION DETECTED</div>
                <div className="flex items-center gap-2">
                  {analysis.injectionDetected ? (
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-sm py-1">
                      <ShieldAlert className="w-4 h-4 mr-1" /> YES
                    </Badge>
                  ) : (
                    <Badge className="bg-success/20 text-success border-success/30 text-sm py-1">
                      <ShieldCheck className="w-4 h-4 mr-1" /> NO
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-muted-foreground">THREAT LEVEL</div>
                <div className={`text-xl font-bold font-mono ${getThreatColor(analysis.threatLevel)}`}>
                  {analysis.threatLevel}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-muted-foreground">CONFIDENCE</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${analysis.confidence > 80 ? 'bg-primary' : analysis.confidence > 50 ? 'bg-warning' : 'bg-muted-foreground'}`} 
                      style={{ width: `${analysis.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono text-white">{analysis.confidence}%</span>
                </div>
              </div>

              {analysis.triggeredPatterns?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-muted-foreground">DETECTED PATTERNS</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.triggeredPatterns.map((pattern: string) => (
                      <Badge key={pattern} variant="outline" className="border-info/30 text-info bg-info/10 font-mono text-xs">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <Activity className="w-12 h-12 mb-2" />
              <p className="text-xs font-mono">Awaiting input for analysis...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
