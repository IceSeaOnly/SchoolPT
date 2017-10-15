var base = require('conf.js')
var request = new Object();

request.register = function(){
  wx.login({
   success:function(res){
    if(res.code){
      var code = res.code;
      wx.getUserInfo({
        success:function(res){
          var userInfo = res.userInfo
          userInfo.code = code
            wx.request({
            url:base.url+'login',
            data:userInfo,
            method:"POST",
            header:{"Content-Type": "application/x-www-form-urlencoded"},
            success:function(res){
              if(res.statusCode ==200 &&res.data.code == 'success'){
                try {
                    wx.setStorageSync('access_token', res.data.data)
                } catch (e) {
                  console.log(e)  
                }
              }else{
                console.log(res)
              }
            }
          })
        }
      })
    }
   }
  })
}

request.wxRequest = function(obj){
  var code = wx.getStorageSync('access_token')
  wx.request({
    url: base.url + obj.url,
    // url: base.url + obj.url + '&wechat_id=' + base.wechat_id + '&code=' + code,
    data:obj.data,
    method:obj.method,
    header:{"Content-Type": "application/x-www-form-urlencoded"},
    success:function(res){
      console.log(res)
      if(res.statusCode ==200 &&res.data.code == 'success'){
        typeof(obj.success)=='function' && obj.success(res.data.data);
      }
    }
  })

}
module.exports = request