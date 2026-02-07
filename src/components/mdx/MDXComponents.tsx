import { Heading, Text, Link, Blockquote, Box, Separator, Table } from "@radix-ui/themes";


export const CommonMDXComponents = {
    h1: (props: any) => (
        <Heading size="9" weight="bold" mt="8" mb="4" highContrast {...props} />
    ),
    h2: (props: any) => (
        <Heading as="h2" size="6" weight="medium" mt="6" mb="5" highContrast {...props} />
    ),
    h3: (props: any) => (
        <Heading as="h3" size="4" weight="medium" my="5" {...props} />
    ),
    h4: (props: any) => (
        <Heading as="h4" size="4" weight="medium" color="gray" my="5" {...props} />
    ),
    p: (props: any) => <Text as="p" size="3" mb="4" wrap="pretty" {...props} />,
    a: ({ href, children, ...props }: any) => {
        const isExternal = href?.startsWith("http");
        return (
            <Link
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                {...props}
            >
                {children}
            </Link>
        );
    },
    blockquote: (props: any) => (
        <Blockquote size="4" my="6" color="gray" {...props} />
    ),
    ul: (props: any) => (
        <Box as="ul" style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }} {...props} />
    ),
    ol: (props: any) => (
        <Box as="ol" style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }} {...props} />
    ),
    li: (props: any) => (
        <li style={{ marginBottom: "var(--space-2)" }}>
            <Text size="3" {...props} />
        </li>
    ),
    table: (props: any) => <Table.Root className="mdx-table" size="2" variant="ghost" mt="4" {...props} />,
    thead: (props: any) => <Table.Header {...props} />,
    tbody: (props: any) => <Table.Body {...props} />,
    tr: (props: any) => <Table.Row {...props} />,
    th: (props: any) => <Table.ColumnHeaderCell {...props} />,
    td: (props: any) => <Table.Cell {...props} />,
    hr: (props: any) => <Separator size="4" mt="5" mb="6" {...props} />,
    Separator,
};
