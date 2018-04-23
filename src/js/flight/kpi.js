'use strict';

define(['jQuery', 'Base', 'dateRange', 'Highcharts'], function ($, base, dateRange, Highcharts) {

    if ($("#KpiPage").size() < 1) return;

    var initDom = function initDom() {

        initEvent();
    },
        initEvent = function initEvent() {
        getData();
        tablePageFn();
        formFn();
    },
        getData = function getData() {

        $('#index_table').html('<tr><td colspan="8" class="center">努力加载中...</td></tr>');

        $.api('get', 'get_order_info', {
            supplier_id: supplier_id,
            airline: airline,
            display_format: display_format,
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

                $.each(data_list, function (i, d) {

                    var obj_is_qualified = getIsQualifiedFn(d);
                    var obj_expected_profit_rate = getObjExpectedProfitRateFn(d);

                    ohtml += '<tr><td width=\'90px\'>' + (i + 1 + limit * (current_page - 1)) + '</td><td width=\'200px\'>' + d.time + '</td><td width=\'120px\'>' + d.query_count + '</td><td width=\'120px\'>' + d.order_count + '</td><td width=\'200px\'>' + d.profit + '</td><td width="200px">' + d.profit_rate + '</td><td width="200px">' + obj_expected_profit_rate + '</td><td>' + obj_is_qualified + '</td></tr>';
                });
            } else {
                ohtml += '<tr><td colspan="8" class="center">暂无数据</td></tr>';
            }

            $('#index_table').html(ohtml);
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
        $('.label_content_btns').on('click', function () {
            $(this).addClass('on').siblings().removeClass('on');
            display_format = display_format_arr[$(this).index()];
            current_page = 1;
            getData();
        });
    },
        getIsQualifiedFn = function getIsQualifiedFn(obj) {

        var result = '';

        if (display_format == 'day') {
            result = '--';
        } else {
            if (obj.is_qualified) {
                result = '是';
            } else {
                result = '<span class="red">否<span>';
            }
        }

        return result;
    },  
        getObjExpectedProfitRateFn = function(obj){
            var result = '';
            if(display_format == 'day'){
                result = '--';
            }else{
                result = obj.expected_profit_rate;
            }

            return result;
    },  

        supplier_id = null,
        airline = null,
        display_format_arr = ['day', 'week'],
        display_format = 'day',
        page_list = '',
        current_page = 1,
        total_page = null,
        limit = 15;

    initDom();
});