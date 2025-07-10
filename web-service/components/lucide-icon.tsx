import { icons } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface LucideIconProps extends HTMLAttributes<HTMLOrSVGElement> {
	name: keyof typeof icons;
	size?: string;
}

export default function LucideIcon({ name, ...props }: LucideIconProps) {
	const Icon = icons[name];

	return <Icon className={cn(props.className)} {...props} />;
}
