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
        title: "Francesco Imola | Web Designer & Creative Marketer in Kent",
        description:
            "I help small businesses, freelancers and creatives drive long-term growth with futureproof websites, UX copy, email marketing and strategic consultations.",
        image: "/assets/images/og-image.png",
    },
    pages: {
        home: {
            title: "Francesco Imola | Web Designer & Creative Marketer in Kent",
            description:
                "Honest pixels and words that connect your work to the people who need it most. Web design and development for small businesses in Kent.",
        },
        about: {
            title: "About | Francesco Imola",
            description:
                "Designer and marketer based in Folkestone, Kent. I help independent businesses with websites, strategy, copy, and integrations.",
        },
        blog: {
            title: "Blog | Francesco Imola",
            description:
                "Notes on marketing and designing your thing without following the usual playbook. For anyone who suspects there might be a better way.",
        },
        webdesign: {
            title: "Web Design & Development | Francesco Imola",
            description:
                "Deliberately simpler web design for independent businesses and freelancers. No agency overhead, no false promises, no dark patterns.",
        },
        consultations: {
            title: "Website Consultations | Francesco Imola",
            description:
                "Get clarity on what's holding your site back. Each session includes a mini website review plus 1 hour of dedicated consultation time.",
        },
        work: {
            title: "Selected Work | Francesco Imola",
            description:
                "A selection of web design, marketing, and content projects for small businesses, non-profits, and higher education.",
        },
        notFound: {
            title: "Page Not Found | Francesco Imola",
            description:
                "The page you're looking for doesn't exist or has been moved.",
        },
        workWithMe: {
            title: "Work With Me | Francesco Imola",
            description:
                "Designer, writer, and strategist. I make things clearer and simpler — for websites, campaigns, brand messaging, and anything that needs to communicate well.",
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
