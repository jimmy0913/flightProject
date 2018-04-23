({
	urlArgs: "bust=2018-02-09",
	paths: {
		'jQuery': './../src/libs/jquery/dist/jquery-1.11.3.min',
		'Base': './../src/js/base',
		'Highcharts': './../src/libs/hcharts/highcharts',
		'dateRange':  './../src/libs/pickerDateRange/dateRange',
	},
	shim: {
		'jQuery': {
			exports: '$'
		},
		'Highcharts':{
			exports:'Highcharts'
		},
	},
	deps: [
		'./../src/js/bootstrap'
	],
	
	name: './../src/js/main',//源文件
	out : '../dist/js/main.js'//输出路径
})