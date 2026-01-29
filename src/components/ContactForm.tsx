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
} from "@radix-ui/themes";
import { Link } from "@radix-ui/themes";

export const ContactForm = () => {
    return (

        <Theme accentColor="yellow" grayColor="olive" panelBackground="solid" radius="none" scaling="97%" hasBackground={false} asChild>
            <Form.Root style={{ marginTop: 'var(--space-8)' }}>
                <Grid columns={{ initial: "1", md: "2" }} gap="5">
                    <Form.Field name="firstName">
                        <Flex direction="column" gap="1">
                            <Text as="div" size="3" weight="medium" mb="1">
                                First name
                            </Text>
                            <Form.Control asChild>
                                <TextField.Root required variant="soft" placeholder="" className="contact-form-input" />
                            </Form.Control>
                        </Flex>
                    </Form.Field>

                    <Form.Field name="lastName">
                        <Flex direction="column" gap="1">
                            <Text as="div" size="3" weight="medium" mb="1">
                                Last name <Text as="span" color="gray" weight="regular">(optional)</Text>
                            </Text>
                            <Form.Control asChild>
                                <TextField.Root variant="soft" placeholder="" className="contact-form-input" />
                            </Form.Control>
                        </Flex>
                    </Form.Field>

                    <Form.Field name="email">
                        <Flex direction="column" gap="1">
                            <Text as="div" size="3" weight="medium" mb="1">
                                Email
                            </Text>
                            <Form.Control asChild>
                                <TextField.Root required variant="soft" placeholder="" type="email" className="contact-form-input" />
                            </Form.Control>
                            <Form.Message match="typeMismatch" asChild>
                                <Text color="red" size="1">Please provide a valid email</Text>
                            </Form.Message>
                        </Flex>
                    </Form.Field>

                    <Form.Field name="phone">
                        <Flex direction="column" gap="1">
                            <Text as="div" size="3" weight="medium" mb="1">
                                Phone number <Text as="span" color="gray" weight="regular">(optional)</Text>
                            </Text>
                            <Form.Control asChild>
                                <TextField.Root variant="soft" placeholder="" type="tel" className="contact-form-input" />
                            </Form.Control>
                        </Flex>
                    </Form.Field>

                    <Box gridColumn={{ initial: "1", sm: "span 2" }}>
                        <Form.Field name="service">
                            <Flex direction="column" gap="1">
                                <Form.Label>
                                    <Text as="span" size="3" weight="medium">
                                        What can I help with?
                                    </Text>
                                </Form.Label>
                                <Select.Root required defaultValue="web-design">
                                    <Form.Control asChild>
                                        <Select.Trigger variant="soft" className="contact-form-input" style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'space-between' }} />
                                    </Form.Control>
                                    <Form.Message match="valueMissing" asChild>
                                        <Text color="red" size="2">Please select a service</Text>
                                    </Form.Message>
                                    <Select.Content>
                                        <Select.Item value="web-design">Web Design & Development</Select.Item>
                                        <Select.Item value="consulting">Website Consultation</Select.Item>
                                        <Select.Item value="copywriting">Content Writing</Select.Item>
                                        <Select.Item value="email-marketing">Email Marketing</Select.Item>
                                        <Select.Item value="other">Other</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Flex>
                        </Form.Field>
                    </Box>

                    <Box gridColumn={{ initial: "1", sm: "span 2" }} mt="4">
                        <Text as="p" size="3" weight="medium" mb="3">
                            Which best describes you? <Text as="span" color="gray" weight="regular">(optional)</Text>
                        </Text>
                        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="3">
                            {["Small business owner", "Marketing manager", "Agency partner", "Freelancer", "Startup founder", "Other"].map((role) => (
                                <Flex key={role} align="center" gap="2">
                                    <Checkbox id={role} color="gray" />
                                    <Text as="label" htmlFor={role} size="2">
                                        {role}
                                    </Text>
                                </Flex>
                            ))}
                        </Grid>
                    </Box>


                    <Box gridColumn={{ initial: "1", sm: "span 2" }} mt="2">
                        <Form.Field name="message">
                            <Flex direction="column" gap="1">
                                <Text as="div" size="3" weight="medium" mb="1">
                                    Message
                                </Text>
                                <Form.Control asChild>
                                    <TextArea required variant="soft" placeholder="Tell me about your project..." className="contact-form-input" style={{ minHeight: '100px', resize: 'vertical' }} />
                                </Form.Control>
                                <Form.Message match="valueMissing" asChild>
                                    <Text color="red" size="2">Please provide a message</Text>
                                </Form.Message>
                            </Flex>
                        </Form.Field>
                    </Box>

                    <Box gridColumn={{ initial: "1", sm: "span 2" }} mt="2">
                        <Flex align="center" gap="2">
                            <Checkbox id="terms" required color="gray" />
                            <Text as="label" htmlFor="terms" size="2">
                                I accept the <Link href="/terms" color="gray" underline="always">terms</Link> and <Link href="/privacy-notice" color="gray" underline="always">privacy notice</Link>
                            </Text>
                        </Flex>
                    </Box>

                    <Box mt="4">
                        <Form.Submit asChild>
                            <Button size="4" variant="surface">
                                Send
                            </Button>
                        </Form.Submit>
                    </Box>

                </Grid>
            </Form.Root>
        </Theme>

    );
};
