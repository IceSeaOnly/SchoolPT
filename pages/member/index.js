// pages/member/index.js
var app = getApp();
Page({
  onLoad: function (options) {
    var self = this
    wx.getUserInfo({
      success:function(res){
        self.setData({
          userInfo:res.userInfo
        })
      }
    })
  },
  onShow:function(){
    var self = this
    app.request.wxRequest({
      url:'member',
      success:function(res){
        self.setData({
          data:res
        })
      }
    })
  },
  showOrder:function(e){
  	var type = e.currentTarget.dataset.type
  	app.redirect('orders/index','id='+type)
  },
  showGroupIndex:function(){
   wx.switchTab({
     url: '/pages/group/index'
   })
  }
})