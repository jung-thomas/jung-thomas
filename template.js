module.exports = `
---
layout: tutorial
schemadotorg:
 "@context": http://schema.org/
 "@type": CreativeWork
 about: "This is a training material about schema.org"
 audience:
   - "@type": Audience
     name: WebMaster
 genre: "Tutorial"
 name: "Adding schema.org to your website"
 description: "In order to establish higher search results for online resources"
 keywords: ["schemaorg", "TeSS"]
 license: CC-BY 4.0
 version: 1.0
---

# Hi there 👋🏼

I'm currently Head of [SAP Developer Advocacy](https://developers.sap.com/) team at SAP .

<table><tr><td valign="top" width="50%">
 
## On my blog
{{#items}}- [{{{title}}}]({{{id}}}) 
{{/items}} 
- More on [My SAP Community Blog](https://people.sap.com/thomas.jung#content:blogposts)
</td>
  
<td valign="top" width="50%">
  
## Videos and Live Streams
{{#itemsNew}}- [{{{title}}}]({{{link}}}) ({{date}})
{{/itemsNew}}
- More on [SAP Developers YouTube Channel](https://www.youtube.com/channel/UCNfmelKDrvRmjYwSi9yvrMg)
</td></tr></table>

Follow me on [Twitter](https://twitter.com/thomas_jung) or [LinkedIn](https://www.linkedin.com/in/thomasjungsap/).

![README builder](https://github.com/jung-thomas/jung-thomas/workflows/README%20builder/badge.svg)

<a href="https://github.com/anuraghazra/github-readme-stats">
  <img align="center" src="https://github-readme-stats.vercel.app/api?username=jung-thomas&count_private=true&show_icons=true&theme=dark" />
</a>
<a href="https://github.com/anuraghazra/github-readme-stats">
  <img align="center" src="https://github-readme-stats.vercel.app/api/top-langs/?username=jung-thomas&show_icons=true&theme=dark" />
</a>
`

