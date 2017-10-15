// pages/orders/detail.js
var app = getApp();
Page({
  onLoad: function (options) {
   this.oid = options.oid;
  },
  onShow:function(){
    this.showDataInfo()
  },
  showDataInfo:function(){
    var self = this;
    app.request.wxRequest({
      url:'orders-detail',
      data:{id:this.oid},
      success:function(res){
        self.setData({
          orderInfo:res
        })
      }
    })
  },
  toPay:function(){
    var self = this;
   app.request.wxRequest({
     url:'wx-pay',
     data:{oid:this.oid},
     success:function(res){   
       wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success':function(res){
         self.showDataInfo()
        },
        'fail':function(res){
         console.log(res)
        }
     })
     }
   })
  },
  confirmReceipt:function(){
   var self = this;
   wx.showModal({
     content: '是否确认收货？',
     success: function(res) {
       if (res.confirm) {
         app.request.wxRequest({
           url:'confirm-receipt',
           data:{oid:this.oid},
           success:function(res){
              self.showDataInfo()
           }
         })
       }
     }
   })
  }
})