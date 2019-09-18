const uuid4 = require('uuid/v4');
const cryptoMO = require("crypto"); // MD5算法
const parseString = require("xml2js").parseString; // xml转js对象
module.exports = {

    //获得32位字符换
    filterUuid4(){
        return str = uuid4().replace(/-/g,"");
    },

    /**
     * 微信支付
     * @param {string} openid 用户
     * @param {int} totalFee 支付金额  
     */
    wxpayBodyData( openid,totalFee,des,appConfig,mchConfig,ip ){
        let out_trade_no = this.filterUuid4();
        let nonce_str = this.getNonceStr();
        let notify_url = appConfig.notify_url;
        let bodyData = "<xml>";
            bodyData += "<appid>" + appConfig.appid + "</appid>"; // 小程序ID
            bodyData += "<body>" + des + "</body>"; // 商品描述
            bodyData += "<mch_id>" + mchConfig.mchid + "</mch_id>"; // 商户号
            bodyData += "<nonce_str>" + nonce_str + "</nonce_str>"; // 随机字符串
            bodyData += "<notify_url>" + notify_url + "</notify_url>"; // 支付成功的回调地址
            bodyData += "<openid>" + openid + "</openid>"; // 用户标识
            bodyData += "<out_trade_no>" + out_trade_no + "</out_trade_no>"; // 商户订单号
            bodyData += "<spbill_create_ip>" + ip + "</spbill_create_ip>"; // 终端IP
            bodyData += "<total_fee>" + totalFee + "</total_fee>"; // 总金额 单位为分
            bodyData += "<trade_type>JSAPI</trade_type>"; // 交易类型 小程序取值如下：JSAPI
        // 签名
        let sign = this.paysignjsapi(
            appConfig.appid, des, mchConfig.mchid, nonce_str, notify_url, openid, out_trade_no, ip, totalFee,mchConfig.mch_secert
        );
        bodyData += "<sign>" + sign + "</sign>";
        bodyData += "</xml>";
        return {bodyData,out_trade_no};
    },
    //查询订单
    wxpayFindOrder(out_trade_no,appConfig,mchConfig){
        let nonce_str = this.getNonceStr();
        let bodyData = "<xml>";
            bodyData += "<appid>" + appConfig.appid + "</appid>"; // 小程序ID
            bodyData += "<mch_id>" + mchConfig.mchid + "</mch_id>"; // 商户号
            bodyData += "<nonce_str>" + nonce_str + "</nonce_str>"; // 随机字符串
            bodyData += "<out_trade_no>" + out_trade_no + "</out_trade_no>"; // 商户订单号
        let sign = this.findsign(appConfig.appid, mchConfig.mchid, nonce_str,out_trade_no,mchConfig.mch_secert);
        bodyData += "<sign>" + sign + "</sign>";
        bodyData += "</xml>";
        return bodyData;
    },
    //退款
    wxpayReund(order,refund_fee,appConfig,mchConfig){
        let out_refund_no = this.filterUuid4();
        let nonce_str = this.getNonceStr();
        let formData = "<xml>";
        formData += "<appid>" + appConfig.appid + "</appid>"; // 公众账号ID    appid
        formData += "<mch_id>" + mchConfig.mchid + "</mch_id>"; // 商户号    mch_id
        formData += "<nonce_str>" + nonce_str + "</nonce_str>"; // 随机字符串
        formData += "<out_refund_no>" + out_refund_no + "</out_refund_no>"; // 商户退款单号
        formData += "<out_trade_no>" + order.order_no + "</out_trade_no>"; //商户系统内部订单号
        formData += "<refund_fee>" + parseInt((refund_fee) * 100) + "</refund_fee>"; // 退款金额
        formData += "<total_fee>" + parseInt(order.pay_amount * 100) + "</total_fee>"; // 订单金额
        formData += "<sign>" + this.refundsign(appConfig.appid , mchConfig.mchid, nonce_str, order.refund_no || out_refund_no, order.order_no, parseInt((refund_fee) * 100), parseInt(order.pay_amount * 100),mchConfig.mch_secert) + "</sign>"; // 签名    sign
        formData += "</xml>";
        return {formData,out_refund_no: out_refund_no};
    },
    findsign(appid,mch_id,nonce_str,out_trade_no,mch_secert){
        var ret = {
            appid: appid,
            mch_id: mch_id,
            nonce_str: nonce_str,
            out_trade_no: out_trade_no,
        };
        var str = this.raw(ret);
        str = str + "&key=" + mch_secert;
        var md5Str = cryptoMO
            .createHash("md5")
            .update(str)
            .digest("hex");
        md5Str = md5Str.toUpperCase();
        return md5Str;
    },
    refundsign(appid, mch_id, nonce_str, out_refund_no, out_trade_no, refund_fee, total_fee,key){
        let ret = {
            appid: appid,
            mch_id: mch_id,
            nonce_str: nonce_str,
            out_refund_no: out_refund_no,
            out_trade_no: out_trade_no,
            refund_fee: refund_fee,
            total_fee: total_fee,
        };
        let string = this.raw(ret);
        string = string + '&key=' + key; //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置 
        let sign = cryptoMO.createHash('md5').update(string, 'utf8').digest('hex');
        return sign.toUpperCase();
    },

    //获取随机串
    getNonceStr(len) {
        len = len || 32;
        var $chars =
            "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = "";
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    //xml转换成string
    async parseString(cbdata) {
        return new Promise(function (resolve, reject) {
            parseString(cbdata, function (err, result) {
                resolve(result)
            })
        })
    },

    // 生成签名
    paysignjsapi(
        appid,
        body,
        mch_id,
        nonce_str,
        notify_url,
        openid,
        out_trade_no,
        spbill_create_ip,
        total_fee,
        mch_secert
    ) {
        var ret = {
            appid: appid,
            body: body,
            mch_id: mch_id,
            nonce_str: nonce_str,
            notify_url: notify_url,
            openid: openid,
            out_trade_no: out_trade_no,
            spbill_create_ip: spbill_create_ip,
            total_fee: total_fee,
            trade_type: "JSAPI"
        };
        var str = this.raw(ret);
        str = str + "&key=" + mch_secert;
        var md5Str = cryptoMO
            .createHash("md5")
            .update(str)
            .digest("hex");
        md5Str = md5Str.toUpperCase();
        return md5Str;
    },

    raw(args) {
        var keys = Object.keys(args);
        keys = keys.sort();
        var newArgs = {};
        keys.forEach(function (key) {
            newArgs[key.toLowerCase()] = args[key];
        });

        var str = "";
        for (var k in newArgs) {
            str += "&" + k + "=" + newArgs[k];
        }
        str = str.substr(1);
        return str;
    },

    paysignjs(appid, nonceStr, _package, signType, timeStamp,mchkey) {
        var ret = {
            appId: appid,
            nonceStr: nonceStr,
            package: _package,
            signType: signType,
            timeStamp: timeStamp
        };
        var str = this.raw1(ret);
        str = str + "&key=" + mchkey;
        return cryptoMO
            .createHash("md5")
            .update(str)
            .digest("hex");
    },

    raw1(args) {
        var keys = Object.keys(args);
        keys = keys.sort();
        var newArgs = {};
        keys.forEach(function (key) {
            newArgs[key] = args[key];
        });

        var str = "";
        for (var k in newArgs) {
            str += "&" + k + "=" + newArgs[k];
        }
        str = str.substr(1);
        return str;
    }

}
