define(['jQuery', 'Base', 'layui', 'lay'], function($, base, layui, lay) {

    if ($("#HistoryPage").size() < 1)
        return;



    var initDom = function() {
            
        initEvent();
    },
    initEvent = function() {
            getData();
            tablePageFn();
    },

    getData = function(){
        
        $('#index_table').html('<tr><td colspan="9" class="center">努力加载中...</td><tr>');

        $.api('get','get_markups_by_supplier_and_airline',{
            object_id:object_id,
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
                total_page = page_list.total_page;
                current_page = page_list.current_page;
                $('#cur_page').html(current_page);
                $('#total_count').html(' ' + page_list.total_count + ' ');
                $('#total_page').html(' ' + total_page + ' ');

                
                $.each(ret.result.list,function(i,d){
                    ohtml += `<tr><td width="90px" id='code'>${(i+1)+ limit*(current_page-1)}</td><td width="130px">${d.airline}</td><td width="130px">${d.time}</td><td width="130px">${d.query_count}</td><td width="130px">${d.book_count}</td><td width="130px">${d.convert_rate}</td><td width="130px">${d.profit}</td><td width="130px">${d.profit_rate + '%'}</td><td>${d.current_markup}</td></tr>`;
                })

            }else{
                ohtml +='<tr><td colspan="9" class="center">暂无数据</td></tr>';
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



    supplier_id = getParam('supplier_id')||'',
    time = getParam('time')||'',
    display_format = getParam('display_format'),
    airline = getParam('airline')||'',

    page_list = '',
    current_page = 1,
    total_page = null,
    limit = 15,
    object_id = $('#object_id').val();


    initDom();

});