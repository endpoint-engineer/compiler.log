export const TokenType = {
  LET: 'LET',
  PRINT: 'PRINT',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  EQUALS: 'EQUALS',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  STAR: 'STAR',
  SLASH: 'SLASH',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  SEMICOLON: 'SEMICOLON',
  EOF: 'EOF'
};

export function tokenize(source) {
  const tokens = [];
  let current = 0;
  let line = 1;
  let column = 1;

  function isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  function isDigit(c) {
    return c >= '0' && c <= '9';
  }

  function advance() {
    const c = source[current];
    current++;
    if (c === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
    return c;
  }

  function peek() {
    return current < source.length ? source[current] : '\0';
  }

  function addToken(type, value = null) {
    tokens.push({ type, value, line, column: column - (value ? String(value).length : 1) });
  }

  while (current < source.length) {
    let char = peek();

    if (char === ' ' || char === '\r' || char === '\t' || char === '\n') {
      advance();
      continue;
    }

    if (char === '=') { advance(); addToken(TokenType.EQUALS, '='); continue; }
    if (char === '+') { advance(); addToken(TokenType.PLUS, '+'); continue; }
    if (char === '-') { advance(); addToken(TokenType.MINUS, '-'); continue; }
    if (char === '*') { advance(); addToken(TokenType.STAR, '*'); continue; }
    if (char === '/') { advance(); addToken(TokenType.SLASH, '/'); continue; }
    if (char === '(') { advance(); addToken(TokenType.LPAREN, '('); continue; }
    if (char === ')') { advance(); addToken(TokenType.RPAREN, ')'); continue; }
    if (char === ';') { advance(); addToken(TokenType.SEMICOLON, ';'); continue; }

    if (char === '"' || char === "'") {
      const quote = advance(); // Consume opening quote
      let str = '';
      while (peek() !== quote && current < source.length) {
        str += advance();
      }
      if (current >= source.length) {
        throw new Error(`Syntax Error [${line}:${column}]: Unterminated string.`);
      }
      advance(); // Consume closing quote
      addToken(TokenType.STRING, str);
      continue;
    }

    if (isDigit(char)) {
      let numStr = '';
      while (isDigit(peek())) {
        numStr += advance();
      }
      if (peek() === '.' && isDigit(source[current + 1])) {
        numStr += advance(); // Consume '.'
        while (isDigit(peek())) {
          numStr += advance();
        }
      }
      addToken(TokenType.NUMBER, parseFloat(numStr));
      continue;
    }

    if (isAlpha(char)) {
      let idStr = '';
      while (isAlpha(peek()) || isDigit(peek())) {
        idStr += advance();
      }
      
      switch (idStr) {
        case 'let': addToken(TokenType.LET, 'let'); break;
        case 'print': addToken(TokenType.PRINT, 'print'); break;
        case 'true': addToken(TokenType.BOOLEAN, true); break;
        case 'false': addToken(TokenType.BOOLEAN, false); break;
        default: addToken(TokenType.IDENTIFIER, idStr); break;
      }
      continue;
    }

    throw new Error(`Syntax Error [${line}:${column}]: Unexpected character '${char}'.`);
  }

  tokens.push({ type: TokenType.EOF, value: null, line, column });
  return tokens;
}
