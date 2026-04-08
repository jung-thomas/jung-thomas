module.exports = `
# Hi there 👋🏼

I'm **Thomas Jung**, Head of [SAP Developer Advocacy](https://developers.sap.com/developer-advocates.html) at SAP.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/thomasjungsap/)

---

## About

Nearly three decades in SAP — from ABAP developer to Head of Developer Advocacy. I lead a team that creates tutorials, videos, sample code, and CodeJams to help developers cut through the noise and actually build things.

---

<table><tr><td valign="top" width="50%">

## Latest Videos
{{#itemsNew}}<a href="{{{link}}}"><img src="{{{thumb}}}" width="240" alt="{{title}}" /></a><br/>
<a href="{{{link}}}">{{title}}</a> ({{date}})

{{/itemsNew}}
- More on [SAP Developers YouTube Channel](https://www.youtube.com/channel/UCNfmelKDrvRmjYwSi9yvrMg)

</td><td valign="top" width="50%">

## Upcoming SAP CodeJams
{{#events}}- [{{{title}}}]({{{href}}})
  - Start: {{{startTimeFormatted}}}
  - Location: {{{location}}}
{{/events}}
- More on [the SAP CodeJam Community Events Calendar](https://groups.community.sap.com/t5/sap-codejam/eb-p/codejam-events)

</td></tr></table>

---

## Tech Stack

<img src="https://img.shields.io/badge/SAP%20BTP-0070F2?style=flat&logo=sap&logoColor=white" alt="SAP BTP" /> <img src="https://img.shields.io/badge/CAP%20Node.js-0070F2?style=flat&logo=sap&logoColor=white" alt="CAP Node.js" /> <img src="https://img.shields.io/badge/SAP%20HANA%20Cloud-00A4E4?style=flat&logo=sap&logoColor=white" alt="SAP HANA Cloud" /> <img src="https://img.shields.io/badge/ABAP-0070F2?style=flat&logo=sap&logoColor=white" alt="ABAP" /> <img src="https://img.shields.io/badge/SAP%20AI%20Core-6E40C9?style=flat&logo=sap&logoColor=white" alt="SAP AI Core" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript" /> <img src="https://img.shields.io/badge/Joule%20Studio-E8503A?style=flat&logo=sap&logoColor=white" alt="Joule Studio" />

---

## Featured Projects

<table>
{{#repoRows}}
<tr>
{{#this}}
<td valign="top" width="50%">

**[{{{name}}}]({{{url}}})**

{{{description}}}

</td>
{{/this}}
</tr>
{{/repoRows}}
</table>
`

