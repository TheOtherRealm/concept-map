document.addEventListener('DOMContentLoaded', function () {
	var w = window.innerWidth,
		h = window.innerHeight,
		numOfGroups = 50;
	$("#cy").css('width', w);
	$("#cy").css('height', h);
	var nw = ['100px', '200px', '50px'];
	var iter = 0;
	function rand(n) { return Math.random() * n; };
	function arrayONumbers(q, rang) {
		var a = [];
		for (var i = 0; i < q; i++) {
			a.push(rand(rang));
		}
		console.log(q, rang, a);
		return a;
	}
	var cy = cytoscape({
		container: document.getElementById('cy'),
		elements: [ // flat array of nodes and edges
			{ // node n1
				group: 'nodes', // 'nodes' for a node, 'edges' for an edge
				// NB the group field can be automatically inferred for you but specifying it
				// gives you nice debug messages if you mis-init elements
				data: { // element data (put json serialisable dev data here)
					id: 'n1', // mandatory (string) id for each element, assigned automatically on undefined
					parent: 'nparent', // indicates the compound node parent id; not defined => no parent
					// (`parent` can be effectively changed by `eles.move()`)
					width: nw[0]
				},
				// scratchpad data (usually temp or nonserialisable data)
				scratch: {
					_foo: 'bar' // app fields prefixed by underscore; extension fields unprefixed
				},
				position: { // the model position of the node (optional on init, mandatory after)
					x: 100,
					y: 100
				},
				selected: false, // whether the element is selected (default false)
				selectable: true, // whether the selection state is mutable (default true)
				locked: false, // when locked a node's position is immutable (default false)
				grabbable: true, // whether the node can be grabbed and moved by the user
				pannable: false, // whether dragging the node causes panning instead of grabbing
				classes: ['foo', 'bar'] // an array (or a space separated string) of class names that the element has
			},
			{ // node n2
				data: { id: 'n2', width: nw[1] },
				renderedPosition: { x: 200, y: 200 }, // can alternatively specify position in rendered on-screen pixels
			},
			{ // node n3
				data: {
					id: 'n3',
					parent: 'nparent',
					width: nw[2]
				},
				position: { x: 123, y: 234 }
			},

			{ // node nparent
				data: { id: 'nparent' }
			},

			{ // edge e1
				data: {
					id: 'e1',
					// inferred as an edge because `source` and `target` are specified:
					source: 'n1', // the source node id (edge comes from this node)
					target: 'n2'  // the target node id (edge goes to this node)
					// (`source` and `target` can be effectively changed by `eles.move()`)
				},
				pannable: true // whether dragging on the edge causes panning
			}
		],
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

	});
});