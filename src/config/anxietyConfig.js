export const anxietyLevels = {
  0: { text: "Cool as a cucumber", emoji: "🥒" },
  1: { text: "I like a little buffer", emoji: "😮‍💨" },
  2: { text: "Hope TSA doesn't shout at me", emoji: "🤬" },
  3: { text: "What if my Uber cancels twice?", emoji: "🚗" },
  4: { text: "My plants will die alone", emoji: "🪴" },
  5: { text: "Everyone's judging me", emoji: "👀" },
  6: { text: "I love the announcements", emoji: "📢" },
  7: { text: "Existential airport dread", emoji: "💀" },
  8: { text: "Having heart palpitations", emoji: "💗" },
  9: { text: "This is my villain origin", emoji: "😈" },
  10: { text: "I'll relax when we land", emoji: "🛬" },
};

export const getAnxietyText = (level, extraMinutes) => {
  return `${anxietyLevels[level].text} (+${extraMinutes} min)`;
};

export const getEmoji = (level) => anxietyLevels[level].emoji;
