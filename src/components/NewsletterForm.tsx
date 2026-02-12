import { useState, useRef } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { Flex, Box, TextField, Theme, Button, Text, Card, Link } from "@radix-ui/themes";
import { CopyEmailButton } from "./CopyEmailButton";
import { SITE_DATA, EXTERNAL_URLS } from "../constants";

interface NewsletterFormProps {
    showPrivacyText?: boolean;
    textAlign?: "left" | "center" | "right";
    align?: "start" | "center" | "end" | "stretch" | "baseline";
}

// Validation schema
const NewsletterSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
});

// Custom Radix TextField that works with Formik
const EmailField = ({ name, id }: { name: string; id?: string }) => {
    const [field] = useField(name);
    return (
        <TextField.Root
            {...field}
            id={id || name}
            placeholder="Your email"
            size="3"
            variant="surface"
            radius="none"
            type="email"
            autoComplete="email"
            aria-label="Email address for newsletter"
            style={{
                padding: 0,
                minHeight: "auto",
                border: "none",
                backgroundColor: "transparent",
            }}
        />
    );
};

export const NewsletterForm = ({
    showPrivacyText = true,
    textAlign = "left",
    align = "start",
}: NewsletterFormProps) => {
    const [submitStatus, setSubmitStatus] = useState<{
        success?: boolean;
        error?: string;
    }>({});

    // Timestamp for bot detection (set on mount)
    const mountTime = useRef(Date.now());

    const handleSubmit = async (
        values: { email: string; website: string },
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
    ) => {
        setSubmitStatus({});

        try {
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("website", values.website); // honeypot
            formData.append("timestamp", mountTime.current.toString());

            const response = await fetch("/api/newsletter", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus({ success: true });
                resetForm();
                // Reset mount time for next submission attempt
                mountTime.current = Date.now();
            } else {
                setSubmitStatus({ error: result.error || "Subscription failed. Please try again." });
            }
        } catch (error) {
            setSubmitStatus({ error: "Something went wrong. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Flex direction="column" justify="center" align={align} gap="4">
            <Formik
                initialValues={{ email: "", website: "" }}
                validationSchema={NewsletterSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form style={{ width: "100%" }}>
                        <Flex direction="column" gap="2" width="100%">
                            <Flex gap="2" align="start" width="100%">
                                <Box flexGrow="1">
                                    <EmailField name="email" id="newsletter-email" />
                                </Box>

                                {/* Honeypot field - invisible to humans, bots fill it */}
                                <input
                                    name="website"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    style={{
                                        position: "absolute",
                                        left: "-9999px",
                                        opacity: 0,
                                        pointerEvents: "none",
                                    }}
                                />

                                <Theme
                                    appearance="light"
                                    accentColor="yellow"
                                    grayColor="olive"
                                    radius="none"
                                    hasBackground={true}
                                    asChild
                                >
                                    <Button
                                        type="submit"
                                        size="3"
                                        variant="solid"
                                        disabled={isSubmitting}
                                        style={{
                                            color: "var(--accent-a12)",
                                            backgroundColor: "var(--accent-3)",
                                        }}
                                        highContrast
                                    >
                                        {isSubmitting ? "..." : "Subscribe"}
                                    </Button>
                                </Theme>
                            </Flex>

                            {/* Status messages with aria-live for screen reader announcements */}
                            <Box aria-live="polite" aria-atomic="true">
                                {/* Validation error */}
                                {errors.email && touched.email && (
                                    <Text color="red" size="2">
                                        {errors.email}
                                    </Text>
                                )}

                                {/* Success message */}
                                {submitStatus.success && (
                                    <Card variant="ghost" size="2" mt="2" style={{ margin: "unset", backgroundColor: "var(--gray-a3)" }}>
                                        <Text size="2" weight="bold" style={{ color: "var(--accent-12)" }}>
                                            Wonderful, you're in!
                                        </Text>
                                    </Card>
                                )}

                                {/* Server error */}
                                {submitStatus.error && (
                                    <Card variant="ghost" size="2" mt="2" style={{ margin: "unset", backgroundColor: "var(--gray-a3)" }}>
                                        <Flex direction="column" justify="center" gap="4" wrap="wrap">
                                            <Text color="red" size="2" trim="end" weight="medium">
                                                {submitStatus.error}
                                            </Text>
                                            <Text size="2" color="gray" trim="both">
                                                Having trouble? I want to fix that. Could you drop me a message?{" "}
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
                            </Box>
                        </Flex>
                    </Form>
                )}
            </Formik>

            {showPrivacyText && (
                <Text size="2" as="p" color="gray" align={textAlign}>
                    You agree to receive updates and consent to the <Link href={EXTERNAL_URLS.privacyNotice} target="_blank" rel="noopener noreferrer">Privacy Notice</Link>.
                </Text>
            )}
        </Flex>
    );
};

export default NewsletterForm;
