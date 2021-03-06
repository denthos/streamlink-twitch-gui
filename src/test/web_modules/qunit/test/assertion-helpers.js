import QUnit, {
	module,
	test
} from "qunit";
import sinon from "sinon";


module( "qunit/assertion-helpers" );


test( "assert.clearSteps", assert => {

	const API = {
		test: {
			steps: [ 1, 2, 3 ]
		}
	};

	QUnit.assert.clearSteps.call( API );
	assert.strictEqual( API.test.steps.length, 0, "Clears the steps of the current test" );

});


test( "assert.checkSteps", assert => {

	const API = {
		test: {
			steps: [ 1, 2, 3 ]
		},
		verifySteps() {},
		clearSteps() {}
	};

	const verifyStepsSpy = sinon.spy( API, "verifySteps" );
	const clearStepsSpy = sinon.spy( API, "clearSteps" );

	QUnit.assert.checkSteps.call( API, [ 1, 2, 3 ] );
	assert.ok( verifyStepsSpy.calledOnce, "Has called verifySteps" );
	assert.propEqual(
		verifyStepsSpy.getCall(0).args,
		[
			[ 1, 2, 3 ]
		],
		"Called verifySteps with correct params"
	);
	assert.ok( clearStepsSpy.calledOnce, "Has called clearSteps" );
	assert.ok( clearStepsSpy.calledAfter( verifyStepsSpy ), "Called clearSteps after verifySteps" );

});


test( "assert.rejects", async assert => {

	const API = {
		test: {
			pushResult() {}
		}
	};

	const pushResultSpy = sinon.spy( API.test, "pushResult" );

	class Foo {
		get name() {
			return "Foo";
		}
	}
	const foo = new Foo();
	const error = new Error( "foo" );
	const value = "bar";

	// resolves without expectations
	pushResultSpy.reset();
	const pFailNoExp = QUnit.assert.rejects.call( API, Promise.resolve( 123 ) );
	assert.ok( pFailNoExp instanceof Promise, "Returns a promise" );
	assert.ok( await pFailNoExp.then( () => true ), "Promise always fulfills" );
	assert.propEqual( pushResultSpy.getCall(0).args, [{
		result: false,
		actual: 123,
		expected: undefined,
		message: "Does not reject"
	}], "Pushes result to the test" );

	// resolves with expectations
	pushResultSpy.reset();
	const pFailExp = QUnit.assert.rejects.call( API, Promise.resolve( 123 ), error, "foo" );
	assert.ok( pFailExp instanceof Promise, "Returns a promise" );
	assert.ok( await pFailExp.then( () => true ), "Promise always fulfills" );
	assert.propEqual( pushResultSpy.getCall(0).args, [{
		result: false,
		actual: 123,
		expected: error,
		message: "foo"
	}], "Pushes result to the test" );

	// rejects without expectations
	pushResultSpy.reset();
	const pSucceedNoExp = QUnit.assert.rejects.call( API, Promise.reject( error ) );
	assert.ok( pSucceedNoExp instanceof Promise, "Returns a promise" );
	assert.ok( await pSucceedNoExp.then( () => true ), "Promise always fulfills" );
	assert.propEqual( pushResultSpy.getCall(0).args, [{
		result: true,
		actual: error,
		expected: undefined,
		message: "Rejects"
	}], "Pushes result to the test" );

	// rejects with expectations and no custom message
	pushResultSpy.reset();
	const pSucceedExp = QUnit.assert.rejects.call( API, Promise.reject( error ), error );
	assert.ok( pSucceedExp instanceof Promise, "Returns a promise" );
	assert.ok( await pSucceedExp.then( () => true ), "Promise always fulfills" );
	assert.propEqual( pushResultSpy.getCall(0).args, [{
		result: true,
		actual: error,
		expected: error,
		message: "Error: foo"
	}], "Pushes result to the test" );

	// rejects with expectations and custom message
	pushResultSpy.reset();
	const pSucceedExpMsg = QUnit.assert.rejects.call( API, Promise.reject( error ), error, "bar" );
	assert.ok( pSucceedExpMsg instanceof Promise, "Returns a promise" );
	assert.ok( await pSucceedExpMsg.then( () => true ), "Promise always fulfills" );
	assert.propEqual( pushResultSpy.getCall(0).args, [{
		result: true,
		actual: error,
		expected: error,
		message: "bar"
	}], "Pushes result to the test" );

	// executes async function which returns a rejected promise
	pushResultSpy.reset();
	const pSucceedFuncExp = QUnit.assert.rejects.call( API, async () => { throw error; }, error );
	assert.ok( pSucceedFuncExp instanceof Promise, "Returns a promise" );
	assert.ok( await pSucceedFuncExp.then( () => true ), "Promise always fulfills" );
	assert.propEqual( pushResultSpy.getCall(0).args, [{
		result: true,
		actual: error,
		expected: error,
		message: "Error: foo"
	}], "Pushes result to the test" );

	// expectation is a constructor
	pushResultSpy.reset();
	const pSucceedExpConst = QUnit.assert.rejects.call( API, Promise.reject( foo ), Foo );
	assert.ok( pSucceedExpConst instanceof Promise, "Returns a promise" );
	assert.ok( await pSucceedExpConst.then( () => true ), "Promise always fulfills" );
	assert.propEqual( pushResultSpy.getCall(0).args, [{
		result: true,
		actual: foo,
		expected: Foo,
		message: "Foo"
	}], "Pushes result to the test" );

	// expectation is something else
	pushResultSpy.reset();
	const pSucceedExpUnknown = QUnit.assert.rejects.call( API, Promise.reject( value ), value );
	assert.ok( pSucceedExpUnknown instanceof Promise, "Returns a promise" );
	assert.ok( await pSucceedExpUnknown.then( () => true ), "Promise always fulfills" );
	assert.propEqual( pushResultSpy.getCall(0).args, [{
		result: true,
		actual: value,
		expected: value,
		message: "Error"
	}], "Pushes result to the test" );

});
