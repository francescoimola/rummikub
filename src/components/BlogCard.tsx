import { Card, Flex, AspectRatio, Text, Badge, Heading } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { ImageMetadata } from "astro";

interface BlogCardBaseProps {
    title: string;
    excerpt: string;
    href: string;
}

interface BlogCardFullProps extends BlogCardBaseProps {
    variant?: "full";
    tags: string[];
    coverImage: ImageMetadata;
}

interface BlogCardCompactProps extends BlogCardBaseProps {
    variant: "compact";
    tags?: never;
    coverImage?: never;
}

type BlogCardProps = BlogCardFullProps | BlogCardCompactProps;

export function BlogCard({
    title,
    excerpt,
    tags,
    coverImage,
    href,
    variant = "full",
}: BlogCardProps) {
    if (variant === "compact") {
        return (
            <a href={href} className="blog-card" style={{ textDecoration: "none", color: "inherit" }}>
                <Card
                    variant="ghost"
                    size="3"
                    style={{ margin: "unset", background: "transparent" }}
                >
                    <Flex justify="between" align="center" gap="8">
                        <Flex direction="column" gap="2">
                            <Heading as="h3" size="3" weight="medium" highContrast>
                                {title}
                            </Heading>
                            <Text
                                size="3"
                                color="gray"
                                className="project-desc-clip"
                            >
                                {excerpt}
                            </Text>
                        </Flex>
                        <ArrowRightIcon width="18" height="18" style={{ flexShrink: 0 }} />
                    </Flex>
                </Card>
            </a>
        );
    }

    const img = coverImage!;
    const cardTags = tags!;

    return (
        <a href={href} className="blog-card" style={{ textDecoration: "none", color: "inherit" }}>
            <Card
                variant="ghost"
                size="3"
                style={{ margin: "unset", background: "transparent" }}
            >
                <Flex direction="column" gap="5">
                    <AspectRatio ratio={16 / 9}>
                        <img
                            src={img.src}
                            alt={title}
                            width={img.width}
                            height={img.height}
                            style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </AspectRatio>
                    <Flex direction="column" gap="8">
                        <Flex direction="column" gap="2">
                            <Heading as="h3" size="3" weight="medium" highContrast>
                                {title}
                            </Heading>
                            <Text
                                size="3"
                                color="gray"
                                className="project-desc-clip"
                            >
                                {excerpt}
                            </Text>
                        </Flex>
                        <Flex justify="between" align="center">
                            <Flex gap="2">
                                {cardTags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        color="gray"
                                        size={{ initial: "2", sm: "3" }}
                                        radius="none"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </Flex>
                            <ArrowRightIcon width="18" height="18" />
                        </Flex>
                    </Flex>
                </Flex>
            </Card>
        </a>
    );
}
