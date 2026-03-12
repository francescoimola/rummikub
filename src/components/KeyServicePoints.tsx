import { Grid, Heading, Text, Flex, Link } from "@radix-ui/themes";
import type { ReactNode } from "react";

import { ButtonLink } from "./ButtonLink";

interface KSPProps {
    heading: ReactNode;
    children: ReactNode;
    grayWordCount?: number;
    multiParagraph?: boolean;
    href?: string;
    buttonText?: string;
}

export const KSP = ({ heading, children, multiParagraph, href, buttonText }: KSPProps) => {


    return (
        <Grid columns={{ initial: "1", md: "2" }} gapX="6" gapY="2" className="key-service-point">
            <Heading size="3" weight="medium" className="ksp-heading" asChild={!!href}>
                {href ? (
                    <Link href={href} style={{ color: "inherit", textDecoration: "none" }}>
                        {heading}
                    </Link>
                ) : (
                    <>{heading}</>
                )}
            </Heading>
            <Flex direction="column" gap="3" align="start">
                <Text as={multiParagraph ? "div" : "p"} size="3">
                    {children}
                </Text>
                {href && buttonText && (
                    <ButtonLink variant="soft" size="2" color="solid" href={href} style={{ alignSelf: "start" }}>
                        {buttonText}
                    </ButtonLink>
                )}
            </Flex>
        </Grid>
    );
};

export const KeyServicePoints = ({ children }: { children: ReactNode }) => (
    <div className="key-service-points">{children}</div>
);
