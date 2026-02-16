import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button, Flex, Separator, Text, Theme } from "@radix-ui/themes";
import { type ReactNode, useRef, useState } from "react";
import { CopyEmailButton } from "./CopyEmailButton";

const DialogText = ({ children }: { children: ReactNode }) => (
    <Text as="p" size="3" style={{ lineHeight: "24px" }}>
        {children}
    </Text>
);

export function TemplateDialog() {
    const [messageCopied, setMessageCopied] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleCopyMessage = () => {
        if (contentRef.current) {
            // innerText preserves newlines based on layout styles
            navigator.clipboard.writeText(contentRef.current.innerText);
            setMessageCopied(true);
            setTimeout(() => setMessageCopied(false), 2000);
        }
    };

    return (
        <Dialog.Root>
            <Theme
                panelBackground="solid"
                hasBackground={false}
                accentColor="gray"
                grayColor="olive"
                radius="none"
            >
                <Dialog.Trigger asChild>
                    <Button
                        size="3"
                        mt="2"
                        variant="outline"
                        style={{ cursor: "pointer", alignSelf: "flex-start" }}
                    >
                        Copy this template
                    </Button>
                </Dialog.Trigger>
            </Theme>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                    <Theme
                        panelBackground="solid"
                        hasBackground={false}
                        accentColor="orange"
                        grayColor="olive"
                        radius="none"
                    >
                        <Flex
                            direction="column"
                            justify="between"
                            height="100%"
                            gap="var(--space-10)"
                            p={{ initial: "4", sm: "6" }}
                            style={{ backgroundColor: "var(--color-background)" }}
                        >
                            <Flex
                                direction="column"
                                className="dialog-message-content"
                                gap="4"
                                pt="6"
                                ref={contentRef}
                            >
                                <DialogText>
                                    Hi, I’m <Text weight="bold">Carla</Text> and I'm a{" "}
                                    <Text weight="bold">Marketing Director</Text> at{" "}
                                    <Text weight="bold">Company</Text>. I found you through{" "}
                                    <Text weight="bold">place, person, or thing</Text>, and love
                                    the work you did on{" "}
                                    <Text weight="bold">your favourite project</Text>.
                                </DialogText>
                                <DialogText>
                                    I'd love to hire you to help us with{" "}
                                    <Text weight="bold">project</Text> so we can{" "}
                                    <Text weight="bold">business goal</Text>. Our timeline looks
                                    like <Text weight="bold">dates</Text> and we'd like to keep
                                    the price about{" "}
                                    <Text weight="bold">
                                        $3k (with room up to $8k if we can make a solid business
                                        case for it)
                                    </Text>
                                    .
                                </DialogText>
                                <DialogText>
                                    Full disclosure: I'm talking with a few other agencies like{" "}
                                    <Text weight="bold">these folks</Text>.
                                </DialogText>
                                <DialogText>
                                    Let's set up a time to talk shop. How does{" "}
                                    <Text weight="bold">next week</Text> look for you?
                                </DialogText>
                                <DialogText>Thanks!</DialogText>

                                <Separator size="4" my="4" color="gray" />
                            </Flex>

                            <Flex justify="end" gap="3">
                                <Button
                                    variant="solid"
                                    highContrast
                                    onClick={handleCopyMessage}
                                    style={{ cursor: "pointer" }}
                                >
                                    {messageCopied ? <em>Copied!</em> : "Copy this message"}
                                </Button>
                                <CopyEmailButton variant="soft" highContrast>
                                    Copy my email
                                </CopyEmailButton>
                            </Flex>
                        </Flex>
                    </Theme>

                    <Dialog.Close asChild>
                        <Button
                            className="DialogClose"
                            aria-label="Close"
                            style={{ cursor: "pointer" }}
                        >
                            <Cross1Icon />
                        </Button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
