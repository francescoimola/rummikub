import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

interface ScrollRevealProps {
	children: ReactNode;
	style?: CSSProperties;
}

export function ScrollReveal({ children, style }: ScrollRevealProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 18 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-80px" }}
			transition={{ duration: 0.5, ease: "easeInOut" }}
			style={style}
		>
			{children}
		</motion.div>
	);
}
