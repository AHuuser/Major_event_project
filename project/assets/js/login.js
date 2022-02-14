$(function() {
    // 点击 去注册账号
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    // 点击 去登陆
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 从layui中获取form对象
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6～12位，且不能出现空格'],
        // 校验两次是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的确认密码框的内容
            // 拿到密码框中的内容
            // 然后进行等于的判断
            // 判断失败则return提示消息
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });

    // 从layui获取提示消息
    var layer = layui.layer;

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起Ajax的POST请求
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            } else {
                layer.msg('注册成功！请登录');
                // 模拟点击行为 自动跳转
                $('#link_login').click();
            }
        })
    });

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起Ajax的POST请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                } else {
                    layer.msg('登录成功！');
                    // 将登陆成功后得到的token字符串保存在localstorage中
                    localStorage.setItem('token', res.token);
                    // 跳转到后台主页
                    location.href = '/index.html';
                }
            }
        })
    })
})