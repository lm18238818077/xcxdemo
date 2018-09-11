const Ut = require("../common/utils");
const openid = async (ctx, next) => {
  let appId = "wx30b9a490310edd9e";
  let secret = "1c7e4cdbf21138cb6e556c78ed93b9fb";
  let js_code = ctx.request.body.js_code;
  let opts = {
    url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`
  }
  let r1 = await Ut.promiseReq(opts);
  r1 = JSON.parse(r1);
  ctx.state.data = r1
}

module.exports = { openid}