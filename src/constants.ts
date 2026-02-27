/**
 * Shared external URLs used across the site.
 */
export const EXTERNAL_URLS = {
    termsOfBusiness:
        "https://francescoimola.notion.site/Terms-of-Business-106e78091df380d387cbe92ec091a04e",
    privacyNotice:
        "https://francescoimola.notion.site/Privacy-Communications-Notice-Francesco-Imola-106e78091df3803aa3cdf5d614ae6146",
    socials: {
        substack: "https://substack.com",
        linkedin: "https://www.linkedin.com/in/francescoimola/",
        nina: "https://nina.market",
        sublime: "https://sublime.app",
    },
    calendar: {
        intro: "https://cal.com/francescoimola/intro",
        consultation: "https://cal.com/francescoimola/website-consultation",
    },
    services: {
        web3forms: "https://api.web3forms.com/submit",
    },
} as const;

/**
 * Shared site data and metadata.
 */
export const SITE_DATA = {
    name: "Francesco Imola",
    email: "hi@francescoimola.com",
    location: "Folkestone, UK",
    copyrightYear: 2024,
} as const;

/**
 * SEO metadata defaults and page-specific overrides.
 */
export const SEO = {
    defaults: {
        title: "Francesco Imola | Designer & Creative Marketer in Kent",
        description:
            "I help businesses, freelancers and creatives grow sustainably with unapologetically simple websites, UX copy, email marketing and strategic consultations",
        image: "/assets/images/og-image.png",
    },
    pages: {
        home: {
            title: "Francesco Imola | Web Designer & Creative Marketer in Kent",
            description:
                "I help businesses, freelancers and creatives grow sustainably with unapologetically simple websites, UX copy, email marketing and strategic consultations",

        },
        about: {
            title: "About | Francesco Imola",
            description:
                "Francesco Imola is a designer who writes, a writer who designs, and a strategist who does both.",

        },
        blog: {
            title: "Blog | Francesco Imola",
            description:
                "Notes on marketing and designing your thing without following the playbook everyone is following.",

        },
        websites: {
            title: "Web Design & Development | Francesco Imola",
            description:
                "Unapologetically simple web design and development for independent businesses and freelancers.",

        },
        consultations: {
            title: "Website Consultations | Francesco Imola",
            description:
                "Get clarity on what's holding your site back. Each session includes a mini website review plus 1 hour of honest, focused conversation.",

        },
        work: {
            title: "Selected Work | Francesco Imola",
            description:
                "A selection of projects I have worked on at the infamous roundabout where marketing and design perpetually chase each other.",

        },
        notFound: {
            title: "404 | Page Not Found | Francesco Imola",
            description:
                "The page you're looking for doesn't exist or has been moved.",

        },
        comingSoon: {
            title: "Coming Soon | Francesco Imola",
            description:
                "This page isn't quite ready yet.",

        },
        collaborate: {
            title: "Collaborate | Francesco Imola",
            description:
                "Folkestone-based designer, writer, and strategist. I help businesses simplify their websites, campaigns, and messaging. Available freelance or part-time.",
        },
        playground: {
            title: "Playground | Francesco Imola",
            description:
                "Net art, essays, poems, exhibitions, and other creative projects.",
        },
    },
    person: {
        "@type": "Person" as const,
        name: "Francesco Imola",
        jobTitle: "Web Designer & Creative Marketer",
        url: "https://francescoimola.com",
        email: "hi@francescoimola.com",
        address: {
            "@type": "PostalAddress" as const,
            addressLocality: "Folkestone",
            addressCountry: "UK",
        },
        sameAs: ["https://www.linkedin.com/in/francescoimola/"],
    },
} as const;
