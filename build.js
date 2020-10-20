const Parser = require('rss-parser')
const request = require('then-request');
const parser = new Parser()

const Handlebars = require('handlebars')
const source = require('./template')
const template = Handlebars.compile(source)

const URLYouTube = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCVLSTvSR7UAd87o_0qoIR4Q'
const URLSAPDevs = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNfmelKDrvRmjYwSi9yvrMg'
const URLSCN = 'https://content.services.sap.com/cs/searches/userProfile?userName=thomas.jung&objectTypes=blogpost&sort=published,desc&size=6&page=0'
const main = async _ => {
  try {
    const res = await request('GET', URLSCN)
    const scnItems = JSON.parse(res.getBody())
    /* const feed = await parser.parseURL(URLYouTube)
    const items = feed.items.slice(0, 3).map(item => {
      item.date = new Date(item.pubDate).toDateString()
      return item
    }) */
    const feedNew = await parser.parseURL(URLSAPDevs)
    const itemsNew = feedNew.items.slice(0, 6).map(item => {
      item.date = new Date(item.pubDate).toDateString()
      return item
    })

    const scnCont = scnItems._embedded.contents
    for (const cont of scnCont) {
        cont.date = new Date(cont.published).toDateString()
        cont.url = encodeURI(cont.url)
      } 
    console.log(template({itemsNew, scnCont}))
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

main()
