class WasRun {
  constructor(name) {
    this.wasRun = "None";
    this.name = name;
  }

  testMethod() {
    this.wasRun = true;
  }

  run() {
    const method = this[this.name];
    method();
  }
}

const test = new WasRun("testMethod");
console.log(test.wasRun);
test.testMethod();
console.log(test.wasRun);
