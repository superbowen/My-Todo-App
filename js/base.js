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
        // listen();
    }
    function refresh_list() {
        store.set('task_list',task_list);
        console.log('task_list',task_list);
        render_task_list();
    }
    function add_task(nt) {
        init();
        task_list.push(nt);
        refresh_list();
        return true;
    }
    function listen() {
        for(var i in task_list){
            task_list[i].index=i;
            $('#del_' + i).bind('click',function () {
                task_list[i]=i;
                console.log(i)
            }

                // delete_task(i);
            );
        }
    }
    function render_task_list() {
        $('.task-list').empty();//
        for(var i=0;i<task_list.length;i++){

            $('.task-list').prepend(
                $(_tpl
                    .replace('{{item-content}}',task_list[i].content)
                    .replace(/\{\{index\}\}/g,i))
            );
        }
        listen();
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
    //清除全部任务
    $('h1').on('dblclick',function (e) {
        e.preventDefault();
        store.clear();
        init();
    });
    //清除函数
    function delete_task(_index) {
        if(_index===undefined||!task_list[_index]) return;
        // delete task_list[index];
        console.log('delete_task',task_list.splice(_index,1)[0]);
        refresh_list();
    }







})();