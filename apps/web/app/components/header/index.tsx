"use client"
import { AnimatedIcon } from "../animated-logo";
import { clashDisplay } from '@repo/design-system/fonts';
import { useEffect, useState } from 'react';
import Menu from "@/app/[locale]/(home)/components/menu";

export function Header() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<nav className={`${clashDisplay.className} fixed top-8 left-0 right-0 z-50`}>
			<div className="flex items-center justify-between h-12 px-4 max-w-7xl mx-auto">
				<div className="flex items-center gap-2">
					<AnimatedIcon dark={true} w="w-5" h="h-5" />
					<span className="text-black/90 text-xl font-bold mix-blend-difference">
						Synaxis
					</span>
				</div>

				<div className="flex items-center gap-4">
					<Menu />
				</div>
			</div>
		</nav>
	);
}
