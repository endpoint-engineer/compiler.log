# Compiler.Log
### A High-Performance, Client-Side Mini Language Compiler

**Compiler.Log** is a lightweight, dependency-free systems programming language toolchain designed for educational transparency and high-speed execution. Built entirely for the browser, it demonstrates the full journey of code from raw text to execution without any server-side communication.

## 🚀 Features

- **Custom Compiler Pipeline:** Built from scratch with a dedicated Tokenizer, Parser, AST Generator, and Interpreter.
- **Zero Dependencies:** Core logic is implemented using native JavaScript, adhering to a strict no-external-library rule for the compilation engine.
- **Real-Time Diagnostics:** Native performance tracking that calculates execution time (ms) and browser memory usage (MB) based on the user's specific hardware.
- **Modern UI/UX:** A clean, student-built interface featuring a sticky-sidebar documentation system and an interactive code playground.
- **Educational Design:** Transparent architectural breakdown to help students and developers understand compiler theory.

## 🏗️ Technical Architecture

The compiler operates through four distinct phases:

1.  **The Tokenizer (Lexical Analysis):** Scans raw input and groups characters into meaningful tokens.
2.  **The Parser (Syntax Analysis):** Validates the token stream against language grammar rules.
3.  **Abstract Syntax Tree (AST):** Builds a hierarchical tree structure representing the program's logic.
4.  **The Interpreter (Execution):** Traverses the AST and executes operations natively in the browser.

## 🛠️ Local Development

To run this project on your local machine:

```bash
# Clone the repository
git clone [https://github.com/](https://github.com/)[endpoint-engineer]/compiler-log

# Navigate to the directory
cd compiler-log

# Install UI dependencies
npm install

# Start the development server
npm run dev
