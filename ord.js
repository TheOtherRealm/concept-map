document.addEventListener('DOMContentLoaded', function () {
	var w = window.innerWidth,
		h = window.innerHeight,
		numOfGroups = 50;
	$("#cy").css('width', w);
	$("#cy").css('height', h);
	var nw = ['100px', '200px', '50px'];
	var iter = 0;
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
	fetch('fakeData.json', { mode: 'no-cors' })
		.then(function (res) {
			return res.json()
		})
		.then(function (data) {
			var cy = cytoscape({
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
					
			});
			return data;
		}).then(function(data){
			cy.add([ // flat array of nodes and edges
				{
					group: 'nodes', // 'nodes' for a node, 'edges' for an edge
					// NB the group field can be automatically inferred for you but specifying it
					// gives you nice debug messages if you mis-init elements
					data: { // element data (put json serialisable dev data here)
						id: 'buffer', // mandatory (string) id for each element, assigned automatically on undefined
						width: bufferF * 0.000001,
						height: bufferF * 0.000001,
					},
					position: { // the model position of the node (optional on init, mandatory after)
						x: w / 2,
						y: h / 2,
					},
					selected: false, // whether the element is selected (default false)
					selectable: true, // whether the selection state is mutable (default true)
					locked: false, // when locked a node's position is immutable (default false)
					grabbable: true, // whether the node can be grabbed and moved by the user
					pannable: false, // whether dragging the node causes panning instead of grabbing
					classes: ['foo', 'bar'] // an array (or a space separated string) of class names that the element has
				}
			])
		})
});