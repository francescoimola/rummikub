import {
    Grid,
    Flex,
    Text,
    Link,
    Heading,
    Button,
    TextField,
    Separator,
    Box,
    Container,
    Theme,
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";

export const Footer = ({ withSignupForm = false }) => {
    return (
        <Theme
            appearance="dark"
            accentColor="yellow"
            grayColor="olive"
            hasBackground={false}
            asChild
        >
            <Box
                style={{
                    backgroundColor: "var(--brand-surface-dark-olive)",
                }}
                py="9"
            >
                <Container maxWidth="var(--max-cw)">
                    <Grid
                        columns={{ initial: "1", sm: "12" }}
                        gapX="4"
                        gapY="8"
                        px={{ initial: "var(--section-px-initial)", sm: "var(--section-px-sm)" }}
                    >
                        {/* Brand Column */}
                        <Box gridColumn={{ initial: "auto", sm: "span 4" }}>
                            <Heading size="3" weight="medium" highContrast>
                                Francesco Imola
                            </Heading>
                        </Box>

                        {/* Navigation Columns - Desktop: Columns 5 & 7 (approx) */}
                        {/* Using explicit spans for alignment matching Figma roughly */}

                        <Box gridColumn={{ initial: "auto", sm: "span 2" }}>
                            <Flex direction="column" gap="4">
                                <Heading
                                    as="h3"
                                    size="3"
                                    weight="medium"
                                    highContrast
                                >
                                    Services
                                </Heading>
                                <Flex direction="column" gap="3">
                                    <Link
                                        href="/web-design"
                                        color="gray"
                                        size="3"
                                        highContrast={false}
                                    >
                                        Web design
                                    </Link>
                                    <Link
                                        href="/consulting"
                                        color="gray"
                                        size="3"
                                        highContrast={false}
                                    >
                                        Consulting
                                    </Link>
                                    <Link
                                        href="/faq"
                                        color="gray"
                                        size="3"
                                        highContrast={false}
                                    >
                                        FAQ
                                    </Link>
                                </Flex>
                            </Flex>
                        </Box>

                        <Box gridColumn={{ initial: "auto", sm: "span 2" }}>
                            <Flex direction="column" gap="4">
                                <Heading
                                    as="h3"
                                    size="3"
                                    weight="medium"
                                    highContrast
                                >
                                    About
                                </Heading>
                                <Flex direction="column" gap="3">
                                    <Link
                                        href="/selected-works"
                                        color="gray"
                                        size="3"
                                        highContrast={false}
                                    >
                                        Selected works
                                    </Link>
                                    <Link
                                        href="/contact"
                                        color="gray"
                                        size="3"
                                        highContrast={false}
                                    >
                                        Contact
                                    </Link>
                                    <Link
                                        href="/privacy-notice"
                                        color="gray"
                                        size="3"
                                        highContrast={false}
                                    >
                                        Privacy Notice
                                    </Link>
                                    <Link
                                        href="/terms-of-business"
                                        color="gray"
                                        size="3"
                                        highContrast={false}
                                    >
                                        Terms of Business
                                    </Link>
                                </Flex>
                            </Flex>
                        </Box>

                        {/* Signup Form */}
                        {withSignupForm && (
                            <Box gridColumn={{ initial: "auto", sm: "span 4" }}>
                                <Flex direction="column" gap="4">
                                    <Box>
                                        <Heading
                                            as="h3"
                                            size="3"
                                            weight="medium"
                                            highContrast
                                        >
                                            Finally, something decent in your
                                            inbox
                                        </Heading>
                                        <Box display="block" mt="2">
                                            <Text size="3" color="gray">
                                                Sign up and get occasional emails
                                                about new projects, special offers,
                                                and event invites.
                                            </Text>
                                        </Box>
                                    </Box>

                                    <Form.Root
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <Flex gap="4" align="start" width="100%">
                                            <Form.Field name="email" asChild>
                                                <Box
                                                    flexGrow="1"
                                                    asChild
                                                >
                                                    <Form.Control asChild>
                                                        <TextField.Root
                                                            placeholder="Your email"
                                                            size="3"
                                                            variant="ghost"
                                                            radius="none"
                                                            style={{
                                                                padding: 0,
                                                                color: "var(--gray-a8)",
                                                                mixBlendMode: "plus-lighter",
                                                                minHeight: "auto",
                                                                border: "none",

                                                            }}
                                                        />
                                                    </Form.Control>
                                                </Box>
                                            </Form.Field>
                                            <Form.Submit asChild>
                                                <Theme
                                                    appearance="light"
                                                    accentColor="var(--yellow-a3)"
                                                    radius="none"
                                                    hasBackground={true}
                                                    asChild
                                                >
                                                    <Button
                                                        size="3"
                                                        variant="solid"
                                                        style={{
                                                            color: "var(--yellow-a12)",
                                                        }}
                                                        highContrast
                                                    >
                                                        Subscribe
                                                    </Button>
                                                </Theme>
                                            </Form.Submit>
                                        </Flex>
                                    </Form.Root>

                                    <Text size="2" color="gray">
                                        You agree to receive updates and consent
                                        to our Privacy Policy.
                                    </Text>
                                </Flex>
                            </Box>
                        )}
                    </Grid>

                    <Box px={{ initial: "var(--section-px-initial)", sm: "var(--section-px-sm)" }}>
                        <Separator size="4" my="8" />

                        <Flex
                            justify="between"
                            align="center"
                            direction={{ initial: "column", sm: "row" }}
                            gap="4"
                        >
                            <Text size="2" color="gray">
                                Francesco Imola
                            </Text>

                            <Flex gap="4" align="center">
                                <Text size="2" color="gray">
                                    © 2024 Francesco Imola. All rights reserved.
                                </Text>
                                <Text size="2" color="gray">
                                    Developed by Cantiere Creativo
                                </Text>
                            </Flex>
                        </Flex>
                    </Box>
                </Container >
            </Box >
        </Theme >
    );
};
