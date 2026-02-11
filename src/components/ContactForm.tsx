import * as Form from "@radix-ui/react-form";
import {
    Grid,
    Flex,
    Button,
    TextField,
    TextArea,
    Select,
    Text,
    Checkbox,
    Box,
    Theme,
    Card,
} from "@radix-ui/themes";
import { Link } from "@radix-ui/themes";

export const ContactForm = () => {
    return (
        <Theme
            accentColor="yellow"
            grayColor="olive"
            panelBackground="solid"
            radius="none"
            scaling="97%"
            hasBackground={false}
            asChild
        >
            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    service: "web-design",
                    roles: [] as string[],
                    message: "",
                    acceptedTerms: false,
                    botcheck: "", // honeypot
                }}
                validationSchema={ContactSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form style={{ marginTop: "var(--space-8)" }}>
                        <Grid columns={{ initial: "1", md: "2" }} gap="5">
                            {/* First Name */}
                            <Flex direction="column" gap="1">
                                <Text as="div" size="3" weight="medium" mb="1">
                                    First name
                                </Text>
                                <FormTextField name="firstName" required />
                                {errors.firstName && touched.firstName && (
                                    <Text color="red" size="1">{errors.firstName}</Text>
                                )}
                            </Flex>

                            {/* Last Name */}
                            <Flex direction="column" gap="1">
                                <Text as="div" size="3" weight="medium" mb="1">
                                    Last name <Text as="span" color="gray" weight="regular">(optional)</Text>
                                </Text>
                                <FormTextField name="lastName" />
                            </Flex>

                            {/* Email */}
                            <Flex direction="column" gap="1">
                                <Text as="div" size="3" weight="medium" mb="1">
                                    Email
                                </Text>
                                <FormTextField name="email" type="email" required />
                                {errors.email && touched.email && (
                                    <Text color="red" size="1">{errors.email}</Text>
                                )}
                            </Flex>

                            {/* Phone */}
                            <Flex direction="column" gap="1">
                                <Text as="div" size="3" weight="medium" mb="1">
                                    Phone number <Text as="span" color="gray" weight="regular">(optional)</Text>
                                </Text>
                                <FormTextField name="phone" type="tel" />
                            </Flex>

                            {/* Service Select */}
                            <Box gridColumn={{ initial: "1", sm: "span 2" }}>
                                <Flex direction="column" gap="1">
                                    <Text as="span" size="3" weight="medium">
                                        What can I help with?
                                    </Text>
                                    <FormSelect name="service" />
                                    {errors.service && touched.service && (
                                        <Text color="red" size="2">{errors.service}</Text>
                                    )}
                                </Flex>
                            </Box>

                            {/* Role Checkboxes */}
                            <Box gridColumn={{ initial: "1", sm: "span 2" }} mt="4">
                                <Text as="p" size="3" weight="medium" mb="3">
                                    Which best describes you?{" "}
                                    <Text as="span" color="gray" weight="regular">(optional)</Text>
                                </Text>
                                <RoleCheckboxes />
                            </Box>

                            {/* Message */}
                            <Box gridColumn={{ initial: "1", sm: "span 2" }} mt="2">
                                <Flex direction="column" gap="1">
                                    <Text as="div" size="3" weight="medium" mb="1">
                                        Message
                                    </Text>
                                    <FormTextArea name="message" />
                                    {errors.message && touched.message && (
                                        <Text color="red" size="2">{errors.message}</Text>
                                    )}
                                </Flex>
                            </Box>

                            {/* Terms Checkbox */}
                            <Box gridColumn={{ initial: "1", sm: "span 2" }} mt="2">
                                <TermsCheckbox />
                                {errors.acceptedTerms && touched.acceptedTerms && (
                                    <Text color="red" size="2" mt="1" asChild>
                                        <span>{errors.acceptedTerms}</span>
                                    </Text>
                                )}
                            </Box>

                            {/* Honeypot - hidden from humans */}
                            <Field
                                name="botcheck"
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

                            {/* Submit Button */}
                            <Box mt="4">
                                <Button
                                    type="submit"
                                    size="4"
                                    variant="surface"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Send"}
                                </Button>
                            </Box>

                            {/* Success Message */}
                            {submitStatus.success && (
                                <Box gridColumn={{ initial: "1", sm: "span 2" }}>
                                    <Card variant="ghost" size="2" style={{ backgroundColor: "var(--gray-a3)" }}>
                                        <Text size="2" weight="bold" style={{ color: "var(--accent-12)" }}>
                                            Message sent! I'll get back to you soon.
                                        </Text>
                                    </Card>
                                </Box>
                            )}

                            {/* Error Message */}
                            {submitStatus.error && (
                                <Box gridColumn={{ initial: "1", sm: "span 2" }}>
                                    <Card variant="ghost" size="2" style={{ backgroundColor: "var(--gray-a3)" }}>
                                        <Text color="red" size="2" weight="medium">
                                            {submitStatus.error}
                                        </Text>
                                    </Card>
                                </Box>
                            )}
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Theme>
    );
};
