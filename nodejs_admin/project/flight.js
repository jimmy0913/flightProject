var routes_flight = require('../../nodejs_admin/routes/flight/routes_flight');

exports.start = function(app) {

	//首页
	app.get('/flight',routes_flight.index);
	app.get('/get_data_by_supplier_and_airline', routes_flight.getDataBySupplierAndAirline);

	//价格分析
	app.get('/price/:price',routes_flight.price);
	app.get('/get_markups_by_supplier_and_date', routes_flight.getDataBySupplierAndAirline);


	//航线分析
	app.get('/airline/:time',routes_flight.airline);
	app.get('/get_airlines_by_supplier_and_date', routes_flight.getDataBySupplierAndAirline);

	//某航线的历史加价分析
	app.get('/airline/history/:history',routes_flight.history);
	app.get('/get_markups_by_supplier_and_airline', routes_flight.getDataBySupplierAndAirline);


	//某价格的航线分析
	app.get('/price/time/:line',routes_flight.line);
	app.get('/get_airlines_by_supplier_and_markup', routes_flight.getDataBySupplierAndAirline);
}
