module.exports = `
# Hi there 👋🏼

I'm currently Head of [SAP Developer Advocacy](https://developers.sap.com/) team at SAP .

<table><tr><td valign="top" width="50%">
 
## On my blog
{{#scnCont}}- [{{{displayName}}}]({{{url}}}) ({{date}})
{{/scnCont}} 
- More on [My SAP Community Blog](https://people.sap.com/thomas.jung#content:blogposts)
</td>
  
<td valign="top" width="50%">
  
## Videos and Live Streams
{{#items}}- [{{{title}}}]({{{link}}}) ({{date}})
{{/items}}
- More on [My YouTube Channel](https://www.youtube.com/channel/UCVLSTvSR7UAd87o_0qoIR4Q)
</td></tr></table>

Follow me on [Twitter](https://twitter.com/thomas_jung) or [LinkedIn](https://www.linkedin.com/in/thomasjungsap/).

![README builder](https://github.com/jung-thomas/jung-thomas/workflows/README%20builder/badge.svg)

`