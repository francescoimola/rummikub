---
title: "Colophon: or how and why I built this website"
contentMode: flush
permalink: /about/colophon/
date: 2026-08-04
updated: 2026-08-05
type: notes
teaser: "How and why I built this site."
---
I built this website myself. The current iteration is the third, or the seventh. I stopped counting, to be honest. Its design and features have changed a lot over the years, and whilst looking after it has kept me busy many an evening, it has also given me countless challenges from which to learn. I am immensely grateful to have a website as "mine" as this, and despite having probably spent way too much time tending to it, I regret very little about the whole experience.

## The current infrastructure is as follows

- Built with [11ty](https://www.11ty.dev/) using VS Code, my own coding knowledge, and the help of Claude Code and Opencode.
- Pages are written either in Nunjucks or Markdown, with JavaScript propping up some of the more complex but useful features (like only loading videos when the user is about to scroll near them).
- Code stored on [GitHub](https://github.com/francescoimola/rummikub/).
- Updates are handled either manually or using [Pages CMS](https://pagescms.org).
- Deployed with [Cloudflare Pages](https://pages.cloudflare.com/).

## Privacy and data

This site does not track you. There are no cookies, no tracking pixels, no analytics script, and no forms. Nothing interacts with your browser to follow you around on the web. All I see are rough numbers of page views, requests to the website, and from what country these requests are  coming from. Cloudflare, which hosts the website, aggregates all this data from server logs but I can never identify IP addresses or personal information.

Across the site, you'll see links to other platforms (e.g. Substack) and to cal.com, the platform I use to let people book time to talk to me. Once you're out of this site and are on one of these platforms, their terms apply and not mine.

## Credits 

- Uses [Ronzino](https://www.collletttivo.it/typefaces/ronzino) by Colletttivo (designed by Luigi Gorlero and Nunzio Mazzaferro)
- Relies on [Utopia](https://utopia.fyi/), a fluid design system by James Gilyead and Trys Mudford.
- Would have taken a lot longer to build without [cleacss](https://cleacss.dev), a mighty but lightweight CSS framework by Justus Kraft that handles resets and styling foundations.

## Highlight features

- I can swap the entire colour palette by changing two values in the css, hue and chroma. Users too can swap the entire palette by interacting with the theme toggle in the sidebar/menu.
- Light/dark mode is automatic via light-dark(), plus there's a manual toggle users can switch themselves.
- IntersectionObserver loads videos only when they scroll into view and prefers-reduced-motion and slow connections are respected, within what's feasible.
- I can make pages either white/black or slightly tint them with the brand colour just by changing a variable in the frontmatter.
- Near 100% fluid type and spacing, achieved using Utopia, which generates a scale from 16px to 24px with a Perfect Fourth ratio.
- Running on 100% renewable energy infrastructure. Cloudflare Pages is certified green by The Green Web Foundation.

## How it was built

I drafted the design in Figma. I then ported the designs into code, achieving something fairly close to the reference. Next, I applied Utopia's fluid scale to turn all static values into dynamic values that adapt to the size of the viewport. 

With regard to the CSS, I leaned in part on cleacss and in part on my own stubbornness and digging my own heels deep into layer upon layer of SCSS, which I hope I will trim down over time.

As page and features began to take form, bugs crept in... before being ironed out one by one. Then came weeks of fine-tuning, adding minor features to the front end, and significantly streamlining the back end, which I never imagined would sprawl so much. 

## On using LLMs

Conversations about the use of AI at work often lack nuance and do not welcome nuance. You must either be completely against generative AI and refuse to use it... or if you embrace it you should do so fully, so much so that you let AI give you back massages, write messages to your lover, and choose what you're having for dinner 7 nights a week. The idea of sitting on the fence and using LLMs sparingly, when they make the most sense, seems both sacrilegious and out of the question. Ironically, that's exactly how I use them.

As a web designer by trade and a developer by necessity, my knowledge of back-end code in particular is limited. Luckily, this site was redesigned in 2026. It's the Year of the Horse, and agentic coding tools like Claude Code or Opencode have become an undeniable part of any programmer's workflow, at least at the time of writing.

I relied on AI assistance to: 

- Port designs from Figma into code that was good enough to start building, and I then refined it
- Improve accessibility
- Make the code I wrote more reliable and performant
- Write tests and troubleshoot bugs
- Connect the repository to a CMS 

I am aware that using large language models carries a carbon footprint. While Google Lighthouse scores this site ~100% across the board in terms of efficiency, accessibility, and weight, I know that the environmental ramifications of using LLMs in the first place can't be so easily erased by means of code optimisation alone.

If we must discuss the human element, rest assured, it is integral to my work, whether or not it can be detected from a first glance. If AI has a strength is that it's really, really good at coding. In fact, that's where I've taken advantage of it most. I did not, however, let it touch my designs (beyond fixing the inevitable bugs) because I wanted total control over UI, UX, and how the user would interact with the website.

Using LLMs might seem contradictory and ironical for someone who promotes transparency and insists on not working with clients in exploitative industries, but I believe finding a balance is possible. In my case, I worked solo and did the bulk of the thinking, brainstorming, writing, and designing from scratch. Technology came in to fill the gaps, such as to autocomplete repetitive lines of code and help me debug issues outside my remit. Ultimately, I treat LLMs as just another tool in my arsenal. The job can sometimes be done without them, though, and there is a certain beauty in doing such a job yourself; I appreciate those moments.

## Yes, this site has a "history"

This website was previously two websites! I used to have a container for everything in my practice related to business, and one for art slash everything else. I have since recognised the value of my, as they call it, multidisciplinary practice: I have embraced my name, my creativity, and my broad skillset as what makes me stand out. My arts background and my ability to relate to people across departments and walks of life has become part of my personal brand, if you wish, rather than something to be hidden away.

This epiphany led me to redesign this website in 2025. That version won the Public Award for Best UI, UX and Innovation, plus a Special Kudos at the [CSS Design Awards](https://www.cssdesignawards.com/sites/francesco-imola/48906/) at the beginning of 2026. 

Later that year, I continued to update the design, until I landed on a version much closer to what I initially envisioned: a welcoming, non-prescriptive website. A vessel capable of holding all I do and have to offer, and flexible enough to accommodate the needs of its various audiences (current and potential clients and employers, curious folks, people who want to read what I post, and fellow professionals). I'm proud of this version, and I'm excited to see where it goes from here.
