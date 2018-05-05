const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const mapTo = require('./index');

test('it maps data to a fixed value and hands along terminations', t => {
  const source = makeMockCallbag(true);
  const mapToFoo = mapTo('foo');
  const sink = makeMockCallbag();

  mapToFoo(source)(0, sink);

  source.emit(1, 'bar');
  source.emit(1, 'baz');
  source.emit(2, 'error');

  t.deepEqual(
    sink.getReceivedData(),
    ['foo', 'foo'],
    'data was mapped'
  );
  t.ok(!sink.checkConnection(), 'termination was passed along');
  t.end();
});

test('it passes requests back up', t => {
  const source = makeMockCallbag(true);
  const mapToFoo = mapTo('foo');
  const sink = makeMockCallbag();

  mapToFoo(source)(0, sink);

  sink.emit(1);
  sink.emit(2);

  const [init,...messages] = source.getMessages();

  t.equal(init[0], 0, 'source got init request');
  t.deepEqual(messages, [[1, undefined], [2, undefined]], 'source got messages');
  t.end();
});
