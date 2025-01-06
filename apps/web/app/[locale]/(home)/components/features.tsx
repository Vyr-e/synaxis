'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayIcon, PauseIcon } from 'lucide-react'
import { useWindow } from '@repo/ui-utils'
import { lora } from "@repo/design-system/fonts"
import { useTranslations } from 'next-intl'

export function Features() {
  const t = useTranslations()
  const containerRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const [isHovered, setIsHovered] = useState(false)
  const { isMobile } = useWindow()
  const [progress, setProgress] = useState(0)

  const features = [
    {
      id: 1,
      title: t('features.community.title'),
      description: t('features.community.description'),
      videoPath: "/features/features-1.mp4", // TODO: upload asssets to uploadthing or a cloud-storage and replace path, copy assets to the folder in public
      duration: 9
    },
    {
      id: 2,
      title: t('features.events.title'),
      description: t('features.events.description'),
      videoPath: "/features/features-2.mp4",  // TODO: upload asssets to uploadthing or a cloud-storage and replace path, copy assets to the folder in public
      duration: 29
    },
    {
      id: 3,
      title: t('features.audio.title'),
      description: t('features.audio.description'),
      videoPath: "/features/features-3.mp4", // TODO: upload asssets to uploadthing or a cloud-storage and replace path, copy assets to the folder in public
      duration: 19
    }
  ]

  // GSAP Scale Animation with mobile optimization
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    ScrollTrigger.getAll().forEach(t => t.kill())

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top center",
        end: "bottom center",
        scrub: 3,
        markers: false,
        ease: "none",
        onEnter: () => {
          if (videoRefs.current[0]) {
            videoRefs.current[0].play()
          }
        }
      }
    })

    gsap.set(container, {
      scale: 0.6,
      opacity: 0,
      y: 50
    })

    tl.to(container, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 2,
      ease: "none"
    })

    return () => {
      tl.kill()
    }
  }, [isMobile])

  const handleVideoSwitch = (index: number) => {
    if (videoRefs.current[current]) {
      videoRefs.current[current]!.pause()
      videoRefs.current[current]!.currentTime = 0
    }
    
    if (videoRefs.current[index]) {
      videoRefs.current[index]!.play()
      setIsPlaying(true)
    }
    
    setCurrent(index)
  }

  const togglePlay = () => {
    if (videoRefs.current[current]) {
      if (isPlaying) {
        videoRefs.current[current]!.pause()
      } else {
        videoRefs.current[current]!.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Fixed video ref callback
  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el
  }

  useEffect(() => {
    // Preload all videos
    features.forEach((feature) => {
      const video = new Audio(feature.videoPath)
      video.preload = 'auto'
    })
  }, [])

  const handleTimeUpdate = () => {
    if (videoRefs.current[current]) {
      const video = videoRefs.current[current]!
      const percentage = (video.currentTime / video.duration) * 100
      setProgress(percentage)
    }
  }

  return (
    <section className="min-h-[40vh] flex items-center justify-center flex-col overflow-hidden">
      <h2 className={'font-clash-display font-bold text-3xl sm:text-4xl md:text-5xl mb-8 text-center'}>
        {t('features.title')}
      </h2>
      <div 
        ref={containerRef}
        className="w-full max-w-[1000px] mx-auto px-4"
        style={{ 
          opacity: 0,
        }}
      >
        {/* Video container */}
        <div 
          className="relative aspect-video rounded-xl overflow-hidden bg-black"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Stacked videos */}
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`absolute inset-0 transition-opacity duration-500
                ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <video
                ref={setVideoRef(index)}
                src={feature.videoPath}
                className="w-full h-full object-cover"
                loop={false}
                muted
                playsInline
                autoPlay={index === 0}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => handleVideoSwitch((index + 1) % features.length)}
                onError={(e) => {
                  console.error(`Error loading video ${feature.title}:`, e)
                  handleVideoSwitch((index + 1) % features.length)
                }}
              />
            </div>
          ))}

          {/* Dark overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
              transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
            style={{ zIndex: 20 }}
          />

          {/* Controls container */}
          <div className="absolute inset-0 z-30">
            {/* Progress bars and descriptions container */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex flex-col gap-4">
                {/* Descriptions */}
                <div className="relative h-[60px] md:h-[80px]">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      className={`absolute inset-0 transition-all duration-500`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: index === current ? 1 : 0,
                        y: index === current ? 0 : 20,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className={`text-sm md:text-lg text-white/90 font-light max-w-[80%] 
                        ${lora.className}`}
                      >
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Progress bars */}
                <div className="flex gap-2">
                  {features.map((feature, index) => (
                    <button
                      key={feature.id}
                      onClick={() => handleVideoSwitch(index)}
                      className="flex-1 group"
                      aria-label={`Switch to ${feature.title} video`}
                      aria-pressed={index === current}
                    >
                      <h3 className={`text-[10px] md:text-sm font-medium mb-1.5 md:mb-2 
                        transition-colors duration-300 text-left font-clash-display
                        ${index === current ? 'text-white' : 'text-white/60'}`}
                      >
                        {feature.title}
                      </h3>
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <AnimatePresence mode="wait">
                          {current === index && (
                            <motion.div
                              className="h-full bg-white"
                              initial={{ width: isPlaying ? '0%' : `${progress}%` }}
                              animate={{ width: isPlaying ? '100%' : `${progress}%` }}
                              transition={{
                                duration: isPlaying ? feature.duration * (1 - progress / 100) : 0,
                                ease: 'linear',
                              }}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Play/Pause Button */}
            <motion.button 
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md 
                border border-white/30 flex items-center justify-center 
                opacity-0 scale-95 hover:scale-105 transition-transform duration-200"
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5 md:w-8 md:h-8 text-white" />
              ) : (
                <PlayIcon className="w-5 h-5 md:w-8 md:h-8 text-white ml-1" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
