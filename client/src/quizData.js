// src/quizData.js

// === TRIVIA QUESTIONS ===
export const triviaQuestions = [
    {
      id: 1,
      type: "multiple",
      question: "Which anime features the character 'Levi Ackerman'?",
      options: ["One Piece", "Attack on Titan", "Bleach", "Fullmetal Alchemist"],
      answer: "Attack on Titan",
    },
    {
      id: 2,
      type: "multiple",
      question: "Who is the main protagonist of 'Naruto'?",
      options: ["Sasuke Uchiha", "Kakashi Hatake", "Naruto Uzumaki", "Itachi Uchiha"],
      answer: "Naruto Uzumaki",
    },
    {
      id: 3,
      type: "multiple",
      question: "In 'Demon Slayer', what is Nezuko's relation to Tanjiro?",
      options: ["Sister", "Cousin", "Friend", "Stranger"],
      answer: "Sister",
    },
    {
      id: 4,
      type: "multiple",
      question: "Which anime is set in the city of 'Tokyo-3'?",
      options: ["Tokyo Ghoul", "Neon Genesis Evangelion", "Psycho-Pass", "Akira"],
      answer: "Neon Genesis Evangelion",
    },
    {
      id: 5,
      type: "multiple",
      question: "What is the name of the pirate crew led by Monkey D. Luffy?",
      options: [
        "Red-Haired Pirates",
        "Heart Pirates",
        "Straw Hat Pirates",
        "Blackbeard Pirates",
      ],
      answer: "Straw Hat Pirates",
    },
    {
      id: 6,
      type: "multiple",
      question: "In 'My Hero Academia', what is Deku's real name?",
      options: [
        "Shoto Todoroki",
        "Katsuki Bakugo",
        "Izuku Midoriya",
        "Tenya Iida",
      ],
      answer: "Izuku Midoriya",
    },
    {
      id: 7,
      type: "multiple",
      question: "Which anime centers around a notebook that can kill people?",
      options: ["Death Parade", "Parasyte", "Death Note", "Erased"],
      answer: "Death Note",
    },
    {
      id: 8,
      type: "multiple",
      question: "Who is the Homunculus with the Ouroboros tattoo on her chest?",
      options: ["Lust", "Greed", "Envy", "Gluttony"],
      answer: "Lust",
    },
    {
      id: 9,
      type: "multiple",
      question: "In 'Jujutsu Kaisen', what grade sorcerer is Satoru Gojo?",
      options: ["Grade 1", "Special Grade", "Grade 2", "Semi-Grade 1"],
      answer: "Special Grade",
    },
    {
      id: 10,
      type: "multiple",
      question: "Which studio animated 'Spirited Away'?",
      options: ["Studio Trigger", "Kyoto Animation", "Madhouse", "Studio Ghibli"],
      answer: "Studio Ghibli",
    },
    {
      id: 11,
      type: "multiple",
      question: "What is the main sport in 'Haikyuu!!'?",
      options: ["Basketball", "Soccer", "Volleyball", "Baseball"],
      answer: "Volleyball",
    },
    {
      id: 12,
      type: "multiple",
      question: "In 'Hunter x Hunter', what is Gon’s last name?",
      options: ["Freecss", "Zoldyck", "Kurta", "Leorio"],
      answer: "Freecss",
    },
    {
      id: 13,
      type: "multiple",
      question: "Which anime is known for the line 'I am gonna be King of the Pirates!'?",
      options: ["Black Clover", "One Piece", "Fairy Tail", "Gintama"],
      answer: "One Piece",
    },
    {
      id: 14,
      type: "multiple",
      question: "In 'Tokyo Ghoul', what is Kaneki’s first name?",
      options: ["Hide", "Arima", "Ken", "Touka"],
      answer: "Ken",
    },
    {
      id: 15,
      type: "multiple",
      question: "What is the name of the guild in 'Fairy Tail'?",
      options: ["Sabertooth", "Blue Pegasus", "Fairy Tail", "Phantom Lord"],
      answer: "Fairy Tail",
    },
    {
      id: 16,
      type: "multiple",
      question: "In 'Sword Art Online', what is Kirito’s real first name?",
      options: ["Asuna", "Kazuto", "Klein", "Eugeo"],
      answer: "Kazuto",
    },
    {
      id: 17,
      type: "multiple",
      question: "Which anime features the character 'Saitama'?",
      options: ["Mob Psycho 100", "One Punch Man", "Bleach", "Overlord"],
      answer: "One Punch Man",
    },
    {
      id: 18,
      type: "multiple",
      question: "In 'Blue Lock', what position does Isagi Yoichi primarily play?",
      options: ["Goalkeeper", "Defender", "Midfielder", "Striker"],
      answer: "Striker",
    },
    {
      id: 19,
      type: "multiple",
      question: "Which anime features alchemy as a central theme?",
      options: [
        "Fullmetal Alchemist: Brotherhood",
        "Attack on Titan",
        "Code Geass",
        "Steins;Gate",
      ],
      answer: "Fullmetal Alchemist: Brotherhood",
    },
    {
      id: 20,
      type: "multiple",
      question: "In 'Demon Slayer', what is the name of the demon slayer corps leader?",
      options: [
        "Kagaya Ubuyashiki",
        "Kyojuro Rengoku",
        "Muzan Kibutsuji",
        "Giyu Tomioka",
      ],
      answer: "Kagaya Ubuyashiki",
    },
  ];
  
  // === PERSONALITY QUIZ ===
  export const personalityQuestions = [
    {
      id: 1,
      question: "What motivates you the most?",
      options: [
        { label: "Protecting the people I care about", value: "tanjiro" },
        { label: "Becoming the strongest", value: "goku" },
        { label: "Achieving my long-term dream", value: "luffy" },
        { label: "Proving everyone wrong", value: "sasuke" },
      ],
    },
    {
      id: 2,
      question: "How do you handle conflict?",
      options: [
        { label: "Try to understand the other side first", value: "tanjiro" },
        { label: "Charge in headfirst", value: "goku" },
        { label: "Keep smiling but stay serious inside", value: "luffy" },
        { label: "Stay calm and analyze everything", value: "sasuke" },
      ],
    },
    {
      id: 3,
      question: "Your friends would describe you as...",
      options: [
        { label: "Kind and empathetic", value: "tanjiro" },
        { label: "Laid-back but reliable", value: "goku" },
        { label: "Energetic and goofy", value: "luffy" },
        { label: "Quiet but intense", value: "sasuke" },
      ],
    },
    {
      id: 4,
      question: "Pick a battle style:",
      options: [
        { label: "Fast and precise", value: "tanjiro" },
        { label: "Pure power", value: "goku" },
        { label: "Unpredictable and creative", value: "luffy" },
        { label: "Strategic and calculated", value: "sasuke" },
      ],
    },
    {
      id: 5,
      question: "How do you feel about teamwork?",
      options: [
        { label: "I value it a lot", value: "tanjiro" },
        { label: "I like it but don’t overthink it", value: "goku" },
        { label: "I love leading the crew", value: "luffy" },
        { label: "I prefer doing things my own way", value: "sasuke" },
      ],
    },
  ];
  
  export const personalityResults = {
    tanjiro: {
      name: "Tanjiro Kamado",
      anime: "Demon Slayer",
      description:
        "You’re kind-hearted, protective, and always thinking about others. You push yourself hard but never lose your empathy.",
    },
    goku: {
      name: "Goku",
      anime: "Dragon Ball",
      description:
        "You’re laid-back but live for a challenge. You see obstacles as chances to get stronger and you don’t stay down for long.",
    },
    luffy: {
      name: "Monkey D. Luffy",
      anime: "One Piece",
      description:
        "You’re optimistic, loyal, and a natural leader. You might act goofy, but when it matters, you’re dead serious for your friends and your dreams.",
    },
    sasuke: {
      name: "Sasuke Uchiha",
      anime: "Naruto",
      description:
        "You’re focused, intense, and driven. You think deeply and keep your circle small, but your determination stands out.",
    },
  };
  