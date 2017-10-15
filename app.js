var request = require('request.js')
App({
	globalData:{
	
	},
  onLaunch:function(options){
  	request.register()
    this.request = request
  },
  redirect:function(url,param){
		wx.navigateTo({
			url:'/pages/'+url+'?'+param
		})
	},
	showModal:function(that){
	  var animation = wx.createAnimation({
	    duration: 200
	  })
	  animation.opacity(0).rotateX(-100).step();
	  that.setData({
	      animationData:animation.export()
	  })
	  setTimeout(function() {
	    animation.opacity(1).rotateX(0).step();
	    that.setData({ 
	      animationData:animation
	   }); 
	  }.bind(that), 200)
	},
	showToast:function(that,title){
		var toast = {};
		toast.toastTitle = title;
	  that.setData({
	    toast:toast
	  })
	  var animation = wx.createAnimation({
	    duration: 100
	  })
	  animation.opacity(0).rotateY(-100).step();
	  toast.toastStatus = true;
	  toast.toastAnimationData = animation.export()
	  that.setData({
	    toast:toast
	  })
	  setTimeout(function() {
	    animation.opacity(1).rotateY(0).step();
	  	toast.toastAnimationData = animation
	    that.setData({ 
	      toast:toast
	   }); 
	  }.bind(that), 100)
	  // 定时器关闭 
	  setTimeout(function () { 
	  	toast.toastStatus = false
	   that.setData({ 
	   toast:toast
	   }); 
	  }.bind(that),2000);
	}
})