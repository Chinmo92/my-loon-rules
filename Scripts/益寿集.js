/*************************************

345益寿集 BoxJs版（修复自动抓取）

功能：
1. 自动抓取变量
2. 自动保存 BoxJs
3. 多账号支持
4. 自动签到
5. 自动视频任务

**************************************/

const COOKIE_KEY = "@kyh.cookie";
const ENABLE_KEY = "@kyh.enable";
const NOTIFY_KEY = "@kyh.notify";

class Env {

  getdata(key) {
    return $prefs.valueForKey(key);
  }

  setdata(val, key) {
    return $prefs.setValueForKey(val, key);
  }

  msg(title, sub, body) {

    const notify =
      this.getdata(NOTIFY_KEY);

    if (notify === "false") return;

    $notify(title, sub, body);
  }

  log(...args) {
    console.log(args.join(" "));
  }

  post(url, body, headers = {}) {

    return $task.fetch({
      url,
      method: "POST",
      headers,
      body
    });
  }
}

const $ = new Env();

/***********************
 抓包阶段
************************/

if (typeof $request !== "undefined") {

  const headers = $request.headers;

  const stoken =
    headers["stoken"] ||
    headers["Stoken"];

  const xwebid =
    headers["x-web-id"] ||
    headers["X-Web-Id"];

  const etag =
    headers["x-cdn-relay-etag"] ||
    headers["X-Cdn-Relay-Etag"];

  if (stoken && xwebid && etag) {

    const cookie =
      `${stoken}&${xwebid}&${etag}`;

    let old =
      $.getdata(COOKIE_KEY) || "";

    let arr =
      old ? old.split("\n") : [];

    if (!arr.includes(cookie)) {

      arr.push(cookie);

      $.setdata(
        arr.join("\n"),
        COOKIE_KEY
      );

      $.msg(
        "345益寿集",
        "抓取成功",
        "变量已自动保存"
      );
    } else {

      $.msg(
        "345益寿集",
        "账号已存在",
        "无需重复抓取"
      );
    }
  }

  $done({});
  return;
}

/***********************
 任务阶段
************************/

!(async () => {

  const enable =
    $.getdata(ENABLE_KEY);

  if (enable === "false") {
    $.log("脚本已关闭");
    return;
  }

  const data =
    $.getdata(COOKIE_KEY);

  if (!data) {

    $.msg(
      "345益寿集",
      "",
      "未获取到账号"
    );

    return;
  }

  const accounts =
    data.split("\n").filter(Boolean);

  $.log(`共${accounts.length}个账号`);

  for (let i = 0; i < accounts.length; i++) {

    const arr =
      accounts[i].split("&");

    if (arr.length < 3) continue;

    const account = {
      stoken: arr[0],
      xWebId: arr[1],
      xCdnRelayEtag: arr[2]
    };

    $.log(`开始账号${i + 1}`);

    await run(account, i + 1);

    await sleep(3000);
  }

})()
.catch(err => {

  $.msg(
    "345益寿集",
    "运行异常",
    err.message
  );

})
.finally(() => {
  $done({});
});

/***********************
 工具函数
************************/

function sleep(ms) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}

function headers(account) {

  return {
    "Content-Type":
      "application/json",

    "stoken":
      account.stoken,

    "x-web-id":
      account.xWebId,

    "x-cdn-relay-etag":
      account.xCdnRelayEtag,

    "appid":
      "wx253b08ac367c0899",

    "User-Agent":
      "Mozilla/5.0 MicroMessenger"
  };
}

async function request(
  account,
  url,
  body = {}
) {

  const res = await $.post(
    url,
    JSON.stringify(body),
    headers(account)
  );

  return JSON.parse(res.body || "{}");
}

async function run(account, index) {

  try {

    let sign = await request(
      account,
      "https://wxashopapi.heliang.cc/wxa/WelfareCenter/doTask",
      {
        task: "attend"
      }
    );

    if (sign.error_code === 0) {

      $.log(`账号${index}签到成功`);

    } else {

      $.log(`账号${index}已签到`);
    }

    let config = await request(
      account,
      "https://wxashopapi.heliang.cc/wxa/WelfareCenter/config",
      {}
    );

    if (config.error_code !== 0) {

      $.log(`账号${index}配置失败`);

      return;
    }

    let coin =
      config.data.coin;

    $.log(
      `账号${index}金币：${coin}`
    );

    let videoTask =
      config.data.task.video;

    if (videoTask) {

      let list =
        videoTask.list || [];

      let undone =
        list.filter(
          x => x.status !== 1
        );

      $.log(
        `剩余视频任务：${undone.length}`
      );

      for (let i = 0; i < undone.length; i++) {

        let res = await request(
          account,
          "https://wxashopapi.heliang.cc/wxa/WelfareCenter/doTask",
          {
            task: "video"
          }
        );

        if (res.error_code === 0) {

          $.log(
            `视频${i + 1}成功`
          );

        } else {

          $.log(
            `视频${i + 1}失败`
          );
        }

        await sleep(5000);
      }
    }

    $.msg(
      "345益寿集",
      `账号${index}完成`,
      `金币：${coin}`
    );

  } catch (e) {

    $.msg(
      "345益寿集",
      `账号${index}异常`,
      e.message
    );
  }
}
