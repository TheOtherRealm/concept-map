function rand(n) { return Math.random() * n; };
function createAofInts(q) {
	var a = [];
	for (var i = 0; i < q; i++) {
		a.push(i);
	}
	return a;
}
var nids = createAofInts(50);
console.log(nids);
var jsonNode = {
	group: 'nodes',
	data: { // element data (put json serialisable dev data here)
		id: 0,
		money: rand(100000),
		width: this.money * .001,
		height: this.money * .001,
	},
	position: { // the model position of the node (optional on init, mandatory after)
		x: 100,
		y: 100,
	},
	selected: false, // whether the element is selected (default false)
	selectable: true, // whether the selection state is mutable (default true)
	locked: false, // when locked a node's position is immutable (default false)
	grabbable: true, // whether the node can be grabbed and moved by the user
	pannable: false, // whether dragging the node causes panning instead of grabbing
};
var jsonEdge = {
	group: 'edges',
	data: {
		id: 0,
		source: 'buffer', // the source node id (edge comes from this node)
		target: nids[0]
	},
	pannable: true // whether dragging on the edge causes panning
};
var cD = [];
for (var i = 0; i < nids.length; i++) {
	var pos = (i * 75);
	cD.push(jsonNode);
	cD[i].data.id = nids[i];
}

if (pos <= 500) {
	cD[i].position.x = pos % 500
}

var x = 0,
	y = 0,
	delta = [0, -1],
	width = 5,
	height = 3;


for (i = Math.pow(Math.max(width, height), 2); i > 0; i--) {
	if ((-width / 2 < x && x <= width / 2)
		&& (-height / 2 < y && y <= height / 2)) {
		console.debug('POINT', x, y);
		$('#result').append('[' + x + ', ' + y + '], ');
	}

	if (x === y
		|| (x < 0 && x === -y)
		|| (x > 0 && x === 1 - y)) {
		// change direction
		delta = [-delta[1], delta[0]]
	}

	x += delta[0];
	y += delta[1];
}
// 2D vectors
const add = ([x0, y0]) => ([x1, y1]) => [x0 + x1, y0 + y1];
const rotate = θ => ([x, y]) => [
	Math.round(x * Math.cos(θ) - y * Math.sin(θ)),
	Math.round(x * Math.sin(θ) + y * Math.cos(θ))
];
// Iterables
const fromGen = g => ({ [Symbol.iterator]: g });
const range = n => [...Array(n).keys()];
const map = f => it =>
	fromGen(function* () {
		for (const v of it) {
			yield f(v);
		}
	});
const take = n => it =>
	fromGen(function* () {
		for (let v of it) {
			if (--n < 0) break;
			yield v;
		}
	});
const empty = [];
const append = it1 => it2 =>
	fromGen(function* () {
		yield* it1;
		yield* it2;
	});

// Outward spiral
const spiralOut = i => {
	const n = Math.floor(i / 2) + 1;
	const leg = range(n).map(x => [x, 0]);
	const transform = p => add([n, 0])(rotate(Math.PI / 2)(p));

	return fromGen(function* () {
		yield* leg;
		yield* map(transform)(spiralOut(i + 1));
	});
};

// Test
{
	const points = [...take(5)(spiralOut(0))];
	console.log(JSON.stringify(points));
}

// Inward spiral
const spiralIn = ([w, h]) => {
	const leg = range(w).map(x => [x, 0]);
	const transform = p => add([w - 1, 1])(rotate(Math.PI / 2)(p));

	return w * h === 0
		? empty
		: append(leg)(
			fromGen(function* () {
				yield* map(transform)(spiralIn([h - 1, w]));
			})
		);
};
// Test
{
	const points = [...spiralOut([5, 5])];
	console.log(JSON.stringify(points));
}