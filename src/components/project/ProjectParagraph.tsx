import { Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface ProjectParagraphProps {
    children: ReactNode;
}

export const ProjectParagraph = ({ children }: ProjectParagraphProps) => {
    return (
        <Text size="3" asChild>
            <p>{children}</p>
        </Text>
    );
};
