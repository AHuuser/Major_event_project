$(function() {
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码长度为6～12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('[name=oldpwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newpwd]').val()) {
                return '两次密码不一致'
            }
        }
    });

    // 监听form表单 发起ajax请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                } else {
                    layui.layer.msg('更新密码成功！');
                    // 重置表单
                    $('.layui-form')[0].reset();

                }
            }
        })
    })
})