import { Grid, Box, Heading, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface InnerSectionProps {
    title?: string;
    header?: ReactNode;
    showCounter?: boolean;
    sectionId?: string;
    children?: ReactNode;
    headerBottomOnMobile?: boolean;
}

export function InnerSection({
    title,
    header,
    showCounter = true,
    sectionId,
    children,
    headerBottomOnMobile = false
}: InnerSectionProps) {
    const headerContent = header ?? (
        <Heading
            size={{ initial: "6", sm: "3" }}
            weight="medium"
            as="h2"
            highContrast
        >
            {showCounter && (
                <Text as="span" className="section-counter-number" />
            )}
            {title}
        </Heading>
    );

    return (
        <Grid
            asChild
            gapY="8"
            style={{ gridColumn: "1 / -1", gridTemplateColumns: "subgrid" }}
        >
            <section id={sectionId}>
                {/* Section Header - top position (hidden on mobile if headerBottomOnMobile) */}
                <Box
                    className="section-header"
                    display={headerBottomOnMobile ? { initial: "none", sm: "block" } : "block"}
                >
                    {headerContent}
                </Box>

                {/* Section Content */}
                {children}

                {/* Section Header - bottom position (only on mobile when headerBottomOnMobile) */}
                {headerBottomOnMobile && (
                    <Box
                        className="section-header"
                        display={{ initial: "block", sm: "none" }}
                    >
                        {headerContent}
                    </Box>
                )}
            </section>
        </Grid>
    );
}
