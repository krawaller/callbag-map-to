let test = require('tape');

let mapTo = require('./index');

test('it maps data to a fixed value and hands along terminations', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', true);
  const mapToFoo = mapTo('foo');
  const sink = makeMockCallbag('sink', report);

  mapToFoo(source)(0, sink);

  source.emit(1, 'bar');
  source.emit(1, 'baz');
  source.emit(2, 'error');

  t.deepEqual(history, [
    ['sink', 'fromUp', 1, 'foo'],
    ['sink', 'fromUp', 1, 'foo'],
    ['sink', 'fromUp', 2, 'error'],
  ], 'sink gets terminations and mapped values');

  t.end();
});

test('it passes requests back up', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', report, true);
  const mapToFoo = mapTo('foo');
  const sink = makeMockCallbag('sink', report);

  mapToFoo(source)(0, sink);

  sink.emit(1);
  sink.emit(2);

  t.deepEqual(history, [
    ['source', 'fromDown', 1, undefined],
    ['source', 'fromDown', 2, undefined],
  ], 'source gets requests from sink');

  t.end();
});

function makeMockCallbag(name, report=()=>{}, isSource) {
  if (report === true) {
    isSource = true;
    report = ()=>{};
  }
  let talkback;
  let mock = (t, d) => {
    report(name, 'fromUp', t, d);
    if (t === 0){
      talkback = d;
      if (isSource) talkback(0, (st, sd) => report(name, 'fromDown', st, sd));
    }
  };
  mock.emit = (t, d) => {
    if (!talkback) throw new Error(`Can't emit from ${name} before anyone has connected`);
    talkback(t, d);
  };
  return mock;
}
