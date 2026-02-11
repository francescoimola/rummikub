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
