/**
 * @authors daoqing (daoqing99@163.com)
 * @date    2017-07-19 17:28:55
 * @version $Id$
 */

// rem单位
(function() {
    var html = document.getElementsByTagName('html')[0];
    var width = document.documentElement.clientWidth || document.body.clientWidth;
    html.style.fontSize = width / 375 * 20 * 2 + 'px';
})();


// ajax
function ajaxPost(url, data, callback, callErr) {
    ajaxGetPostRequest(url, data, callback, 'post', 1, callErr);
};




// ajax封装
function ajaxGetPostRequest(url, data, callback, type, retry, callErr) {

    var bannerUrl = location.href;
    var aaaUrlArr = bannerUrl.split('?');
    // console.log(aaaUrlArr)
    // console.log(aaaUrlArr[1])

    var bbbUrlArr = aaaUrlArr[1].split('&');

    var obj = {};
    for (var i = 0; i < bbbUrlArr.length; i++) {
        var bbb = bbbUrlArr[i].split('=');
        obj[bbb[0]] = bbb[1];
    }

    console.log("url>>>>>>>>>>>>>>>" + url);
    console.log("para:" + JSON.stringify(data));
    mui.ajax(url, {
        data: data,
        dataType: 'json',
        type: type ? type : 'post',
        timeout: 10000,
        crossDomain: true,
        headers: obj,
        success: function(response) {
            if (response == null || response == '') {
                console.log("server null");
            } else {
                console.log("server<<<<<<<<<<<<<" + JSON.stringify(response));
                callback(response, callback);
            }
        },
        error: function(xhr, type, errorThrown) {
            if (typeof retry != 'undefined') {
                retry--;
            } else {
                retry = 0;
            }
            if (retry > 0) {
                ajaxGetPostRequest(url, data, callback, type, retry);
            } else {
                console.log(ajaxErrors(xhr));
                if (callErr) callback(xhr, callErr);
                //console.log(xhr);
                //owner.toast(owner.ajaxErrors(xhr));
            }
        }
    });
};




var SERVERINDEX = 2;
var SERVER_IPS = ["http://120.77.154.220:8081/api",
    "http://119.23.77.245:8081/api",
    "http://120.76.220.202:8081/api", //测试
    "http://119.23.229.84:8081/api", //ios
    "http://120.77.245.61:8081/api"
]
var SERVER_IP = SERVER_IPS[SERVERINDEX];

var CHECKRECEIVEQUALIFICATION = SERVER_IP + '/bonus_activity/checkReceiveQualification'; //验证活动资格是否已被领取
var RECEIVEQUALIFICATION = SERVER_IP + '/bonus_activity/receiveQualification'; //领取活动资格
var PRODUCTIDS = SERVER_IP + '/bonus_activity/productIds'; //获取某个活动商品




// 获取是否有参与资格
function checkQualification(activityCode) {
    ajaxPost(CHECKRECEIVEQUALIFICATION, {
            activityCode: activityCode
        }, function success(data) {
            if (data.status == "1") {

                var zige01 = document.getElementById('zige01');
                var zige02 = document.getElementById('zige02');

                if (data.data) {
                    zige02.style.display = 'block';
                    zige01.style.display = 'none';
                } else {
                    zige02.style.display = 'none';
                    zige01.style.display = 'block';
                }

                mui.toast(data.msg)

            } else if (data.status == "0") {
                mui.toast(data.msg);
            } else {
                mui.toast(data.msg);
            }
        },
        function error(err) {}
    );
}

// 领取活动资格
function getActivity(activityCode) {
    ajaxPost(RECEIVEQUALIFICATION, {
            activityCode: activityCode
        }, function success(data) {
            if (data.status == "1") {
                // console.log(JSON.stringify(data.data))

                mui.toast(data.msg)
                checkQualification(activityCode);
            } else if (data.status == "0") {
                // mui.toast(data.msg);
            } else {
                // mui.toast(data.msg);
            }
        },
        function error(err) {}
    );
};