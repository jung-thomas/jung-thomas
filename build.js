const Parser = require('rss-parser')
const request = require('then-request')
const parser = new Parser({
  headers: {
    'Accept': 'application/atom+xml'
  }
})

const Handlebars = require('handlebars')
const source = require('./template')
const template = Handlebars.compile(source)

const URLYouTube = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCVLSTvSR7UAd87o_0qoIR4Q'
const URLSAPDevs = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNfmelKDrvRmjYwSi9yvrMg'
//const URLSCN = 'https://content.services.sap.com/cs/searches/userProfile?userName=thomas.jung&objectTypes=blogpost&sort=published,desc&size=6&page=0'
const URLSCN = 'https://content.services.sap.com/feed?type=blogpost&author=thomas.jung'
const main = async _ => {
  try {
    //  const res = await request('GET', URLSCN)
    //  const scnItems = JSON.parse(res.getBody())
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

    const feed = await parser.parseURL(URLSCN)
    const items = feed.items.slice(0, 6).map(item => {
      // item.date = new Date(item.pubDate).toDateString()
      return item
    })

    // const scnCont = scnItems._embedded.contents
    // for (const cont of scnCont) {
    //     cont.date = new Date(cont.published).toDateString()
    //     cont.url = encodeURI(cont.url)
    //   } 

    const start = new Date()
    const eventURL = `https://groups.community.sap.com/api/2.0/search?q=SELECT * FROM messages WHERE board.id='codejam-events' and occasion_data.start_time >= '${start.toISOString()}' order by occasion_data.start_time asc limit 5`
    let eventDetails = await request('GET', eventURL)
    const eventOutput = JSON.parse(eventDetails.getBody())
    //const events = eventOutput.data.items.map(item => {

    const events = await Promise.all(eventOutput.data.items.map(async (item) => {
      let newItem = {}
      newItem.title = item.subject
      newItem.href = item.view_href
      newItem.location = item.occasion_data.location
      newItem.start_time = item.occasion_data.start_time
      newItem.end_time = item.occasion_data.end_time
      newItem.timezone = item.occasion_data.timezone
      newItem.startTimeFormatted = new Date(
        (typeof date === "string" ? new Date(newItem.start_time) : newItem.start_time)
      ).toLocaleString('en-US', { timeZone: newItem.timezone, dateStyle: 'full', timeStyle: 'full' })
      newItem.endTimeFormatted = new Date(
        (typeof date === "string" ? new Date(newItem.end_time) : newItem.end_time)
      ).toLocaleString('en-US', { timeZone: newItem.timezone })

      const thumbURL = `https://groups.community.sap.com/api/2.0/search?q=SELECT * FROM images WHERE messages.id = '${item.id}'`
      let thumbDetails = await request('GET', thumbURL)
      const thumbOutput = JSON.parse(thumbDetails.getBody())
      newItem.thumb = thumbOutput.data.items[0].thumb_href
      return newItem

    }))

    console.log(template({ itemsNew, items, events }))
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

main()
