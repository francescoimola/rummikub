import {
    Box,
    Card,
    Container,
    Flex,
    Grid,
    Heading,
    Link,
    Separator,
    Text,
    Theme,
} from "@radix-ui/themes";
import { EXTERNAL_URLS, SITE_DATA } from "../constants";
import NewsletterForm from "./NewsletterForm";

interface FooterLinkItem {
    label: string;
    href: string;
    external?: boolean;
}

interface FooterSection {
    title: string;
    items: FooterLinkItem[];
    headingWrap?: "wrap" | "nowrap"; // strict typing for Radix Heading 'wrap' prop if needed, or string
}

const FOOTER_SECTIONS: FooterSection[] = [
    {
        title: "Services",
        items: [
            { label: "Web design", href: "/webdesign" },
            { label: "Consulting", href: "/consultations" },
            { label: "FAQ", href: "/about#faq" },
        ],
    },
    {
        title: "About",
        items: [
            { label: "Work", href: "/work" },
            { label: "Contact", href: "/about#contact" },
            { label: "Privacy Notice", href: EXTERNAL_URLS.privacyNotice, external: true },
            { label: "Terms of Business", href: EXTERNAL_URLS.termsOfBusiness, external: true },
        ],
    },
    {
        title: "Procrastinate",
        headingWrap: "nowrap",
        items: [
            { label: "For agencies", href: "/work-with-me" },
            { label: "Colophon", href: "/soon" },
            { label: "Playground", href: "/soon" },
        ],
    },
    {
        title: "Elsewhere",
        items: [
            { label: "Substack", href: EXTERNAL_URLS.socials.substack, external: true },
            { label: "Linkedin", href: EXTERNAL_URLS.socials.linkedin, external: true },
            { label: "Nina", href: EXTERNAL_URLS.socials.nina, external: true },
            { label: "Sublime", href: EXTERNAL_URLS.socials.sublime, external: true },
        ],
    },
];

// Force rebuild: Footer update verification
export const Footer = () => {
    return (
        <Theme
            appearance="dark"
            accentColor="yellow"
            grayColor="olive"
            radius="none"
            panelBackground="translucent"
            asChild
        >
            <footer
                style={{ backgroundColor: "var(--brand-surface-dark-olive)" }}
                className="side-margin"
            >
                <Container maxWidth="var(--max-cw)">
                    <Grid
                        columns={{ initial: "1", sm: "2" }} // split 2 cols on sm screens to match page content
                        gapX="4"
                        gapY="calc(var(--space-12) + var(--space-8))"
                        pt="var(--space-10)"
                        pb="calc(var(--space-12) + var(--space-8))"
                        style={{ containerType: "inline-size" }}
                    >
                        {/* LEFT COLUMN: Brand + Navigation */}
                        <Flex
                            gapX="4"
                            gapY="8"
                            width="100%"
                            wrap="wrap"
                            className="footer-navigation"
                        >
                            {FOOTER_SECTIONS.map((section) => (
                                <Flex key={section.title} direction="column" gap="3">
                                    <Heading
                                        as="h3"
                                        size="3"
                                        weight="medium"
                                        highContrast
                                        wrap={section.headingWrap}
                                    >
                                        {section.title}
                                    </Heading>
                                    <Flex direction="column" gap="1">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                color="gray"
                                                size="2"
                                                target={item.external ? "_blank" : undefined}
                                                rel={item.external ? "noopener noreferrer" : undefined}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>

                        {/* RIGHT COLUMN: Signup Form */}
                        <Flex direction="column" gapY={{ initial: "var(--space-11)", sm: "var(--space-12)" }}>
                            <Flex
                                direction="column"
                                gap="4"
                                style={{ containerType: "inline-size" }}
                                className="signup-form-container"
                            >
                                <Flex direction="column">
                                    <Heading as="h3" size="3" weight="medium" highContrast>
                                        Finally, something decent in your inbox
                                    </Heading>
                                    <Text size="3" as="p" mt="2" color="gray">
                                        Sign up and get occasional emails about new projects, special offers, and event invites.
                                    </Text>
                                </Flex>

                                <NewsletterForm showPrivacyText={true} />
                            </Flex>
                            <Card size="2" variant="surface" style={{ backgroundColor: "var(--gray-a2)", inlineSize: "fit-content" }} mt={{ initial: "var(--space-8)", sm: "0" }} mb={{ initial: "-9", sm: "0" }}>
                                <Text size="2" color="gray"><Link href="https://www.websitecarbon.com/website/francescoimola-com/" target="_blank" rel="noopener noreferrer">This website runs on sustainable energy and consumes ~80% less energy than all websites globally</Link></Text>
                            </Card>
                        </Flex>
                    </Grid>

                    <Box pb="var(--space-10)">
                        <Separator size="4" my="4" />
                        <Flex
                            justify="between"
                            align="stretch"
                            direction="row"
                            gapX="6"
                            gapY="1"
                            wrap="wrap"
                        >
                            <Text size="2" style={{ color: "var(--gray-a11)" }}>
                                {SITE_DATA.name} © {SITE_DATA.copyrightYear}. All rights reserved.
                            </Text>
                            <Text size="2" style={{ color: "var(--gray-a11)" }}>
                                Built with love and anxiety in {SITE_DATA.location}
                            </Text>
                        </Flex>
                    </Box>
                </Container>
            </footer>
        </Theme>
    );
};
