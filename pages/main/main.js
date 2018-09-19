//main.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cash: 0.00,
    superid: '',
    routers: [
      {
        name: '推广码',
        url: '/pages/tgm/tgm',
        icon: 'iconfont icon-qrcode',
        show: true
      },
      {
        name: '客户',
        url: '/pages/customer/customer',
        icon: 'iconfont icon-nav_promoter',
        show: true
      },
      {
        name: '提现记录',
        url: '/pages/txorder/txorder',
        icon: 'iconfont icon-jizhangben',
        show: true
      },
      {
        name: '收益明细',
        url: '/pages/sylist/sylist',
        icon: 'iconfont icon-shouyi1',
        show: true
      },
      // {
      //   name: '游戏充值',
      //   url: '',
      //   icon: 'iconfont icon-48',
      //   show: true
      // },
      {
        name: '推广员审批',
        url: '/pages/tgysp/tgysp',
        icon: 'iconfont icon-shenhe',
        show: false
      },
      {
        name: '提现审批',
        url: '/pages/txsp/txsp',
        icon: 'iconfont icon-shenhe1',
        show: false
      }
    ]
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo.qx_tgsp > 0) {
      this.data.routers[4].show = true;
    }
    if (app.globalData.userInfo.qx_txsp > 0) {
      this.data.routers[5].show = true;
    }
    this.setData({
      cash: app.globalData.userInfo.cash,
      routers: this.data.routers
    })
  },
  onButtonCode: function (e) {
    wx.navigateTo({
      url: '../tgm/tgm'
    })
  },
  onButtonCustomer: function (e) {
    wx.navigateTo({
      url: '../customer/customer'
    })
  },
  onButtonCZ: function (e) {

  },
  onButtonTX: function (e) {
    if (this.data.cash < 10) {
      // 10元以下不能提现
      wx.showToast({
        title: '超过10元才能提现!',
        icon: 'none',
        duration: 3000
      })
      return
    }
    // 发送提现请求
    var cookie = wx.getStorageSync('cookieKey');
    var header = {};
    if (cookie) {
      header.Cookie = cookie;
    }
    wx.request({
      url: 'https://www.yunpai8.cn/ldyx/xcx/ldyxTg/reqtx.php',
      header: header,
      data: {
        cash: this.data.cash
      },
      success: res => {
        console.log(res.data);
        if (res.data.code == 0) {
          wx.showToast({
            title: '申请提现成功，审核中...',
            icon: 'none',
            duration: 3000
          })
          this.setData({
            cash: 0
          });
        } else {
          wx.showToast({
            title: '申请提现失败!',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  }
})
