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

const URLSAPDevs = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNfmelKDrvRmjYwSi9yvrMg'
//const URLSCN = 'https://content.services.sap.com/cs/searches/userProfile?userName=thomas.jung&objectTypes=blogpost&sort=published,desc&size=6&page=0'
//const URLSCN = 'https://content.services.sap.com/feed?type=blogpost&author=thomas.jung'

const FEATURED_REPOS = [
  'SAP-samples/hana-developer-cli-tool-example',
  'SAP-samples/abap-oo-basics',
  'SAP-samples/cloud-cap-hana-swapi',
  'SAP-samples/cap-hana-exercises-codejam',
]

const repoHeaders = {
  'User-Agent': 'jung-thomas-readme-builder',
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN && {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`
  })
}

const main = async _ => {
  try {
    const feedNew = await parser.parseURL(URLSAPDevs)
    const itemsNew = feedNew.items.slice(0, 6).map(item => {
      item.date = new Date(item.pubDate).toDateString()
      return item
    })

   /*  const feed = await parser.parseURL(URLSCN)
    const items = feed.items.slice(0, 6).map(item => {
      return item
    }) */

    const start = new Date()
    const eventURL = 
    `https://groups.community.sap.com/api/2.0/search?q=` +
    `SELECT id, subject, view_href, occasion_data.location, occasion_data.start_time, occasion_data.end_time, ` +
    `occasion_data.timezone ` +
    `FROM messages WHERE board.id='codejam-events' and occasion_data.start_time >= '${start.toISOString()}' order by occasion_data.start_time asc limit 5`
    let eventDetails = await request('GET', eventURL)
    const eventOutput = JSON.parse(eventDetails.getBody())

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

      return newItem

    }))

    const repos = []
    for (const slug of FEATURED_REPOS) {
      const res = await request('GET', `https://api.github.com/repos/${slug}`, { headers: repoHeaders })
      if (res.statusCode !== 200) {
        process.stderr.write(`Warning: could not fetch ${slug} (${res.statusCode})\n`)
        repos.push({ name: slug.split('/')[1], description: '', url: 'https://github.com/' + slug })
      } else {
        const data = JSON.parse(res.getBody('utf8'))
        repos.push({ name: data.name, description: data.description || '', url: data.html_url })
      }
    }

    const repoRows = []
    for (let i = 0; i < repos.length; i += 2) {
      repoRows.push(repos.slice(i, i + 2))
    }

    console.log(template({ itemsNew, events, repoRows }))
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

main()
