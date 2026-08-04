---
title: Colophon
contentMode: flush
permalink: /about/colophon/
hidden: true
date: 2026-08-04
---
I built this website myself. The current iteration is the third, or the seventh. I stopped counting, to be honest. Its always-changing design and features have kept me busy many an evening and given me countless business and coding challenges from which to learn. I am immensely grateful to this website, and, despite having probably spent way too much time on it, I regret very little about it. 

## The current infrastructure is as follows:

– Built with 11ty (Eleventy) using VS Code, my own coding knowledge, and the help of AI (Claude and Opencode).
- [cleacss](https://cleacss.dev) handles the CSS foundations 
- Pages are written either in Nunjucks or Markdown, with JavaScript propping up some useful features (like only loading videos when the user is about to scroll near them).
- Code stored on [GitHub] (https://github.com/francescoimola/rummikub/).
- Updates handled either manually or using [Pages CMS](https://pagescms.org).
- Deploys with [Cloudflare Pages](https://pages.cloudflare.com/) at francescoimola.com.

## Credits 

- Uses Ronzino by Collettivo (designed by Luigi Gorlero and Nunzio Mazzaferro)
- 

## Highlight features

- Brand tint: I can swap the entire colour palette by changing --brand-hue and --brand-chroma. 
- Light/dark mode is automatic via light-dark(), plus there's a manual toggle with data-theme.
- Lazy video: IntersectionObserver loads project videos only when they scroll into view and prefers-reduced-motion and slow connections are respected, within what's feasible.
- Content modes: by setting "contentMode: contrast" in frontmatter, I can make pages either white or slightly tint them with the brand colour.
- Fluid type using Utopia, which generates a scale from 16px to 24px with a Perfect Fourth ratio.
- Running on 100% renewable energy infrastructure. Cloudflare Pages is certified green by The Green Web Foundation.

## How it was built:

I drafted the design in Figma, page by page but not pixel perfect. I then ported the designs for pages and components into code, achieving something fairly close to the reference. Next, I applied Utopia's fluid scale to turn all static values into dynamic ones that adapt to the size of the viewport—both typography and spacing. With regard to the CSS, I leaned in part on cleacss and in part on my own stubbornness and digging my own heels deep into layer upon layer of SCSS, which I hope I will trim down over time.

As page and features began to take form, bugs crept in... before being ironed out one by one. Then came weeks of fine-tuning, adding minor features to the front end, and significantly streamlining the back end, which I never imagined would become so sprawling. 

## On AI use

Conversations about the use of AI at work often lack nuance and do not welcome nuance. You must either completely against generative AI and refuse to use it, or fully embrace it so much that you let it give you back massages, write messages to your lover, and choose what you're having for dinner 7 nights a week. The idea of sitting on the fence and using LLMs sparingly, when they make the most sense, seems both sacrilegious and out of the question. Ironically, that's exactly how I use AI.

As a web designer by trade and a developer by necessity, my knowledge of back-end code in particular is limited. Luckily, this site was redesigned in 2026. It's the Year of the Horse, and Claude Code, along with its friends (shout out to Opencode), have become an undeniable part of any programmer's workflow—at least at the time of writing (note from the author: all the em dashes are mine because, well, I like them).

I relied on AI assistance to: 

- Port designs from Figma into code that was good enough to start building, and I then refined it
- Improve accessibility
- Make the code I wrote more reliable and performant
- Troubleshoot bugs 
- Write tests
- Connect the repository to a CMS 

I am aware that using large language models carries a carbon footprint. While Google Lighthouse scores this site's code ~100% across the board in terms of efficiency, accessibility, and weight, I know that the environmental ramifications of using LLMs in the first place can't be so easily erased by means of code optimisation alone.

If we must discuss the human element, rest assured, it is integral to my work, whether or not it can be detected from a first glance. I have to admit that AI has its strengths; it's really good at coding, in fact, and that's exactly where I've taken advantage of it. I haven't let it touch the design though, beyond fixing the inevitable bugs, because I wanted total control over UI, UX, and how the user would interact with the thing that is ultimately both a portfolio and an extension of my identity. Using LLMs might seem contradictory and ironical for someone who promotes transparency and insists on not working with clients in exploitative industries, but I believe finding a balance is possible. In my case, I worked solo and did the bulk of the thinking, brainstorming, writing, and designing from scratch. Technology came in to fill the gaps, such as to autocomplete repetitive lines of code and help me debug issues outside my remit. Ultimately, I treat LLMs as just another tool in my arsenal. The job can sometimes be done without them, though, and there is a certain beauty in doing such a job yourself. I appreciate those moments.

## Yes, this site has a "history" 

This website was previously two websites! I used to have a container for everything in my practice related to business, and one for art slash everything else. I have since recognised the value of, as they call it, multidisciplinary practice, and I have embraced my name, my creativity, and my broad skillset as what makes me stand out. My arts background and my ability to relate to people across departments and walks of life has become part of my 'personal brand', if you wish, rather than something to be hidden away.

This epiphany led me to redesign this website in 2025. That version won the Public Award for Best UI, UX and Innovation, plus a Special Kudos at the CSS Design Awards (https://www.cssdesignawards.com/sites/francesco-imola/48906/) at the beginning of 2026. 

Later that year, I continued to update the design, until the result came closer and closer to what I initially envisioned for my practice: a welcoming, non-prescriptive vessel, capable of holding all I do and have to offer, and flexible enough to accommodate the needs of its various audiences (current and potential clients and employers, curious folks, people who want to read what I post, and fellow professionals).
