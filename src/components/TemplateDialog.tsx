import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Theme, Flex, Text, Button } from "@radix-ui/themes";
import { CopyEmailButton } from "./CopyEmailButton";
import "../styles/global.css";
import { useState } from "react";

export function TemplateDialog() {
    const [messageCopied, setMessageCopied] = useState(false);

    const handleCopyMessage = () => {
        const text = `Hi, I’m Carla and I'm a Marketing Director at Company. I found you through place, person, or thing, and love the work you did on your favourite project.

I'd love to hire you to help us with project so we can business goal. Our timeline looks like dates and we'd like to keep the price about $3k (with room up to $8k if we can make a solid business case for it).

Full disclosure: I'm talking with a few other agencies like these folks.

Let's set up a time to talk shop. How does next week look for you?

Thanks!`;
        navigator.clipboard.writeText(text);
        setMessageCopied(true);
        setTimeout(() => setMessageCopied(false), 2000);
    };

    return (

        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Theme
                    panelBackground="solid"
                    scaling="97%"
                    hasBackground={false}
                    accentColor="gray"
                    radius="none"
                >
                    <Button size="3" mt="2" variant="outline" style={{ cursor: 'pointer', width: 'fit-content' }}>
                        Copy this template
                    </Button>
                </Theme>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Theme
                        panelBackground="solid"
                        scaling="97%"
                        hasBackground={false}
                        accentColor="orange"
                        radius="none"
                    >
                        <Flex direction="column" justify="between" height="100%" gap="var(--space-10)" p={{ initial: "4", sm: "6" }} style={{ backgroundColor: "var(--color-background)" }}>
                            <Flex direction="column" className="dialog-message-content" gap="4" pt="6">
                                <Text size="3" style={{ lineHeight: "24px", color: "var(--gray-12)" }}>
                                    Hi, I’m <Text weight="bold">Carla</Text> and I'm a <Text weight="bold">Marketing Director</Text> at <Text weight="bold">Company</Text>. I found you through <Text weight="bold">place, person, or thing</Text>, and love the work you did on <Text weight="bold">your favourite project</Text>.
                                </Text>
                                <Text size="3" style={{ lineHeight: "24px", color: "var(--gray-12)" }}>
                                    I'd love to hire you to help us with <Text weight="bold">project</Text> so we can <Text weight="bold">business goal</Text>. Our timeline looks like <Text weight="bold">dates</Text> and we'd like to keep the price about <Text weight="bold">$3k (with room up to $8k if we can make a solid business case for it)</Text>.
                                </Text>
                                <Text size="3" style={{ lineHeight: "24px", color: "var(--gray-12)" }}>
                                    Full disclosure: I'm talking with a few other agencies like <Text weight="bold">these folks</Text>.
                                </Text>
                                <Text size="3" style={{ lineHeight: "24px", color: "var(--gray-12)" }}>
                                    Let's set up a time to talk shop. How does <Text weight="bold">next week</Text> look for you?
                                </Text>
                                <Text size="3" style={{ lineHeight: "24px", color: "var(--gray-12)" }}>
                                    Thanks!
                                </Text>

                                <div style={{ borderBottom: "1px solid var(--gray-a6)", width: "100%", marginTop: "var(--space-4)" }} />
                            </Flex>

                            <Flex justify="end" gap="3">
                                <Button variant="solid" highContrast onClick={handleCopyMessage}>
                                    {messageCopied ? <em>Copied!</em> : "Copy this message"}
                                </Button>
                                <CopyEmailButton variant="soft" highContrast>
                                    Copy my email
                                </CopyEmailButton>
                            </Flex>
                        </Flex>
                    </Theme>

                    <Dialog.Close asChild>
                        <Button className="DialogClose" aria-label="Close">
                            <Cross1Icon />
                        </Button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
