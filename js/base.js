;(function () {
    'use strict';

    var task_list=[];
    var _tpl=$('.task-list').html();//html模板

    //初始化，读取localStorage，并渲染
    init();
    function init() {
        task_list=store.get('task_list')||[];
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
        $('.task-list').empty();//
        //for(var i=0;i<task_list.length;i++){}
        //循环里所有代码封装成函数，可以防止闭包带来的问题
        $(task_list).each(function (i) {
            render_task(i);
            listen(i);
        });
    }
    function render_task(i) {
        if(task_list[i].complete){
            $('.task-list').append($(
                _tpl.replace('{{item-content}}',task_list[i].content)
                    .replace(/\{\{index\}\}/g,i)
            ));
        }else{
            $('.task-list').prepend($(
                _tpl.replace('{{item-content}}',task_list[i].content)
                    .replace(/\{\{index\}\}/g,i)
                    .replace(/checked/,'')
                    .replace(/ttrue/,'')
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
        var $cont=$('.content'),
                $desc=$('textarea[name=desc]'),
                $date=$('input[name=date]'),
                $time=$('input[name=time]');
        $cont.val(task_list[i].content);
        $desc.val(task_list[i].desc);
        $date.val(task_list[i].date);
        $time.val(task_list[i].time);
            //保存按钮
            $('.remind').on('submit',function (e) {
                e.preventDefault();
                task_list[i].desc=$desc.val();
                task_list[i].content=$cont.val();
                task_list[i].date=$date.val();
                task_list[i].time=$time.val();
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
    //隐藏的清除全部任务
    $('h1').on('dblclick',function (e) {
        e.preventDefault();
        console.log('点击了清空操作');
        var _q=confirm('确定清空全部任务吗？');
        if(_q) {store.clear();init();console.log('清空了任务列表');console.log('当前任务列表task_list',task_list);}
        else{    console.log('取消了清空操作')};
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

    // $('.complete').on('click',function () {
    //     var _complete=$(this).is(':checked');
    //     console.log(_complete);
    // })






})();