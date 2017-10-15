// pages/index/list.js
var app = getApp();
Page({
  data:{
    page:0,
    scrollTop:0,
    goodsList:[],
    loading:true
  },
  onLoad:function(options){
    this.data.cid = options.cid
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight:systemInfo.windowHeight
    })
  },
  onShow:function(){
    this.setGoodsData()
  },
  setGoodsData:function(){
    if(!this.data.loading){
      return false;
    }
    var self = this;
    app.request.wxRequest({
      url:'goods-list',
      data:{page:this.data.page,cid:this.data.cid},
      success:function(res){
        if(!res){
          self.data.loading = false
          self.setData({
            loading:false
          })
          return false
        }
        if(res.length<4){
          self.setData({
            loading:false
          })
        }
        var goodsList = self.data.goodsList = self.data.goodsList.concat(res)
        self.setData({
          goodsList:goodsList
        })
      }
    })
  },
  showGoodsDetail:function(e){
    var id = e.currentTarget.dataset.id;
    app.redirect('goods/detail','gid='+id)
  },
  scrolltolower:function(){
    ++this.data.page
    this.setGoodsData()
  }
})