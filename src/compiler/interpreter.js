import { Program, VarDecl, Assign, Print, BinaryExpr, UnaryExpr, Literal, Identifier } from './ast.js';

export class Interpreter {
  constructor() {
    this.environment = new Map();
    this.output = []; // Collects all printed lines
  }

  interpret(astNode) {
    this.output = [];
    this.evaluate(astNode);
    return this.output;
  }

  evaluate(node) {
    if (!node) return null;

    switch (node.type) {
      case 'Program':
        let lastResult;
        for (const stmt of node.body) {
          lastResult = this.evaluate(stmt);
        }
        return lastResult;

      case 'VarDecl':
        const initValue = node.init ? this.evaluate(node.init) : null;
        if (this.environment.has(node.identifier.name)) {
          throw new Error(`Runtime Error: Identifier '${node.identifier.name}' has already been declared.`);
        }
        this.environment.set(node.identifier.name, initValue);
        return null;

      case 'Assign':
        if (!this.environment.has(node.identifier.name)) {
          throw new Error(`Runtime Error: Undefined variable '${node.identifier.name}'.`);
        }
        const assignedValue = this.evaluate(node.value);
        this.environment.set(node.identifier.name, assignedValue);
        return assignedValue;

      case 'Print':
        const printValue = this.evaluate(node.expr);
        this.output.push(String(printValue));
        return null;

      case 'BinaryExpr':
        const left = this.evaluate(node.left);
        const right = this.evaluate(node.right);
        
        switch (node.operator) {
          case '+':
            // JS handles either math + math or string concat
            return left + right; 
          case '-':
            if (typeof left !== 'number' || typeof right !== 'number') throw new Error('Runtime Error: Operands to "-" must be numbers.');
            return left - right;
          case '*':
            if (typeof left !== 'number' || typeof right !== 'number') throw new Error('Runtime Error: Operands to "*" must be numbers.');
            return left * right;
          case '/':
            if (typeof left !== 'number' || typeof right !== 'number') throw new Error('Runtime Error: Operands to "/" must be numbers.');
            if (right === 0) throw new Error('Runtime Error: Division by zero.');
            return left / right;
          default:
            throw new Error(`Runtime Error: Unknown operator '${node.operator}'.`);
        }

      case 'UnaryExpr':
        const unaryRight = this.evaluate(node.right);
        if (typeof unaryRight !== 'number') throw new Error('Runtime Error: Operand to unary operator must be a number.');
        if (node.operator === '-') return -unaryRight;
        if (node.operator === '+') return +unaryRight;
        throw new Error(`Runtime Error: Unknown unary operator '${node.operator}'.`);

      case 'Literal':
        return node.value;

      case 'Identifier':
        if (!this.environment.has(node.name)) {
          throw new Error(`Runtime Error: Undefined variable '${node.name}'.`);
        }
        return this.environment.get(node.name);

      default:
        // We evaluate other raw expressions that might be hanging around (e.g. `5 + 5;`)
        return null;
    }
  }
}
