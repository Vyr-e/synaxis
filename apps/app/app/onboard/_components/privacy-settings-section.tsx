'use client';

import { AtSign, Eye, MapPin, Settings } from 'lucide-react';

import { Switch } from '@repo/design-system/components/ui/switch';

import {
  type FormData as StoreFormData,
  useFormStore,
} from '@/store/use-onboarding-store';

export function PrivacySettingsSection() {
  const formData = useFormStore((state) => state.formData);
  const setField = useFormStore((state) => state.setField);

  const {
    isProfilePublic = true,
    showLocation = true,
    allowMessages = true,
  } = formData;

  const handleSwitchChange = (name: string, checked: boolean) => {
    setField(name as keyof StoreFormData, checked);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div className="flex items-center p-3 sm:p-5 bg-gray-50/50">
        <Settings className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="font-medium text-gray-700">Privacy Settings</h3>
      </div>

      <div className="p-3 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Public Profile
              </p>
              <p className="text-xs text-gray-500">
                Allow others to discover your profile
              </p>
            </div>
          </div>
          <Switch
            checked={isProfilePublic}
            onCheckedChange={(checked) =>
              handleSwitchChange('isProfilePublic', checked)
            }
            className="rounded-md [&_span]:rounded [&_span]:shadow-md data-[state=checked]:bg-[#0077FF] data-[state=checked]:[&_span]:ml-auto transition-all duration-300 ease-in-out [&_span]:size-[0.9rem] p-[0.1rem]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">Show Location</p>
              <p className="text-xs text-gray-500">
                Display your location on your profile
              </p>
            </div>
          </div>
          <Switch
            checked={showLocation}
            onCheckedChange={(checked) =>
              handleSwitchChange('showLocation', checked)
            }
            className="rounded-md [&_span]:rounded [&_span]:shadow-md data-[state=checked]:bg-[#0077FF] data-[state=checked]:[&_span]:ml-auto transition-all duration-300 ease-in-out [&_span]:size-[0.9rem] p-[0.1rem]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AtSign className="h-4 w-4 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Allow Messages
              </p>
              <p className="text-xs text-gray-500">
                Let others send you direct messages
              </p>
            </div>
          </div>
          <Switch
            checked={allowMessages}
            onCheckedChange={(checked) =>
              handleSwitchChange('allowMessages', checked)
            }
            className="rounded-md [&_span]:rounded [&_span]:shadow-md data-[state=checked]:bg-[#0077FF] data-[state=checked]:[&_span]:ml-auto transition-all duration-300 ease-in-out [&_span]:size-[0.9rem] p-[0.1rem]"
          />
        </div>
      </div>
    </div>
  );
}
