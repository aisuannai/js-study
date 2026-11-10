let str = prompt('请输入','').toLowerCase().match(/[a-z0-9_]+/g) ?? []
alert(str)