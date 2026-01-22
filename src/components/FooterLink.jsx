import { Link } from "@radix-ui/themes";

export const FooterLink = ({ href, children }) => {
    return (
        <Link href={href} color="gray" size="3" highContrast={false}>
            {children}
        </Link>
    );
};
