"use client";

import { Avatar as HeroAvatar, AvatarProps } from "@heroui/react";

export function Avatar(props: Readonly<AvatarProps>) {
    return <HeroAvatar {...props} />;
}

Avatar.Image = HeroAvatar.Image;
Avatar.Fallback = HeroAvatar.Fallback;
