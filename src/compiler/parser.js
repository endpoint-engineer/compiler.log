import { Program, VarDecl, Assign, Print, BinaryExpr, UnaryExpr, Literal, Identifier } from './ast.js';
import { TokenType } from './tokenizer.js';

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  peek() {
    return this.tokens[this.current];
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  match(...types) {
    for (let type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new Error(`Parse Error [${token.line}:${token.column}]: ${message}`);
  }

  parse() {
    const statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return new Program(statements);
  }

  declaration() {
    if (this.match(TokenType.LET)) {
      return this.varDeclaration();
    }
    return this.statement();
  }

  varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expected variable name.");
    let initializer = null;
    if (this.match(TokenType.EQUALS)) {
      initializer = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration.");
    return new VarDecl(new Identifier(name.value), initializer);
  }

  statement() {
    if (this.match(TokenType.PRINT)) {
      return this.printStatement();
    }
    return this.expressionStatement();
  }

  printStatement() {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after print value.");
    return new Print(expr);
  }

  expressionStatement() {
    const expr = this.expression();
    
    // Check if it's an assignment statement disguised as an expression
    // E.g., `x = 5;` where x is parsed as an identifier expression first.
    if (this.match(TokenType.EQUALS)) {
      if (expr instanceof Identifier) {
        const value = this.expression();
        this.consume(TokenType.SEMICOLON, "Expected ';' after assignment.");
        return new Assign(expr, value);
      } else {
         const errorToken = this.peek();
         throw new Error(`Parse Error [${errorToken.line}:${errorToken.column}]: Invalid assignment target.`);
      }
    }
    
    // Actually, regular standalone expressions (e.g., `5 + 5;`) aren't assignments. 
    // We strictly didn't define a standalone `ExprStmt` in the required AST node list, 
    // but a script might have them. If it happens, we can return the expr, 
    // but the task requirements requested Assign and Print explicitly. Let's consume semicolon anyway.
    this.consume(TokenType.SEMICOLON, "Expected ';' after expression.");
    return expr;
  }

  expression() {
    return this.term();
  }

  term() {
    let expr = this.factor();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.tokens[this.current - 1].value;
      const right = this.factor();
      expr = new BinaryExpr(operator, expr, right);
    }
    return expr;
  }

  factor() {
    let expr = this.unary();
    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operator = this.tokens[this.current - 1].value;
      const right = this.unary();
      expr = new BinaryExpr(operator, expr, right);
    }
    return expr;
  }

  unary() {
    if (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.tokens[this.current - 1].value;
      const right = this.unary();
      return new UnaryExpr(operator, right);
    }
    return this.primary();
  }

  primary() {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    
    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.tokens[this.current - 1].value);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new Identifier(this.tokens[this.current - 1].value);
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RPAREN, "Expected ')' after expression.");
      return expr;
    }

    const token = this.peek();
    throw new Error(`Parse Error [${token.line}:${token.column}]: Expected expression, got '${token.value || token.type}'.`);
  }
}
