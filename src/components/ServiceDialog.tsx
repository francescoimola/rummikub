import * as Dialog from "@radix-ui/react-dialog";
import { ArrowTopRightIcon, Cross1Icon } from "@radix-ui/react-icons";
import { type ReactNode } from "react";
import { ServiceCard } from "./ServiceCard";
import { Theme, Flex, Heading, Text, Grid, Card } from "@radix-ui/themes";
import { ButtonLink } from "./ButtonLink";
import "../styles/global.css";

type ServiceType = "content-writing" | "email-marketing";

interface ServiceData {
    title: string;
    slug: string;
    descriptionP1: string;
    descriptionP2?: string;
    descriptionP3?: string;
    options: {
        title: string;
        description: string;
        link: string;
        smallPrint?: string;
        buttonText: string;
    }[];
}

const SERVICE_CONTENT: Record<ServiceType, ServiceData> = {
    "content-writing": {
        title: "Content writing",
        slug: "/contentwriting",
        descriptionP1: "Your website reads fine. And no one’s complained about your content.",
        descriptionP2: "Why pay extra for... better writing?",
        descriptionP3: "I can’t put a price on words so spot on they’ll make your people think, “you know what, they get it!”. But treating copy as an afterthought? Does hardly anything.",
        options: [
            {
                title: "I only need words",
                description: "For those who need unmistakable words or copy-editing. Think creating landing pages, unf*cking AI-generated content or structuring blog posts. You're in good hands.",
                link: "https://cal.com/francescoimola/intro?description=website-copy",
                smallPrint: "Share your brief",
                buttonText: "Let's chat"
            },
            {
                title: "I also need a website",
                description: "Need a website to go with your copy? Content writing (aka UX writing) is included in my website packages. And if you need more than that, like ongoing SEO content, we can make it happen.",
                link: "https://cal.com/francescoimola/intro?description=blog-posts",
                smallPrint: "Free 30-min intro call",
                buttonText: "Schedule a call to discuss"
            }
        ]
    },
    "email-marketing": {
        title: "Email marketing",
        slug: "/emailmarketing",
        descriptionP1: "People don’t hate emails. They hate bad emails.",
        descriptionP2: "I’ve helped B2B agencies and brick-and-mortar shops push their open and click rates way up by cutting the corporate tone, sticking with the basics, and keeping it consistent.",
        descriptionP3: "If email’s never worked for you, that’s usually why. And I say it's worth another go.",
        options: [
            {
                title: "I need ad-hoc email marketing",
                description: "Ideal for those looking to set up an automated welcome campaign, design a custom template or sort out their neglected list.",
                link: "/about#contact",
                buttonText: "Share your brief",
                smallPrint: "Get a quote",
            },
            {
                title: "I need a website too",
                description: "I can add an email starter package or a custom email campaign to any website project. Let's scope it together.",
                link: "https://cal.com/francescoimola/intro?description=automations",
                buttonText: "Book a free intro",
                smallPrint: "Schedule a 30-min call to discuss",
            }
        ]
    }
};

interface ServiceDialogProps {
    type: ServiceType;
    cardIcon?: ReactNode;
}

export function ServiceDialog({ type, cardIcon }: ServiceDialogProps) {
    const content = SERVICE_CONTENT[type];

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <ServiceCard
                    title={content.title}
                    icon={cardIcon}
                    data-slug={content.slug}
                />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />

                <Dialog.Content className="DialogContent">

                    <Theme
                        accentColor="yellow"
                        grayColor="olive"
                        radius="none"
                        panelBackground="solid"
                        scaling="97%"
                    >
                        <Flex direction="column" justify="between" height="100%" gap="var(--space-10)" p={{ initial: "4", sm: "6" }}>
                            <Flex direction="column" gap="6">
                                <Heading
                                    size="6"
                                    as="h3"
                                    highContrast
                                >
                                    {content.title}
                                </Heading>
                                <Flex direction="column" gap="4">
                                    <Text
                                        size="3"
                                        as="p"
                                    >
                                        {content.descriptionP1}
                                    </Text>
                                    {content.descriptionP2 && <Text
                                        size="3"
                                        as="p"
                                    >
                                        {content.descriptionP2}
                                    </Text>}
                                    {content.descriptionP3 && <Text
                                        size="3"
                                        as="p"
                                    >
                                        {content.descriptionP3}
                                    </Text>}
                                </Flex>
                            </Flex>

                            <Flex direction="column" gap="4">
                                <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                                    {content.options.map((option, index) => (
                                        <Card key={index} variant="surface">
                                            <Flex direction="column" gap="var(--space-10)" p="3" height="100%" justify="between" align="start">
                                                <Flex direction="column" gap="4">
                                                    <Heading size="3">{option.title}</Heading>
                                                    <Text size="2" color="gray" as="p" style={{ textWrap: "balance" }}>
                                                        {option.description}
                                                    </Text>
                                                </Flex>
                                                <Flex direction="column" align="center" gap="2" width="100%">
                                                    <ButtonLink
                                                        href={option.link}
                                                        size="2"
                                                        highContrast
                                                        variant="solid"
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {option.buttonText || "Get Started"} {index === 1 && (<ArrowTopRightIcon />)}
                                                    </ButtonLink>
                                                    <Text size="1" color="gray" >
                                                        {option.smallPrint}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    ))}
                                </Grid>
                            </Flex>
                        </Flex>
                    </Theme>

                    <Dialog.Close asChild >
                        <button className="DialogClose" aria-label="Close">
                            <Cross1Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root >
    );
}
