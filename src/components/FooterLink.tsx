import { Link } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface FooterLinkProps {
    href: string;
    children: ReactNode;
}

export const FooterLink = ({ href, children }: FooterLinkProps) => {
    return (
        <Link href={href} color="gray" size="3" highContrast={false}>
            {children}
        </Link>
    );
};
