function placement(n){
	var xy=[];
	for(var i=0;i<n;i++){
		xy.push({x:(Math.cos(((2*i*Math.PI)/n))*300),y:(Math.sin(((2*i*Math.PI)/n))*300)});
	}
	return xy;
}
function rand(n) { return Math.random() * n; };
const createAofInts = q => {
	var a = [];
	for (var i = 0; i < q; i++) {
		a.push(i);
	}
	return a;
}
const nids = 40;
var iterIds = 0;
console.log(nids);
function jsonNode(id) {
	var m=rand(100000);
	var n = {
		group: 'nodes',
		data: { // element data (put json serialisable dev data here)
			id: id,
			money: m,
			width: m * .0005,
			height: m * .0005,
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
	}
	return n;
}
function jsonEdge() {
	var e = {
		group: 'edges',
		data: {
			id: 0,
			source: 'buffer', // the source node id (edge comes from this node)
			target: nids[0]
		},
		pannable: true // whether dragging on the edge causes panning
	}
	return e;
}
var cD = [];
var pos = placement(nids);
for (var i = 0; i < nids; i++) {
	cD.push(jsonNode(i));
	cD[i].data.id = i;
	cD[i].position.x = pos[i].x;
	cD[i].position.y = pos[i].y;
}
console.log(pos,cD);
 JSON.parse(cD);