'use client';

import { useFormStore } from '@/store/use-onboarding-store';
import { usePathname } from 'next/navigation';

export function DebugValidation() {
  const pathname = usePathname();
  const formData = useFormStore((state) => state.formData);
  const getStepValidation = useFormStore((state) => state.getStepValidation);

  // Parse the current step from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const steps = pathSegments.slice(1);
  const stepType = steps[0] as 'user' | 'brand';
  const subStep = steps[1];

  // Test the validation
  const validationResult =
    stepType && subStep ? getStepValidation(stepType, subStep) : false;

  // Check individual brand validation criteria
  const brandValidationChecks = {
    brandName: Boolean(
      formData.brandName && formData.brandName.trim().length >= 2
    ),
    brandDescription: Boolean(
      formData.brandDescription && formData.brandDescription.trim().length >= 10
    ),
    slug: Boolean(formData.slug && formData.slug.trim().length >= 3),
  };

  return (
    <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-md z-50">
      <h3 className="font-bold mb-2">Debug Validation</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>Pathname:</strong> {pathname}
        </div>
        <div>
          <strong>Step Type:</strong> {stepType}
        </div>
        <div>
          <strong>Sub Step:</strong> {subStep}
        </div>
        <div>
          <strong>Validation Result:</strong>{' '}
          {validationResult ? '✅ PASS' : '❌ FAIL'}
        </div>

        {stepType === 'brand' && subStep === 'community' && (
          <div className="mt-2">
            <div>
              <strong>Brand Validation Details:</strong>
            </div>
            <div>
              • brandName: {brandValidationChecks.brandName ? '✅' : '❌'} (
              {formData.brandName?.length || 0} chars)
            </div>
            <div>
              • brandDescription:{' '}
              {brandValidationChecks.brandDescription ? '✅' : '❌'} (
              {formData.brandDescription?.length || 0} chars)
            </div>
            <div>
              • slug: {brandValidationChecks.slug ? '✅' : '❌'} (
              {formData.slug?.length || 0} chars)
            </div>
          </div>
        )}

        <div className="mt-2">
          <div>
            <strong>Form Data:</strong>
          </div>
          <div>• brandName: "{formData.brandName}"</div>
          <div>• brandDescription: "{formData.brandDescription}"</div>
          <div>• slug: "{formData.slug}"</div>
        </div>
      </div>
    </div>
  );
}
