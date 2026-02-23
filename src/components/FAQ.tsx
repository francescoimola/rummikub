import * as Accordion from "@radix-ui/react-accordion";
import { Flex, Text, Box, Link } from "@radix-ui/themes";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

import type { ComponentProps, ReactNode } from "react";

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
        question: "What if I need changes after launch?",
        answer: "I build sites that are easy to update and to maintain. You'll understand how everything works and be able to make changes yourself. But if you'd rather have me handle things, I offer ongoing support packages.",
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
        question: "Can you work with my existing team?",
        answer: "Absolutely. I usually take care of the full scope myself, but I'm happy to collaborate with your team if necessary.",
    },
    {
        question: "What if I'm worried about email overload?",
        answer: "I'm flexible about how to keep in touch during a project. If you're worried about missing emails, or maybe you flinch at the very thought of following up on something that was said four emails ago, I got you. I can set up private Slack and Trello boards for real-time progress and communication at no extra cost. And if email works for you, great!",
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
        answer: "Why not! I'm always up for meeting clients face to face. I'm based in Folkestone, South East England, so you'll need to be able to get here. I'm happy to meet anywhere nearby when our schedules coincide.",
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
        answer: "I try not to hide behind decorations. The question I ask myself is \"can this go undetected?\" If the answer is yes, it's likely the thing I'm designing — be it a strategy, website, event, or something else — is going to better fit the needs of the person experiencing it. Which is also why good design is harder to spot than bad design.",
    },
    {
        question: "What's your background?",
        answer: "I came to marketing and designfrom a wobbly trajectory that let me dip my toes into many a role, from working in hospitality to curating exhibitions, running social media campaigns, and many more things that make my CV hard to keep updated. In life, I'm as curious as I am practical. In work, I'm especially allergic to pretension.",
    },
    {
        question: "How do you think about marketing?",
        answer: "The marketing I love and recommend works best when it's part of the process from the very beginning, rather than bolted on at the end. I love working on projects where marketing can do more than just promote but also shape the thing it's selling and help it find its audience.",
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

interface FAQProps {
    variant: Variant;
    py?: FlexProps["py"];
    weight?: TextProps["weight"];
    activeWeight?: TextProps["weight"];
}

export default function FAQ({
    variant,
    py = "6",
    weight = "medium",
    activeWeight = "medium",
}: FAQProps) {
    const [openItem, setOpenItem] = useState<string | undefined>();
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
