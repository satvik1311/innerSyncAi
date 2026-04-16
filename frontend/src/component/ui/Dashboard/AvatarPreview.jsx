import React from "react";

/**
 * AvatarPreview
 * Generates DiceBear URL with gender-specific modifiers.
 */
const AvatarPreview = ({ seed, style = "avataaars", gender, className = "" }) => {
  const getModifiers = () => {
    let mods = "";
    if (style === "avataaars") {
      if (gender === "Male") {
        // High probability of short hair and beards
        mods = "&topProbability=100&facialHairProbability=80&top[]=shortHair,shaggy,shaggyMullet,shortCurly,shortFlat,shortRound,shortWaved,sides,theCaesar,theCaesarAndSidePart";
      } else if (gender === "Female") {
        // High probability of long hair and no beards
        mods = "&topProbability=100&facialHairProbability=0&top[]=longHair,blonde,bob,bun,curly,curlySubPart,dreads,frida,fro,froBand,hijab,kurly,layered,long,misty,punk,shaved,shavedSides,straight,straight2,straightAndCurly";
      } else {
        // Neutral
        mods = "";
      }
    }
    return mods;
  };

  const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed || 'default'}${getModifiers()}`;

  return (
    <div className={`overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 ${className}`}>
      <img 
        src={avatarUrl} 
        alt="Digital Identity" 
        className="w-full h-full object-contain"
        onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/initials/svg?seed=User"; }}
      />
    </div>
  );
};

export default AvatarPreview;
