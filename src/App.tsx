/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, BookOpen, Cpu, ShieldCheck, Code, Settings, Trash2, Play, Database, Clock, CheckCircle } from 'lucide-react';
import { runCode } from './compiler/compiler';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Documentation' | /*'Changelog' |*/ 'Playground' /*| 'Community'*/> ('Home');

  // Playground State
  const [sourceCode, setSourceCode] = useState('');
  const [output, setOutput] = useState<{ type: 'success' | 'error', lines: string[] } | null>(null);
  const [diagnostics, setDiagnostics] = useState({ time: "0.00", memory: "0.00", status: "idle" });

  const handleRun = () => {
    const startTime = performance.now();
    let runStatus = "success";
    try {
      if (!sourceCode.trim()) {
        setOutput({ type: 'success', lines: ['> No code provided.'] });
        runStatus = "success";
        return;
      }      const result = runCode(sourceCode);
      if (result.length === 0) {
        setOutput({ type: 'success', lines: ['> Compilation Complete. (No output)'] });
      } else {
        setOutput({ type: 'success', lines: result });
      }
    } catch (err: any) {
      setOutput({ type: 'error', lines: [err.message] });
      runStatus = "error";
    } finally {
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(2);
      const memoryUsage = (performance as any).memory ? ((performance as any).memory.usedJSHeapSize / 1048576).toFixed(2) : "0.00";
      setDiagnostics({
        time: executionTime,
        memory: memoryUsage,
        status: runStatus
      });
    }
  };

  const handleLoadExample = () => {
    setSourceCode('let x = 2+3*4;\nprint x;\nx=x+1;\nprint x;\nprint "Professors: " + professor;');
    setOutput(null);
  };

  const clearOutput = () => setOutput(null);

  return (
    <div className="flex flex-col min-h-screen bg-paper text-ink font-sans selection:bg-accent selection:text-white">
      {/* Navbar */}
      <header className="px-6 md:px-12 py-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 bg-white sticky top-0 z-50">
        <div 
          className="font-serif italic font-bold text-2xl tracking-tight cursor-pointer"
          onClick={() => setActiveTab('Home')}
        >
          COMPILER.LOG
          
        </div>
        
        <nav className="flex items-center gap-6 md:gap-8 text-sm font-medium text-gray-600">
          {['Documentation'/*, 'Changelog'*/, 'Playground'/*, 'Community'*/].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`hover:text-ink transition-colors pb-1 border-b-2 ${activeTab === tab ? 'border-ink text-ink' : 'border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 border border-gray-200 text-sm focus:outline-none focus:border-ink w-48 bg-gray-50"
            />
          </div>
          <button className="border border-ink px-4 py-1.5 text-xs font-bold tracking-wider hover:bg-gray-50 transition-colors uppercase">
            Login
          </button>
        </div> */}
      </header>

      {/* Main Content Area */}
      <main className="grow flex flex-col items-center bg-white">
        <div className="w-full max-w-6xl grow flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.03)] bg-white border-x border-gray-100 min-h-[calc(100vh-84px)]">
          {activeTab === 'Home' && <HomeView setActiveTab={setActiveTab} />}
          {activeTab === 'Documentation' && <DocumentationView />}
          {activeTab === 'Playground' && (
            <PlaygroundView 
              sourceCode={sourceCode}
              setSourceCode={setSourceCode}
              output={output}
              handleRun={handleRun}
              handleLoadExample={handleLoadExample}
              clearOutput={clearOutput}
              diagnostics={diagnostics}
            />
          )}
          {/* {['Changelog', 'Community'].includes(activeTab) && (
            <div className="p-20 text-center font-serif text-2xl text-gray-400 italic">Section under construction.</div>
          )} */}
        </div>
      </main>
    </div>
      );
}

function HomeView({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
  return (
    <div className="px-10 py-20 md:p-24 w-full h-full flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-[10px] uppercase tracking-[3px] font-extrabold text-accent mb-6 block">System Architecture</span>
          <h1 className="font-serif text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8">
          Code in the Browser.<br />Execute Instantly.
          </h1>
          <p className="text-gray-600 leading-relaxed mb-10 max-w-md text-lg">
            A lightweight, dependency-free compiler and mini-language built entirely for the client side. Experience the journey from raw syntax to execution without ever communicating with a server. 
          </p>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('Playground')} className="bg-ink text-white px-6 py-3 text-xs font-extrabold tracking-widest uppercase hover:bg-black transition-colors">
              Get Started
            </button>
            <button onClick={() => setActiveTab('Documentation')} className="border border-gray-300 px-6 py-3 text-xs font-extrabold tracking-widest uppercase hover:border-ink transition-colors">
              Read Specification
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute top-4 left-4 w-full h-full bg-gray-100 -z-10"></div>
          <div className="border border-gray-200 bg-white shadow-xl p-6 relative z-10">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500">main.arch</span>
              <span className="text-[10px] text-gray-400 tracking-wider">v1.0.4</span>
            </div>
            <div className="font-mono text-[13px] leading-relaxed text-gray-800">
              <span className="text-gray-300 mr-4 select-none">01 |</span> <span className="text-accent
              ">let</span> config = Config::load(<span className="text-[#059669]">"arch.toml"</span>);<br/>
              <span className="text-gray-300 mr-4 select-none">02 |</span> <br/>
              <span className="text-gray-300 mr-4 select-none">03 |</span> <span className="text-accent
              ">let</span> compiler = Compiler::new(config);<br/>
              <span className="text-gray-300 mr-4 select-none">04 |</span> <span className="text-accent
              ">let</span> target = compiler.build_target(<span className="text-[#059669]">"release"</span>);<br/>
              <span className="text-gray-300 mr-4 select-none">05 |</span> <br/>
              <span className="text-gray-300 mr-4 select-none">06 |</span> target.execute();
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-20 border-t border-gray-200 pt-20 pb-32">
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] uppercase tracking-[3px] font-extrabold text-accent mb-6 block">Technical Specification</span>
          <h2 className="font-serif text-4xl mb-6 font-bold">Academic context. Real-world insights.</h2>
          <p className="text-gray-600 leading-relaxed text-lg font-sans">
            Designed as a foundational exploration into compiler theory, this mini-language translates raw syntax into actionable execution entirely from scratch. It serves as a transparent educational window into lexical analysis, recursive parsing, and interpretation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-gray-400 mb-5 pb-3 border-b border-gray-100 w-full block">01</span>
            <h3 className="font-serif font-bold text-xl mb-3 text-ink">Character-Stream Tokenization</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              A custom-built scanner that performs high-speed character processing to generate typed tokens, handling whitespace and complex syntax with zero external dependencies.
            </p>
          </div>
          
          <div className="flex flex-col">
            <span className="font-mono text-xs text-gray-400 mb-5 pb-3 border-b border-gray-100 w-full block">02</span>
            <h3 className="font-serif font-bold text-xl mb-3 text-ink">Hardware-Level Diagnostics</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              Equipped with native browser hooks to monitor JS heap memory consumption and execution latency, providing instant feedback on user-device performance.
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-xs text-gray-400 mb-5 pb-3 border-b border-gray-100 w-full block">03</span>
            <h3 className="font-serif font-bold text-xl mb-3 text-ink">Abstract Syntax Tree Parsing</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              Transforms flat arrays of string tokens into a robust, hierarchical data structure. This defines order-of-operations and grammar rules for immediate, safe interpretation.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="w-full border-t border-gray-100 py-8 mt-auto">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500 font-sans">
          <div className="flex items-center gap-4">
            <span className="font-bold text-ink">Compiler.Log</span>
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-1 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
              Operational
            </div>
          </div>

          <div>
            &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
    
  );
}

function DocumentationView() {
  return (
    <div className="grow grid grid-cols-1 md:grid-cols-[260px_1fr] border-t border-gray-100">
      
      {/* 1. SIDEBAR: Added 'sticky', 'top-0', 'self-start', 'h-screen', and 'overflow-y-auto' */}
      <aside className="sticky top-0 self-start h-screen overflow-y-auto border-r border-gray-100 bg-[#FAFAFA] p-8 flex flex-col gap-8">
        <div>
          <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase mb-2">Specification</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">v1.0.0-stable</p>
        </div>
        
        {/* 2. NAVIGATION: Changed <button> tags to <a> tags with hrefs pointing to the section IDs */}
        <nav className="flex flex-col gap-1">
          <a href="#" className="flex items-center gap-3 text-xs font-bold bg-gray-200 px-4 py-3 rounded-sm">
            <BookOpen className="w-4 h-4" /> Introduction
          </a>
          <a href="#tokenizer" className="flex items-center gap-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 px-4 py-3 rounded-sm transition-colors">
            <Cpu className="w-4 h-4" /> Tokenizer
          </a>
          <a href="#parser" className="flex items-center gap-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 px-4 py-3 rounded-sm transition-colors">
            <ShieldCheck className="w-4 h-4" /> Parser 
          </a>
          <a href="#ast" className="flex items-center gap-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 px-4 py-3 rounded-sm transition-colors">
            <Code className="w-4 h-4" /> Abstract Syntax Tree 
          </a>
          <a href="#interpreter" className="flex items-center gap-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 px-4 py-3 rounded-sm transition-colors">
            <Settings className="w-4 h-4" /> Interpreter 
          </a>
        </nav>
      </aside>

      {/* Content */}
      <div className="p-12 md:p-20">
        <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-12">The Architecture: From Text to Execution</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-16">
          <div className="prose prose-sm prose-gray max-w-none text-[15px] leading-relaxed">
            <p className="text-lg text-ink font-medium leading-relaxed mb-6">
              A modern compiler is not merely a translator, but an orchestrator of complex semantic transformations. It governs the lifecycle of code from its textual inception to its final execution context.
            </p>
            <p className="mb-6">
               This mini-language operates through a custom, dependency-free pipeline entirely within the browser. When you click "Run" in the playground, your code doesn't just execute magically; it goes through four distinct phases to translate raw text into actions.
            </p>
            
            {/* 3. HEADINGS: Added specific 'id' attributes matching the hrefs above. 
                Also added 'scroll-mt-32' (scroll-margin-top) so the header doesn't hit the very edge of the screen when clicked. */}
            <h3 id="tokenizer" className="font-bold text-lg text-ink mt-8 mb-2 scroll-mt-32">1. The Tokenizer (Lexical Analysis)</h3>
            <p className="mb-6">
              The compiler first reads your code character by character. The Tokenizer's job is to group these raw characters into meaningful chunks called "tokens." For example, it takes the string <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm text-accent">print professor;</code> and breaks it down into identifiable pieces: a <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm text-ink">KEYWORD</code> ("print"), an <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm text-ink">IDENTIFIER</code> ("professor"), and a <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm text-ink">SEMICOLON</code> (";").
            </p>
            
            <h3 id="parser" className="font-bold text-lg text-ink mt-6 mb-2 scroll-mt-32">2. The Parser (Syntax Analysis)</h3>
            <p className="mb-6">
              Once the code is tokenized, it is passed to the Parser. The Parser checks these tokens against the grammatical rules of our mini-language. It ensures that the sequence of tokens makes logical sense (e.g., catching syntax errors like a missing semicolon).
            </p>
            
            <h3 id="ast" className="font-bold text-lg text-ink mt-6 mb-2 scroll-mt-32">3. The Abstract Syntax Tree (AST)</h3>
            <p className="mb-6">
              As the Parser validates the grammar, it simultaneously builds the Abstract Syntax Tree (AST). The AST is a tree-like data structure that represents the hierarchical logic of your code. Instead of a flat list of tokens, the AST maps out the exact operations the program needs to perform and in what order.
            </p>
            
            <h3 id="interpreter" className="font-bold text-lg text-ink mt-6 mb-2 scroll-mt-32">4. The Interpreter (Execution)</h3>
            <p className="mb-6">
              Finally, the Interpreter takes over. Instead of compiling down to machine code or assembly, this client-side architecture directly traverses the AST. It visits each node in the tree and immediately executes the corresponding logic in JavaScript, returning the output directly to the playground console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaygroundView({ sourceCode, setSourceCode, output, handleRun, handleLoadExample, clearOutput, diagnostics }: any) {
  return (
    <div className="flex flex-col p-8 md:p-12 h-fit md:h-full overflow-y-auto">
      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[3px] font-extrabold text-accent
         mb-2 block">Interactive Sandbox</span>
        <h1 className="font-serif text-4xl font-bold tracking-tight">Playground</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 h-full min-h-75">
        {/* Editor Block */}
        <div className="flex flex-col border border-gray-200 shadow-sm bg-white h-full">
          <div className="bg-[#FAFAFA] border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 tracking-wider">
              <Code className="w-4 h-4" /> MAIN.ARCH
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleLoadExample}
                className="bg-white border border-gray-300 text-ink px-3 py-1.5 text-[10px] font-extrabold tracking-widest uppercase hover:bg-gray-50 transition-colors"
                title="Load example code"
              >
                Load Example
              </button>
              <button 
                onClick={handleRun}
                className="bg-ink text-white px-4 py-1.5 text-[10px] font-extrabold tracking-widest uppercase hover:bg-black transition-colors flex items-center gap-2"
              >
                <Play className="w-3 h-3 fill-current" /> Run
              </button>
            </div>
          </div>
          <div className="grow
           relative flex bg-white font-mono text-sm group">
            {/* Very simple line numbers */}
            <div className="w-12 bg-[#FAFAFA] border-r border-gray-100 flex flex-col items-center py-4 text-gray-300 text-xs select-none">
              {(sourceCode.match(/\n/g) || []).map((_: any, i: any) => (
                <div key={i}>{i + 1}</div>
              ))}
              <div>{(sourceCode.match(/\n/g) || []).length + 1}</div>
            </div>
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              spellCheck="false"
              className="w-full h-full p-4 resize-none outline-none text-gray-800 leading-relaxed font-mono"
              placeholder="// Write code here, e.g. let x = 5; print x;"
            />
          </div>
        </div>

        {/* Right Column (Output & Diagnostics) */}
        <div className="flex flex-col gap-8 h-full">
          
          {/* Output Terminal */}
          <div className="flex flex-col border border-gray-200 shadow-sm bg-white grow
           min-h-75">
            <div className="bg-[#FAFAFA] border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-gray-600 flex items-center gap-2">
                <Database className="w-3 h-3" /> Output
              </div>
              <button onClick={clearOutput} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 bg-white font-mono text-xs leading-relaxed overflow-y-auto grow
             h-50">
              {!output ? (
                <span className="text-gray-400 italic">Waiting for compilation...</span>
              ) : output.type === 'error' ? (
                <div className="text-red-600 font-bold whitespace-pre-wrap">
                  {output.lines.map((line: any, i: any) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-800 whitespace-pre-wrap">
                  {output.lines.map((line: any, i: any) => (
                    <div key={i} className="mb-1">&gt; {line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Diagnostics */}
          <div className="flex flex-col border border-gray-200 shadow-sm bg-white h-fit shrink-0">
            <div className="bg-[#FAFAFA] border-b border-gray-200 px-4 py-3">
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-gray-600 flex items-center gap-2">
                <Settings className="w-3 h-3" /> Diagnostics
              </div>
            </div>
            <div className="p-5 flex flex-col gap-6">
              <div className="flex gap-4">
                <Database className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <div className="text-[10px] font-extrabold tracking-widest uppercase text-gray-800 mb-0.5">Memory Usage</div>
                  <div className="text-xs text-gray-500 font-mono">{diagnostics.memory} MB</div>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <div className="text-[10px] font-extrabold tracking-widest uppercase text-gray-800 mb-0.5">Execution Time</div>
                  <div className="text-xs text-gray-500 font-mono">{diagnostics.time} ms</div>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className={`w-4 h-4 mt-1 ${diagnostics.status === 'error' ? 'text-red-500' : 'text-green-600'}`} />
                <div>
                  <div className="text-[10px] font-extrabold tracking-widest uppercase text-gray-800 mb-0.5">Status</div>
                  <div className="text-xs text-gray-500 font-mono">
                    {diagnostics.status === 'idle' ? 'Idle' : (diagnostics.status === 'error' ? 'Failed (Exit Code 1)' : 'Success (Exit Code 0)')}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
