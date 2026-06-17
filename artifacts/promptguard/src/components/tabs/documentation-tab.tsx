import { Card, CardContent } from "@/components/ui/card";
import { FileText, Terminal, Code, Github } from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentationTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-foreground" />
          Documentation
        </h2>
        <p className="text-muted-foreground">
          System architecture, API reference, and installation guides.
        </p>
      </div>

      <div className="prose prose-invert prose-pre:bg-secondary prose-pre:border prose-pre:border-border max-w-none">
        <h3>Project Overview</h3>
        <p>
          PromptGuard is an open-source research platform designed to help security engineers, AI researchers, and developers understand, simulate, and defend against prompt injection vulnerabilities in Large Language Models (LLMs).
        </p>

        <h3>Architecture</h3>
        <Card className="bg-secondary/30 border-border my-6 overflow-hidden">
          <CardContent className="p-6">
            <pre className="text-info font-mono text-xs sm:text-sm bg-transparent border-none m-0 p-0 overflow-x-auto">
{`[User / Attacker]
       │
       ▼
+--------------+        +-------------------+        +----------------+
|  Frontend    | ──────>|  API Server       | ──────>|  Claude API    |
|  React/Vite  | <──────|  Express/Node.js  | <──────|  Anthropic     |
+--------------+        +-------------------+        +----------------+
                                │
                          +-----------+
                          |  Defense  |
                          |  Engine   |
                          +-----------+
                          | - Sanitization
                          | - Output Validation
                          | - Intent Classifier
                          +-----------+`}
            </pre>
          </CardContent>
        </Card>

        <h3>API Reference</h3>
        <div className="space-y-4 not-prose">
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-info/20 text-info rounded text-xs font-bold font-mono">POST</span>
                <code className="text-sm text-white">/api/promptguard/simulate-attack</code>
              </div>
              <p className="text-sm text-muted-foreground">Simulates a prompt injection attack against a vulnerable model.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-info/20 text-info rounded text-xs font-bold font-mono">POST</span>
                <code className="text-sm text-white">/api/promptguard/test-defense</code>
              </div>
              <p className="text-sm text-muted-foreground">Tests an injection payload against configured defense layers.</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-info/20 text-info rounded text-xs font-bold font-mono">POST</span>
                <code className="text-sm text-white">/api/promptguard/chat</code>
              </div>
              <p className="text-sm text-muted-foreground">Engage with the red-team agent in vulnerable or hardened modes.</p>
            </CardContent>
          </Card>
        </div>

        <h3 className="flex items-center gap-2 mt-8">
          <Terminal className="w-5 h-5" /> Local Installation
        </h3>
        <pre><code>{`git clone https://github.com/promptguard/promptguard
cd promptguard
npm install
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm run dev`}</code></pre>

        <h3 className="flex items-center gap-2 mt-8">
          <Code className="w-5 h-5" /> Contributing
        </h3>
        <p>
          We welcome contributions from the security research community. Please read our <a href="#" className="text-info hover:text-info/80">Contributing Guidelines</a> before submitting a Pull Request. For responsible disclosure of new prompt injection vectors, please contact security@promptguard.dev.
        </p>

        <hr className="border-border my-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 PromptGuard. Released under the MIT License.</p>
          <a href="https://github.com/promptguard/promptguard" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white hover:text-info transition-colors">
            <Github className="w-4 h-4" /> Star on GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
}
