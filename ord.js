document.addEventListener('DOMContentLoaded', function () {
	const w = window.innerWidth,
		h = window.innerHeight,
		nids = 20,
	contrb = .25,
	scaleF=.0005;
	var bufferF = 50000,
		money = arrayONumbers(nids, 100000),
		income = arrayONumbers(nids, 100000),
		expence = arrayONumbers(nids, 100000);
	$("#cy").css('width', w);
	$("#cy").css('height', h);
	var cy = {};
	function rand(n) { return Math.random() * n; };
	function arrayONumbers(q, rang) {
		var a = [];
		for (var i = 0; i < q; i++) {
			a.push(rand(rang));
		}
		console.log(q, rang, a);
		return a;
	}
	function placement(n) {
		var xy = [];
		for (var i = 0; i < n; i++) {
			xy.push({ x: (Math.cos(((2 * i * Math.PI) / n)) * 300), y: (Math.sin(((2 * i * Math.PI) / n)) * 300) });
		}
		return xy;
	}
	var fakeData = new Promise(function (resolve, reject) {
		function jsonNode(id) {
			var m = money[id];
			console.log(m);
			var n = {
				group: 'nodes',
				data: { // element data 
					id: 'n' + id,
					money: m,
					income: income[id],
					expence: expence[id],
					width: m* scaleF,
					height: m * scaleF,
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
					in: true
				},
				pannable: true
			}
			var eOut = {
				group: 'edges',
				data: {
					id: 'eOut' + id,
					source: 'n' + id, // the source node id (edge comes from this node)
					target: 'nbuffer',
					out: true
				},
				pannable: true
			}
			return [eIn, eOut];
		}
		var cD = [];
		var pos = placement(nids);
		for (var i = 0; i < nids; i++) {
			cD.push(jsonNode(i));
			// cD[i].data.money = bufferF * .000005;
			cD[i].position.x = pos[i].x;
			cD[i].position.y = pos[i].y;
		}
		for (var i = 0; i < nids; i++) {
			let jE = jsonEdge(i);
			cD.push(jE[0]);
			cD.push(jE[1]);
		}
		var nOfObj = cD.push(jsonNode('buffer'));
		cD[nOfObj - 1].position.x = 0;
		cD[nOfObj - 1].position.y = 0;
		cD[nOfObj - 1].data.money=bufferF;
		console.log(cD[nOfObj - 1].data.money);
		cD[nOfObj - 1].data.width= (cD[nOfObj - 1].data.money * scaleF);
		cD[nOfObj - 1].data.height= (cD[nOfObj - 1].data.money * scaleF);
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
					.selector('node[width]')
					.css({
						'width': 'data(width)'
					})
					.selector('node[height]')
					.css({
						'height': 'data(height)'
					})
					.selector('node.label')
					.css({
						'z-index': '999999'
					})
					.selector('edge')
					.css({
						"curve-style": "bezier",
						'width': '1px',
						"control-point-step-size": 10
					})
					.selector('edge[out]')
					.css({
						'width': '2.5px',
						'line-color': 'red',
						"target-arrow-shape": "triangle"
					})
					.selector('edge[in]')
					.css({
						'width': '2.5px',
						'line-color': 'blue',
						"target-arrow-shape": "triangle"
					})
					.selector('node')
					.css({
						'background-color': '#500',
						'label': 'data(money)', // so we can see the ids
					})
			});
			console.log(cy.$('#n3').data('money'), cy.nodes()[0].data('money'));
			var anim = setInterval(function () {
				for (let i = 0; i < nids; i++) {
					let n = cy.$('#n' + i);
					let inc=rand(100000);
					let exp=rand(100000);
					if ((n.data('money') <= cy.$('buffer').data('money')/nids)&&(cy.$('buffer').data('money')>0)) {
						n.data('money',(n.data('money')+(cy.$('buffer').data('money') / nids)));
						cy.$('buffer').data('money', (cy.$('buffer').data('money') - (cy.$('buffer').data('money') / nids)));
					} else {//if(((n.data('income') - n.data('expence')) >= 0)) {
						// n.data('money', n.data('money')+((inc-exp)));
						cy.$('buffer').data('money', (cy.$('buffer').data('money') + (n.data('money') * contrb)));
						n.data('money', n.data('money') - (n.data('money') * contrb));
					}
					// else{
					// 	// n.data('money', n.data('money')+((inc-exp)));						
					// }
					n.data({
						width: parseInt(n.data('money') * scaleF),
						height: parseInt(n.data('money') * scaleF)
					});
					cy.$('buffer').data('width',cy.$('buffer').data('money')*scaleF);
					cy.$('buffer').data('height',cy.$('buffer').data('money')*scaleF);
				};
			}, 1000);
			return cy;
		}).then(function (cy) {
			// setInterval(function () {
			// 	for (var i = 0; i < nids; i++) {
			// 		cy[i].data.money = cy[i].data.income - cy[i].data.expence;
			// 	};
			// }, 500);
		});
});