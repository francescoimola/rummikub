import * as Accordion from "@radix-ui/react-accordion";
import { Flex, Text, Box } from "@radix-ui/themes";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

import type { ComponentProps, ReactNode, PropsWithChildren } from "react";

import { useState } from "react";
import { ButtonLink } from "./ButtonLink";

type FlexProps = ComponentProps<typeof Flex>;
type TextProps = ComponentProps<typeof Text>;

interface FAQItem {
    question: string;
    answer: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Variant content                                                    */
/* ------------------------------------------------------------------ */

const webdesignItems: FAQItem[] = [
    {
        question: "How long does a project take?",
        answer: "Most website projects take 4-10 weeks depending on scope. I work in phases so you can see progress early and provide feedback as we go. We'll establish a timeline together before we start.",
    },
    {
        question: "How are design and copy decisions made?",
        answer: (
            <>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    Client input is extremely important, and I will always listen to your feedback. I tend to say "yes" a lot, but sometimes I have to push back on feedback that will hurt the end result, and I'll always explain why.
                </Text>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    When it comes to the craft itself, the final say on design and copy sits with me. Because you're paying me to solve a business problem, and because both our brands are on the line.
                </Text>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    If you do have something specific in mind, and you'd rather brief someone to build exactly that, it's a fair way to work. It's just not what I do.
                </Text>
            </>
        ),
    },
    {
        question: "Can you help with SEO?",
        answer: (
            <>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    I always ensure that the websites I build are SEO-friendly.
                    This means they have the right structure, load quickly and
                    get Lighthouse scores of 90+ (for SEO), as well as allowing
                    the content displayed in search results to be customised.
                </Text>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    As part of any website project, you can upgrade to receive a
                    detailed SEO analysis of your competitors' websites. This
                    involves looking at over 10 years of data to find tactics and
                    content ideas worth copying, and it includes a plan to help
                    you implement any changes that are needed.
                </Text>
            </>
        ),
    },
    {
        question: "Do you offer consultations?",
        answer: (
            <>
                <Flex direction="column" gap="3">
                    <Text size="3" as="p" color="gray" wrap="pretty">
                        If you know what's broken and need validation, or if you
                        sense something isn't working, but don't know what
                        exactly, it's worth chatting about it.
                    </Text>
                    <Text size="3" as="p" color="gray" wrap="pretty">
                        A consultation gives you clarity on what's wrong and a handful of specific and practical
                        solutions that you can implement right away. No more
                        guessing.
                    </Text>
                    <ButtonLink variant="solid" color="gray" href="/consultations" mt="2" style={{ alignSelf: "start" }}>
                        Learn more about consultations
                    </ButtonLink>
                </Flex>
            </>
        ),
    },
    {
        question: "Are meetings free?",
        answer: "If you need specific help with generating ideas or finding a solution to a problem you're having, this will be a chargeable consultation (unless this meeting was already quoted as part of your project). A consultation won't simply be an informal chat: it's a call I'll do some preparation for, so I can provide you with valuable ideas and options that will help you move forward.",
    },
    {
        question: "Do you offer concessions?",
        answer: (
            <>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    I understand project fees can be a lot to take in. But rest
                    assured, the work I do is always carried out to strengthen
                    your business and generate long-term returns. This means the
                    result should make you money rather than cost you money, and
                    will typically pay for itself.
                </Text>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    I'm always open to discussing options and finding a pricing
                    structure that fits, especially for businesses with tighter
                    budgets. And if you're struggling financially, I'm happy to
                    chat about payment plans. The discounts I offer to everyone
                    (these cannot be combined):
                </Text>
                <Flex direction="column" gap="2" asChild>
                    <ul>
                        <Text size="3" color="gray" asChild><li>
                            3 easy instalments at 0% interest for all
                            invoices over £500
                        </li></Text>
                        <Text size="3" color="gray" asChild><li>
                            6 instalments at 0% interest for all invoices
                            over £3k
                        </li></Text>
                        <Text size="3" color="gray" asChild><li>
                            10% discount for paying your invoice in full
                            before the work starts.
                        </li></Text>
                    </ul>
                </Flex>
            </>
        ),
    },
    {
        question: "Can we meet in person?",
        answer: "Why not! I'm always up for meeting clients face to face when our schedules coincide. I'm based in Folkestone, Kent, so you'll need to be able to get here.",
    },
];

const consultationsItems: FAQItem[] = [
    {
        question: "Will it be a long process?",
        answer: "No, this is a pretty straightforward website health check for busy people who want answers quickly. There is no admin beside the actual meeting. I just need 5 minutes of your time to complete a short questionnaire which I'll send to you immediately after booking.",
    },
    {
        question: "How thorough is the website review?",
        answer: "The website review is thorough but not exhaustive. Before the session, I will spend up to 4 hours auditing your website to get a rounded idea of what it is doing well and what needs work. I will focus my review on the area you told me you're struggling with the most (e.g. SEO, UX, UI, or something else).",
    },
    {
        question: "Can we record the session?",
        answer: "Of course. Sessions can be recorded so you can watch them back or share them with a colleague. You can also opt to receive a transcript of our conversation, and a summary of all my findings (delivered within 3-5 business days).",
    },
    {
        question: "Do you guarantee results?",
        answer: "I can't promise results, but I can promise to do my absolute best to help you improve your website based on my experience and the research I'll do. You should be wary of anyone who claims guaranteed results because every situation is different and running a business is not a science.",
    },
    {
        question: "What if I need to cancel?",
        answer: "Life happens. You can cancel free of charge up to 72 hours before the session. After that, no refunds are available, as I'll have already invested time reviewing your website. If you need to reschedule with less than 24 hours notice, I'll be happy to find another time.",
    },
    {
        question: "What's the difference between a free intro and a consultation?",
        answer: "Where you see \u201cfree intro\u201d mentioned on this page, that's a 15/30-min conversation to see if we're a good fit. I won't offer any advice, it's just a chat. The consultation, on the other hand, is a service and it's where the real work happens. Consultations include a mini website review, a 1:1 session, and a targeted action plan.",
    },
];

const aboutItems: FAQItem[] = [
    {
        question: "What's your approach to design?",
        answer: (
            <>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    Without going into too much detail and risking getting
                    bogged down in aesthetic debates, design-wise I follow a few core
                    principles:
                </Text>
                <Flex direction="column" gap="2" asChild>
                    <ul>
                        <Text size="3" color="gray" asChild><li>Good design is opinionated</li></Text>
                        <Text size="3" color="gray" asChild><li>Good design is choosing the right compromise for your audience.</li></Text>
                        <Text size="3" color="gray" asChild><li>Know how to bend the process in your favor. Skip steps when you deem them unnecessary. Backtrack when you're unsatisfied. Maybe start from the solution first, or operate on intuition, or make something just for the sake of making people smile.</li></Text>
                        <Text size="3" color="gray" asChild><li>Only consider decorations when they serve a purpose</li></Text>
                        <Text size="3" color="gray" asChild><li>Good design is harder to spot than poor design</li></Text>
                        <Text size="3" color="gray" asChild><li>You'll know when you nailed it</li></Text>
                    </ul>
                </Flex>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    Most of my work, generally speaking, is focused on the last three principles. I like to make sure that the interfaces and experiences I design don't get in the way of what they're trying to communicate. Of course, it's a different ball game when it comes to
                    advertising, where attention = money. Nevertheless, I’m
                    pretty good at staying on brief, and when grit, character
                    and oomph are required, I can deliver.
                </Text>
            </>
        ),
    },
    {
        question: "How do you think about marketing?",
        answer: "The kind of marketing I admire and recommend is the kind that's an integral part of the product or service right from the start. Not an afterthought. Not bolted on at the end. I enjoy working on projects where this long-established practice isn’t simply called upon when it’s time to “promote”, but is used to also help shape what’s being offered and connect it with the right audience.",
    },
    {
        question: "What's your background?",
        answer: (
            <>
                <Text size="3" as="p" color="gray" wrap="pretty">
                    I came to do what I do from a wobbly trajectory that let me dip my toes into many a role, from working in hospitality to curating exhibitions, running social media campaigns, and many more things that make my CV hard to keep updated.
                </Text>
                <ButtonLink variant="solid" color="gray" href="https://www.linkedin.com/in/francesco-imola/" target="_blank" rel="noopener noreferrer" mt="2" style={{ alignSelf: "start" }}>
                    Follow me on Linkedin
                </ButtonLink>
            </>
        ),
    },
];

const variantMap = {
    websites: webdesignItems,
    consultations: consultationsItems,
    about: aboutItems,
} as const;

type Variant = keyof typeof variantMap;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type FAQVariantProps = {
    variant: Variant;
    title?: never;
    children?: never;
};

type FAQSectionProps = PropsWithChildren<{
    variant?: never;
    title: string;
}>;

type FAQProps = (FAQVariantProps | FAQSectionProps) & {
    py?: FlexProps["py"];
    weight?: TextProps["weight"];
    activeWeight?: TextProps["weight"];
};

export default function FAQ({
    variant,
    title,
    children,
    py = "6",
    weight = "medium",
    activeWeight = "medium",
}: FAQProps) {
    const [openItem, setOpenItem] = useState<string | undefined>();

    /* ------ Single-section mode (replaces AccordionSection) ------ */
    if (title && children) {
        return (
            <Accordion.Root type="single" collapsible>
                <Accordion.Item
                    value="content"
                    style={{ borderTop: "thin solid var(--gray-a6)" }}
                >
                    <Accordion.Header style={{ margin: 0 }} asChild>
                        <h3>
                            <Accordion.Trigger className="AccordionTrigger">
                                <Flex
                                    justify="between"
                                    align="center"
                                    py={py}
                                    gap="4"
                                >
                                    <Text
                                        size="3"
                                        weight={weight}
                                        highContrast
                                    >
                                        {title}
                                    </Text>
                                    <Text color="gray">
                                        <PlusIcon
                                            className="AccordionIconPlus"
                                            width="18"
                                            height="18"
                                        />
                                        <MinusIcon
                                            className="AccordionIconMinus"
                                            width="18"
                                            height="18"
                                        />
                                    </Text>
                                </Flex>
                            </Accordion.Trigger>
                        </h3>
                    </Accordion.Header>
                    <Accordion.Content className="AccordionContent">
                        <Box pb="6">{children}</Box>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
        );
    }

    /* ------ Variant mode (FAQ list) ------ */
    if (!variant) return null;
    const items = variantMap[variant];

    return (
        <Accordion.Root
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
        >
            {items.map((item, index) => {
                const value = `item-${index}`;
                const isOpen = openItem === value;
                return (
                    <Accordion.Item
                        key={index}
                        value={value}
                        style={{
                            margin: 0,
                            borderTop:
                                index === 0
                                    ? undefined
                                    : "thin solid var(--gray-a6)",
                        }}
                    >
                        <Accordion.Header style={{ margin: 0 }}>
                            <Accordion.Trigger className="AccordionTrigger">
                                <Flex
                                    justify="between"
                                    align="center"
                                    pb={py}
                                    gap="4"
                                    pt={index === 0 ? undefined : py}
                                >
                                    <Text
                                        className="AccordionQuestion"
                                        size="3"
                                        weight={
                                            isOpen ? activeWeight : weight
                                        }
                                        highContrast
                                    >
                                        {item.question}
                                    </Text>
                                    <Text color="gray">
                                        <PlusIcon
                                            className="AccordionIconPlus"
                                            width="18"
                                            height="18"
                                        />
                                        <MinusIcon
                                            className="AccordionIconMinus"
                                            width="18"
                                            height="18"
                                        />
                                    </Text>
                                </Flex>
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="AccordionContent">
                            <Box pb="6" pr="8" m="0">
                                {typeof item.answer === "string" ? (
                                    <Text
                                        size="3"
                                        as="p"
                                        color="gray"
                                        wrap="pretty"
                                    >
                                        {item.answer}
                                    </Text>
                                ) : (
                                    <Flex direction="column" gap="3">
                                        {item.answer}
                                    </Flex>
                                )}
                            </Box>
                        </Accordion.Content>
                    </Accordion.Item>
                );
            })}
        </Accordion.Root>
    );
}
