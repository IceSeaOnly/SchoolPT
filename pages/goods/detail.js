// pages/goods/detail.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({
  data: {
    scrollTop:0,
    num:1
  },
  onLoad: function (options) {
    var self = this;
    var gid = this.gid = options.gid;
    var systemInfo = wx.getSystemInfoSync()
    app.request.wxRequest({
      url:'goods-detail',
      data:{gid:gid},
      success:function(res){
        if(res.intro){
          WxParse.wxParse('goodsIntro', 'html', res.intro, self, 5);
        }
        self.goodsInfo = res;
        var groupList = res.groupList;
        if(groupList.length>0){  
          for (var i = 0; i < groupList.length; i++) {
            var t = --groupList[i].leftTime;
            var h =  Math.floor(t/60/60);
            var m = Math.floor((t-h*60*60)/60);
            var s = t%60;
            if(h<10) h = "0"+h;
            if(m<10) m = "0"+m;
            if(s<10) s = "0"+s;
            groupList[i].leftTimeStr = h+':'+m+':'+s
          }
          self.setTimeData(groupList);
        }
        var is_collect = res.is_collect ? true : false;
        self.setData({
          windowHeight:systemInfo.windowHeight,
          goodsDetail:res,
          groupList,groupList,
          is_collect:is_collect
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title:this.goodsInfo.name,
      path:"/pages/goods/detail?gid="+this.goodsInfo.id,
      success:function(res){
        console.log(res)
      }
    }
  },
  setTimeData:function(data){
    var self = this;
    var groupList = data
    setInterval(function(){
      for (var i = 0; i < groupList.length; i++) {
        var t = --groupList[i].leftTime;
        var h =  Math.floor(t/60/60);
        var m = Math.floor((t-h*60*60)/60);
        var s = t%60;
        if(h<10) h = "0"+h;
        if(m<10) m = "0"+m;
        if(s<10) s = "0"+s;
        groupList[i].leftTimeStr = h+':'+m+':'+s
      }
      self.setData({
        groupList:groupList
      })
    }, 1000)
  },
  joinGroup:function(e){
    var id = e.currentTarget.dataset.id;
    app.redirect('group/detail','id='+id);
  },
  goHome:function(){
    wx.switchTab({
      url:'/pages/index/index'
    })
  },
  collect:function(e){
    var gid = this.gid;
     var status = e.currentTarget.dataset.status;
     status = !status
    app.request.wxRequest({
      url:'collect',
      data:{gid:gid}
    })
    if(status){
      app.showToast(this,'收藏成功')
    }else{
      app.showToast(this,'您已取消收藏')
    }
    this.setData({
      is_collect:status
    })
  },
  goToBuy:function(){
    app.goodsInfo = this.goodsInfo; 
    app.num = this.data.num; 
    app.propValue = this.propValue; 
    app.goodsPrice = this.goodsPrice;
    app.buyType = this.buyType;
    app.groupPid = 0;
    if(this.goodsInfo.property){
      if(this.propValue &&(this.propValue.length==this.goodsInfo.property.length)){
        app.redirect('goods/payfor');
      }else{
        app.showToast(this,'请选择商品属性')
      }
    }else{
      app.redirect('goods/payfor');
    }
  },
  selectProp:function(e){
    var current = e.currentTarget.dataset;
    var pid = current.pid;
    var pname = current.pname;
    var name = current.name;
    var propValue = this.propValue ? this.propValue : [];
    propValue[pid] = {pname:pname,name:name};
    this.propValue = propValue;
    this.setData({
      propValue:propValue
    })
  },
  minus:function(){
    var num = this.data.num > 1 ? --this.data.num : 1
    this.setData({
      num : num
    })
  },
  plus:function(){
    var num = ++this.data.num
    this.setData({
      num : num
    })
  },
  showModal:function(e){
    var type = e.currentTarget.dataset.type;
    var showModalStatus = e.currentTarget.dataset.statu== 'open' ? true : false;
    var goodsPrice = this.goodsPrice = type == 'group' ? this.goodsInfo.gprice : this.goodsInfo.price;
    this.buyType = type=='group'? 1 : 0;
    app.showModal(this);
    this.setData({
      showModalStatus:showModalStatus,
      goodsPrice:goodsPrice
    })
  },
  scrolltolower:function(){

  },
  showServer:function(e){
    // var showServer = e.currentTarget.dataset.statu== 'open' ? true : false;
    // app.showModal(this)
    // this.setData({
      // showServer:showServer
    // })
  }
})