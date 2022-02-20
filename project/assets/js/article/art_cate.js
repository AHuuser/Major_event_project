$(function() {

    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-article', res)
                $('tbody').html(htmlStr)
            }
        })
    };

    // 为添加类别按钮添加点击效果

    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });

    // 通过代理的形式为 form-add 表单绑定事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                } else {
                    initArtCateList();
                    layer.msg('新增分类成功！');
                    // 根据索引关闭对应的弹出层
                    layer.close(indexAdd);
                }
            }
        })
    });

    // 点击编辑按钮进行数据修改
    // 通过代理的形式，为btn-edit绑定事件

    var indexEdit = null;

    $('tbody').on('click', '.btn-edit', function() {
        // 弹出修改文章分类层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        // 发起请求 获取对应的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改失败！')
                } else {
                    form.val('form-edit', res.data)
                }
            }
        })
    });

    // 通过代理的形式 为修改分类的表单绑定事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                } else {
                    layer.msg('更新分类数据成功！')
                    layer.close(indexEdit);
                    initArtCateList();
                }
            }
        })
    });

    // 通过代理的形式 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取id
        var id = $(this).attr('data-id');
        // 询问框
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    } else {
                        layer.msg('删除分类成功！');
                        layer.close(index);
                        initArtCateList()
                    }
                }
            })
        })
    })
})