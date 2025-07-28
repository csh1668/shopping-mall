import { icons } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type LucideIconName = keyof typeof icons;

export interface LucideIconProps extends HTMLAttributes<HTMLOrSVGElement> {
	name: LucideIconName;
	size?: string;
}

export function LucideIcon({ name, ...props }: LucideIconProps) {
	const Icon = icons[name];

	return <Icon className={cn(props.className)} {...props} />;
}
