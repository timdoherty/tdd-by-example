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
  }

  setUp() {}
}

class WasRun extends TestCase {
  constructor(name) {
    super(name);
    this.wasSetUp = false;
  }

  testMethod() {
    this.wasRun = true;
  }

  setUp() {
    this.wasRun = false;
    this.wasSetUp = true;
  }
}

class TestCaseTest extends TestCase {
  testSetUp() {
    const test = new WasRun("testMethod");
    test.run();
    assert(test.wasSetUp);
  }

  testRunning() {
    const test = new WasRun("testMethod");
    assert(!test.wasRun);
    test.run();
    assert(test.wasRun);
  }
}

new TestCaseTest("testRunning").run();
new TestCaseTest("testSetUp").run();
