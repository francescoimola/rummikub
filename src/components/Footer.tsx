import {
    Grid,
    Flex,
    Text,
    Link,
    Heading,
    Separator,
    Container,
    Theme,
    Box,
} from "@radix-ui/themes";
import NewsletterForm from "./NewsletterForm";

// Force rebuild: Footer update verification
export const Footer = () => {
    return (
        <Theme
            appearance="dark"
            accentColor="yellow"
            grayColor="olive"
            radius="none"
            scaling="97%"
            panelBackground="solid"
            hasBackground={false}
            asChild
        >
            <Box asChild>
                <footer
                    style={{
                        backgroundColor: "var(--brand-surface-dark-olive)",
                    }}
                    className="side-margin">
                    <Container maxWidth="var(--max-cw)">
                        <Grid
                            columns={{ initial: "1", sm: "2" }} // split 2 cols on sm screens to match page content
                            gapX="4"
                            gapY="calc(var(--space-12) + var(--space-8))"
                            pt="var(--space-10)"
                            pb="calc(var(--space-12) + var(--space-8))"
                            style={{
                                containerType: "inline-size",
                            }}
                        >
                            {/* LEFT COLUMN: Brand + Navigation */}
                            <Flex
                                gapX="4"
                                gapY="8"
                                width="100%"
                                wrap="wrap"
                                className="footer-navigation"
                            >
                                <Flex direction="column" gap="3">
                                    <Heading as="h3" size="3" weight="medium" highContrast>
                                        Services
                                    </Heading>
                                    <Flex direction="column" gap="1">
                                        <Link href="/webdesign" color="gray" size="2" highContrast={false}>
                                            Web design
                                        </Link>
                                        <Link href="/consultations" color="gray" size="2" highContrast={false}>
                                            Consulting
                                        </Link>
                                        <Link href="/faq" color="gray" size="2" highContrast={false}>
                                            FAQ
                                        </Link>
                                    </Flex>
                                </Flex>

                                {/* About */}
                                <Flex direction="column" gap="3">
                                    <Heading as="h3" size="3" weight="medium" highContrast>
                                        About
                                    </Heading>
                                    <Flex direction="column" gap="1">
                                        <Link href="/selected-works" color="gray" size="2" highContrast={false}>
                                            Selected works
                                        </Link>
                                        <Link href="/about#contact" color="gray" size="2" highContrast={false}>
                                            Contact
                                        </Link>
                                        <Link href="/privacy-notice" color="gray" size="2" highContrast={false}>
                                            Privacy Notice
                                        </Link>
                                        <Link href="/terms-of-business" color="gray" size="2" highContrast={false}>
                                            Terms of Business
                                        </Link>
                                    </Flex>
                                </Flex>

                                {/* Procrastinate */}
                                <Flex direction="column" gap="3">
                                    <Heading as="h3" size="3" weight="medium" highContrast wrap="nowrap">
                                        Procrastinate
                                    </Heading>
                                    <Flex direction="column" gap="1">
                                        <Link href="/playground" color="gray" size="2" highContrast={false}>
                                            Playground
                                        </Link>
                                        <Link href="/newsletter" color="gray" size="2" highContrast={false}>
                                            Newsletter
                                        </Link>
                                        <Link href="/colophon" color="gray" size="2" highContrast={false}>
                                            Colophon
                                        </Link>
                                    </Flex>
                                </Flex>

                                {/* Elsewhere */}
                                <Flex direction="column" gap="3">
                                    <Heading as="h3" size="3" weight="medium" highContrast>
                                        Elsewhere
                                    </Heading>
                                    <Flex direction="column" gap="1">
                                        <Link href="https://substack.com" target="_blank" rel="noopener noreferrer" color="gray" size="2" highContrast={false}>
                                            Substack
                                        </Link>
                                        <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" color="gray" size="2" highContrast={false}>
                                            Linkedin
                                        </Link>
                                        <Link href="https://nina.market" target="_blank" rel="noopener noreferrer" color="gray" size="2" highContrast={false}>
                                            Nina
                                        </Link>
                                        <Link href="https://sublime.app" target="_blank" rel="noopener noreferrer" color="gray" size="2" highContrast={false}>
                                            Sublime
                                        </Link>
                                    </Flex>
                                </Flex>
                            </Flex>

                            {/* RIGHT COLUMN: Signup Form */}
                            <Flex direction="column" gap="4" style={{ containerType: "inline-size" }} className="signup-form-container">
                                <Flex direction="column" >
                                    <Heading as="h3" size="3" weight="medium" highContrast>
                                        Finally, something decent in your inbox
                                    </Heading>
                                    <Text size="3" as="p" mt="2" color="gray">
                                        Sign up and get occasional emails about new projects, special offers, and event invites.
                                    </Text>
                                </Flex>

                                <NewsletterForm showPrivacyText={true} />
                            </Flex>
                        </Grid>

                        <Box
                            pb="var(--space-10)"
                        >
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
                                    Francesco Imola © 2024. All rights reserved.
                                </Text>
                                <Text size="2" style={{ color: "var(--gray-a11)" }}>
                                    Built with love and anxiety in Folkestone, UK
                                </Text>
                            </Flex>
                        </Box>
                    </Container >
                </footer>
            </Box >
        </Theme >
    );
};
