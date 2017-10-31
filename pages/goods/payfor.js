// pages/goods/payfor.js
var app = getApp();
Page({
  data:{
    address:false
  },
  onLoad: function (options) {
    var address = this.data.address = wx.getStorageSync('address')
    this.setData({
      address:address,
      goodsNum:app.num,
      goodsInfo:app.goodsInfo,
      goodsProp:app.propValue,
      goodsPrice:app.goodsPrice
    })
  },
  goToPay:function(){
    var self = this;
    if(!this.data.address){
      app.showToast(this,'请选择地址');
      return false;
    }
    // JSON.stringify(jsonobj)
    var data = {
      pid:app.groupPid,
      isGroup:app.buyType,
      gid:app.goodsInfo.id,
      goodsNum:app.num,
      address:JSON.stringify(this.data.address),
      totalPrice:app.goodsPrice*app.num,
      goodsProp:JSON.stringify(app.propValue)
    }
    if(this.oid){
      return;
    }
    app.request.wxRequest({
      url:'create-orders',
      method:"POST",
      data:data,
      success:function(res){
        var oid = self.oid = res;
        app.request.wxRequest({
          url:'wx-pay',
          data:{oid:res},
          success:function(res){
            wx.requestPayment({
             'timeStamp': res.timeStamp,
             'nonceStr': res.nonceStr,
             'package': res.package,
             'signType': 'MD5',
             'paySign': res.paySign,
             'success':function(res){
              console.log(res)
              if(data.isGroup==1){ //拼团
                app.redirect('group/detail','id='+oid)
              }else{
                app.redirect('orders/index','id=3')
              }
             }
          })
          }
        })
      },
      failed:function(res){
        app.showToast(self, res.msg);
      }
    })
  },
  getWxAddress:function(){
    var self = this;
    wx.chooseAddress({
      success: function (res) {
        self.data.address = {
          userName:res.userName,
          telNumber:res.telNumber,
          provinceName:res.provinceName,
          cityName:res.cityName,
          countyName:res.countyName,
          detailInfo:res.detailInfo
        };
        wx.setStorage({
          key:"address",
          data:self.data.address
        })
        self.setData({
          address:self.data.address
        })
      }
    })
  },
  minus:function(){
    var num = app.num > 1 ? --app.num : 1
    this.setData({
      goodsNum : num
    })
  },
  plus:function(){
    var num = ++app.num
    this.setData({
      goodsNum : num
    })
  }
})