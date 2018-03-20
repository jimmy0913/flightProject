({
	urlArgs: "bust=2018-02-09",
	// baseUrl:'/libs',
	paths: {
		'jQuery': 'http://p1b4fm7e0.bkt.clouddn.com/jquery.min',
		'Base': './../src/js/base',
		'layui':'./../src/libs/layui-src/dist/layui.all',
		'lay':'./../src/libs/layui-src/dist/layui',
		'dateRange':'./../src/libs/pickerDateRange/dateRange',
	},
	shim: {
		'jQuery': {
			exports: '$'
		},
		'layui':{
			exports:'layui',
		},
		'lay':{
			exports:'lay',
		}
		
	},
	deps: [
		'./../src/js/bootstrap'
	]
	,
	out : '../dist/js/main.js',
	name: './../src/js/main',
})