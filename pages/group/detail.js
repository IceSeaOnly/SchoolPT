// pages/group/info.js
var app = getApp();
Page({
  data:{
    num:1
  },
  onLoad:function(options){
    this.id = options.id;
  },
  onShow: function () {
    var id = this.id;
    var self = this;
    app.request.wxRequest({
      url:'group-detail',
      data:{oid:id},
      success:function(res){
        self.goodsInfo = res;
        var timeStr = '';
        if(res.leftTime>0){
          var t = --res.leftTime
          var h =  Math.floor(t/60/60)
          var m = Math.floor((t-h*60*60)/60)
          var s = t%60;
          if(h<10) h = "0"+h;
          if(m<10) m = "0"+m;
          if(s<10) s = "0"+s;
          timeStr = h+':'+m+':'+s
          self.setTimeData(res.leftTime)
        }
        var groupMember=[];
        for (var i = res.groupNum - 1; i >= 0; i--) {
          if(res.groupMember[i]){
            groupMember[i]=res.groupMember[i]
          }else{
            groupMember[i]={}
          }
        }
        self.setData({
          groupMember,groupMember,
          groupInfo:res,
          leftTime:timeStr
        })
      }
    })
  },
  setTimeData:function(time){
    var self = this;
    setInterval(function(){
        var t = --time;
        var h =  Math.floor(t/60/60);
        var m = Math.floor((t-h*60*60)/60);
        var s = t%60;
        if(h<10) h = "0"+h;
        if(m<10) m = "0"+m;
        if(s<10) s = "0"+s;
        var timeStr = h+':'+m+':'+s
      self.setData({
        leftTime:timeStr
      })
    }, 1000)
  },
  onShareAppMessage:function(options){
    console.log(options)
    var path = '/pages/group/detail?id='+this.goodsInfo.oid
    return {
        title: this.goodsInfo.name,
        path: path,
        success:function(res){
          console.log(path)
          console.log(res)
        }
      }
  },
  goToHome:function(){
    wx.switchTab({
      url:'/pages/index/index'
    })
  },
  showGoodsDetail:function(e){
    var id = e.currentTarget.dataset.id;
    app.redirect('goods/detail','gid='+id)
  },
  goToBuy:function(){
    app.goodsInfo = this.goodsInfo; 
    app.goodsInfo.id = this.goodsInfo.gid;
    app.num = this.data.num; 
    app.propValue = this.propValue; 
    app.goodsPrice = this.goodsInfo.gprice*this.data.num;
    app.buyType = 1;
    app.groupPid = this.goodsInfo.oid;
    if(this.goodsInfo.property){
      if(this.propValue &&(this.propValue.length==this.goodsInfo.property.length)){
        app.redirect('goods/payfor');
      }else{
        app.showToast(this,'请选择商品属性');
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
   var showModalStatus = e.currentTarget.dataset.statu== 'open' ? true : false;
    app.showModal(this);
    this.setData({
      showModalStatus:showModalStatus
    })
  }
})