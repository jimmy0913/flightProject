require.config({
	urlArgs: "bust=2018-02-09",
	// baseUrl:'/libs',
	paths: {
		'jQuery': './../libs/jquery/dist/jquery-1.11.3.min',
		'Base': './../js/base',
		'Highcharts': './../libs/hcharts/highcharts',
		'dateRange':'./../libs/pickerDateRange/dateRange',
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
		'./../js/bootstrap'
	]
});