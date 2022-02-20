$(function() {

    var layer = layui.layer;

    var form = layui.form;

    var laypage = layui.laypage;

    // 定义一个查询的参数对象
    // 在请求数据的时候，将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值 默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据 默认每页显示2条
        cate_id: '', // 文章分类的id
        state: '' // 文章的发布状态
    };

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initTable();

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                } else {
                    // 通过模板引擎渲染页面数据
                    var htmlStr = template('tpl-table', res);
                    $('tbody').html(htmlStr);
                    // 调用渲染分页的方法
                    renderPage(res.total);
                }
            }
        })
    };

    initCate();

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                } else {
                    // 调用模板引擎分类的可选项
                    var htmlStr = template('tpl-cate', res);
                    $('[name=cate_id]').html(htmlStr);
                    // 通知layui重新渲染表单的UI结构
                    form.render()
                }
            }
        })
    };

    // 为筛选表单添加submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q中对应属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // 渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 默认被选中的页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 配置对象
            limits: [5, 10, 15, 20], // 配置limit
            // 分页发生切换时的回调函数
            // 触发jump的方式两种
            // 1、点击页码时会触发
            // 2、调用laypage.render()方法就会触发
            jump: function(obj, first) {
                // 将最新的页码值赋值到查询参数中
                q.pagenum = obj.curr;
                // 拿到最新的条目数
                q.pagesize = obj.limit;
                // 重新渲染页面
                // 通过first的值判断程序通过哪种方式触发的回调
                // 如果first的值时true 方式2触发 死循环
                // 否则为方式1触发
                if (!first) {
                    initTable();
                }
            }
        })
    };

    // 通过代理的形式为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delelte').length;

        var id = $(this).attr('data-id');

        // 询问框
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    } else {
                        layer.msg('删除文章成功！');
                        // 当数据删除完成后
                        // 需要判断当前这一页中，是否还有剩余的数据
                        // 没有剩余数据，则让页码值-1
                        // 再重新渲染页面
                        if (len === 1) {
                            // 当len的值为1 证明删除完成后页面后就没数据了
                            // 此时 让页码值-1
                            // 注意 页码值最小是 1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        }
                        initTable()
                    }
                }
            })
            layer.close(index)
        })
    })
})