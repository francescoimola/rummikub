import { useState, useRef } from "react";
import { Flex, Box, TextField, Theme, Button, Text, Card } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { actions } from "astro:actions";
import { CopyEmailButton } from "./CopyEmailButton";

type FormState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success" }
    | { status: "error"; errorType: "validation" | "system"; message: string };

interface NewsletterFormProps {
    showPrivacyText?: boolean;
    textAlign?: "left" | "center" | "right";
    align?: "start" | "center" | "end" | "stretch" | "baseline";
}

export const NewsletterForm = ({
    showPrivacyText = true,
    textAlign = "left",
    align = "start",
}: NewsletterFormProps) => {
    const [formState, setFormState] = useState<FormState>({ status: "idle" });
    const [email, setEmail] = useState("");
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Client-side validation
        if (!email || !email.includes("@")) {
            setFormState({
                status: "error",
                errorType: "validation",
                message: "Please enter a valid email address",
            });
            return;
        }

        if (!turnstileToken) {
            setFormState({
                status: "error",
                errorType: "system",
                message: "Verification not complete. Please wait a moment and try again.",
            });
            return;
        }

        setFormState({ status: "loading" });

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("turnstileToken", turnstileToken);

            const result = await actions.subscribeNewsletter(formData);

            if (result.error) {
                const isValidationError = result.error.code === "BAD_REQUEST";
                setFormState({
                    status: "error",
                    errorType: isValidationError ? "validation" : "system",
                    message: result.error.message || "Something went wrong",
                });
                turnstileRef.current?.reset();
                return;
            }

            setFormState({ status: "success" });
        } catch (error) {
            setFormState({
                status: "error",
                errorType: "system",
                message: "A glitch in the matrix occurred. Please try again.",
            });
            turnstileRef.current?.reset();
        }
    };

    // Success state - hide form entirely
    if (formState.status === "success") {
        return (
            <Flex direction="column" align={align} gap="2">
                <Text size="3" weight="medium" highContrast>
                    You're in! Thanks for subscribing.
                </Text>
                <Text size="2" color="gray">
                    Check your inbox for a confirmation email.
                </Text>
            </Flex>
        );
    }

    const isLoading = formState.status === "loading";
    const hasError = formState.status === "error";
    const isValidationError = hasError && formState.errorType === "validation";
    const isSystemError = hasError && formState.errorType === "system";

    return (
        <Flex direction="column" justify="center" align={align} gap="4">
            <Form.Root onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Flex direction="column" gap="2" width="100%">
                    <Flex gap="2" align="start" width="100%">
                        <Form.Field name="email" asChild>
                            <Box flexGrow="1" asChild>
                                <Form.Control asChild>
                                    <TextField.Root
                                        placeholder="Your email"
                                        size="3"
                                        variant="surface"
                                        radius="none"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (isValidationError) {
                                                setFormState({ status: "idle" });
                                            }
                                        }}
                                        disabled={isLoading}
                                        style={{
                                            padding: 0,
                                            minHeight: "auto",
                                            border: "none",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                </Form.Control>
                            </Box>
                        </Form.Field>
                        <Form.Submit asChild>
                            <Theme
                                appearance="light"
                                accentColor="yellow"
                                radius="none"
                                hasBackground={true}
                                asChild
                            >
                                <Button
                                    size="3"
                                    variant="solid"
                                    disabled={isLoading}
                                    style={{
                                        color: "var(--accent-a12)",
                                        backgroundColor: "var(--accent-3)",
                                    }}
                                    highContrast
                                >
                                    {isLoading ? "Subscribing..." : "Subscribe"}
                                </Button>
                            </Theme>
                        </Form.Submit>
                    </Flex>

                    {/* Validation error - inline */}
                    {isValidationError && (
                        <Text color="red" size="2">
                            {formState.message}
                        </Text>
                    )}

                    {/* System error - friendly message with fallback */}
                    {isSystemError && (
                        <Card variant="ghost" size="2" mt="2" style={{ margin: "unset", backgroundColor: "var(--gray-a3)" }}>
                            <Flex direction="column" justify="center" gap="4" wrap="wrap">
                                <Text color="red" size="2" trim="end" weight="medium">
                                    {formState.message}
                                </Text>
                                <Text size="2" color="gray" trim="both">
                                    Having trouble? I want to fix that. Could you drop me a message? {" "}
                                    <CopyEmailButton
                                        variant="surface"
                                        size="1"
                                        ml="2"
                                        style={{ display: "inline-flex" }}
                                    />
                                </Text>
                            </Flex>
                        </Card>
                    )}

                    {/* Turnstile widget - invisible */}
                    <Turnstile
                        ref={turnstileRef}
                        siteKey="0x4AAAAAACYaP-Z4M6Y6c2WR"
                        options={{
                            size: "invisible",
                            theme: "auto",
                        }}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => {
                            setFormState({
                                status: "error",
                                errorType: "system",
                                message: "Verification failed. Please refresh and try again.",
                            });
                        }}
                        onExpire={() => setTurnstileToken(null)}
                    />
                </Flex>
            </Form.Root>

            {showPrivacyText && (
                <Text size="2" as="p" color="gray" align={textAlign}>
                    You agree to receive updates and consent to our Privacy Policy.
                </Text>
            )}
        </Flex>
    );
};

export default NewsletterForm;
