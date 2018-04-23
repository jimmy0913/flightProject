'use strict';

define(['jQuery', 'Base', 'dateRange', 'Highcharts'], function ($, base, dateRange, Highcharts) {

    if ($("#IndexPage").size() < 1) return;

    var initDom = function initDom() {

        initEvent();
    },
        initEvent = function initEvent() {
        tabFn();
        getData();
        formFn();
        tablePageFn();

        new dateRange('date', {
            aRecent7Days: "fRecent7Days" + new Date().getTime(),
            aRecent30Days: "fRecent30Days" + new Date().getTime(),
            success: function success(obj) {
                date_from = obj.startDate;
                date_to = obj.endDate;
                current_page = 1;
                getData();
            },
            clear: function clear() {
                date_from = undefined;
                date_to = undefined;
                current_page = 1;
                getData();
            }
        });
    },
        getData = function getData() {

        $('#index_table').html('<tr><td colspan="10" class="center">努力加载中...</td></tr>');

        $.api('get', 'get_data_by_supplier_and_airline', {
            supplier_id: supplier_id,
            airline: airline,
            display_format: display_format,
            date_from: date_from,
            date_to: date_to,
            current_page: current_page,
            limit: limit
        }, function (ret) {

            var ohtml = '';

            if (ret.status.code == 200 && ret.status.message == 'success' && ret.result.list.length > 0) {

                page_list = ret.result.pagination;
                total_page = page_list.total_page;
                current_page = page_list.current_page;
                $('#cur_page').html(current_page);
                $('#total_count').html(' ' + page_list.total_count + ' ');
                $('#total_page').html(' ' + total_page + ' ');

                var data_list = ret.result.list;
                var average_data = data_list.splice(0, 1);

                $.each(average_data, function (i, d) {
                    ohtml += '<tr class=\'average_tr\'><td>--</td><td>' + (d.supplier_id || '--') + '</td><td>' + (d.airline || '--') + '</td><td>' + d.time + '</td><td>' + d.query_count + '</td><td>' + d.book_count + '</td><td>' + d.convert_rate + '</td><td>--</td><td>--</td><td>--</td></tr>';

                    ohtml += '<tr class=\'average_tr\'><td>--</td><td>' + (d.supplier_id || '--') + '</td><td>' + (d.airline || '--') + '</td><td>\u6807\u51C6\u5DEE</td><td>' + d.query_count_sd + '</td><td>' + d.book_count_sd + '</td><td>' + d.convert_rate_sd + '</td><td>--</td><td>--</td><td>--</td></tr>';
                });

                $.each(data_list, function (i, d) {
                    ohtml += '<tr><td width=\'90px\'>' + (i + 1 + limit * (current_page - 1)) + '</td><td width=\'120px\'>' + (d.supplier_id || '--') + '</td><td width=\'120px\'>' + (d.airline || '--') + '</td><td width=\'200px\'>' + d.time + '</td><td width=\'120px\'>' + d.query_count + '</td><td width=\'120px\'>' + d.book_count + '</td><td width=\'120px\'>' + d.convert_rate + '</td><td width="120px">' + d.profit + '</td><td width=\'120px\'>' + d.profit_rate + '</td><td>\n                    <a class=\'td_a\' href="/price/' + d.time + '?supplier_id=' + supplier_id + '&airline=' + airline + '&display_format=' + display_format + '">\u4EF7\u683C\u5206\u6790</a><a class=\'td_a\' href="/airline/' + d.time + '?supplier_id=' + (supplier_id || '') + '&airline=' + (airline || '') + '&display_format=' + display_format + '">\u822A\u7EBF\u5206\u6790</a>\n                    </td></tr>';
                });
            } else {
                ohtml += '<tr><td colspan="10" class="center">暂无数据</td></tr>';
            }

            $('#index_table').html(ohtml);
        });
    },
        getData2 = function getData2() {

        $.api('get', 'get_data_by_supplier_and_airline', {
            supplier_id: supplier_id,
            airline: airline,
            display_format: display_format,
            date_from: date_from,
            date_to: date_to,
            current_page: current_page,
            limit: limit,
            sd_interval:sd_interval,
        }, function (ret) {

            if (ret.status.code == 200 && ret.status.message == 'success') {

                xdata1 = [];
                ydata1 = [];
                ydata2 = [];
                ydata3 = [];
                ydata4 = [];

                xdata2 = [];
                yydata1 = [];
                yydata2 = [];
                yydata3 = [];
                yydata4 = [];

                var data_list = ret.result.list;
                var average_data = data_list.splice(0, 1);

                $.each(data_list.reverse(), function (i, d) {
                    xdata1.push(d.time);
                    xdata2.push(d.time);
                    ydata1.push(d.book_count);
                    yydata1.push(d.convert_rate);

                    ydata3.push(d.avg_book_count);
                    yydata3.push(d.avg_convert_rate);

                    ydata2.push(parseFloat((d.avg_book_count + d.book_count_sd).toFixed(4)));
                    yydata2.push(parseFloat((d.avg_convert_rate + d.convert_rate_sd).toFixed(4)));

                    ydata4.push(parseFloat((d.avg_book_count - d.book_count_sd).toFixed(4)));
                    yydata4.push(parseFloat((d.avg_convert_rate - d.convert_rate_sd).toFixed(4)));
                });

                drawCharts('chart1', '最近30天成交量', '成交量', xdata1, ydata1, ydata2, ydata3, ydata4);
                drawCharts('chart2', '最近30天转化率', '转化率', xdata2, yydata1, yydata2, yydata3, yydata4);
            }
        });
    },
        tabFn = function tabFn() {
        $('.btn_group a').on('click', function () {
            var idx = $(this).index();

            if (tab_index != idx) {
                $(this).addClass('on').siblings().removeClass('on');

                if (idx == 0) {
                    limit = 15;
                    current_page = 1;
                    $('.form_group').eq(0).removeClass('hide');
                    $('.label_date_content a').eq(1).removeClass('hide');
                    $('#date').removeAttr('disabled');
                    $('.data_chart_box').hide().siblings('.data_table_box').show();
                    // $('#title,#date').val('');
                    display_format = 'day';
                    $('.label_date_content a').eq(0).addClass('on').siblings().removeClass('on');
                    $('#form_group_interval').addClass('hide');

                    getData();
                } else {
                    display_format = 'day';
                    limit = 30;
                    current_page = 1;
                    $('.form_group').eq(0).addClass('hide');
                    $('.label_date_content a').eq(1).addClass('hide');
                    $('.label_date_content a').eq(0).addClass('on');
                    $('#date').attr('disabled', 'disabled');
                    $('.data_table_box').hide().siblings('.data_chart_box').show();

                    date_from = new Date().lessDay(30).Format('yyyy-MM-dd');
                    date_to = new Date().Format('yyyy-MM-dd');

                    $('#date').val(date_from + '至' + date_to);

                    date_from = null;
                    date_to = null;
                    $('#form_group_interval').removeClass('hide');

                    getData2();
                }

                tab_index = idx;
            }
        });
    },
        tablePageFn = function tablePageFn() {
        $('#prev').on('click', function () {
            if (current_page <= 1) {
                current_page = 1;
                return;
            } else {
                current_page--;
                getData();
            }
        });

        $('#next').on('click', function () {
            if (current_page >= total_page) {
                current_page = total_page;
                return;
            } else {
                current_page++;
                getData();
            }
        });

        $('#goPage').on('click', function () {

            var myPage = $('#yourPage').val();
            console.warn(myPage + ',' + total_page + ',' + current_page);
            if (myPage >= 1 && myPage <= total_page && myPage != current_page) {
                current_page = myPage;
                getData();
            } else {
                alert('错误的页码');
            }
            return false;
        });
    },
    formFn = function formFn() {
        $('#index_form').on('submit', function () {
            supplier_id = $('#supplier_id').val();
            airline = $('#title').val();
            if (tab_index == 0) {
                getData();
            } else {
                getData2();
            }

            return false;
        });

        $('.label_date_content a').on('click', function () {
            $(this).addClass('on').siblings().removeClass('on');
            display_format = display_format_arr[$(this).index()];
            current_page = 1;
            getData();
        });

        $('.label_interval_content a').on('click', function () {
            $(this).addClass('on').siblings().removeClass('on');
            sd_interval = $(this).data('interval');

            current_page = 1;
            getData2();
        });

    },
    drawCharts = function drawCharts(id, chartText, yText, xdata, ydata1, ydata2, ydata3, ydata4) {
        var chart = Highcharts.chart(id, {
            chart: {
                type: 'line',
                marginLeft: 100,
                marginRight: 100
                // backgroundColor:'rgba(241,241,241,1)'
            },
            title: {
                text: chartText
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: xdata,
                minTickInterval: 5

            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineColor: 'rgba(206,206,206,.2)'
            },
            tooltip: {
                enable: true
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                },
                series: {
                    lineWidth: 2,
                    marker: {
                        radius: 0
                    }
                }
            },
            series: [{
                name: yText,
                data: ydata1,
                symbol: 'circle',
                dataLabels: {
                    enabled: true
                }
            }, {
                name: '最高平均值',
                data: ydata2,
                symbol: 'circle',
                dataLabels: {
                    enabled: false
                }
            }, {
                name: '平均值',
                data: ydata3,
                symbol: 'circle',
                dataLabels: {
                    enabled: false
                }
            }, {
                name: '最低平均值',
                data: ydata4,
                symbol: 'circle',
                dataLabels: {
                    enabled: false
                }
            }]
        });
    },
        supplier_id = $('#supplier_id').val(),
        airline = $('#title').val(),
        display_format_arr = ['day', 'week'],
        display_format = 'day',
        page_list = '',
        current_page = 1,
        total_page = null,
        date_from = '',
        date_to = '',
        tab_index = 0,
        xdata1 = [],
        ydata1 = [],
        //成交量
    ydata2 = [],
        //最高平均值
    ydata3 = [],
        //平均值
    ydata4 = [],
        //最低平均值

    xdata2 = [],
        yydata1 = [],
        //成交量
    yydata2 = [],
        //最高平均值
    yydata3 = [],
        //平均值
    yydata4 = [],
        //最低平均值
    sd_interval = 7,

    limit = 15;

    initDom();
});