const { mysql } = require('../qcloud');

const comment = async (ctx, next) => {
  const content = { name: ctx.request.body.name, face: ctx.request.body.face, words: ctx.request.body.words }
  await mysql("comment").insert(content).then(res =>{
    ctx.state.data = res
  })
}

const fetch = async (ctx, next) => {
  await mysql('comment').select('*').orderBy('id', 'desc').then(res => {
    ctx.state.data = res
  })

}

const zan = async (ctx, next) => {
  const id = ctx.request.body.id
  await mysql("comment").increment('zannum', 1).where('id', '=', id)
  ctx.state.data = { msg: 'ok' }
}

module.exports = { comment, zan,fetch}