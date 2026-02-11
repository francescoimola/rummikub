import {
    Link2Icon,
    LinkedInLogoIcon,
    TwitterLogoIcon,
    CheckIcon,
} from "@radix-ui/react-icons";
import { TfiFacebook } from "react-icons/tfi";
import { Flex, Box } from "@radix-ui/themes";
import { useState } from "react";

interface ShareButtonsProps {
    title: string;
    url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return (
        <Flex gap="3" align="center">
            {/* LinkedIn */}
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="share-icon"
                style={{ color: 'inherit', textDecoration: 'none' }}
            >
                <LinkedInLogoIcon />
            </a>

            {/* Twitter/X */}
            <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
                className="share-icon"
                style={{ color: 'inherit', textDecoration: 'none' }}
            >
                <TwitterLogoIcon />
            </a>

            {/* Facebook */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="share-icon"
                style={{ color: 'inherit', textDecoration: 'none' }}
            >
                <TfiFacebook />
            </a>

            {/* Copy Link */}
            <button
                onClick={handleCopy}
                aria-label="Copy link to clipboard"
                className="share-icon"
                style={{
                    all: 'unset',
                    cursor: 'pointer',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {copied ? <CheckIcon /> : <Link2Icon />}
            </button>
        </Flex>
    );
}
