/******************************

[rewrite_local]

# 有道词典 自动抓包
^https:\/\/dict\.youdao\.com\/.* url script-request-header https://raw.githubusercontent.com/Chinmo92/iOSRuleScript/main/Quantumult%20X/Scripts/ydcd.js

[task_local]

0 0,9 * * * https://raw.githubusercontent.com/Chinmo92/iOSRuleScript/main/Quantumult%20X/Scripts/ydcd.js, tag=有道词典

[mitm]

hostname = dict.youdao.com

******************************/

/*************** 自动抓包 ***************/
if (typeof $request !== "undefined") {

  const oldCookie = $prefs.valueForKey("ydcd");

  // 已抓取则停止
  if (oldCookie) {

    console.log("有道词典: 已存在Cookie，停止抓取");

    $done({});

  } else {

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
        "首次自动抓包成功",
        "已自动停止后续抓取"
      );

      console.log("Cookie写入成功");

    } else {

      console.log("未获取到Cookie");

    }

    $done({});
  }
}

/***************
下面接原脚本
不要删除
直接粘贴你的原混淆代码
***************/