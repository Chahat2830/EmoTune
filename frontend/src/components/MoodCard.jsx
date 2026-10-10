import {
  Frown,
  Heart,
  Meh,
  Smile,
  Sparkles,
} from "lucide-react";

import "./MoodCard.css";

const moodConfig = {
  happy: {
    label: "Happy",
    icon: Smile,
    className: "happy",
    description: "Bright songs for a joyful moment.",
  },

  sad: {
    label: "Sad",
    icon: Frown,
    className: "sad",
    description: "Gentle songs for quiet moments.",
  },

  angry: {
    label: "Angry",
    icon: Meh,
    className: "angry",
    description: "Let the music release the energy.",
  },

  fear: {
    label: "Fear",
    icon: Heart,
    className: "fear",
    description: "Comforting music to calm your mind.",
  },

  surprise: {
    label: "Surprise",
    icon: Sparkles,
    className: "surprise",
    description: "Something unexpected for your mood.",
  },
};

function MoodCard({
  mood = "happy",
  confidence = null,
  onClick,
}) {
  const config =
    moodConfig[mood.toLowerCase()] ||
    moodConfig.happy;

  const Icon = config.icon;

  return (
    <div
      className={`mood-card soft-card ${config.className}`}
      onClick={onClick}
    >
      <div className="mood-card-icon">
        <Icon size={28} strokeWidth={1.7} />
      </div>

      <div className="mood-card-content">
        <p className="mood-card-label">
          YOUR CURRENT MOOD
        </p>

        <h3 className="display-font">
          {config.label}
        </h3>

        <p className="mood-card-description">
          {config.description}
        </p>

        {confidence !== null && (
          <div className="confidence">
            <div className="confidence-header">
              <span>Confidence</span>
              <strong>
                {Math.round(confidence * 100)}%
              </strong>
            </div>

            <div className="confidence-track">
              <div
                className="confidence-fill"
                style={{
                  width: `${confidence * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodCard;