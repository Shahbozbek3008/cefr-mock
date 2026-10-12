import type { ReactNode } from 'react';
import type { Skill } from '@cefr/ui/lib/constants';
import type { TESTIMONIALS } from '@/constants/sections';

export type FormatCardProps = { skill: Skill; wide: boolean; children: ReactNode };

export type FormatCard = { skill: Skill; wide: boolean; Demo: () => ReactNode };

export type Testimonial = (typeof TESTIMONIALS)[number];
