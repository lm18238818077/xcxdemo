const { mysql } = require('../qcloud');
// get => ctx.query  post => ctx.request.body

const demo = async (ctx, next) => {
  const { id } = ctx.query;
  await mysql('test').select('*').where({id}).then(res => {
    ctx.state.data = res
  }) 
}

module.exports = {demo}
