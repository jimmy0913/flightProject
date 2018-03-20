require.config({
	urlArgs: "bust=2018-02-09",
	// baseUrl:'/libs',
	paths: {
		'jQuery': 'http://p1b4fm7e0.bkt.clouddn.com/jquery.min',
		'Base': './../js/base',
		'layui':'./../libs/layui-src/dist/layui.all',
		'lay':'./../libs/layui-src/dist/layui',
		'dateRange':'./../libs/pickerDateRange/dateRange',
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
		'./../js/bootstrap'
	]
});