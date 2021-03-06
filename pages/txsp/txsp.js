//customer.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    motto: '正在请求数据...',
    orders: [],
    winWidth: 0,
    winHeight: 0,
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      },
    });

    // 提交申请请求到服务器
    var cookie = wx.getStorageSync('cookieKey');
    var header = {};
    if (cookie) {
      header.Cookie = cookie;
    }
    wx.request({
      url: 'https://www.yunpai8.cn/ldyx/xcx/ldyxTg/txsplist.php',
      header: header,
      success: res => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.setData({
            orders: res.data.list
          });
        }
      }
    })
  },
  // 同意提现操作,请求后台支付到用户钱包
  onButtonPayCash: function (e) {
    var self = this;
    // 再确认一次
    wx.showModal({
      title: '同意',
      content: '确定要支付此订单吗',
      success(res) {
        if (res.confirm) {
          // 同意了
          // 发送支付请求
          var id = e.currentTarget.dataset.orderId;
          var salerid = e.currentTarget.dataset.orderSalerid;
          var cash = e.currentTarget.dataset.orderCash;
          var cookie = wx.getStorageSync('cookieKey');
          var header = {};
          if (cookie) {
            header.Cookie = cookie;
          }
          wx.request({
            url: 'https://www.yunpai8.cn/ldyx/xcx/ldyxTg/paycash.php',
            header: header,
            data: {
              opsalerid: app.globalData.userInfo.salerid,
              id: id,
              salerid: salerid,
              cash: cash
            },
            success: res => {
              console.log(res.data);
              if (res.data.code == 0) {
                wx.showToast({
                  title: '支付成功!',
                  icon: 'none',
                  duration: 3000
                })
                // 删除列表数据
                for (var i = 0; i < self.data.orders.length; i++) {
                  if (self.data.orders[i].id == res.data.id) {
                    self.data.orders.splice(i, 1);
                    break;
                  }
                }
                self.setData({
                  orders: self.data.orders
                });
              } else {
                wx.showToast({
                  title: '支付失败:' + res.data.errMsg,
                  icon: 'none',
                  duration: 3000
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  // 拒绝提现,金额回退到可体现金额
  onButtonBackCash: function (e) {
    var self = this;
    // 确认一次
    wx.showModal({
      title: '拒绝',
      content: '确定要回退此订单吗',
      success(res) {
        if (res.confirm) {
          var id = e.currentTarget.dataset.orderId;
          var salerid = e.currentTarget.dataset.orderSalerid;
          var cash = e.currentTarget.dataset.orderCash;
          var cookie = wx.getStorageSync('cookieKey');
          var header = {};
          if (cookie) {
            header.Cookie = cookie;
          }
          wx.request({
            url: 'https://www.yunpai8.cn/ldyx/xcx/ldyxTg/backcash.php',
            header: header,
            data: {
              opsalerid: app.globalData.userInfo.salerid,
              id: id,
              salerid: salerid,
              cash: cash
            },
            success: res => {
              console.log(res.data);
              if (res.data.code == 0) {
                wx.showToast({
                  title: '操作成功!',
                  icon: 'none',
                  duration: 3000
                })
                // 删除列表数据
                for (var i = 0; i < self.data.orders.length; i++) {
                  if (self.data.orders[i].id == res.data.id) {
                    self.data.orders.splice(i, 1);
                    break;
                  }
                }
                self.setData({
                  orders: self.data.orders
                });
              } else {
                wx.showToast({
                  title: '操作失败:' + res.data.errMsg,
                  icon: 'none',
                  duration: 3000
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  switchNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      });
    }
  }
})
