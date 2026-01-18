import { Flex, Text, Link, Button } from "@radix-ui/themes";

export default function Header({ logoText = "Francesco Imola" }) {
    return (
        <Flex
            asChild
            justify="between"
            align="center"
            p="6"
            gap="5"
            style={{ width: "100%", backgroundColor: "var(--yellow-3)" }}
        >
            <header>
                {/* Logo */}
                <Text size="3" weight="medium" style={{ width: "100%" }} highContrast>
                    {logoText}
                </Text>

                {/* Navigation + CTA */}
                <Flex
                    justify="between"
                    align="center"
                    style={{ width: "100%" }}>
                    {/* Nav Items */}
                    <Flex asChild gap="5">
                        <nav>
                            <Link
                                href="/websites"
                                size="3"
                                color="gray"
                                underline="hover"
                            >
                                Websites
                            </Link>
                            <Link
                                href="/consulting"
                                size="3"
                                color="gray"
                                underline="hover"
                            >
                                Consulting
                            </Link>
                            <Link
                                href="/about"
                                size="3"
                                color="gray"
                                underline="hover"
                            >
                                About
                            </Link>
                        </nav>
                    </Flex>

                    {/* Contact CTA */}
                    <Button variant="soft" color="gray" size="3">
                        Contact
                    </Button>
                </Flex>
            </header>
        </Flex>
    );
}
