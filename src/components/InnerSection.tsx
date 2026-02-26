import { Grid, Box, Heading, Text } from "@radix-ui/themes";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface InnerSectionProps {
    title?: string;
    header?: ReactNode;
    showCounter?: boolean;
    sectionId?: string;
    children?: ReactNode;
    animate?: boolean;
}

export function InnerSection({
    title,
    header,
    showCounter = true,
    sectionId,
    children,
    animate = false,
}: InnerSectionProps) {
    const content = (
        <Grid
            asChild
            gapY="8"
            style={{ gridColumn: "1 / -1", gridTemplateColumns: "subgrid" }}
        >
            <section id={sectionId}>
                <Box className="section-header" my={{ initial: "8", sm: "4", md: "0" }}>
                    {header ?? (
                        <Heading
                            size={{ initial: "8", sm: "6", md: "3" }}
                            align={{ initial: "center", sm: "left" }}
                            weight="medium"
                            as="h2"
                            highContrast
                        >
                            {showCounter && (
                                <Text
                                    as="span"
                                    className="section-counter-number"
                                />
                            )}
                            {title}
                        </Heading>
                    )}
                </Box>
                {children}
            </section>
        </Grid>
    );

    if (!animate) return content;

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
                gridColumn: "1 / -1",
                display: "grid",
                gridTemplateColumns: "subgrid",
            }}
        >
            {content}
        </motion.div>
    );
}
