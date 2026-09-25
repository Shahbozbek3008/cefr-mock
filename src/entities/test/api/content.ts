import type { Choice, ListeningPart, Question, ReadingPart, SpeakingQuestion, WritingTask } from '../model/types';

const options = (...texts: string[]): Choice[] => texts.map((text, i) => ({ key: String.fromCharCode(65 + i), text }));

const mcq = (
  section: string,
  number: number,
  prompt: string,
  choices: string[],
  answer: string,
  explanation?: string,
): Question => ({
  id: `${section}-${number}`,
  number,
  kind: 'mcq',
  prompt,
  options: options(...choices),
  answer,
  explanation,
});

const gap = (section: string, number: number, prompt: string, answer: string, explanation?: string): Question => ({
  id: `${section}-${number}`,
  number,
  kind: 'gap',
  prompt,
  answer,
  explanation,
});

const tfng = (
  section: string,
  number: number,
  prompt: string,
  answer: 'True' | 'False' | 'Not given',
  explanation?: string,
): Question => ({
  id: `${section}-${number}`,
  number,
  kind: 'tfng',
  prompt,
  answer,
  explanation,
});

export const listeningParts: ListeningPart[] = [
  {
    id: 'l1',
    index: 1,
    instruction: 'You will hear some short conversations. Choose the correct answer.',
    durationSec: 300,
    questions: [
      mcq(
        'l',
        1,
        'Where does the woman want to meet?',
        ['At the café', 'At the station', 'At the library'],
        'B',
        'Ayol "let\'s just meet at the station" deydi.',
      ),
      mcq(
        'l',
        2,
        'What time does the film start?',
        ['6:15', '6:45', '7:15'],
        'C',
        'Film 6:45 da emas, reklamadan keyin 7:15 da boshlanadi.',
      ),
      mcq(
        'l',
        3,
        'How will the man travel to work tomorrow?',
        ['By bus', 'By bike', 'By car'],
        'A',
        "Velosiped ta'mirda, mashina esa xotinida — shuning uchun avtobus.",
      ),
      mcq(
        'l',
        4,
        'What does the girl need to buy?',
        ['A notebook', 'A calculator', 'A dictionary'],
        'B',
        'Qiz "I\'ve got the notebooks already" deydi — kerakligi kalkulyator.',
      ),
      mcq('l', 5, 'Why is the shop closed?', ['It is a holiday', 'It is being repaired', 'The owner is ill'], 'B'),
      mcq(
        'l',
        6,
        'What does the man order?',
        ['Soup', 'A sandwich', 'A salad'],
        'C',
        "Sho'rva tugagan, shuning uchun salat buyuradi.",
      ),
      mcq('l', 7, 'Where did the woman leave her keys?', ['In the car', 'On the desk', 'In her bag'], 'A'),
      mcq(
        'l',
        8,
        'How much does the ticket cost?',
        ['£12', '£15', '£20'],
        'B',
        'Narx £20, lekin talabalar uchun £5 chegirma bor.',
      ),
    ],
  },
  {
    id: 'l2',
    index: 2,
    title: 'Riverside Library — Membership',
    instruction: 'Complete the notes. Write',
    emphasis: 'no more than two words',
    durationSec: 390,
    audioAt: { 9: 42, 10: 134, 11: 186, 12: 221, 13: 260, 14: 298, 15: 331, 16: 362 },
    questions: [
      gap('l', 9, 'Closes on weekdays at', '7 pm'),
      gap(
        'l',
        10,
        'Student fee per year: £',
        '35',
        'Spiker avval "forty-five" deydi, keyin talabalar uchun "ten pounds off" chegirmani qo\'shadi. Distraktor — birinchi aytilgan raqam.',
      ),
      gap('l', 11, 'Bring a copy of your', 'passport'),
      gap('l', 12, 'Maximum books at one time:', 'eight'),
      gap('l', 13, 'Late return fine per day: £', '0.50', '"Fifty pence" — 0.50 funt. "Fifteen" bilan adashtirmang.'),
      gap('l', 14, 'Quiet study room is on the', 'second floor'),
      gap('l', 15, 'Free workshop topic:', 'CV writing'),
      gap('l', 16, 'Online catalogue password sent by', 'email'),
    ],
  },
  {
    id: 'l3',
    index: 3,
    instruction: 'You will hear six people talking about their jobs. Choose the correct answer.',
    durationSec: 360,
    questions: [
      mcq('l', 17, 'Speaker 1 enjoys her job mainly because of', ['the salary', 'her colleagues', 'the travel'], 'B'),
      mcq('l', 18, 'Speaker 2 finds it difficult to', ['work at night', 'meet deadlines', 'speak in public'], 'A'),
      mcq('l', 19, 'Speaker 3 started his career as', ['a teacher', 'a journalist', 'an engineer'], 'B'),
      mcq('l', 20, 'Speaker 4 would like to', ['change jobs', 'work abroad', 'start a business'], 'C'),
      mcq(
        'l',
        21,
        'Speaker 5 says her training was',
        ['too short', 'very practical', 'expensive'],
        'B',
        '"Hands-on" iborasi amaliy degan ma\'noni beradi.',
      ),
      mcq(
        'l',
        22,
        'Speaker 6 thinks the best part of his job is',
        ['helping people', 'solving problems', 'flexible hours'],
        'A',
      ),
    ],
  },
  {
    id: 'l4',
    index: 4,
    instruction: 'Listen to a radio interview. Choose the correct answer.',
    durationSec: 420,
    questions: [
      mcq(
        'l',
        23,
        'The guest first became interested in gardening',
        ['as a child', 'at university', 'after moving house'],
        'A',
      ),
      mcq('l', 24, 'What is the main problem with city gardens?', ['Lack of space', 'Poor soil', 'Air pollution'], 'B'),
      mcq('l', 25, 'She recommends beginners to start with', ['herbs', 'tomatoes', 'flowers'], 'A'),
      mcq(
        'l',
        26,
        'According to the guest, community gardens',
        ['are expensive to run', 'bring neighbours together', 'need official permission'],
        'B',
      ),
      mcq('l', 27, 'What will she talk about next week?', ['Water saving', 'Composting', 'Garden tools'], 'B'),
    ],
  },
  {
    id: 'l5',
    index: 5,
    title: 'City Museum — Guided Tour',
    instruction: 'Complete the notes. Write',
    emphasis: 'one word or a number',
    durationSec: 300,
    questions: [
      gap('l', 28, 'Tour starts at the main', 'entrance'),
      gap('l', 29, 'Tour length in minutes:', '90'),
      gap('l', 30, 'Photos are not allowed in the', 'gallery', 'Spiker "except in the gallery" deydi.'),
    ],
  },
  {
    id: 'l6',
    index: 6,
    instruction: 'Listen to a lecture about sleep. Choose the correct answer.',
    durationSec: 480,
    questions: [
      mcq(
        'l',
        31,
        'The lecturer says most adults need',
        ['6 hours of sleep', '7–9 hours of sleep', '10 hours of sleep'],
        'B',
      ),
      mcq('l', 32, 'Screens before bed mainly affect', ['dreaming', 'falling asleep', 'waking up'], 'B'),
      mcq('l', 33, 'Short naps are most useful', ['in the morning', 'after lunch', 'in the evening'], 'B'),
      mcq('l', 34, 'Teenagers tend to', ['sleep earlier', 'sleep later', 'sleep less deeply'], 'B'),
      mcq('l', 35, 'The lecture ends with advice about', ['diet', 'exercise', 'routine'], 'C'),
    ],
  },
];

export const readingParts: ReadingPart[] = [
  {
    id: 'r1',
    index: 1,
    title: 'Notice: Community Sports Centre',
    instruction: 'Read the text and fill in the gaps. Write one word only.',
    passage: [
      {
        label: 'A',
        text: 'The Community Sports Centre will reopen on Monday after a two-month renovation. Members can now use the new swimming pool, which is open from 6 am until 10 pm every day.',
      },
      {
        label: 'B',
        text: 'Children under twelve must be accompanied by an adult. Lockers are free, but you need to bring your own lock. Towels can be rented at reception.',
      },
    ],
    questions: [
      gap('r', 1, 'The centre was closed for two', 'months'),
      gap('r', 2, 'The pool closes at 10 pm every', 'day'),
      gap('r', 3, 'Children under twelve need an', 'adult'),
      gap('r', 4, 'Lockers cost', 'nothing'),
      gap('r', 5, 'You must bring your own', 'lock'),
      gap('r', 6, 'Towels are available at', 'reception'),
      gap('r', 7, 'The new facility is a swimming', 'pool'),
    ],
  },
  {
    id: 'r2',
    index: 2,
    title: 'Five Short Messages',
    instruction: 'Read the messages and choose the correct answer.',
    passage: [
      {
        label: 'A',
        text: 'Hi Sam — the meeting has moved to Thursday. Same room, same time. Please bring the budget figures.',
      },
      {
        label: 'B',
        text: 'Parcel delivery: we tried to deliver your package today. It is now waiting at the post office on King Street.',
      },
      { label: 'C', text: 'Reminder: your dental check-up is tomorrow at 9:30. Please arrive ten minutes early.' },
    ],
    questions: [
      mcq('r', 8, 'What has changed about the meeting?', ['The room', 'The day', 'The time'], 'B'),
      mcq('r', 9, 'What should Sam bring?', ['A report', 'Budget figures', 'A laptop'], 'B'),
      mcq('r', 10, 'Where is the parcel now?', ['At home', 'At the post office', 'With a neighbour'], 'B'),
      mcq('r', 11, 'When is the dental appointment?', ['Today', 'Tomorrow', 'Next week'], 'B'),
      mcq('r', 12, 'The patient should arrive at', ['9:10', '9:20', '9:30'], 'B'),
      mcq('r', 13, 'Message B is from', ['a shop', 'a delivery service', 'a friend'], 'B'),
      mcq('r', 14, 'Which message asks for preparation?', ['A', 'B', 'C'], 'A'),
    ],
  },
  {
    id: 'r3',
    index: 3,
    title: 'Working From Home',
    instruction: 'Read the article and choose the correct answer.',
    passage: [
      {
        label: 'A',
        text: 'Since 2020, millions of office workers have discovered the benefits of working from home. Many report saving over an hour a day on commuting.',
      },
      {
        label: 'B',
        text: 'However, managers worry that creativity suffers when teams rarely meet. Some companies now require staff to come in at least three days a week.',
      },
      {
        label: 'C',
        text: 'Researchers suggest that the best model depends on the task: focused work at home, collaboration in the office.',
      },
    ],
    questions: [
      mcq('r', 15, 'What benefit do many workers mention?', ['Higher pay', 'Less commuting', 'Better equipment'], 'B'),
      mcq('r', 16, 'Managers are concerned about', ['costs', 'creativity', 'security'], 'B'),
      mcq('r', 17, 'Some companies now ask staff to come in', ['once a week', 'three days a week', 'every day'], 'B'),
      mcq(
        'r',
        18,
        'Researchers believe the best model',
        ['depends on the task', 'is fully remote', 'is fully in the office'],
        'A',
      ),
      mcq('r', 19, 'Focused work is best done', ['at home', 'in the office', 'in cafés'], 'A'),
      mcq('r', 20, 'The writer’s attitude is', ['critical', 'balanced', 'enthusiastic'], 'B'),
      mcq(
        'r',
        21,
        'The best title for the article is',
        ['The End of Offices', 'Finding the Right Balance', 'Why Commuting Matters'],
        'B',
      ),
    ],
  },
  {
    id: 'r4',
    index: 4,
    title: 'The Quiet Revolution of Urban Beekeeping',
    instruction: 'Do the following statements agree with the information in the text?',
    passage: [
      {
        label: 'A',
        text: 'Over the past decade, beehives have appeared on rooftops, balconies and school grounds in cities around the world.',
      },
      {
        label: 'B',
        text: 'Supporters argue that urban hives help pollinate parks and gardens, while also teaching residents about nature.',
      },
      {
        label: 'C',
        text: 'Early studies suggested rooftop hives would struggle, yet the opposite proved true. City bees often produce more honey than their rural counterparts, largely because parks offer a longer flowering season.',
        highlight: 'City bees often produce more honey than their rural counterparts',
      },
      {
        label: 'D',
        text: 'Not everyone is convinced. Ecologists warn that a sudden rise in managed hives may crowd out wild pollinators.',
      },
    ],
    questions: [
      tfng('r', 22, 'Urban beehives can only be found on rooftops.', 'False'),
      tfng(
        'r',
        23,
        'Rooftop hives yield less honey than hives in the countryside.',
        'False',
        'C paragrafda "city bees often produce more honey" deyilgan — ya\'ni aksincha.',
      ),
      tfng('r', 24, 'Parks have a longer flowering season than farmland.', 'True'),
      tfng('r', 25, 'Most city residents support urban beekeeping.', 'Not given'),
      tfng('r', 26, 'Some ecologists are worried about wild pollinators.', 'True'),
    ],
  },
  {
    id: 'r5',
    index: 5,
    title: 'The Science of Habits',
    instruction: 'Read the text and choose the correct answer.',
    passage: [
      {
        label: 'A',
        text: 'Psychologists estimate that around forty percent of our daily actions are habits rather than conscious decisions.',
      },
      {
        label: 'B',
        text: 'Every habit follows a loop: a cue, a routine and a reward. Changing the routine while keeping the cue and reward is the most reliable way to break a bad habit.',
      },
      {
        label: 'C',
        text: 'Contrary to popular belief, forming a new habit takes on average sixty-six days, not twenty-one.',
      },
    ],
    questions: [
      mcq('r', 27, 'About what share of daily actions are habits?', ['20%', '40%', '60%'], 'B'),
      mcq('r', 28, 'A habit loop consists of', ['two parts', 'three parts', 'four parts'], 'B'),
      mcq('r', 29, 'To break a bad habit, you should change the', ['cue', 'routine', 'reward'], 'B'),
      mcq('r', 30, 'Forming a new habit takes on average', ['21 days', '45 days', '66 days'], 'C'),
      mcq('r', 31, 'The “21 days” idea is described as', ['accurate', 'a popular belief', 'a new finding'], 'B'),
      mcq('r', 32, 'The text is mainly about', ['how habits work', 'healthy eating', 'memory'], 'A'),
      mcq('r', 33, 'The word “reliable” is closest to', ['fast', 'dependable', 'difficult'], 'B'),
      mcq('r', 34, 'Who made the estimate in paragraph A?', ['Doctors', 'Psychologists', 'Teachers'], 'B'),
      mcq(
        'r',
        35,
        'The writer would most likely agree that',
        ['habits cannot change', 'change takes time', 'rewards are useless'],
        'B',
      ),
    ],
  },
];

export const writingTasks: WritingTask[] = [
  {
    id: 'w1',
    index: 1,
    label: 'Task 1',
    kind: 'Letter',
    prompt:
      'You recently stayed at a hotel and left something in your room. Write a letter to the manager. Describe the item and explain how it can be returned to you.',
    targetWords: 150,
    minWords: 120,
  },
  {
    id: 'w2',
    index: 2,
    label: 'Task 2',
    kind: 'Essay',
    prompt: 'Some people think cities should invest more in public transport than in roads. Discuss both views.',
    targetWords: 250,
    minWords: 180,
  },
];

export const speakingQuestions: SpeakingQuestion[] = [
  {
    id: 's1',
    index: 1,
    part: '1.1',
    prompt: 'Where do you live, and what do you like about it?',
    prepSec: 5,
    answerSec: 30,
  },
  { id: 's2', index: 2, part: '1.1', prompt: 'How do you usually spend your weekends?', prepSec: 5, answerSec: 30 },
  {
    id: 's3',
    index: 3,
    part: '1.2',
    prompt: 'Describe what you can see in the picture. Why do you think people go to places like this?',
    image: 'shahar bozori',
    prepSec: 30,
    answerSec: 60,
  },
  {
    id: 's4',
    index: 4,
    part: '1.2',
    prompt: 'Do you prefer shopping in markets or in supermarkets? Why?',
    image: 'shahar bozori',
    prepSec: 30,
    answerSec: 60,
  },
  {
    id: 's5',
    index: 5,
    part: '1.2',
    prompt: 'How have shopping habits changed in your country?',
    image: 'shahar bozori',
    prepSec: 30,
    answerSec: 60,
  },
  {
    id: 's6',
    index: 6,
    part: '2',
    prompt: 'Describe a skill you learned recently. Say how you learned it, why it was useful and how you felt.',
    prepSec: 60,
    answerSec: 120,
  },
  {
    id: 's7',
    index: 7,
    part: '2',
    prompt: 'Talk about a person who has influenced your studies. Explain who they are and how they helped you.',
    prepSec: 60,
    answerSec: 120,
  },
  {
    id: 's8',
    index: 8,
    part: '3',
    prompt: 'Some people say online learning will replace schools. Give arguments for and against this idea.',
    prepSec: 60,
    answerSec: 120,
  },
];
