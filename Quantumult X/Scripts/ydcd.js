/******************************

[rewrite_local]

# 有道词典自动抓包
^https:\/\/dict\.youdao\.com\/.* url script-request-header https://raw.githubusercontent.com/你的用户名/你的仓库/main/ydcd.js

[mitm]
hostname = dict.youdao.com

******************************/

const $ = new Env("有道词典");
const md5 = require('md5-node');

const COOKIE_KEY = "ydcd";

/*************** 自动抓包 ***************/
if (typeof $request !== "undefined") {

  (() => {

    try {

      const cookie =
        $request.headers["Cookie"] ||
        $request.headers["cookie"];

      if (!cookie) {
        console.log("未获取到Cookie");
        return;
      }

      const data = JSON.stringify({
        ck: cookie
      });

      $.setdata(data, COOKIE_KEY);

      $.msg(
        "有道词典",
        "自动抓包成功",
        "Cookie已写入圈X"
      );

      console.log("Cookie写入成功");

    } catch (e) {

      console.log(e);

    }

  })();

  $done({});
}