function assert(value) {
  if (Boolean(value) === false) {
    throw new Error("Failed to assert value");
  }
}

class TestCase {
  constructor(name) {
    this.name = name;
  }

  run() {
    this.setUp();
    const method = this[this.name];
    method.call(this);
    this.tearDown();
  }

  setUp() {}

  tearDown() {}
}

class WasRun extends TestCase {
  constructor(name) {
    super(name);
    this.wasSetUp = false;
  }

  testMethod() {
    this.wasRun = true;
    this.log = `${this.log} testMethod`;
  }

  setUp() {
    this.wasRun = false;
    this.wasSetUp = true;
    this.log = "setUp";
  }

  tearDown() {
    this.log = `${this.log} tearDown`;
  }
}

class TestCaseTest extends TestCase {
  testTemplateMethod() {
    this.test = new WasRun("testMethod");
    this.test.run();
    assert("setUp testMethod tearDown" === this.test.log);
  }
}

new TestCaseTest("testTemplateMethod").run();
