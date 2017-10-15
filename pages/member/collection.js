// pages/member/collection.js
var app = getApp();
Page({
  data:{
    scrollTop:0
  },
  onLoad: function (options) {
    var self = this
    var system = wx.getSystemInfoSync()
    app.request.wxRequest({
      url:'collection',
      success:function(res){
        self.collectionList = res;
        self.setData({
          windowHeight:system.windowHeight,
          goodsList:res
        })
      }
    })
  },
  goToGroup:function(e){
    var gid = e.currentTarget.dataset.id;
    app.redirect('goods/detail','gid='+gid);
  },
  cancelCollection:function(e){
    var gid = e.currentTarget.dataset.id;
    if(!this.collectionList) return;
    for (var i = 0; i < this.collectionList.length; i++) {
      if(gid == this.collectionList[i].gid){
        this.collectionList.splice(i,1)
      }
    }
    this.setData({
      goodsList:this.collectionList
    })
    app.request.wxRequest({
      url:'collect',
      data:{gid:gid}
    })
  }
})