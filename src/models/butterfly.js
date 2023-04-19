
export const Butterfly = {
	"part": "body",
	"object" : {
		"num_vertices" : 8,
		"vertices" : [
			[-1.0,  1.0,  1.0],
			[ 1.0,  1.0,  1.0],
			[ 1.0, -1.0,  1.0],
			[-1.0, -1.0,  1.0],
			[-1.0,  1.0, -1.0],
			[ 1.0,  1.0, -1.0],
			[ 1.0, -1.0, -1.0],
			[-1.0, -1.0, -1.0]
		],
		"num_indices" : 6,
		"indices" : [
			[0, 1, 2, 3],
			[4, 5, 6, 7],
			[0, 3, 7, 4],
			[1, 5, 6, 2],
			[0, 4, 5, 1],
			[3, 7, 6, 2]
		],
		"colors" : [
			[255, 0, 0, 255],
			[255, 0, 0, 255],
			[255, 0, 0, 255],
			[255, 0, 0, 255],
			[255, 0, 0, 255],
			[255, 0, 0, 255]
		]
	},
	"textureType": "environment",
	"translation" : [0, 0, 0],
	"rotation" : [0, 0, 0],
	"scale" : [1, 1, 1],
	"subtree_translate" : [0, 0, 0],
	"subtree_rotate" : [0, 0, 0],
	"subtree_scale" : [1, 1, 1],
	"children" : [
		{
			"part": "head",
			"object" : {
				"num_vertices" : 8,
				"vertices" : [
					[-0.6, 2.2,  0.6],
					[ 0.6, 2.2,  0.6],
					[ 0.6, 1.0,  0.6],
					[-0.6, 1.0,  0.6],
					[-0.6, 2.2, -0.6],
					[ 0.6, 2.2, -0.6],
					[ 0.6, 1.0, -0.6],
					[-0.6, 1.0, -0.6]
				],
				"num_indices" : 6,
				"indices" : [
					[0, 1, 2, 3],
					[4, 5, 6, 7],
					[0, 3, 7, 4],
					[1, 5, 6, 2],
					[0, 4, 5, 1],
					[3, 7, 6, 2]
				],
				"colors" : [
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255]
				]
			},
			"textureType": "environment",
			"translation" : [0, 0, 0],
			"rotation" : [0, 0, 0],
			"scale" : [1, 1, 1],
			"subtree_translate" : [0, 0, 0],
			"subtree_rotate" : [0, 0, 0],
			"subtree_scale" : [1, 1, 1],
			"children" : [
				{
					"part": "left antenna",
					"object" : {
						"num_vertices" : 8,
						"vertices" : [
							[-0.35, 3.0,  0.05],
							[-0.25, 3.0,  0.05],
							[-0.25, 2.2,  0.05],
							[-0.35, 2.2,  0.05],
							[-0.35, 3.0, -0.05],
							[-0.25, 3.0, -0.05],
							[-0.25, 2.2, -0.05],
							[-0.35, 2.2, -0.05]
						],
						"num_indices" : 6,
						"indices" : [
							[0, 1, 2, 3],
							[4, 5, 6, 7],
							[0, 3, 7, 4],
							[1, 5, 6, 2],
							[0, 4, 5, 1],
							[3, 7, 6, 2]
						],
						"colors" : [
							[255, 0, 0, 255],
							[255, 0, 0, 255],
							[255, 0, 0, 255],
							[255, 0, 0, 255],
							[255, 0, 0, 255],
							[255, 0, 0, 255]
						]
					},
					"textureType": "environment",
					"translation" : [0, 0, 0],
					"rotation" : [0, 0, 0],
					"scale" : [1, 1, 1],
					"subtree_translate" : [0, 0, 0],
					"subtree_rotate" : [0, 0, 0],
					"subtree_scale" : [1, 1, 1],
					"children" : []
				},
				{
					"part": "right antenna",
					"object" : {
						"num_vertices" : 8,
						"vertices" : [
							[0.25, 3.0,  0.05],
							[0.35, 3.0,  0.05],
							[0.35, 2.2,  0.05],
							[0.25, 2.2,  0.05],
							[0.25, 3.0, -0.05],
							[0.35, 3.0, -0.05],
							[0.35, 2.2, -0.05],
							[0.25, 2.2, -0.05]
						],
						"num_indices" : 6,
						"indices" : [
							[0, 1, 2, 3],
							[4, 5, 6, 7],
							[0, 3, 7, 4],
							[1, 5, 6, 2],
							[0, 4, 5, 1],
							[3, 7, 6, 2]
						],
						"colors" : [
							[255, 0, 0, 255],
							[255, 0, 0, 255],
							[255, 0, 0, 255],
							[255, 0, 0, 255],
							[255, 0, 0, 255],
							[255, 0, 0, 255]
						]
					},
					"textureType": "environment",
					"translation" : [0, 0, 0],
					"rotation" : [0, 0, 0],
					"scale" : [1, 1, 1],
					"subtree_translate" : [0, 0, 0],
					"subtree_rotate" : [0, 0, 0],
					"subtree_scale" : [1, 1, 1],
					"children" : []
				}
			]
		},
		{
			"part": "tail",
			"object" : {
				"num_vertices" : 8,
				"vertices" : [
					[-0.6, -1.0,  0.6],
					[ 0.6, -1.0,  0.6],
					[ 0.6, -4.0,  0.6],
					[-0.6, -4.0,  0.6],
					[-0.6, -1.0, -0.6],
					[ 0.6, -1.0, -0.6],
					[ 0.6, -4.0, -0.6],
					[-0.6, -4.0, -0.6]
				],
				"num_indices" : 6,
				"indices" : [
					[0, 1, 2, 3],
					[4, 5, 6, 7],
					[0, 3, 7, 4],
					[1, 5, 6, 2],
					[0, 4, 5, 1],
					[3, 7, 6, 2]
				],
				"colors" : [
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255]
				]
			},
			"textureType": "environment",
			"translation" : [0, 0, 0],
			"rotation" : [0, 0, 0],
			"scale" : [1, 1, 1],
			"subtree_translate" : [0, 0, 0],
			"subtree_rotate" : [0, 0, 0],
			"subtree_scale" : [1, 1, 1],
			"children" : []
		},
		{
			"part": "left wing",
			"object" : {
				"num_vertices" : 8,
				"vertices" : [
					[-5.0,  3.8,  0.05],
					[-1.0,  0.6,  0.05],
					[-1.0, -0.6,  0.05],
					[-5.0, -3.8,  0.05],
					[-5.0,  3.8, -0.05],
					[-1.0,  0.6, -0.05],
					[-1.0, -0.6, -0.05],
					[-5.0, -3.8, -0.05]
				],
				"num_indices" : 6,
				"indices" : [
					[0, 1, 2, 3],
					[4, 5, 6, 7],
					[0, 3, 7, 4],
					[1, 5, 6, 2],
					[0, 4, 5, 1],
					[3, 7, 6, 2]
				],
				"colors" : [
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255]
				]
			},
			"textureType": "environment",
			"translation" : [0, 0, 0],
			"rotation" : [0, 0, 0],
			"scale" : [1, 1, 1],
			"subtree_translate" : [0, 0, 0],
			"subtree_rotate" : [0, 0, 0],
			"subtree_scale" : [1, 1, 1],
			"children" : []
		},
		{
			"part": "right wing",
			"object" : {
				"num_vertices" : 8,
				"vertices" : [
					[1.0,  0.6,  0.05],
					[5.0,  3.8,  0.05],
					[5.0, -3.8,  0.05],
					[1.0, -0.6,  0.05],
					[1.0,  0.6, -0.05],
					[5.0,  3.8, -0.05],
					[5.0, -3.8, -0.05],
					[1.0, -0.6, -0.05]
				],
				"num_indices" : 6,
				"indices" : [
					[0, 1, 2, 3],
					[4, 5, 6, 7],
					[0, 3, 7, 4],
					[1, 5, 6, 2],
					[0, 4, 5, 1],
					[3, 7, 6, 2]
				],
				"colors" : [
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255],
					[255, 0, 0, 255]
				]
			},
			"textureType": "environment",
			"translation" : [0, 0, 0],
			"rotation" : [0, 0, 0],
			"scale" : [1, 1, 1],
			"subtree_translate" : [0, 0, 0],
			"subtree_rotate" : [0, 0, 0],
			"subtree_scale" : [1, 1, 1],
			"children" : []
		}
	]
}