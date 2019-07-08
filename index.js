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
    const method = this[this.name];
    method.call(this);
  }
}

class WasRun extends TestCase {
  constructor(name) {
    super(name);
    this.wasRun = false;
  }

  testMethod() {
    this.wasRun = true;
  }
}

class TestCaseTest extends TestCase {
  testRunning() {
    const test = new WasRun("testMethod");
    assert(!test.wasRun);
    test.run();
    assert(test.wasRun);
  }
}

new TestCaseTest("testRunning").run();
