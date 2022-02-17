$(function() {

    var layer = layui.layer;

    var $image = $('#image');
    const options = {
        aspectRatio: 1,
        preview: '.img-preview'
    };
    $image.cropper(options);

    // 为上传按钮绑定点击事件
    $('#btnChooseImg').on('click', function() {
        $('#file').click();
    });

    // 为文件选择框绑定change事件
    $('#file').on('change', function(e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        } else {
            // 拿到用户选择的文件
            var file = e.target.files[0];
            // 将文件转换为路径
            var newImgURL = URL.createObjectURL(file);
            // 重新初始化裁剪区域
            $image.cropper('destroy').attr('src', newImgURL).cropper(options);
        }
    });

    // 为确定按钮绑定事件
    $('#btnUpload').on('click', function() {
        // 拿到用户裁剪后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                } else {
                    return layer.msg('更换头像成功！');
                    window.parent.getUserInfo()
                }
            }
        })
    })
})