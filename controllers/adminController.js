const Admin = require('../models/admin');

exports.login_get = function (req, res) {
  if (req.session.admin) {
    res.redirect('/');
  } else {
    res.render('login');
  }
}

exports.login_post = function (req, res, next) {
  var name = req.body.name,
    password = req.body.password;
  if (name && password) {
    Admin.findOne({ 'name': name })
      .exec(function (err, admin) {
        if (err) return next(err);
        if (admin === null) {
          res.render('login', { accountWarning: '该账号未注册', name: name });
        }
        else if (password === admin.password) {
          //登录成功,保存登录状态到session
          req.session.admin = name;
          req.session.save(function (err) {
            if (err) return next(err);
            res.redirect('back');
          })
        } else {
          res.render('login', { passwordWarning: '请输入正确的密码', name: name,password: password });
        }
      });
  }
}

exports.logout_get = function(req,res,next) {
  req.session.destroy();
  res.redirect('back');
}
