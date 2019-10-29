document.addEventListener('DOMContentLoaded', function () {
	var w = window.innerWidth,
		h = window.innerHeight,
		numOfGroups = 50;
	$("#cy").css('width', w);
	$("#cy").css('height', h);
	var nw = ['100px', '200px', '50px'];
	var iter = 0;
	var cy = [];
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
					id: 'n'+id,
					money: m,
					width: m * .0005,
					height: m * .0005,
				},
				position: { // the model position of the node 
					x: 100,
					y: 100,
				},
				selected: false, // whether the element is selected 
				selectable: true, // whether the selection state is mutable 
				locked: false, // when locked a node's position is immutable 
				grabbable: true, // whether the node can be grabbed and moved by the user
				pannable: false, // whether dragging the node causes panning instead of grabbing
			}
			return n;
		}
		function jsonEdge(id) {
			var e = {
				group: 'edges',
				data: {
					id: 'e'+id,
					source: 'nbuffer', // the source node id (edge comes from this node)
					target: 'n'+id
				},
				pannable: true // whether dragging on the edge causes panning
			}
			return e;
		}
		var cD = [];
		var pos = placement(nids);
		for (var i = 0; i < nids; i++) {
			cD.push(jsonNode(i));
			cD[i].position.x = pos[i].x;
			cD[i].position.y = pos[i].y;
		}
		for (var i = 0; i < nids; i++) {
			cD.push(jsonEdge(i));
		}
		var nOfObj = cD.push(jsonNode('buffer'));
		cD[nOfObj-1].position.x = 0;
		cD[nOfObj-1].position.y = 0;
		cD[nOfObj-1].data.width=200;
		cD[nOfObj-1].data.height=200;
		console.log(JSON.stringify(cD))
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
					.selector('edge[width]')
					.css({
						'width': '1px'
					})

			});
			return data;
		})
	// .then(function (data) {
	// 	cy.add( // flat array of nodes and edges
	// 		{
	// 			group: 'nodes', // 'nodes' for a node, 'edges' for an edge
	// 			// NB the group field can be automatically inferred for you but specifying it
	// 			// gives you nice debug messages if you mis-init elements
	// 			data: { // element data (put json serialisable dev data here)
	// 				id: 'buffer', // mandatory (string) id for each element, assigned automatically on undefined
	// 				width: bufferF * 0.000001,
	// 				height: bufferF * 0.000001,
	// 			},
	// 			position: { // the model position of the node (optional on init, mandatory after)
	// 				x: w / 2,
	// 				y: h / 2,
	// 			},
	// 			selected: false, // whether the element is selected (default false)
	// 			selectable: true, // whether the selection state is mutable (default true)
	// 			locked: false, // when locked a node's position is immutable (default false)
	// 			grabbable: true, // whether the node can be grabbed and moved by the user
	// 			pannable: false, // whether dragging the node causes panning instead of grabbing
	// 			classes: ['foo', 'bar'] // an array (or a space separated string) of class names that the element has
	// 		}
	// 	)
	// })
});