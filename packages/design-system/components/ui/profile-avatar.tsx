"use client"

import React, { useEffect, useRef, useMemo } from "react"
import { hashCode, getUnit, getRandomColor, getBoolean, getContrast, generateColorsFromUsername } from "../../lib/utils"

// Type definitions
export type AvatarStyle = "marble" | "beam" | "random"

export interface ProfileAvatarProps {
  username?: string
  avatarStyle?: AvatarStyle
  size?: number
  square?: boolean
  avatarString?: string // The encoded format: username_variant_style_size_size_square_boolean
  onAvatarGenerated?: (svgString: string) => void
  onMetaDataGenerated?: (metaData: string) => void // The encoded string
  onAvatarSelected?: (avatarString: string) => void // Returns the encoded metadata
  selectable?: boolean // Shows selection UI if needed
  className?: string
}

// Constants
const MARBLE_ELEMENTS = 3
const MARBLE_SIZE = 80
const BEAM_SIZE = 36

// Parsing Logic
const parseAvatarString = (str: string | undefined) => {
  if (!str) return null
  const parts = str.split("_")
  if (parts.length < 7 || parts[1] !== "variant" || parts[3] !== "size" || parts[5] !== "square") {
    return null
  }
  return {
    username: parts[0],
    avatarStyle: parts[2] as AvatarStyle,
    size: parseInt(parts[4], 10),
    square: parts[6] === "true",
  }
}

// ProfileAvatar component
export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  username: initialUsername,
  avatarStyle: initialAvatarStyle = "random",
  size: initialSize = 80,
  square: initialSquare = false,
  avatarString,
  onAvatarGenerated,
  onMetaDataGenerated,
  onAvatarSelected,
  selectable = false,
  className = "",
}) => {
  const parsedProps = useMemo(() => parseAvatarString(avatarString), [avatarString])

  // Priority: avatarString > individual props
  const finalProps = useMemo(() => {
    if (parsedProps) {
      return parsedProps
    }
    return { 
      username: initialUsername || "default_user",
      avatarStyle: initialAvatarStyle,
      size: initialSize,
      square: initialSquare
    }
  }, [parsedProps, initialUsername, initialAvatarStyle, initialSize, initialSquare])

  const { username, avatarStyle, size, square } = finalProps
  const safeUsername = username || "default_user"

  // Create a ref for the SVG element
  const svgRef = useRef<SVGSVGElement>(null)

  // Generate a unique ID for SVG masks
  const maskID = React.useId()

  // Determine which avatar style to use
  const style = useMemo(() => {
    if (avatarStyle === "random") {
      return hashCode(safeUsername) % 2 === 0 ? "marble" : "beam"
    }
    return avatarStyle
  }, [avatarStyle, safeUsername])

  // Generate colors from the username
  const colors = useMemo(() => generateColorsFromUsername(safeUsername), [safeUsername])

  // Generate marble avatar properties
  const marbleProperties = useMemo(() => {
    if (style !== "marble") return null

    const numFromName = hashCode(safeUsername)
    const range = colors.length

    return Array.from({ length: MARBLE_ELEMENTS }, (_, i) => ({
      color: getRandomColor(numFromName + i, colors, range),
      translateX: getUnit(numFromName * (i + 1), MARBLE_SIZE / 10, 1),
      translateY: getUnit(numFromName * (i + 1), MARBLE_SIZE / 10, 2),
      scale: 1.2 + getUnit(numFromName * (i + 1), MARBLE_SIZE / 20) / 10,
      rotate: getUnit(numFromName * (i + 1), 360, 1),
    }))
  }, [style, safeUsername, colors])

  // Generate beam avatar data
  const beamData = useMemo(() => {
    if (style !== "beam") return null

    const numFromName = hashCode(safeUsername)
    const range = colors.length
    const wrapperColor = getRandomColor(numFromName, colors, range)
    const preTranslateX = getUnit(numFromName, 10, 1)
    const wrapperTranslateX = preTranslateX < 5 ? preTranslateX + BEAM_SIZE / 9 : preTranslateX
    const preTranslateY = getUnit(numFromName, 10, 2)
    const wrapperTranslateY = preTranslateY < 5 ? preTranslateY + BEAM_SIZE / 9 : preTranslateY

    return {
      wrapperColor,
      faceColor: getContrast(wrapperColor),
      backgroundColor: getRandomColor(numFromName + 13, colors, range),
      wrapperTranslateX,
      wrapperTranslateY,
      wrapperRotate: getUnit(numFromName, 360),
      wrapperScale: 1 + getUnit(numFromName, BEAM_SIZE / 12) / 10,
      isMouthOpen: getBoolean(numFromName, 2),
      isCircle: getBoolean(numFromName, 1),
      eyeSpread: getUnit(numFromName, 5),
      mouthSpread: getUnit(numFromName, 3),
      faceRotate: getUnit(numFromName, 10, 3),
      faceTranslateX: wrapperTranslateX > BEAM_SIZE / 6 ? wrapperTranslateX / 2 : getUnit(numFromName, 8, 1),
      faceTranslateY: wrapperTranslateY > BEAM_SIZE / 6 ? wrapperTranslateY / 2 : getUnit(numFromName, 7, 2),
    }
  }, [style, safeUsername, colors])

  // Call callbacks when the SVG is rendered
  useEffect(() => {
    if (svgRef.current) {
      const metaData = `${safeUsername}_variant_${style}_size_${size}_square_${square}`
      
      if (onAvatarGenerated) {
        const svgString = new XMLSerializer().serializeToString(svgRef.current)
        onAvatarGenerated(svgString)
      }
      
      if (onMetaDataGenerated) {
        onMetaDataGenerated(metaData)
      }
      
      if (onAvatarSelected && selectable) {
        onAvatarSelected(metaData)
      }
    }
  }, [style, safeUsername, size, square, onAvatarGenerated, onMetaDataGenerated, onAvatarSelected, selectable])

  // Render the marble avatar
  if (style === "marble" && marbleProperties) {
    return (
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MARBLE_SIZE} ${MARBLE_SIZE}`}
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        className={className}
      >
        <title>{safeUsername}</title>
        <mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={MARBLE_SIZE} height={MARBLE_SIZE}>
          <rect width={MARBLE_SIZE} height={MARBLE_SIZE} rx={square ? undefined : MARBLE_SIZE * 2} fill="#FFFFFF" />
        </mask>
        <g mask={`url(#${maskID})`}>
          <rect width={MARBLE_SIZE} height={MARBLE_SIZE} fill={marbleProperties[0].color} />
          <path
            filter={`url(#filter_${maskID})`}
            d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
            fill={marbleProperties[1].color}
            transform={
              "translate(" +
              marbleProperties[1].translateX +
              " " +
              marbleProperties[1].translateY +
              ") rotate(" +
              marbleProperties[1].rotate +
              " " +
              MARBLE_SIZE / 2 +
              " " +
              MARBLE_SIZE / 2 +
              ") scale(" +
              marbleProperties[2].scale +
              ")"
            }
          />
          <path
            filter={`url(#filter_${maskID})`}
            style={{
              mixBlendMode: "overlay",
            }}
            d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
            fill={marbleProperties[2].color}
            transform={
              "translate(" +
              marbleProperties[2].translateX +
              " " +
              marbleProperties[2].translateY +
              ") rotate(" +
              marbleProperties[2].rotate +
              " " +
              MARBLE_SIZE / 2 +
              " " +
              MARBLE_SIZE / 2 +
              ") scale(" +
              marbleProperties[2].scale +
              ")"
            }
          />
        </g>
        <defs>
          <filter id={`filter_${maskID}`} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity={0} result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation={7} result="effect1_foregroundBlur" />
          </filter>
        </defs>
      </svg>
    )
  }

  // Render the beam avatar
  if (style === "beam" && beamData) {
    return (
      <svg
        ref={svgRef}
        viewBox={`0 0 ${BEAM_SIZE} ${BEAM_SIZE}`}
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        className={className}
      >
        <title>{safeUsername}</title>
        <mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={BEAM_SIZE} height={BEAM_SIZE}>
          <rect width={BEAM_SIZE} height={BEAM_SIZE} rx={square ? undefined : BEAM_SIZE * 2} fill="#FFFFFF" />
        </mask>
        <g mask={`url(#${maskID})`}>
          <rect width={BEAM_SIZE} height={BEAM_SIZE} fill={beamData.backgroundColor} />
          <rect
            x="0"
            y="0"
            width={BEAM_SIZE}
            height={BEAM_SIZE}
            transform={
              "translate(" +
              beamData.wrapperTranslateX +
              " " +
              beamData.wrapperTranslateY +
              ") rotate(" +
              beamData.wrapperRotate +
              " " +
              BEAM_SIZE / 2 +
              " " +
              BEAM_SIZE / 2 +
              ") scale(" +
              beamData.wrapperScale +
              ")"
            }
            fill={beamData.wrapperColor}
            rx={beamData.isCircle ? BEAM_SIZE : BEAM_SIZE / 6}
          />
          <g
            transform={
              "translate(" +
              beamData.faceTranslateX +
              " " +
              beamData.faceTranslateY +
              ") rotate(" +
              beamData.faceRotate +
              " " +
              BEAM_SIZE / 2 +
              " " +
              BEAM_SIZE / 2 +
              ")"
            }
          >
            {beamData.isMouthOpen ? (
              <path
                d={"M15 " + (19 + beamData.mouthSpread) + "c2 1 4 1 6 0"}
                stroke={beamData.faceColor}
                fill="none"
                strokeLinecap="round"
              />
            ) : (
              <path d={"M13," + (19 + beamData.mouthSpread) + " a1,0.75 0 0,0 10,0"} fill={beamData.faceColor} />
            )}
            <rect
              x={14 - beamData.eyeSpread}
              y={14}
              width={1.5}
              height={2}
              rx={1}
              stroke="none"
              fill={beamData.faceColor}
            />
            <rect
              x={20 + beamData.eyeSpread}
              y={14}
              width={1.5}
              height={2}
              rx={1}
              stroke="none"
              fill={beamData.faceColor}
            />
          </g>
        </g>
      </svg>
    )
  }

  // Fallback (should never happen due to the style determination above)
  return null
}

export default ProfileAvatar
