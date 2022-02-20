$(function() {

    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                } else {
                    var htmlStr = template('tpl-cate', res);
                    $('[name=cate_id').html(htmlStr);
                    form.render();
                }
            }
        })
    };

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 为选择封面的按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
        // 监听coverFile的change事件
        $('#coverFile').on('change', function(e) {
            // 获取文件的列表
            var files = e.target.files;
            if (files.length === 0) {
                return
            } else {
                var newImgURL = URL.createObjectURL(files[0]);
                $image.cropper('destroy').attr('src', newImgURL).cropper(options);
            }
        })
    });

    // 定义文章的发布状态
    var art_state = '已发布'; // 默认为“已发布”
    // 为存为草稿按钮绑定事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 基于form表单快速创建FormData对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态保存在fd中
        fd.append('state', art_state);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意 如果向服务器提交的是formdata格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                } else {
                    layer.msg('发布文章成功！');
                    location.href = '/project/article/art_list.html'
                }
            }
        })
    }
})