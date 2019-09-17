function assert(value, opt = '') {
  console.log(`Assert: ${opt}`);
  if (Boolean(value) === false) {
    throw new Error("Failed to assert value");
  }
}

class TestResult {
  constructor() {
    this.runCount = 0;
  }

  summary() {
    return `${this.runCount} run, 0 failed`;
  }

  testStarted() {
    this.runCount = this.runCount + 1;
  }
}

class TestCase {
  constructor(name) {
    this.name = name;
  }

  run() {
    const result = new TestResult();
    result.testStarted();
    this.setUp();
    const method = this[this.name];
    method.call(this);
    this.tearDown();
    return result;
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

  testBrokenMethod() {
    throw new Error("Can't read 'Feels Weird Man' of undefined");
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
    assert("setUp testMethod tearDown" === this.test.log, String(this.test.log));
  }

  testResult() {
    const test = new WasRun("testMethod");
    const result = test.run();
    assert("1 run, 0 failed" == result.summary(), String(result.summary()));
  }

  testFailedResult() {
    const test = new WasRun("testBrokenMethod");
    const result = test.run();
    assert("1 run, 1 failed" === result.summary(), String(result.summary()));
  }
}

new TestCaseTest("testTemplateMethod").run();
new TestCaseTest("testResult").run();
new TestCaseTest("testFailedResult").run();
