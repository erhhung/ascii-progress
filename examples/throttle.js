var ProgressBar = require('../index.js');

var bars  = [];
var total = 100;
var left  = total;
var count = 0;
var simul = 5;

var stdin = process.stdin;

stdin.setEncoding('utf8');
stdin.setRawMode(true);
stdin.on('data', (key) => {
  if (key === '\u001b' ||
      key === '\u0003') {
    process.exit();
  }
});

var timer = setInterval(function () {

  if (left < 1) {
    clearInterval(timer);
    return;
  }

  while (count < total && bars.length < simul) {
    var opts = {
      schema: 'file_' + zeroPad(count++, 3) + '.jpg: [:bar]'
    };
    if (count < simul) {
      opts.current = (simul - count) * 20;
    }
    bars.push(new ProgressBar(opts));
  }

  for (var i = 0; i < bars.length; i++) {
    var bar = bars[i];
    bar.tick(5);

    if (!bar.completed) {
      continue;
    }
    var time = (new Date - bar.start) / 1000;
    time = 'time ' + zeroPad(time.toFixed(1), 4) + ' sec';
    var mem = process.memoryUsage().heapUsed / 1024 / 1024;
    mem = ', heap ' + zeroPad(mem.toFixed(2), 5) + ' MB';

    bar.render(bar.schema.replace('[:bar]', time + mem));
    bars.splice(i--, 1);
    left--;
  }
}, 50);

function zeroPad(value, width) {
  var v = String(value || '');
  var w = width | 0;
  if (w < 1) {
    return v;
  }
  return '0000000000000000'.substr(0, w - v.length) + v;
}
