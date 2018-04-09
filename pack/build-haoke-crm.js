({
	urlArgs: "bust=2018-02-09",
	// baseUrl:'/libs',
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
	]
	,
	out : '../dist/js/main.js',
	name: './../src/js/main',
})