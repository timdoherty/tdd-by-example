function assert(value) {
  if (Boolean(value) === false) {
    throw new Error("Failed to assert value");
  }
}

class TestResult {
  constructor() {
    this.runCount = 0;
    this.errorCount = 0;
  }

  summary() {
    return `${this.runCount} run, ${this.errorCount} failed`;
  }

  testStarted() {
    this.runCount++
  }

  testFailed() {
    this.errorCount++;
  }
}

class TestCase {
  constructor(name) {
    this.name = name;
  }

  run(result) {
    result.testStarted();
    this.setUp();

    try {
      const method = this[this.name];
      method.call(this);
    } catch(e) {
      result.testFailed();
    }

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

class TestSuite {
  constructor() {
    this.tests = [];
  }

  add(test) {
    this.tests.push(test)
  }

  run(result) {
    this.tests.forEach((test) => test.run(result));
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

  testFailedResultFormatting() {
    const result = new TestResult()
    result.testStarted();
    result.testFailed();
    assert("1 run, 1 failed" === result.summary())
  }

  testSuite() {
    const suite = new TestSuite();
    const result = new TestResult();

    suite.add(new WasRun("testMethod"));
    suite.add(new WasRun("testBrokenMethod"));

    suite.run(result);
    assert("2 run, 1 failed" === result.summary());
  }
}

const suite = new TestSuite();
const result = new TestResult();

suite.add(new TestCaseTest("testTemplateMethod"));
suite.add(new TestCaseTest("testResult"));
suite.add(new TestCaseTest("testFailedResult"));
suite.add(new TestCaseTest("testFailedResultFormatting"));
suite.add(new TestCaseTest("testSuite"));

suite.run(result);

console.log(result.summary());
