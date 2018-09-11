const { mysql } = require('../qcloud');


const bless = async (ctx, next) => {
  const content = { name: ctx.request.body.name, face: ctx.request.body.face, openid: ctx.request.body.openid }
  await mysql("bless").insert(content).then(res => {
    ctx.state.data = res
  })
}

const blessfetch = async (ctx, next) => {
  await mysql('bless').select('*').orderBy('id', 'desc').then(res => {
    ctx.state.data = res
  })
}


module.exports = { bless, blessfetch }