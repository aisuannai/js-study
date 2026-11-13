function summarize(obj={}){
    let {role='user',content=''} = (obj ?? {})
    let {tokens=0} = obj.meta ?? {}
    return {role, content, tokens}
}

module.exports = { summarize }