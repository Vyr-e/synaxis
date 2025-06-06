import type { Metadata } from 'next';
import StepsComponent from '../_components/steps';
import { onboardingMetadata } from './metadata';

interface OnboardingPageProps {
  params: Promise<{ steps?: string[] }>; // Expect params as a Promise
}

export async function generateMetadata({
  params,
}: OnboardingPageProps): Promise<Metadata> {
  const steps = (await params).steps ?? [];

  if (steps.length === 0) {
    return onboardingMetadata.initial;
  }

  const [type, subStep] = steps;

  if (type === 'completion') {
    return onboardingMetadata.completion;
  }

  if ((type === 'user' || type === 'brand') && subStep) {
    const metadata =
      onboardingMetadata[type]?.[
        subStep as keyof (typeof onboardingMetadata)[typeof type]
      ];
    if (metadata) {
      return metadata;
    }
  }

  // Fallback metadata if no match is found
  return onboardingMetadata.default;
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const resolvedParams = await params;
  const steps = resolvedParams?.steps ?? [];

  return <StepsComponent steps={steps} />;
}
