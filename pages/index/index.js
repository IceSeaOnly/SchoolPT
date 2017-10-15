// pages/index/index.js
var app = getApp();
Page({
	data:{
		cid:0,
    scrollLeft:0,
    scrollTop:0,
    page:0,
    goodsList:[],
    loading:true
	},
  onLoad: function (options){
    this.systemInfo = wx.getSystemInfoSync()
    this.setAdvertData()
    this.setCateData()
  },
  onShow:function(){
    // this.data.cid = 0
    // this.data.page = 0
    // this.data.scrollTop = 0
    // this.scrollLeft = 0
    // this.goodsList = []
    // this.loading = true
    // this.setData({
    //   cid:this.data.cid,
    //   scrollTop:0,
    //   scrollLeft:0,
    //   loading:true
    // })
    this.setGoodsData()
  },
  onShareAppMessage:function(){

  },
  setAdvertData:function(){
    var self = this;
    app.request.wxRequest({
      url:'advert',
      success:function(res){
        self.setData({
          windowHeight:self.systemInfo.windowHeight,
          advert:res
        })
      }
    })
  },
  setCateData:function(){
    var self = this;
    var cid = this.data.cid;
    app.request.wxRequest({
      url:'category',
      data:{cid:cid},
      success:function(res){
        if(cid==0){
          self.setData({
            category:res
          })
        }else{        
          self.setData({
            childCate:res
          })
        }
      }
    })
  },
  setGoodsData:function(){
    if(!this.data.loading){
      return false
    }
    var self = this;
    app.request.wxRequest({
      url:'index',
      data:{page:self.data.page,cid:this.data.cid},
      success:function(res){
        if(!res){
          self.data.loading=false
          self.setData({
            loading:false
          })
          return false
        }
        if(res.length<3){
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
  showTopic:function(e){
    var tid = e.currentTarget.dataset.id;
    // app.redirect('topic/index','tid='+tid)
  },
  showList:function(e){
  	var cid = e.currentTarget.dataset.id
  	app.redirect('index/list','cid='+cid)
  },
  showGoodsDetial:function(e){
  	var gid = e.currentTarget.dataset.id
    if(!gid) return ;
  	app.redirect('goods/detail','gid='+gid)
  },
  switchNav:function(e){
    if(this.data.cid ==e.currentTarget.dataset.cid && e.currentTarget.dataset.cid !=0) return;
    this.data.cid = e.currentTarget.dataset.cid;
    this.data.page = 0
    this.data.loading = true
    this.data.goodsList=[]
    var windowWidth = this.systemInfo.windowWidth
    var offsetLeft = e.currentTarget.offsetLeft
    var scrollLeft = this.data.scrollLeft;
    if(offsetLeft>windowWidth/2){
        scrollLeft = offsetLeft  
    }else{
      scrollLeft = 0
    }
    this.setData({
      goodsList:[],
      childCate:[],
      loading:true,
      scrollLeft:scrollLeft,
      scrollTop:0,
      cid:this.data.cid
    })
    this.setCateData()
    this.setGoodsData()
  },
  scrolltolower:function(e){
    ++this.data.page
    this.setGoodsData()
  }
})