/******************************

[rewrite_local]

^https:\/\/dict\.youdao\.com\/.* url script-request-header https://raw.githubusercontent.com/Chinmo92/iOSRuleScript/main/Quantumult%20X/Scripts/ydcd.js

[mitm]

hostname = dict.youdao.com

******************************/

/*************** 自动抓包 ***************/
if (typeof $request !== "undefined") {

  const cookie =
    $request.headers["Cookie"] ||
    $request.headers["cookie"];

  if (cookie) {

    const data = JSON.stringify({
      ck: cookie
    });

    $prefs.setValueForKey(data, "ydcd");

    $notify(
      "有道词典",
      "自动抓包成功",
      "Cookie已写入圈X"
    );

    console.log(cookie);

  }

  $done({});
}

/***************
下面再放你的原始脚本
不要改
直接完整接上
***************/