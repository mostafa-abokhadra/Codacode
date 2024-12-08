#!/usr/bin/node

const api = "https://github.com/mostafa-abokhadra/Codacode/"
console.log(api.split('/'))
const protocol = api.slice(0, 8)
const domain = api.slice(8, 18)
console.log(protocol, domain)
const slashIndex = api.indexOf('/', 19)
const username = api.slice(19, api.indexOf('/', slashIndex))
console.log(username)
const repoEndIndex = api.indexOf('/', slashIndex + 1);
const repo = repoEndIndex !== -1 ? api.slice(slashIndex + 1, repoEndIndex) : api.slice(slashIndex + 1);
console.log(repo)

const finalApi = `https://api.github.com/repos/${username}/${repo}`
fetch(finalApi).then((res) => res.json()).then((data) => console.log(data)).catch((error) => console.log(errro))
