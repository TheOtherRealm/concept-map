document.addEventListener('DOMContentLoaded', function () {
	var w = window.innerWidth,
		h = window.innerHeight,
		numOfGroups = 50;
	$("#cy").css('width', w);
	$("#cy").css('height', h);
	var bufferF = 1000000;
	function rand(n) { return Math.random() * n; };
	function arrayONumbers(q, rang) {
		var a = [];
		for (var i = 0; i < q; i++) {
			a.push(rand(rang));
		}
		console.log(q, rang, a);
		return a;
	}
	var fakeData = new Promise(function (resolve, reject) {
		function placement(n) {
			var xy = [];
			for (var i = 0; i < n; i++) {
				xy.push({ x: (Math.cos(((2 * i * Math.PI) / n)) * 300), y: (Math.sin(((2 * i * Math.PI) / n)) * 300) });
			}
			return xy;
		}
		function rand(n) { return Math.random() * n; };
		const nids = 40;
		console.log(nids);
		function jsonNode(id) {
			var m = rand(100000);
			var n = {
				group: 'nodes',
				data: { // element data 
					id: 'n' + id,
					money: m,
					width: m * .0005,
					height: m * .0005,
				},
				position: { // the model position of the node 
					x: 100,
					y: 100,
				},
				type: "bezier",
				selected: false, // whether the element is selected 
				selectable: true, // whether the selection state is mutable 
				locked: false, // when locked a node's position is immutable 
				grabbable: true, // whether the node can be grabbed and moved by the user
				pannable: false, // whether dragging the node causes panning instead of grabbing
			}
			return n;
		}
		function jsonEdge(id) {
			var eIn = {
				group: 'edges',
				data: {
					id: 'eIn' + id,
					source: 'nbuffer', // the source node id (edge comes from this node)
					target: 'n' + id,
					in:true
				},
				pannable: true
			}
			var eOut = {
				group: 'edges',
				data: {
					id: 'eOut' + id,
					source: 'n' + id, // the source node id (edge comes from this node)
					target: 'nbuffer',
					out:true
				},
				pannable: true
			}
			return [eIn,eOut];
		}
		var cD = [];
		var pos = placement(nids);
		for (var i = 0; i < nids; i++) {
			cD.push(jsonNode(i));
			cD[i].position.x = pos[i].x;
			cD[i].position.y = pos[i].y;
		}
		for (var i = 0; i < nids; i++) {
			let jE=jsonEdge(i);
			cD.push(jE[0]);
			cD.push(jE[1]);
		}
		var nOfObj = cD.push(jsonNode('buffer'));
		cD[nOfObj - 1].position.x = 0;
		cD[nOfObj - 1].position.y = 0;
		cD[nOfObj - 1].data.width = 200;
		cD[nOfObj - 1].data.height = 200;
		resolve(cD);
	});
	fakeData
		.then((data) => {
			console.log(data);
			cy = cytoscape({
				container: document.getElementById('cy'),
				elements: data,
				layout: {
					name: 'preset'
				},
				style: cytoscape.stylesheet()
					.selector('node')
					.css({
						'lable': 'data(id)',// so we can see the ids
					})
					.selector('node[width]')
					.css({
						'width': 'data(width)'
					})
					.selector('node[height]')
					.css({
						'height': 'data(height)'
					})
					.selector('edge')
					.css({
						"curve-style": "bezier",
						'width': '1px',
						"control-point-step-size": 10
					})
					.selector('edge[out]')
					.css({
						'width':'2.5px',
						'line-color':'red',
						"target-arrow-shape": "triangle"
					})
					.selector('edge[in]')
					.css({
						'width':'2.5px',
						'line-color':'blue',
						"target-arrow-shape": "triangle"
					})
			});
			return data;
		})
});