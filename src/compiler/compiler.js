import { tokenize } from './tokenizer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

/**
 * Main entry point for the browser compiler.
 * 
 * @param {string} sourceCodeString - Raw source code input from the UI.
 * @returns {Array<string>} An array of printed outputs.
 * @throws {Error} Throws descriptive syntax/runtime errors.
 */
export function runCode(sourceCodeString) {
  // 1. Lexical Analysis (Strings -> Tokens)
  const tokens = tokenize(sourceCodeString);

  // 2. Syntactic Parsing (Tokens -> AST)
  const parser = new Parser(tokens);
  const ast = parser.parse();

  // 3. Evaluation / Interpreting (AST -> Execution & capture outputs)
  const interpreter = new Interpreter();
  
  // Easter egg: Pre-load the professor variable
  interpreter.environment.set("professor", "Ms. Sony Jha, Ms. Asmita Marathe");
  interpreter.environment.set("group", "Tavleen, Ashutosh, Gauri");
  
  const outputArray = interpreter.interpret(ast);

  return outputArray;
}
