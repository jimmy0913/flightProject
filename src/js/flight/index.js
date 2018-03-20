define(['jQuery', 'Base', 'layui', 'lay','dateRange'], function($, base, layui, lay,dateRange) {

    if ($("#IndexPage").size() < 1)
        return;



    var initDom = function() {

            
            initEvent();
    },
    initEvent = function() {

            getData();
            formFn();
            tablePageFn();


            new dateRange('date', {
                aRecent7Days: "fRecent7Days" + new Date().getTime(),
                aRecent30Days: "fRecent30Days" + new Date().getTime(),
                success: function(obj) {
                    date_from = obj.startDate;
                    date_to = obj.endDate;
                    current_page = 1;
                    getData();
                },
                clear: function() {
                    date_from = undefined;
                    date_to = undefined;
                    current_page = 1;
                    getData(); 
                }
            });

    },

    getData = function(){

        $('#index_table').html('<tr><td colspan="10" class="center">努力加载中...</td></tr>');

        $.api('get','get_data_by_supplier_and_airline',{
            supplier_id:supplier_id,
            airline:airline,
            display_format:display_format,
            date_from:date_from,
            date_to:date_to,
            current_page:current_page,
            limit:limit,
        },function(ret){

            var ohtml = '';

            if(ret.status.code ==200 && ret.status.message=='success'){

                page_list = ret.result.pagination;
                total_page = page_list.total_page;
                current_page = page_list.current_page;
                $('#cur_page').html(current_page);
                $('#total_count').html(' ' + page_list.total_count + ' ');
                $('#total_page').html(' ' + total_page + ' ');

                var data_list = ret.result.list;
                var average_data = data_list.splice(0,1);

                $.each(average_data,function(i,d){
                    ohtml += `<tr class='average_tr'><td id='code'>--</td><td>${d.supplier_id||'--'}</td><td>${d.airline||'--'}</td><td>${d.time}</td><td>${d.query_count}</td><td>${d.book_count}</td><td>${d.convert_rate}</td><td>${d.profit}</td><td>${d.profit_rate + '%'}</td><td>--</td></tr>`;
                })


                $.each(data_list,function(i,d){
                    ohtml += `<tr><td width='90px' id='code'>${(i+1)+ limit*(current_page-1)}</td><td width='120px'>${d.supplier_id||'--'}</td><td width='120px'>${d.airline||'--'}</td><td width='200px'>${d.time}</td><td width='120px'>${d.query_count}</td><td width='120px'>${d.book_count}</td><td width='120px'>${d.convert_rate}</td><td width="120px">${d.profit}</td><td width='120px'>${d.profit_rate + '%'}</td><td>
                    <a class='td_a' href="/price/${d.time}?supplier_id=${supplier_id}&airline=${airline}&display_format=${display_format}">价格分析</a><a class='td_a' href="/airline/${d.time}?supplier_id=${supplier_id||''}&airline=${airline||''}&display_format=${display_format}">航线分析</a>
                    </td></tr>`;
                })

               
            }else{
                ohtml +='<tr><td colspan="10" class="center">暂无数据</td></tr>';
            }


            $('#index_table').html(ohtml);
        })

    },

    tablePageFn = function(){
        $('#prev').on('click',function(){
            if(current_page<=1){
                current_page=1;
                return;
            }else{
                current_page--;
                getData();
            }
        })

        $('#next').on('click',function(){
            if(current_page>=total_page){
                current_page = total_page;
                return;
            }else{
                current_page++;
                getData();
            }
                
        })

        $('#goPage').on('click',function(){

            var myPage = $('#yourPage').val();
            console.warn(myPage + ',' + total_page + ',' + current_page);
            if(myPage>=1 && myPage<=total_page && myPage!=current_page){
                current_page = myPage;
                getData();
            }else{
                alert('错误的页码');
            }
            return false;
        })
    },

    formFn = function(){
        $('#index_form').on('submit',function(){
            supplier_id = $('#supplier_id').val();
            airline = $('#title').val();
            getData();
            return false;
        })


        $('.label_content_btns').on('click',function(){
            $(this).addClass('on').siblings().removeClass('on');
            display_format = display_format_arr[$(this).index()];
            current_page = 1;
            getData();
        })
    },


    supplier_id = $('#supplier_id').val(),
    airline = $('#title').val(),
    display_format_arr = ['day','week'],
    display_format = 'day',
    page_list = '',
    current_page = 1,
    total_page = null,
    date_from = '',
    date_to = '',
    limit = 15;


    initDom();

});