;(function () {
    'use strict';
    // store.clear();
    var task_list=[];
    var _tpl=$('.task-list').html();//html模板

    init();
    function init() {
        task_list=store.get('task_list')||[];
        console.log('当前任务列表',task_list);
        render_task_list();
    }
    function refresh_list() {
        store.set('task_list',task_list);
        console.log('当前任务列表task_list',task_list);
        render_task_list();
    }
    function add_task(nt) {
        init();
        task_list.push(nt);
        refresh_list();
        return true;
    }
    function listen(i) {
        $('#del_' + i).on('click',function () {
                console.log("点击了删除按钮",task_list[i]);
                var _r=confirm("确定删除？");
                _r?delete_task(i):console.log("取消了删除操作");
        } );
        $('#det_'+i).on('click',function () {
            show_detail(i);
            console.log('查看了任务',task_list[i])
        })
    }
    function show_detail(i){
        $('.task-detail').show();$('.task-detail-mask').show();
        var $cont=$('h2.content'),
                $desc=$('textarea[name=desc]'),
                $date=$('input[name=date]'),
                $time=$('input[name=time]');
        $cont.text(task_list[i].content);
        $desc.val(task_list[i].desc);
        $date.val(task_list[i].date);
        $time.val(task_list[i].time);
            $('.remind').on('submit',function (e) {
                e.preventDefault();
                task_list[i].desc=$desc.val();
                task_list[i].content=$cont.text();
                task_list[i].date=$date.val();
                task_list[i].time=$time.val();
                console.log('任务内容更新为',task_list[i]);
                refresh_list();
                $('.task-detail-mask').click();
            });
    }
    $('.task-detail-mask').on('click',function () {
        $(this).hide();$('.task-detail').hide();
        $('.remind').unbind('submit');
    });
    function render_task(i) {
        $('.task-list').prepend($(
            _tpl.replace('{{item-content}}',task_list[i].content)
                .replace(/\{\{index\}\}/g,i)
        ));
    }
    function render_task_list() {
        $('.task-list').empty();//
        //for(var i=0;i<task_list.length;i++){}
        //循环里所有代码封装成函数，可以防止闭包带来的问题
        $(task_list).each(function (i,obj) {
            render_task(i);
            listen(i);
        });
    }
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
    //清除全部任务
    $('h1').on('dblclick',function (e) {
        e.preventDefault();
        store.clear();
        init();
    });
    //清除函数
    function delete_task(_index) {
        // if(_index===undefined||!task_list[_index]) return;
        // delete task_list[_index];
        var _d=task_list.splice(_index,1);
        console.log('删除了任务',_d[0]);
        refresh_list();
    }







})();