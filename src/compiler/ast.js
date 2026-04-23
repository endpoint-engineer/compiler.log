export class Program {
  constructor(body) {
    this.type = 'Program';
    this.body = body;
  }
}

export class VarDecl {
  constructor(identifier, init) {
    this.type = 'VarDecl';
    this.identifier = identifier; // Identifier node
    this.init = init; // Expression node
  }
}

export class Assign {
  constructor(identifier, value) {
    this.type = 'Assign';
    this.identifier = identifier; // Identifier node
    this.value = value; // Expression node
  }
}

export class Print {
  constructor(expr) {
    this.type = 'Print';
    this.expr = expr; // Expression node
  }
}

export class BinaryExpr {
  constructor(operator, left, right) {
    this.type = 'BinaryExpr';
    this.operator = operator; // string ('+', '-', '*', '/')
    this.left = left; // Expression node
    this.right = right; // Expression node
  }
}

export class UnaryExpr {
  constructor(operator, right) {
    this.type = 'UnaryExpr';
    this.operator = operator; // string ('+', '-')
    this.right = right; // Expression node
  }
}

export class Literal {
  constructor(value) {
    this.type = 'Literal';
    this.value = value; // number, string, or boolean
  }
}

export class Identifier {
  constructor(name) {
    this.type = 'Identifier';
    this.name = name; // string
  }
}
