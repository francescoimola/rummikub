import { CheckIcon, Link2Icon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import { TfiFacebook } from "react-icons/tfi";

interface ShareButtonsProps {
    title: string;
    url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const encoded = { url: encodeURIComponent(url), title: encodeURIComponent(title) };

    const SOCIAL_LINKS = [
        {
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`,
            icon: <LinkedInLogoIcon />,
            label: "Share on LinkedIn",
        },
        {
            href: `https://twitter.com/intent/tweet?text=${encoded.title}&url=${encoded.url}`,
            icon: <TwitterLogoIcon />,
            label: "Share on Twitter",
        },
        {
            href: `https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`,
            icon: <TfiFacebook />,
            label: "Share on Facebook",
        },
    ];

    return (
        <Flex gap="3" align="center">
            {SOCIAL_LINKS.map(({ href, icon, label }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="share-icon"
                    style={{ color: "inherit", textDecoration: "none" }}
                >
                    {icon}
                </a>
            ))}
            <button
                onClick={() => {
                    navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}
                aria-label="Copy link to clipboard"
                className="share-icon"
                style={{
                    all: "unset",
                    cursor: "pointer",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {copied ? <CheckIcon /> : <Link2Icon />}
            </button>
        </Flex>
    );
}
