define(['jQuery', 'Base', 'layui', 'lay'], function($, base, layui, lay) {

    if ($("#AirlinePage").size() < 1)
        return;



    var initDom = function() {
            
        initEvent();
    },
    initEvent = function() {

            $('#supplier_id').val(supplier_id);
            $('#title').val(airline);

            getData();
            formFn();
            tablePageFn();

    },

    getData = function(){

         $('#index_table').html('<tr><td colspan="11" class="center">努力加载中...</td><tr>');

        $.api('get','get_airlines_by_supplier_and_date',{
            supplier_id:supplier_id,
            airline:airline,
            display_format:display_format,
            time:time,
            current_page:current_page,
            limit:limit,
        },function(ret){

            var ohtml = '';

            if(ret.status.code ==200 && ret.status.message=='success' && ret.result.list.length>0){

                page_list = ret.result.pagination;
                total_page = ret.result.pagination.total_page;
                current_page = ret.result.pagination.current_page;

                $('#cur_page').html(current_page);
                $('#total_count').html(' ' + page_list.total_count + ' ');
                $('#total_page').html(' ' + total_page + ' ');

                
                $.each(ret.result.list,function(i,d){
                    ohtml += `<tr><td width="90px" id='code'>${(i+1)+ limit*(current_page-1)}</td><td width="120px">${d.supplier_id||'--'}</td><td>${d.object_id}</td><td width="120px">${d.airline||'--'}</td><td width="120px">${d.current_markup}</td><td width="100px">${d.query_count}</td><td width="100px">${d.book_count}</td><td width="120px">${d.convert_rate}</td><td width="120px">${d.profit}</td><td width="120px">${d.profit_rate + '%'}</td><td width="150px"><a class='td_a' href="/airline/history/${d.object_id}?supplier_id=${d.supplier_id||''}&airline=${d.airline||''}&display_format=${display_format}&time=${d.time}">历史加价</a>
                    </td></tr>`;
                })

            }else{
                ohtml +='<tr><td colspan="11" class="center">暂无数据</td></tr>';
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

    },




    supplier_id = getParam('supplier_id')||'',
    time = getParam('time')||'',
    display_format = getParam('display_format'),
    airline = getParam('airline')||'';

    page_list = '',
    current_page = 1,
    total_page = null,
    limit = 15,
    time = $('#time').val();


    initDom();

});