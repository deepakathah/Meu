export const ratingEmojis = {
  1: { label: "Worst", active: "WorstActive", inactive: "WorstInActive" },
  2: { label: "Not Good", active: "NotGoodActive", inactive: "NotGoodInActive" },
  3: { label: "Fine", active: "FineActive", inactive: "FineInActive" },
  4: { label: "Good", active: "GoodActive", inactive: "GoodInActive" },
  5: { label: "Very Good", active: "VeryGoodActive", inactive: "VeryGoodInActive" },
};

export const feedbackPoints = [
  "Behaviour",
  "Communication",
  "Punctuality",
  "OverallExperience",
];

export const defaultFeedbacks = {
  emoji: "Fine",
  categories: {
    Behaviour: 3,
    Communication: 3,
    Punctuality: 3,
    OverallExperience: 3,
  },
  flag: 3,
  query: "",
};
