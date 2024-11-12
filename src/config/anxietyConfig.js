export const anxietyLevels = {
  0: { text: "Cool as a cucumber", emoji: "🥒" },
  1: { text: "I like a little buffer", emoji: "😮‍💨" },
  2: { text: "Hope TSA doesn't shout at me", emoji: "🤬" },
  3: { text: "What if my Uber cancels twice?", emoji: "🚗" },
  4: { text: "Did I pack my ID?", emoji: "🔍" },
  5: { text: "I'll relax when I get there", emoji: "🤷‍♂️" },
  6: { text: "I love the announcements", emoji: "📢" },
  7: { text: "Please don't give my seat away", emoji: "💺" },
  8: { text: "I hate being late", emoji: "🤢" },
  9: { text: "When do they close the door?", emoji: "🚪" },
  10: { text: "I'll relax when we land", emoji: "🛬" },
};

export const getAnxietyText = (level, extraMinutes) => {
  return `${anxietyLevels[level].text} (+${extraMinutes} min)`;
};

export const getEmoji = (level) => anxietyLevels[level].emoji;
