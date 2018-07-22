const mapTo = v => source => (start, sink) => {
  if (start !== 0) return;
  source(0, (t, d) => sink(t, t === 1 ? v : d));
};

export default mapTo;
