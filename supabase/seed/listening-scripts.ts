export type Voice = 'narrator' | 'woman' | 'man' | 'woman2' | 'man2' | 'woman3' | 'man3';

export type ScriptLine = {
  voice: Voice;
  text: string;
  question?: number;
  pauseAfter?: number;
};

export type PartScript = { partId: string; lines: ScriptLine[] };

const intro = (text: string): ScriptLine => ({ voice: 'narrator', text, pauseAfter: 1.5 });
const ask = (number: number, text: string): ScriptLine => ({
  voice: 'narrator',
  text: `Question ${number}. ${text}`,
  question: number,
  pauseAfter: 1.2,
});

export const listeningScripts: PartScript[] = [
  {
    partId: 'l1',
    lines: [
      intro('Part one. You will hear some short conversations. For each question, choose the correct answer.'),
      ask(1, 'Where does the woman want to meet?'),
      { voice: 'man', text: 'Shall we meet at the café before the concert? The one next to the library?' },
      {
        voice: 'woman',
        text: "Hmm, it's always so crowded on Fridays, and the library closes early anyway. Let's just meet at the station. It's easier for both of us.",
      },
      { voice: 'man', text: "Fine. I'll be by the ticket machines.", pauseAfter: 2 },
      ask(2, 'What time does the film start?'),
      { voice: 'woman', text: 'The website says six forty-five. We should leave now.' },
      {
        voice: 'man',
        text: "That's when the doors open, but there are always half an hour of adverts first. The film itself doesn't start until seven fifteen.",
      },
      { voice: 'woman', text: "Oh, then we've got time for a coffee.", pauseAfter: 2 },
      ask(3, 'How will the man travel to work tomorrow?'),
      { voice: 'woman', text: 'Are you cycling to work tomorrow?' },
      {
        voice: 'man',
        text: "I'd love to, but my bike is still at the repair shop. And my wife needs the car to visit her mother, so I'll have to take the bus.",
        pauseAfter: 2,
      },
      ask(4, 'What does the girl need to buy?'),
      { voice: 'man2', text: 'Have you got everything for the maths exam, Anna?' },
      {
        voice: 'woman2',
        text: "I've got the notebooks already, and I can borrow Tom's dictionary for English. But my calculator broke yesterday, so I need to get a new one.",
        pauseAfter: 2,
      },
      ask(5, 'Why is the shop closed?'),
      { voice: 'woman', text: "That's strange. The shop is closed. It isn't a holiday today, is it?" },
      {
        voice: 'man',
        text: "No. Look at the sign on the door: closed for repairs. They're fixing the roof after the storm. The owner says they'll open again next Monday.",
        pauseAfter: 2,
      },
      ask(6, 'What does the man order?'),
      { voice: 'man', text: "I'll have the tomato soup, please." },
      { voice: 'woman', text: "I'm sorry, the soup is finished. We have sandwiches or a chicken salad." },
      {
        voice: 'man',
        text: "I had a sandwich for lunch, so I'll take the salad, please.",
        pauseAfter: 2,
      },
      ask(7, 'Where did the woman leave her keys?'),
      { voice: 'man', text: 'Did you find your keys? Were they on your desk?' },
      {
        voice: 'woman',
        text: "I checked my desk and my bag twice. In the end they were in the car. I'd left them next to the gear stick.",
        pauseAfter: 2,
      },
      ask(8, 'How much does the ticket cost?'),
      { voice: 'woman', text: 'One ticket for the exhibition, please. How much is it?' },
      {
        voice: 'man',
        text: "It's twenty pounds, but if you're a student, you get five pounds off.",
      },
      { voice: 'woman', text: "Great, here's my student card." },
      { voice: 'man', text: "So that's fifteen pounds, then.", pauseAfter: 2 },
      { voice: 'narrator', text: 'That is the end of part one.' },
    ],
  },
  {
    partId: 'l2',
    lines: [
      intro(
        'Part two. You will hear a phone call to Riverside Library. Complete the notes. Write no more than two words.',
      ),
      { voice: 'woman', text: 'Good morning, Riverside Library. How can I help you?' },
      {
        voice: 'man',
        text: "Hello. I've just moved to the area and I'd like to become a member. Could you tell me about it?",
      },
      {
        voice: 'woman',
        text: "Of course. We're open every day. At weekends we close at five, and on weekdays we stay open until seven p.m.",
        question: 9,
      },
      { voice: 'man', text: 'Great. And how much does membership cost?' },
      {
        voice: 'woman',
        text: "The normal fee is forty-five pounds a year. Are you a student? Students get ten pounds off, so it's thirty-five pounds a year.",
        question: 10,
      },
      { voice: 'man', text: "Yes, I'm at the university. What do I need to bring?" },
      {
        voice: 'woman',
        text: "Your student card isn't enough, I'm afraid. Please bring a copy of your passport, so we can check your identity.",
        question: 11,
      },
      { voice: 'man', text: 'No problem. How many books can I borrow?' },
      {
        voice: 'woman',
        text: 'You can have up to eight books at one time, and you can keep them for three weeks.',
        question: 12,
      },
      { voice: 'man', text: 'And if I bring them back late?' },
      {
        voice: 'woman',
        text: "Then there's a fine of fifty pence for each day. Not fifteen, fifty pence.",
        question: 13,
      },
      { voice: 'man', text: 'I see. Is there a place where I can study?' },
      {
        voice: 'woman',
        text: "Yes. The ground floor is for children, but there's a quiet study room on the second floor.",
        question: 14,
      },
      { voice: 'man', text: 'Do you organise any events?' },
      {
        voice: 'woman',
        text: "We do. This month there's a free workshop on CV writing, every Thursday evening.",
        question: 15,
      },
      { voice: 'man', text: 'Perfect. And can I search for books online?' },
      {
        voice: 'woman',
        text: "Yes. When you join, we'll send you a password for the online catalogue by email. We don't send it by post any more.",
        question: 16,
      },
      { voice: 'man', text: 'Thank you very much. See you tomorrow.', pauseAfter: 2 },
      { voice: 'narrator', text: 'That is the end of part two.' },
    ],
  },
  {
    partId: 'l3',
    lines: [
      intro('Part three. You will hear six people talking about their jobs. For each speaker, choose the correct answer.'),
      { voice: 'narrator', text: 'Speaker one.', question: 17, pauseAfter: 0.8 },
      {
        voice: 'woman',
        text: "The pay is fine, nothing special, and I hardly ever travel. But I work with a fantastic team. My colleagues are the reason I get up happily every morning.",
        pauseAfter: 2,
      },
      { voice: 'narrator', text: 'Speaker two.', question: 18, pauseAfter: 0.8 },
      {
        voice: 'man',
        text: "I'm a nurse, so giving presentations or meeting deadlines isn't really an issue. The hard part is the night shifts. My body never gets used to working when everyone else is asleep.",
        pauseAfter: 2,
      },
      { voice: 'narrator', text: 'Speaker three.', question: 19, pauseAfter: 0.8 },
      {
        voice: 'man2',
        text: "People are surprised that I'm an engineer now, because I studied teaching. But my first real job was as a journalist for a local newspaper. I wrote about technology, and that's how it all began.",
        pauseAfter: 2,
      },
      { voice: 'narrator', text: 'Speaker four.', question: 20, pauseAfter: 0.8 },
      {
        voice: 'woman2',
        text: "I'm happy with my company and I don't want to move abroad. But one day I'd like to be my own boss. My dream is to start a small business selling handmade furniture.",
        pauseAfter: 2,
      },
      { voice: 'narrator', text: 'Speaker five.', question: 21, pauseAfter: 0.8 },
      {
        voice: 'woman3',
        text: "My training lasted a whole year, and luckily the company paid for it. What I liked most was that it was so hands-on. We learned by actually doing the job, not just reading about it.",
        pauseAfter: 2,
      },
      { voice: 'narrator', text: 'Speaker six.', question: 22, pauseAfter: 0.8 },
      {
        voice: 'man3',
        text: "My hours are long and not flexible at all, and some problems take weeks to solve. But when a family leaves my office with a solution, knowing I've helped people makes it all worth it.",
        pauseAfter: 2,
      },
      { voice: 'narrator', text: 'That is the end of part three.' },
    ],
  },
  {
    partId: 'l4',
    lines: [
      intro('Part four. You will hear a radio interview with a gardening expert. Choose the correct answer.'),
      {
        voice: 'man',
        text: 'Welcome back to Green Hour. My guest today is Laura Hill, who writes about city gardening. Laura, how did it all start for you?',
      },
      {
        voice: 'woman',
        text: "It started when I was about six. My grandmother gave me a tiny corner of her garden, and I grew my first carrots there. I studied economics at university, but I never lost that love.",
        question: 23,
      },
      { voice: 'man', text: "Many listeners live in flats. Isn't space the biggest problem in the city?" },
      {
        voice: 'woman',
        text: "Everyone thinks so, and pollution is a worry too. But actually the main problem is the soil. City soil is often poor, full of stones and building waste, so plants simply can't grow well.",
        question: 24,
      },
      { voice: 'man', text: 'So what should a complete beginner grow?' },
      {
        voice: 'woman',
        text: "Not tomatoes. They need a lot of care. And flowers can be disappointing at first. I always tell beginners to start with herbs, like mint or basil. They grow quickly in small pots.",
        question: 25,
      },
      { voice: 'man', text: 'You also support community gardens. Why are they important?' },
      {
        voice: 'woman',
        text: "They cost very little and you rarely need official permission. But the real benefit is social. Community gardens bring neighbours together. People who never spoke before start sharing tools and advice.",
        question: 26,
      },
      { voice: 'man', text: "Wonderful. And you'll be back next week?" },
      {
        voice: 'woman',
        text: "Yes. I was going to talk about saving water, but so many listeners asked about compost that next week will be all about composting at home.",
        question: 27,
      },
      { voice: 'man', text: 'Laura Hill, thank you.', pauseAfter: 2 },
      { voice: 'narrator', text: 'That is the end of part four.' },
    ],
  },
  {
    partId: 'l5',
    lines: [
      intro('Part five. You will hear a guide at the City Museum. Complete the notes. Write one word or a number.'),
      {
        voice: 'woman',
        text: "Good morning, everyone, and welcome to the City Museum. Our guided tour starts here, at the main entrance, so please don't go to the side door by the shop.",
        question: 28,
      },
      {
        voice: 'woman',
        text: "The tour usually takes an hour and a half. That's ninety minutes, with a short break in the café halfway through.",
        question: 29,
      },
      {
        voice: 'woman',
        text: "You're welcome to take photos everywhere in the museum, except in the gallery, because the old paintings can be damaged by the flash.",
        question: 30,
      },
      { voice: 'woman', text: "Right, if everyone is ready, let's begin.", pauseAfter: 2 },
      { voice: 'narrator', text: 'That is the end of part five.' },
    ],
  },
  {
    partId: 'l6',
    lines: [
      intro('Part six. You will hear a lecture about sleep. Choose the correct answer.'),
      {
        voice: 'man',
        text: "Good afternoon. Today we're talking about sleep. Let's start with the most common question: how much do we really need? Some people claim six hours is enough, and a few like ten. But research shows that most adults need between seven and nine hours a night.",
        question: 31,
      },
      {
        voice: 'man',
        text: "Now, what about phones and tablets? Many people think screens give us bad dreams, or make us wake up at night. In fact, their main effect is on falling asleep. The light from the screen tells the brain it's still daytime.",
        question: 32,
      },
      {
        voice: 'man',
        text: "What about naps? A morning nap doesn't do much, and an evening nap can ruin your night. The most useful time for a short nap is after lunch, when energy naturally drops.",
        question: 33,
      },
      {
        voice: 'man',
        text: "Teenagers are a special case. Parents often complain that they're lazy. But teenagers' body clocks actually shift, so they tend to fall asleep later and wake up later. It isn't that they sleep less deeply.",
        question: 34,
      },
      {
        voice: 'man',
        text: "So, what's my final advice? Diet and exercise both matter, but the most important thing is routine. Go to bed and get up at the same time every day, even at weekends. Thank you.",
        question: 35,
        pauseAfter: 2,
      },
      { voice: 'narrator', text: 'That is the end of the listening test.' },
    ],
  },
];
