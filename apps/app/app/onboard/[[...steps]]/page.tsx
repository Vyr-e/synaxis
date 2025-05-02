import StepsComponent from '../_components/steps';

interface OnboardingPageProps {
  params: Promise<{ steps?: string[] }>; // Expect params as a Promise
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const resolvedParams = await params;
  const steps = resolvedParams?.steps ?? [];

  return <StepsComponent steps={steps} />;
}
