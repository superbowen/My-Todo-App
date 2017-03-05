;(function () {
    'use strict';

    // var task_list={};
    var task_list=[];
    // var new_task={};
    var _tpl=$('.task-list').html();//html模板

    init();
    function init() {
        task_list=store.get('task_list')||[];
        render_task_list();
    }
    function add_task(nt) {
        init();
        task_list.push(nt);
        store.set('task_list',task_list);
        console.log('task_list',task_list);
        return true;
    }
    function render_tpl(data){
        return $(_tpl.replace('{{item-content}}',data.content));//.replace('{{index}}',data.index);
    }
    function render_task_list() {
        $('.task-list').empty();//
        for(var i=0;i<task_list.length;i++){
            $('.task-list').prepend(render_tpl(task_list[i]));
        }
    }
    $('.add-task').on('submit',function (e) {
        e.preventDefault();//阻止默认行为
        var new_task={};
        new_task.content=$(this).find('input[name=content]').val();//获取输入内容
        if(!new_task.content) return;//如果内容为空，则停止
        // task_list.push(new_task);//add_task()做过了
        console.log('new_task',new_task);
        if(add_task(new_task)){
            render_task_list();
        };
    });
    $('h1').on('dblclick',function (e) {
        e.preventDefault();
        store.clear();
        init();
    });









})();