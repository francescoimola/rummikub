import { useState } from "react";
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
import * as Yup from "yup";
import { Formik, useField, useFormikContext, Field } from "formik";
import { EXTERNAL_URLS } from "../constants";

// Validation schema
const ContactSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string(),
    email: Yup.string().email("Please provide a valid email").required("Email is required"),
    phone: Yup.string(),
    service: Yup.string().required("Please select a service"),
    roles: Yup.array().of(Yup.string()),
    message: Yup.string().required("Please provide a message"),
    acceptedTerms: Yup.boolean().oneOf([true], "You must accept the terms"),
});

// Custom TextField component for Formik
type TextFieldType = "text" | "email" | "tel" | "password" | "url" | "search";

const FormTextField = ({
    name,
    type = "text",
    required = false,
    id,
}: {
    name: string;
    type?: TextFieldType;
    required?: boolean;
    id?: string;
}) => {
    const [field] = useField(name);
    return (
        <TextField.Root
            {...field}
            id={id || name}
            type={type}
            required={required}
            variant="soft"
            placeholder=""
            className="contact-form-input"
        />
    );
};

// Custom TextArea component for Formik
const FormTextArea = ({ name, id }: { name: string; id?: string }) => {
    const [field] = useField(name);
    return (
        <TextArea
            {...field}
            id={id || name}
            required
            variant="soft"
            placeholder="Tell me about your project..."
            className="contact-form-input"
            style={{ minHeight: "100px", resize: "vertical" }}
        />
    );
};

// Custom Select component for Formik
const FormSelect = ({ name, id }: { name: string; id?: string }) => {
    const { setFieldValue, values } = useFormikContext<{ service: string }>();
    return (
        <Select.Root
            required
            value={values.service}
            onValueChange={(value) => setFieldValue(name, value)}
        >
            <Select.Trigger
                id={id || name}
                variant="soft"
                className="contact-form-input"
                style={{ marginTop: "0.75rem", width: "100%", justifyContent: "space-between" }}
            />
            <Select.Content>
                <Select.Item value="web-design">Web Design & Development</Select.Item>
                <Select.Item value="consulting">Website Consultation</Select.Item>
                <Select.Item value="copywriting">Copywriting</Select.Item>
                <Select.Item value="email-marketing">Email Marketing</Select.Item>
                <Select.Item value="other">Other</Select.Item>
            </Select.Content>
        </Select.Root>
    );
};

// Role checkbox group
const ROLES = [
    "Small business owner",
    "Marketing manager",
    "Agency partner",
    "Freelancer",
    "Startup founder",
    "Other",
];

const RoleCheckboxes = () => {
    const { setFieldValue, values } = useFormikContext<{ roles: string[] }>();

    const handleRoleChange = (role: string, checked: boolean) => {
        const currentRoles = values.roles || [];
        if (checked) {
            setFieldValue("roles", [...currentRoles, role]);
        } else {
            setFieldValue("roles", currentRoles.filter((r) => r !== role));
        }
    };

    return (
        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="3">
            {ROLES.map((role) => (
                <Flex key={role} align="center" gap="2">
                    <Checkbox
                        id={role}
                        color="gray"
                        checked={(values.roles || []).includes(role)}
                        onCheckedChange={(checked) => handleRoleChange(role, checked === true)}
                    />
                    <Text as="label" htmlFor={role} size="2">
                        {role}
                    </Text>
                </Flex>
            ))}
        </Grid>
    );
};

// Terms checkbox
const TermsCheckbox = () => {
    const { setFieldValue, values } = useFormikContext<{ acceptedTerms: boolean }>();

    return (
        <Flex align="center" gap="2">
            <Checkbox
                id="terms"
                color="gray"
                checked={values.acceptedTerms}
                onCheckedChange={(checked) => setFieldValue("acceptedTerms", checked === true)}
            />
            <Text as="label" htmlFor="terms" size="2">
                I accept the{" "}
                <Link href={EXTERNAL_URLS.termsOfBusiness} color="gray" underline="always">
                    terms
                </Link>{" "}
                and{" "}
                <Link href={EXTERNAL_URLS.privacyNotice} color="gray" underline="always">
                    privacy notice
                </Link>
            </Text>
        </Flex>
    );
};

export const ContactForm = () => {
    const [submitStatus, setSubmitStatus] = useState<{ success: boolean; error: string | null }>({
        success: false,
        error: null,
    });

    const handleSubmit = async (
        values: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            service: string;
            roles: string[];
            message: string;
            acceptedTerms: boolean;
            botcheck: string;
        },
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
    ) => {
        setSubmitStatus({ success: false, error: null });

        try {
            const formData = new FormData();
            formData.append("firstName", values.firstName);
            formData.append("lastName", values.lastName);
            formData.append("email", values.email);
            formData.append("phone", values.phone);
            formData.append("service", values.service);
            formData.append("roles", values.roles.join(", "));
            formData.append("message", values.message);
            formData.append("botcheck", values.botcheck);

            const response = await fetch("/api/contact", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setSubmitStatus({ success: true, error: null });
                resetForm();
            } else {
                setSubmitStatus({ success: false, error: data.error || "Something went wrong. Please try again." });
            }
        } catch {
            setSubmitStatus({ success: false, error: "Network error. Please check your connection and try again." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Theme
            accentColor="yellow"
            grayColor="olive"
            panelBackground="solid"
            radius="none"

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
                    <form style={{ marginTop: "var(--space-8)" }}>
                        <Grid columns={{ initial: "1", md: "2" }} gap="5">
                            {/* First Name */}
                            <Flex direction="column" gap="1">
                                <Text as="label" htmlFor="firstName" size="3" weight="medium" mb="1">
                                    First name
                                </Text>
                                <FormTextField name="firstName" id="firstName" required />
                                {errors.firstName && touched.firstName && (
                                    <Text color="red" size="1">{errors.firstName}</Text>
                                )}
                            </Flex>

                            {/* Last Name */}
                            <Flex direction="column" gap="1">
                                <Text as="label" htmlFor="lastName" size="3" weight="medium" mb="1">
                                    Last name <Text as="span" color="gray" weight="regular">(optional)</Text>
                                </Text>
                                <FormTextField name="lastName" id="lastName" />
                            </Flex>

                            {/* Email */}
                            <Flex direction="column" gap="1">
                                <Text as="label" htmlFor="email" size="3" weight="medium" mb="1">
                                    Email
                                </Text>
                                <FormTextField name="email" id="email" type="email" required />
                                {errors.email && touched.email && (
                                    <Text color="red" size="1">{errors.email}</Text>
                                )}
                            </Flex>

                            {/* Phone */}
                            <Flex direction="column" gap="1">
                                <Text as="label" htmlFor="phone" size="3" weight="medium" mb="1">
                                    Phone number <Text as="span" color="gray" weight="regular">(optional)</Text>
                                </Text>
                                <FormTextField name="phone" id="phone" type="tel" />
                            </Flex>

                            {/* Service Select */}
                            <Box gridColumn={{ initial: "1", sm: "span 2" }}>
                                <Flex direction="column" gap="1">
                                    <Text as="label" htmlFor="service" size="3" weight="medium">
                                        What can I help with?
                                    </Text>
                                    <FormSelect name="service" id="service" />
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
                                    <Text as="label" htmlFor="message" size="3" weight="medium" mb="1">
                                        Message
                                    </Text>
                                    <FormTextArea name="message" id="message" />
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

                            {/* Status Messages with aria-live for screen reader announcements */}
                            <Box
                                gridColumn={{ initial: "1", sm: "span 2" }}
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {submitStatus.success && (
                                    <Card variant="ghost" size="2" style={{ backgroundColor: "var(--gray-a3)" }}>
                                        <Text size="2" weight="bold" style={{ color: "var(--accent-12)" }}>
                                            Message sent! I'll get back to you soon.
                                        </Text>
                                    </Card>
                                )}
                                {submitStatus.error && (
                                    <Card variant="ghost" size="2" style={{ backgroundColor: "var(--gray-a3)" }}>
                                        <Text color="red" size="2" weight="medium">
                                            {submitStatus.error}
                                        </Text>
                                    </Card>
                                )}
                            </Box>
                        </Grid>
                    </form>
                )}
            </Formik>
        </Theme>
    );
};
