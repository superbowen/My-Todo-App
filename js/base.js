;(function () {
    'use strict';


    $('input[name=date]').datetimepicker();
    var task_list=[];
    var _tpl=$('.task-list').html();//html模板
    var intDiff;



    // setInterval(render_task_list(), 1000);//每秒渲染一次界面
    //初始化，读取localStorage，并渲染
    init();
    function init() {
        task_list=store.get('task_list')||[{content: "例1：周末去理发", desc: "剃个3毫米，凉快！", date: "2017/03/04 20:44", complete: true},{content: "例2：明天晚上去看电影", desc: "别忘了买票！", date: "2017/03/07 20:00", complete: false},{content: "例3：4月份《第一季度 工作报告》", desc: "提前准备！", date: "2017/04/01 00:00"}];//
        render_task_list();
    }
    console.log('当前任务列表task_list',task_list);

    //更新列表(储存数据)并渲染界面
    function refresh_list() {
        store.set('task_list',task_list);
        console.log('当前任务列表task_list',task_list);
        render_task_list();
    }

    //增加任务
    function add_task(nt) {
        init();
        task_list.push(nt);
        refresh_list();
        return true;
    }

    //删除任务
    function delete_task(_index) {
        // if(_index===undefined||!task_list[_index]) return;
        // delete task_list[_index];
        var _d=task_list.splice(_index,1);
        console.log('删除了任务',_d[0]);
        refresh_list();
    }

    //渲染界面
    function render_task_list() {
        $('.task-list').empty();
        $(task_list).each(function (i) {
            render_task(i);
            listen(i);
        });//循环里所有代码封装成函数，可以防止闭包带来的问题
    }
    function render_task(i) {
        if(task_list[i].complete){
            $('.task-list').append($(
                _tpl.replace('{{item-content}}',task_list[i].content)
                    .replace(/\{\{index\}\}/g,i)
                    .replace(/\{\{time-remaining\}\}/,'已完成')
            ));
        }else{
            $('.task-list').prepend($(
                _tpl.replace('{{item-content}}',task_list[i].content)
                    .replace(/\{\{index\}\}/g,i)
                    .replace(/checked/,'')
                    .replace(/completed/,'')
                    .replace(/\{\{time-remaining\}\}/,return_time_remaining(i))
            ));
        }
    }
    function listen(i) {
        $('#del_' + i).on('click',function () {
            console.log("点击了删除按钮",task_list[i]);
            var _r=confirm("确定删除？");
            _r?delete_task(i):console.log("取消了删除操作");
        });
        $('#det_'+i).on('click',function () {
            show_detail(i);
            console.log('查看了任务',task_list[i])
        });
        $('#complete_'+i).on('click',function () {
            task_complete(i);
        });
    }
    function show_detail(i){
        //渲染任务详情界面
        $('.task-detail').show();$('.task-detail-mask').show();
        var $cont=$('.task-detail .content'),
                $desc=$('textarea[name=desc]'),
                $date=$('.task-detail input[name=date]');
        $cont.val(task_list[i].content);
        $desc.val(task_list[i].desc);
        $date.val(task_list[i].date);
            //保存按钮
            $('.remind').on('submit',function (e) {
                e.preventDefault();
                task_list[i].desc=$desc.val();
                task_list[i].content=$cont.val();
                task_list[i].date=$date.val();
                console.log('任务内容更新为',task_list[i]);
                refresh_list();
                $('.task-detail-mask').click();
            });
    }
    function task_complete(i) {
        var _c=$('#complete_'+i).is(':checked');
        // console.log(_c);
        task_list[i].complete=_c;
        console.log('任务状态更新为',task_list[i]);
        refresh_list();
    }
    function return_time_remaining(i) {
        // console.log(task_list[i].date);
        if(task_list[i].date){
            var current_timestamp=(new Date()).getTime();
            var task_timestamp=(new Date(task_list[i].date)).getTime();
            intDiff = parseInt((task_timestamp-current_timestamp)/1000);
            return timer(intDiff);
        }
        else{
            return " ";
        }
    }

    //返回剩余时间
    function timer(intDiff) {
        // 参数intDiff为总秒数
            var day = 0,
                hour = 0,
                minute = 0,
                second = 0; //时间默认值
            if (intDiff > 0) {
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                // second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }else{return '已过期'}
            // if (minute <= 9) minute = '0' + minute;
            // if (second <= 9) second = '0' + second;
            if(day>0){
                return hour==0?day + "天后":day + "天"+hour + '小时后';
            }else if(hour>0){
                return minute==0?hour + '小时后':hour + '小时' + minute + '分钟后';
            }else {
                return minute<30?"少于半小时":minute + '分钟后';
                // return minute + '分钟'+ second + '秒后';
            }
           //  else{
           //     return  second + '秒后';
           // }
    }
    //隐藏的清除全部任务
    $('h1').on('dblclick',function (e) {
        e.preventDefault();
        console.log('点击了初始化');
        var _q=confirm('确定初始化吗？\n初始化：清除数据并填充测试数据。此操作只会清除LocalStorage的数据，并不会将测试数据储存到LocalStorage。如果您更改了测试数据（增、删、改，包括勾选），所有数据都会储存到LocalStorage！');
        if(_q) {store.clear();init();console.log('初始化完成');console.log('当前任务列表task_list',task_list);}
        else{    console.log('取消了初始化操作')}
    });
    //蒙版
    $('.task-detail-mask').on('click',function () {
        $(this).hide();$('.task-detail').hide();
        $('.remind').unbind('submit');
    });
    //增加按钮
    $('.add-task').on('submit',function (e) {
        e.preventDefault();//阻止默认行为
        var new_task={};
        new_task.content=$(this).find('input[name=content]').val();//获取输入内容
        if(!new_task.content) return;//如果内容为空，则停止
        // task_list.push(new_task);//add_task()做过了
        console.log('添加了一个新任务',new_task);
        if(add_task(new_task)){
            render_task_list();
        }
        $('input[name=content]').val('');
    });






})();