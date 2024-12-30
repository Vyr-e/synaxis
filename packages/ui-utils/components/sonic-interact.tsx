'use client';

import React, { useRef, useEffect, useCallback, useContext } from 'react';
import useSound from 'use-sound';
import { SoundContext } from '../context/sound-provider';
import useKeyboardBindings from './useKeyboardBindings';

const COMPONENT_TYPES = {
  div: 'div',
  button: 'button',
} as const;

type ComponentType = (typeof COMPONENT_TYPES)[keyof typeof COMPONENT_TYPES];

interface SoundInteractionProps
  extends React.HTMLAttributes<HTMLDivElement | HTMLButtonElement> {
  sounds: {
    click?: string;
    clickDown?: string;
    clickOn?: string;
    clickOff?: string;
    hover?: string;
    swipe?: string;
    [key: string]: string | undefined;
  };
  volume?: number;
  disabled?: boolean;
  as?: ComponentType;
  keyBindings?: Record<string, (event: KeyboardEvent) => void>;
  useHapticFeedback?: boolean;
}

type SoundType =
  | 'click'
  | 'clickDown'
  | 'clickOn'
  | 'clickOff'
  | 'hover'
  | 'swipe';

const useSoundPlayers = (
  sounds: SoundInteractionProps['sounds'],
  volume: number,
  disabled: boolean
) => {
  const soundContext = useContext(SoundContext);
  if (!soundContext) {
    throw new Error('SonicInteract must be used within a SoundProvider');
  }
  const { globalVolume } = soundContext;
  const effectiveVolume = volume ?? globalVolume;

  return {
    click: useSound(sounds.click || '', {
      volume: effectiveVolume,
      soundEnabled: !disabled && !!sounds.click,
    }),
    clickDown: useSound(sounds.clickDown || '', {
      volume: effectiveVolume,
      soundEnabled: !disabled && !!sounds.clickDown,
    }),
    clickOn: useSound(sounds.clickOn || '', {
      volume: effectiveVolume,
      soundEnabled: !disabled && !!sounds.clickOn,
    }),
    clickOff: useSound(sounds.clickOff || '', {
      volume: effectiveVolume,
      soundEnabled: !disabled && !!sounds.clickOff,
    }),
    hover: useSound(sounds.hover || '', {
      volume: effectiveVolume,
      soundEnabled: !disabled && !!sounds.hover,
    }),
    swipe: useSound(sounds.swipe || '', {
      volume: effectiveVolume,
      soundEnabled: !disabled && !!sounds.swipe,
    }),
  };
};

const SonicInteract: React.FC<SoundInteractionProps> = ({
  children,
  sounds = {},
  volume,
  disabled = false,
  as = COMPONENT_TYPES.div,
  keyBindings = {},
  useHapticFeedback = false,
  role,
  tabIndex,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement & HTMLButtonElement>(null);
  const soundPlayers = useSoundPlayers(sounds, volume || 0.5, disabled);

  const playSound = useCallback(
    (type: SoundType) => {
      if (soundPlayers[type]) {
        const [play] = soundPlayers[type];
        play();
        if (useHapticFeedback && navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    },
    [soundPlayers, useHapticFeedback]
  );

  const handleInteraction = useCallback(
    (e: Event) => {
      // biome-ignore lint/style/useBlockStatements: <quick return statement>
      if (disabled) return;

      const target = e.target as HTMLElement;

      switch (e.type) {
        case 'click':
          playSound('click');
          break;
        case 'mousedown':
        case 'touchstart':
          //biome-ignore lint/style/useBlockStatements: <quick return statement>
          if (as === COMPONENT_TYPES.button) playSound('clickDown');
          break;
        case 'mouseup':
        case 'touchend':
          if (as === COMPONENT_TYPES.button) {
            if ((target as HTMLInputElement).checked) {
              playSound('clickOn');
            } else {
              playSound('clickOff');
            }
          }
          break;
        case 'mouseenter':
          playSound('hover');
          break;
        default:
          break;
      }
    },
    [disabled, playSound, as]
  );

  const handleSwipe = useCallback(
    (startX: number, endX: number) => {
      // biome-ignore lint/style/useBlockStatements: <quick return statement>
      if (disabled || as !== COMPONENT_TYPES.div) return;
      // biome-ignore lint/style/useBlockStatements: <inline fits this statement>
      if (Math.abs(startX - endX) > 50 && sounds.swipe) playSound('swipe');
    },
    [disabled, playSound, sounds.swipe, as]
  );

  useEffect(() => {
    const element = ref.current;
    // biome-ignore lint/style/useBlockStatements: <quick return statement>
    if (!element) return;

    let startX: number;

    const touchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const touchEnd = (e: TouchEvent) => {
      handleSwipe(startX, e.changedTouches[0].clientX);
      handleInteraction(e);
    };

    element.addEventListener('click', handleInteraction as EventListener);
    element.addEventListener('mouseenter', handleInteraction as EventListener);
    if (as === COMPONENT_TYPES.button) {
      element.addEventListener('mousedown', handleInteraction as EventListener);
      element.addEventListener('mouseup', handleInteraction as EventListener);
    } else {
      element.addEventListener('touchstart', touchStart);
      element.addEventListener('touchend', touchEnd);
    }

    return () => {
      element.removeEventListener('click', handleInteraction as EventListener);
      element.removeEventListener(
        'mouseenter',
        handleInteraction as EventListener
      );
      if (as === COMPONENT_TYPES.button) {
        element.removeEventListener(
          'mousedown',
          handleInteraction as EventListener
        );
        element.removeEventListener(
          'mouseup',
          handleInteraction as EventListener
        );
      } else {
        element.removeEventListener('touchstart', touchStart);
        element.removeEventListener('touchend', touchEnd);
      }
    };
  }, [handleInteraction, handleSwipe, as]);

  const setKeyBindings = useKeyboardBindings(keyBindings);

  useEffect(() => {
    if (as === COMPONENT_TYPES.div && Object.keys(keyBindings).length > 0) {
      // biome-ignore lint/suspicious/noConsole: <this is obviously a console.error>
      console.error(
        "Key bindings are only allowed for button elements. If you need key bindings, set the 'as' prop to 'button'."
      );
    } else if (as === COMPONENT_TYPES.button) {
      setKeyBindings({
        ...keyBindings,
        ...Object.fromEntries(
          Object.entries(keyBindings).map(([key, handler]) => [
            key,
            (e: KeyboardEvent) => {
              handler(e);
              playSound('click');
            },
          ])
        ),
      });
    }
  }, [as, keyBindings, setKeyBindings, playSound]);

  const Component = as;

  return (
    <Component
      ref={ref as HTMLDivElement & HTMLButtonElement}
      {...rest}
      role={as === COMPONENT_TYPES.button ? 'button' : role}
      tabIndex={tabIndex}
    >
      {children}
    </Component>
  );
};

export default React.memo(SonicInteract);
