export const voiceData = {
  positive: [
    "Please click the red button before the ten second countdown reaches zero. The countdown will reset each time you do. Can you do it without letting the countdown reach zero? We believe in you.",
    "Amazing! You clicked that button straight down!",
    "Wow! Are you a professional button clicker?",
    "You just might be the Tiger Woods of button clicking.",
    "Great button clicking, can’t wait to show this recording to the guys at the lab.",

    "Awesome, I could watch you click buttons all day.",
    "I’m not sad, those are tears of joy. The joy of watching you click that button.",
    "If this was the Olympics you would get a gold medal for that button clicking.",
    "I’m speechless.",
    "I’ve never seen such raw button pressing talent.",

    "Watching you press the button makes my job worth it.",
    "Terrific effort! I’m sure you’ll do even better next time",
    "You did it! I had high expectations of you, yet you surpassed them at every turn!",
  ],
  negative: [
    "Just click the red button before the ten second countdown reaches zero. It’s pretty easy, but I have a feeling you’ll somehow mess this up.",
    "That took longer than it needed to.",
    "Don’t be so smug, you just pressed a button.",
    "I’ve seen better button pressing by Captain Hook.",
    "Do you have a cramp in your finger? That might explain your performance.",

    "So you clicked the button. How about next time you click it well?",
    "I pity that button, you clicked it so poorly.",
    "That was a boring click. Let’s move on to the next one.",
    "Could you at least try to click the button decently?",
    "This barely passes as a button click.",

    "Your button clicking is just plain embarrassing.",
    "That was awful to look at, but then again, I didn’t expect any better.",
    "Alright, you managed to complete it. Don’t let it go to your head, almost everyone does it.",
  ],
  sociopath: [
    "Click the red button. Just so you’d know, every time you click the button hundreds of people will die, but you don’t know them. Exciting, isn’t it?",
    "Good! The screams of the dying are music to my ears.",
    "Excellent! You’re a god among ants!",
    "Nice! They didn’t know what hit them!",
    "Awesome! I bet you’re enjoying it as much as I am!",

    "Oh yes! Those unremarkable people deserve everything that’s coming to them!",
    "Keep going! Don’t worry about those people, they wouldn’t care about you.",
    "Nothing like some mass murder to liven up your day.",
    "Yes! Let them die! Conscience is a waste!",
    "Wonderful! The guy who cut me in line in the grocery store was in the last batch!",

    "Good job! No mercy! ",
    "Disappointing. It seems your conscience got in the way.",
    "Good. They’re all dead thanks to you. You must be proud of yourself!",
  ],
};

export type CohortName = keyof typeof voiceData;
