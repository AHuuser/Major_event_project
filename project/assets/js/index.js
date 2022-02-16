$(function() {
    // 调用getUserInfo函数 获取用户基本信息
    getUserInfo();


    // 点击按钮 实现退出功能

    // 导出layer
    var layer = layui.layer;

    $('#btn-logout').on('click', function() {
        // 弹出提示消息框
        layer.confirm('确定退出登陆？', { icon: 3, title: '提示' }, function(index) {
            // 清空本地存储localStorage中的token
            localStorage.removeItem('token');
            // 跳转到登录页
            location.href = '/project/login.html';

            // 关闭confirm询问框
            layer.close(index);
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                if (res.status !== 0) {
                    console.log(res.status);
                    return layui.layer.msg(res.message)
                } else {
                    // 调用renderAvatar()渲染用户头像
                    renderAvatar(res.data)
                }
            }
            // // ajax请求无论成功或失败 都会调用complete函数
            // complete: function(res) {
            //     // 在complete回调函数中 可以使用responseJSON拿到服务器响应回来的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 强制清空token
            //         localStorage.removeItem('token');
            //         // 强制跳转到登录页
            //         location.href = '/project/login.html';
            //     }
            // }
    })
};

function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);

    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        // 隐藏文本头像
        $('.text-avatar').hide();
    } else {
        // 隐藏图片头像
        $('.layui-nav-img').hide();
        // 渲染文本头像
        var first = name[0].toUpperCase();
        $('text-avatar').html(first).show();
    }
}