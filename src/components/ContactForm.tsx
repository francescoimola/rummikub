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
    Link,
} from "@radix-ui/themes";
import * as Yup from "yup";
import { Formik, useField, useFormikContext, Field, Form } from "formik";
import { EXTERNAL_URLS } from "../constants";

const ROLES = [
    "Small business owner",
    "Marketing manager",
    "Agency partner",
    "Freelancer",
    "Startup founder",
    "Other",
];

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

const FormInput = ({ label, name, required, ...props }: React.ComponentProps<typeof TextField.Root> & { label: React.ReactNode; name: string; required?: boolean }) => {
    const [field, meta] = useField(name);
    return (
        <Flex direction="column" gap="1">
            <Text as="label" htmlFor={name} size="3" weight="medium" mb="1">
                {label} {!required && <Text as="span" color="gray" weight="regular">(optional)</Text>}
            </Text>
            <TextField.Root
                {...field}
                {...props}
                id={name}
                required={required}
                variant="soft"
                className="contact-form-input"
            />
            {meta.touched && meta.error && <Text color="red" size="1">{meta.error}</Text>}
        </Flex>
    );
};

const FormTextArea = ({ label, name, ...props }: React.ComponentProps<typeof TextArea> & { label: string; name: string }) => {
    const [field, meta] = useField(name);
    return (
        <Flex direction="column" gap="1">
            <Text as="label" htmlFor={name} size="3" weight="medium" mb="1">{label}</Text>
            <TextArea
                {...field}
                {...props}
                id={name}
                required
                variant="soft"
                className="contact-form-input"
                style={{ minHeight: "100px", resize: "vertical", ...props.style }}
            />
            {meta.touched && meta.error && <Text color="red" size="2">{meta.error}</Text>}
        </Flex>
    );
};

const FormSelect = ({ label, name }: { label: string; name: string }) => {
    const { setFieldValue, values, touched, errors } = useFormikContext<{ service: string }>();
    const hasError = touched.service && errors.service;

    return (
        <Flex direction="column" gap="1">
            <Text as="label" htmlFor={name} size="3" weight="medium">{label}</Text>
            <Select.Root
                required
                value={values.service}
                onValueChange={(value) => setFieldValue(name, value)}
            >
                <Select.Trigger
                    id={name}
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
            {hasError && <Text color="red" size="2">{errors.service}</Text>}
        </Flex>
    );
};

const FormCheckboxes = () => {
    const { setFieldValue, values } = useFormikContext<{ roles: string[] }>();
    const currentRoles = values.roles || [];

    const handleChange = (role: string, checked: boolean) => {
        const nextRoles = checked
            ? [...currentRoles, role]
            : currentRoles.filter((r) => r !== role);
        setFieldValue("roles", nextRoles);
    };

    return (
        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="3">
            {ROLES.map((role) => (
                <Flex key={role} align="center" gap="2">
                    <Checkbox
                        id={role}
                        color="gray"
                        checked={currentRoles.includes(role)}
                        onCheckedChange={(c) => handleChange(role, c === true)}
                    />
                    <Text as="label" htmlFor={role} size="2">{role}</Text>
                </Flex>
            ))}
        </Grid>
    );
};

export const ContactForm = () => {
    const [status, setStatus] = useState<{ success: boolean; error: string | null }>({ success: false, error: null });

    return (
        <Theme accentColor="yellow" grayColor="olive" panelBackground="solid" radius="none" hasBackground={false} asChild>
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
                    botcheck: "",
                }}
                validationSchema={ContactSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    setStatus({ success: false, error: null });
                    try {
                        const formData = new FormData();
                        Object.entries(values).forEach(([key, value]) => {
                            formData.append(key, Array.isArray(value) ? value.join(", ") : String(value));
                        });

                        const res = await fetch("/api/contact", { method: "POST", body: formData });
                        const data = await res.json();

                        if (data.success) {
                            setStatus({ success: true, error: null });
                            resetForm();
                        } else {
                            setStatus({ success: false, error: data.error || "Something went wrong. Please try again." });
                        }
                    } catch {
                        setStatus({ success: false, error: "Network error. Please check your connection and try again." });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form style={{ marginTop: "var(--space-8)" }}>
                        <Grid columns={{ initial: "1", md: "2" }} gap="5">
                            <FormInput name="firstName" label="First name" required />
                            <FormInput name="lastName" label="Last name" />
                            <FormInput name="email" label="Email" type="email" required />
                            <FormInput name="phone" label="Phone number" type="tel" />

                            <Box gridColumn={{ initial: "1", sm: "span 2" }}>
                                <FormSelect name="service" label="What can I help with?" />
                            </Box>

                            <Box gridColumn={{ initial: "1", sm: "span 2" }} mt="4">
                                <Text as="p" size="3" weight="medium" mb="3">
                                    Which best describes you? <Text as="span" color="gray" weight="regular">(optional)</Text>
                                </Text>
                                <FormCheckboxes />
                            </Box>

                            <Box gridColumn={{ initial: "1", sm: "span 2" }} mt="2">
                                <FormTextArea name="message" label="Message" placeholder="Tell me about your project..." />
                            </Box>

                            <Box gridColumn={{ initial: "1", sm: "span 2" }} mt="2">
                                <Flex align="center" gap="2">
                                    <Field name="acceptedTerms">
                                        {({ field, form }: { field: any, form: any }) => (
                                            <Checkbox
                                                {...field}
                                                id="terms"
                                                color="gray"
                                                checked={field.value}
                                                onCheckedChange={(c) => form.setFieldValue("acceptedTerms", c === true)}
                                            />
                                        )}
                                    </Field>
                                    <Text as="label" htmlFor="terms" size="2">
                                        I accept the <Link href={EXTERNAL_URLS.termsOfBusiness} color="gray" underline="always">terms</Link> and <Link href={EXTERNAL_URLS.privacyNotice} color="gray" underline="always">privacy notice</Link>
                                    </Text>
                                </Flex>
                                {errors.acceptedTerms && touched.acceptedTerms && (
                                    <Text color="red" size="2" mt="1" as="div">{errors.acceptedTerms}</Text>
                                )}
                            </Box>

                            <Field
                                name="botcheck"
                                style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                            />

                            <Box mt="4">
                                <Button type="submit" size="4" variant="surface" disabled={isSubmitting}>
                                    {isSubmitting ? "Sending..." : "Send"}
                                </Button>
                            </Box>

                            <Box gridColumn={{ initial: "1", sm: "span 2" }} aria-live="polite">
                                {(status.success || status.error) && (
                                    <Card variant="ghost" size="2" style={{ backgroundColor: "var(--gray-a3)" }}>
                                        <Text color={status.success ? undefined : "red"} size="2" weight={status.success ? "bold" : "medium"} style={status.success ? { color: "var(--accent-12)" } : undefined}>
                                            {status.success ? "Message sent! I'll get back to you soon." : status.error}
                                        </Text>
                                    </Card>
                                )}
                            </Box>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Theme>
    );
};

