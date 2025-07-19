"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
	hover?: boolean;
	press?: boolean;
	delay?: number;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
	(
		{ className, hover = true, press = true, delay = 0, children, ...props },
		ref,
	) => {
		// motion.div에서 제외할 HTML 이벤트 props들
		const {
			onClick,
			onMouseEnter,
			onMouseLeave,
			onFocus,
			onBlur,
			...cardProps
		} = props;

		const motionProps = {
			onClick,
			onMouseEnter,
			onMouseLeave,
			onFocus,
			onBlur,
		};

		return (
			<motion.div
				ref={ref}
				initial={{
					opacity: 0,
					y: 16,
					scale: 0.95,
				}}
				animate={{
					opacity: 1,
					y: 0,
					scale: 1,
				}}
				whileHover={
					hover
						? {
								y: -4,
								scale: 1.02,
								boxShadow:
									"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
							}
						: undefined
				}
				whileTap={
					press
						? {
								scale: 0.98,
								y: 0,
							}
						: undefined
				}
				transition={{
					duration: 0.3,
					delay: delay / 1000,
					ease: [0.4, 0, 0.2, 1],
					type: "spring",
					stiffness: 300,
					damping: 30,
				}}
				{...motionProps}
			>
				<Card className={cn("h-full w-full", className)} {...cardProps}>
					{children}
				</Card>
			</motion.div>
		);
	},
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };
