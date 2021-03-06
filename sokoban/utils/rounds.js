/**
 * Created by 38079 on 2018/1/30.
 */
const rounds = [{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
		[0, 1, 2, 2, 3, 2, 4, 2, 1, 0],
		[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
		[0, 1, 2, 2, 3, 2, 4, 2, 1, 0],
		[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
		[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 2,
		y: 3
	},
	way: [2, 6, 6, 6, 4, 4, 8, 8, 6, 6]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 1, 1, 0, 0, 0],
		[0, 0, 1, 4, 3, 1, 0, 0, 0, 0],
		[0, 0, 1, 4, 2, 1, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 5,
		y: 3
	},
	way: [8, 4, 4, 2, 2, 2, 2, 6, 8, 4, 8, 8, 8, 6, 6, 2, 4, 8, 4, 2, 2, 2, 6, 8, 4, 8, 8, 6, 6, 2, 4, 8, 4, 2, 2]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 1, 2, 2, 1, 1, 1, 0, 0],
		[0, 0, 1, 2, 2, 3, 2, 1, 0, 0],
		[0, 0, 1, 2, 5, 4, 2, 1, 0, 0],
		[0, 0, 1, 1, 2, 2, 2, 1, 0, 0],
		[0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 6,
		y: 4
	},
	way: [2, 2, 4, 4, 8, 4, 8, 8, 6, 2, 4, 2, 6, 2, 6, 6, 8, 8, 4, 6, 2, 2, 4, 4, 8, 4, 8, 8, 6, 2]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 1, 0, 0],
		[0, 0, 1, 4, 3, 5, 2, 1, 0, 0],
		[0, 0, 1, 2, 2, 1, 2, 1, 0, 0],
		[0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 3,
		y: 3
	},
	way: [6, 2, 4, 2, 2, 6, 6, 6, 8, 8, 4, 4, 6, 6, 2, 2, 4, 4, 8, 2, 6, 6, 8, 8, 4, 8, 4, 4, 2, 6, 2, 2, 4, 8]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 1, 2, 2, 1, 0, 0, 0, 0],
		[0, 0, 1, 2, 2, 1, 0, 0, 0, 0],
		[0, 0, 1, 2, 2, 1, 1, 1, 0, 0],
		[0, 0, 1, 2, 3, 3, 2, 1, 0, 0],
		[0, 0, 1, 4, 2, 2, 4, 1, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 4,
		y: 5
	},
	way: [4, 2, 2, 6, 8, 8, 2, 2, 6, 6, 8, 4, 2, 4, 4, 8, 8, 6, 2, 4, 2, 6, 6, 4, 4, 8, 8, 8, 8, 6, 2, 2, 2, 6, 2, 4]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 1, 4, 2, 1, 0, 0, 0, 0],
		[0, 0, 1, 2, 2, 1, 1, 1, 0, 0],
		[0, 0, 1, 2, 3, 2, 2, 1, 0, 0],
		[0, 0, 1, 2, 3, 4, 2, 1, 0, 0],
		[0, 0, 1, 2, 2, 1, 1, 1, 0, 0],
		[0, 0, 1, 1, 1, 1, 2, 2, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 4,
		y: 3
	},
	way: [ 2, 4, 2, 2, 6, 8, 6, 6, 2, 4,4, 8, 4, 8, 8, 6, 2, 4, 2, 6, 2, 6, 6, 8, 4, 2, 4, 2, 4, 8, 8, 8, 6, 2, 4, 2, 6]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 1, 2, 2, 3, 4, 1, 0, 0],
		[0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
		[0, 0, 1, 2, 3, 1, 4, 1, 0, 0],
		[0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 4,
		y: 3
	},
	way: [ 2, 6, 6, 8, 4, 2, 6, 2, 2, 4, 4, 8, 4, 8, 6, 6, 8, 6, 2, 4, 4, 4, 8, 6, 6]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 4, 1, 3, 1, 1, 0, 0],
		[0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
		[0, 0, 1, 4, 2, 3, 2, 1, 0, 0],
		[0, 0, 1, 1, 1, 2, 2, 1, 0, 0],
		[0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 5,
		y: 5
	},
	way: [ 6, 2, 2, 4, 8, 6, 8, 4, 2, 4, 4, 8, 8, 8, 6, 6, 2, 2, 4, 2, 4, 8, 6, 6, 6, 2, 4, 4]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 1, 3, 4, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 1, 2, 1, 0, 0, 0],
		[0, 0, 1, 4, 3, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 5,
		y: 6
	},
	way: [ 8, 8, 8, 8, 4, 2, 6, 2, 2, 2, 2, 4, 4, 8, 8, 8, 6, 4, 2, 2, 2, 6, 6, 8, 4, 6, 8, 8]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
		[0, 0, 1, 1, 1, 2, 2, 1, 0, 0],
		[0, 0, 1, 4, 3, 3, 4, 1, 0, 0],
		[0, 0, 1, 2, 1, 2, 2, 1, 0, 0],
		[0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
		[0, 0, 1, 1, 1, 2, 2, 1, 0, 0],
		[0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 4,
		y: 6
	},
	way: [ 6, 8, 6, 8, 8, 4, 2, 6, 2, 2, 4, 4, 4, 8, 8, 6, 6, 8, 6, 2, 2, 8, 4, 4, 4, 2, 2, 6, 6, 8, 6, 8, 4, 4, 6, 2, 2, 2, 6, 8, 8]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 4, 2, 4, 1, 0, 0, 0],
		[0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 3, 1, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 1, 2, 2, 1, 0, 0, 0],
		[0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 4,
		y: 2
	},
	way: [ 6, 2, 4, 8, 4, 2, 6, 2, 2, 6, 2, 2, 4, 8, 8, 8, 8, 4, 8, 6, 2, 2, 2, 4, 8, 8]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 4, 4, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
		[0, 0, 1, 1, 3, 2, 1, 1, 0, 0],
		[0, 0, 0, 1, 2, 2, 2, 1, 0, 0],
		[0, 0, 0, 1, 2, 1, 2, 1, 0, 0],
		[0, 0, 0, 1, 2, 2, 2, 1, 0, 0],
		[0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 5,
		y: 2
	},
	way: [ 4, 4, 2, 6, 8, 6, 2, 4, 2, 2, 6, 6, 2, 2, 4, 4, 8, 8, 8, 8, 6, 2, 8, 8, 4, 2, 2, 2, 2, 2, 6, 6, 8, 8, 4, 6, 2, 2, 4, 4, 8, 8, 8, 8]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 1, 2, 2, 1, 0, 0, 0, 0],
		[0, 0, 1, 2, 2, 1, 0, 0, 0, 0],
		[0, 0, 1, 2, 2, 1, 1, 1, 0, 0],
		[0, 0, 1, 4, 3, 3, 2, 1, 0, 0],
		[0, 0, 1, 2, 2, 4, 2, 1, 0, 0],
		[0, 0, 1, 2, 2, 1, 1, 1, 0, 0],
		[0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 6,
		y: 6
	},
	way: [ 4, 4, 8, 2, 6, 6, 8, 4, 4, 8, 4, 8, 8, 6, 2, 2, 4, 2, 6, 2, 6, 6, 8, 4, 2, 4, 2, 4, 8, 8, 8, 6, 2, 4, 2, 6, 8, 8, 8, 8, 4, 2, 2]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 1, 5, 1, 1, 0, 0],
		[0, 0, 1, 2, 2, 3, 2, 1, 0, 0],
		[0, 0, 1, 2, 1, 2, 2, 1, 0, 0],
		[0, 0, 1, 2, 2, 4, 2, 1, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 5,
		y: 3
	},
	way: [ 4, 4, 2, 2, 2, 2, 6, 6, 6, 8, 8, 4, 2, 2, 4, 4, 8, 8, 8, 8, 6, 6, 2, 2, 2, 8, 8, 8, 4, 4, 2, 2, 6, 4, 8, 8, 6, 6, 2, 2, 6, 2, 2, 4, 8, 8, 4, 4, 2, 2, 6]
},{
	map: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
		[0, 0, 1, 2, 3, 3, 1, 1, 1, 0],
		[0, 0, 1, 1, 4, 2, 4, 2, 1, 0],
		[0, 0, 0, 1, 2, 2, 2, 2, 1, 0],
		[0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	person: {
		x: 4,
		y: 4
	},
	way: [ 6, 2, 8, 4, 4, 2, 6, 2, 2, 6, 6, 8, 4, 2, 4, 8, 8, 4, 8, 8, 6, 6, 2, 2, 4, 2, 6, 8, 8, 8, 4, 2, 2]
}];

module.exports = {
	rounds: rounds
};
