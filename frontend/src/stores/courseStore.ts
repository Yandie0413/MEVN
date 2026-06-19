import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface QuizQuestion {
  id: string;
  text: string;
  textEn: string;
  options: { id: string; text: string; textEn: string; isCorrect: boolean }[];
  explanation: string;
  explanationEn: string;
}

export interface Chapter {
  id: string;
  title: string;
  titleEn: string;
  type: 'video' | 'text' | 'quiz' | 'markdown';
  duration: string;
  completed: boolean;
  content?: string;
  contentEn?: string;
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  rating: number;
  students: number;
  progress: number;
  chapters: Chapter[];
  bgColor: string;
  iconColor: string;
  xp: number;
  level: string;
  levelEn?: string;
}

export const useCourseStore = defineStore('course', () => {
  // Locale tracking
  const locale = ref<'fr' | 'en'>('fr');

  function setLocale(newLocale: 'fr' | 'en') {
    locale.value = newLocale;
  }

  function getTitle(item: { title: string; titleEn: string }): string {
    return locale.value === 'en' && item.titleEn ? item.titleEn : item.title;
  }

  function getChapterTitle(chapter: { title: string; titleEn: string }): string {
    return locale.value === 'en' && chapter.titleEn ? chapter.titleEn : chapter.title;
  }

  function getQuestionText(q: { text: string; textEn: string }): string {
    return locale.value === 'en' && q.textEn ? q.textEn : q.text;
  }

  function getOptionText(opt: { text: string; textEn: string }): string {
    return locale.value === 'en' && opt.textEn ? opt.textEn : opt.text;
  }

  function getExplanation(q: { explanation: string; explanationEn: string }): string {
    return locale.value === 'en' && q.explanationEn ? q.explanationEn : q.explanation;
  }

  function getCourseCategory(course: { category: string; categoryEn: string }): string {
    return locale.value === 'en' && course.categoryEn ? course.categoryEn : course.category;
  }

  function getCourseDescription(course: { description: string; descriptionEn: string }): string {
    return locale.value === 'en' && course.descriptionEn ? course.descriptionEn : course.description;
  }

  function getChapterContent(chapter: { content?: string; contentEn?: string }): string {
    if (locale.value === 'en' && chapter.contentEn) {
      return chapter.contentEn;
    }
    return chapter.content || '';
  }

  function getCourseLevel(course: { level: string; levelEn: string }): string {
    return locale.value === 'en' && course.levelEn ? course.levelEn : course.level;
  }

  function getLocalizedCourse(course: any): any {
    return {
      ...course,
      title: getTitle(course),
      category: getCourseCategory(course),
      description: getCourseDescription(course),
      level: getCourseLevel(course),
      chapters: course.chapters.map((ch: any) => ({
        ...ch,
        title: getChapterTitle(ch),
        content: getChapterContent(ch),
        quizQuestions: ch.quizQuestions?.map((q: any) => ({
          ...q,
          text: getQuestionText(q),
          options: q.options?.map((opt: any) => ({
            ...opt,
            text: getOptionText(opt)
          })),
          explanation: getExplanation(q)
        }))
      }))
    };
  }

  // === MASTER DATA ===
  const initialCourses: Course[] = [
    {
      id: '1',
      title: 'Maths Magiques',
      category: 'Mathématiques',
      description: "Apprends les fractions, géométrie et calcul mental en t'amusant.",
      rating: 4.8,
      students: 1240,
      progress: 68, // Default starting progress to match screenshot (e.g. 2 / 5 chapters completed)
      bgColor: 'bg-edu-lavender',
      iconColor: '#7c3aed',
      xp: 450,
      level: 'Niveau intermédiaire',
      chapters: [
        {
          id: 'm1',
          title: 'Les fractions, c\'est facile',
          titleEn: 'Fractions Made Easy',
          type: 'text',
          duration: '12 min',
          completed: true,
          content: 'Les fractions représentent des parties d\'un tout. Par exemple, si vous coupez une pizza en 4 parts égales, chaque part représente 1/4 de la pizza. Si vous mangez 3 parts, vous avez mangé 3/4 de la pizza.\n\nPour additionner des fractions de même dénominateur, il suffit d\'additionner les numérateurs entre eux : 1/4 + 2/4 = 3/4.',
          contentEn: 'Fractions represent parts of a whole. For example, if you cut a pizza into 4 equal slices, each slice represents 1/4 of the pizza. If you eat 3 slices, you\'ve eaten 3/4 of the pizza.\n\nTo add fractions with the same denominator, simply add the numerators together: 1/4 + 2/4 = 3/4.'
        },
        {
          id: 'm2',
          title: 'Géométrie en folie',
          titleEn: 'Geometry Madness',
          type: 'video',
          duration: '18 min',
          completed: true,
          content: 'Regardez cette vidéo animée pour comprendre la différence entre un carré, un rectangle, un triangle et un cercle. Vous apprendrez également les formules magiques pour calculer le périmètre (le tour) et l\'aire (la surface) de chaque figure !',
          contentEn: 'Watch this animated video to understand the difference between a square, rectangle, triangle, and circle. You\'ll also learn the magical formulas to calculate the perimeter (the outline) and area (the surface) of each shape!',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
          id: 'm3',
          title: 'Le calcul mental rapide',
          titleEn: 'Quick Mental Math',
          type: 'text',
          duration: '15 min',
          completed: false,
          content: 'Voici des astuces magiques pour calculer plus vite que votre ombre :\n\n1. **Pour ajouter 9** : ajoutez 10, puis enlevez 1. Exemple : 35 + 9 -> 35 + 10 = 45 -> 45 - 1 = 44.\n2. **Pour multiplier par 5** : multipliez par 10, puis divisez par 2. Exemple : 24 x 5 -> 240 / 2 = 120.\n3. **Pour multiplier par 11** : écartez les deux chiffres et placez leur somme au milieu. Exemple : 13 x 11 -> 1 (1+3) 3 -> 143.',
          contentEn: 'Here are some magical tricks to calculate faster than your shadow:\n\n1. **To add 9**: add 10, then subtract 1. Example: 35 + 9 -> 35 + 10 = 45 -> 45 - 1 = 44.\n2. **To multiply by 5**: multiply by 10, then divide by 2. Example: 24 x 5 -> 240 / 2 = 120.\n3. **To multiply by 11**: spread the two digits and place their sum in the middle. Example: 13 x 11 -> 1 (1+3) 3 -> 143.'
        },
        {
          id: 'm4',
          title: 'Les pourcentages au quotidien',
          titleEn: 'Percentages in Daily Life',
          type: 'text',
          duration: '14 min',
          completed: false,
          content: 'Un pourcentage (%) est simplement une fraction dont le dénominateur est 100. Par exemple, 50% représente 50 sur 100, soit la moitié d\'une quantité.\n\n- **10%** d\'une valeur s\'obtient en la divisant par 10 (déplacer la virgule d\'un rang vers la gauche).\n- **20%** représente le double de 10%.\n- **25%** équivaut à diviser par 4 (le quart).\n- **75%** représente les trois quarts.',
          contentEn: 'A percentage (%) is simply a fraction with a denominator of 100. For example, 50% represents 50 out of 100, which is half of a quantity.\n\n- **10%** of a value is obtained by dividing it by 10 (move the decimal one place to the left).\n- **20%** represents double 10%.\n- **25%** is equivalent to dividing by 4 (the quarter).\n- **75%** represents three quarters.'
        },
        {
          id: 'm5',
          title: 'Quiz final - Maths',
          titleEn: 'Final Quiz - Math',
          type: 'quiz',
          duration: '10 min',
          completed: false,
          quizQuestions: [
            {
              id: 'mq1',
              text: 'Combien font 3/4 + 1/4 ?',
              textEn: 'What is 3/4 + 1/4?',
              options: [
                { id: 'mo1_1', text: '1/2', textEn: '1/2', isCorrect: false },
                { id: 'mo1_2', text: '1', textEn: '1', isCorrect: true },
                { id: 'mo1_3', text: '4/8', textEn: '4/8', isCorrect: false },
                { id: 'mo1_4', text: '2/4', textEn: '2/4', isCorrect: false }
              ],
              explanation: '3/4 + 1/4 = (3 + 1)/4 = 4/4 = 1. Additionner les numérateurs quand le dénominateur est identique.',
              explanationEn: '3/4 + 1/4 = (3 + 1)/4 = 4/4 = 1. Add the numerators when the denominator is the same.'
            },
            {
              id: 'mq2',
              text: 'Quelle est l\'aire d\'un rectangle de 5 cm de long et 3 cm de large ?',
              textEn: 'What is the area of a rectangle 5 cm long and 3 cm wide?',
              options: [
                { id: 'mo2_1', text: '8 cm²', textEn: '8 cm²', isCorrect: false },
                { id: 'mo2_2', text: '15 cm²', textEn: '15 cm²', isCorrect: true },
                { id: 'mo2_3', text: '16 cm²', textEn: '16 cm²', isCorrect: false },
                { id: 'mo2_4', text: '10 cm²', textEn: '10 cm²', isCorrect: false }
              ],
              explanation: 'L\'aire d\'un rectangle se calcule en multipliant la Longueur par la largeur (L x l). Donc 5 cm x 3 cm = 15 cm².',
              explanationEn: 'The area of a rectangle is calculated by multiplying the length by the width (L x W). So 5 cm x 3 cm = 15 cm².'
            },
            {
              id: 'mq3',
              text: 'Combien font 20% de 50 ?',
              textEn: 'What is 20% of 50?',
              options: [
                { id: 'mo3_1', text: '10', textEn: '10', isCorrect: true },
                { id: 'mo3_2', text: '5', textEn: '5', isCorrect: false },
                { id: 'mo3_3', text: '20', textEn: '20', isCorrect: false },
                { id: 'mo3_4', text: '15', textEn: '15', isCorrect: false }
              ],
              explanation: '10% de 50 = 5. Donc 20% représente le double, soit 2 x 5 = 10.',
              explanationEn: '10% of 50 = 5. So 20% is double that, which is 2 x 5 = 10.'
            },
            {
              id: 'mq4',
              text: 'Si un angle mesure 90 degrés, comment s\'appelle-t-il ?',
              textEn: 'If an angle measures 90 degrees, what is it called?',
              options: [
                { id: 'mo4_1', text: 'Angle aigu', textEn: 'Acute angle', isCorrect: false },
                { id: 'mo4_2', text: 'Angle obtus', textEn: 'Obtuse angle', isCorrect: false },
                { id: 'mo4_3', text: 'Angle droit', textEn: 'Right angle', isCorrect: true },
                { id: 'mo4_4', text: 'Angle plat', textEn: 'Straight angle', isCorrect: false }
              ],
              explanation: 'Un angle qui mesure exactement 90 degrés est un angle droit, comme le coin d\'un carré.',
              explanationEn: 'An angle that measures exactly 90 degrees is a right angle, like the corner of a square.'
            },
            {
              id: 'mq5',
              text: 'Quelle est la somme des angles d\'un triangle ?',
              textEn: 'What is the sum of the angles in a triangle?',
              options: [
                { id: 'mo5_1', text: '90°', textEn: '90°', isCorrect: false },
                { id: 'mo5_2', text: '180°', textEn: '180°', isCorrect: true },
                { id: 'mo5_3', text: '360°', textEn: '360°', isCorrect: false },
                { id: 'mo5_4', text: '270°', textEn: '270°', isCorrect: false }
              ],
              explanation: 'Dans n\'importe quel triangle, la somme de ses trois angles fait toujours exactement 180°.',
              explanationEn: 'In any triangle, the sum of its three angles always equals exactly 180°.'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: "L'Univers Fascinant",
      category: 'Sciences',
      description: 'Explore les planètes, étoiles et galaxies de notre système solaire.',
      rating: 4.9,
      students: 2100,
      progress: 42,
      bgColor: 'bg-edu-sky',
      iconColor: '#0ea5e9',
      xp: 350,
      level: 'Niveau débutant',
      chapters: [
        {
          id: 's1',
          title: 'Notre système solaire',
          titleEn: 'Our Solar System',
          type: 'text',
          duration: '15 min',
          completed: true,
          content: 'Notre système solaire est composé d\'une étoile centrale, le Soleil, et de 8 planètes qui tournent autour. Dans l\'ordre de proximité du Soleil : Mercure, Vénus, la Terre, Mars (planètes rocheuses), puis Jupiter, Saturne, Uranus, Neptune (géantes gazeuses).',
          contentEn: 'Our solar system is composed of a central star, the Sun, and 8 planets that orbit around it. In order of proximity to the Sun: Mercury, Venus, Earth, Mars (rocky planets), then Jupiter, Saturn, Uranus, Neptune (gas giants).'
        },
        {
          id: 's2',
          title: 'La Lune, notre satellite',
          titleEn: 'The Moon, Our Satellite',
          type: 'video',
          duration: '10 min',
          completed: false,
          content: 'La Lune tourne autour de la Terre en environ 28 jours. C\'est ce mouvement qui crée les différentes phases de la Lune (nouvelle lune, premier quartier, pleine lune, dernier quartier) visibles depuis notre planète.',
          contentEn: 'The Moon orbits around the Earth in about 28 days. It is this movement that creates the different phases of the Moon (new moon, first quarter, full moon, last quarter) visible from our planet.',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
          id: 's3',
          title: 'Les étoiles et constellations',
          titleEn: 'Stars and Constellations',
          type: 'text',
          duration: '12 min',
          completed: false,
          content: 'Une étoile est une boule géante de gaz chaud qui produit sa propre lumière, comme notre Soleil. Les constellations sont des groupes d\'étoiles qui forment des dessins imaginaires dans le ciel nocturne (ex: la Grande Ourse, Orion).',
          contentEn: 'A star is a giant ball of hot gas that produces its own light, like our Sun. Constellations are groups of stars that form imaginary patterns in the night sky (e.g., Ursa Major, Orion).'
        },
        {
          id: 's4',
          title: 'Quiz final - L\'Univers',
          titleEn: 'Final Quiz - The Universe',
          type: 'quiz',
          duration: '10 min',
          completed: false,
          quizQuestions: [
            {
              id: 'sq1',
              text: 'Quelle est la planète la plus proche du Soleil ?',
              textEn: 'Which planet is closest to the Sun?',
              options: [
                { id: 'so1_1', text: 'Vénus', textEn: 'Venus', isCorrect: false },
                { id: 'so1_2', text: 'Terre', textEn: 'Earth', isCorrect: false },
                { id: 'so1_3', text: 'Mercure', textEn: 'Mercury', isCorrect: true },
                { id: 'so1_4', text: 'Mars', textEn: 'Mars', isCorrect: false }
              ],
              explanation: 'Mercure est la première planète du système solaire, la plus proche du Soleil.',
              explanationEn: 'Mercury is the first planet in the solar system, closest to the Sun.'
            },
            {
              id: 'sq2',
              text: 'Quelle planète est surnommée la Planète Rouge ?',
              textEn: 'Which planet is nicknamed the Red Planet?',
              options: [
                { id: 'so2_1', text: 'Jupiter', textEn: 'Jupiter', isCorrect: false },
                { id: 'so2_2', text: 'Mars', textEn: 'Mars', isCorrect: true },
                { id: 'so2_3', text: 'Saturne', textEn: 'Saturn', isCorrect: false },
                { id: 'so2_4', text: 'Neptune', textEn: 'Neptune', isCorrect: false }
              ],
              explanation: 'Mars doit sa couleur rouge à la présence d\'oxyde de fer (rouille) sur sa surface.',
              explanationEn: 'Mars gets its red color from the presence of iron oxide (rust) on its surface.'
            },
            {
              id: 'sq3',
              text: 'Quelle est la plus grande planète de notre système solaire ?',
              textEn: 'What is the largest planet in our solar system?',
              options: [
                { id: 'so3_1', text: 'Saturne', textEn: 'Saturn', isCorrect: false },
                { id: 'so3_2', text: 'Terre', textEn: 'Earth', isCorrect: false },
                { id: 'so3_3', text: 'Jupiter', textEn: 'Jupiter', isCorrect: true },
                { id: 'so3_4', text: 'Uranus', textEn: 'Uranus', isCorrect: false }
              ],
              explanation: 'Jupiter est une géante gazeuse si grande qu\'elle pourrait contenir plus de 1300 fois la Terre.',
              explanationEn: 'Jupiter is a gas giant so large it could contain more than 1300 Earths.'
            }
          ]
        }
      ]
    },
    {
      id: '3',
      title: 'Anglais Aventure',
      category: 'Langues',
      description: "Maîtrise les bases de l'anglais à travers des histoires interactives.",
      rating: 4.7,
      students: 3400,
      progress: 85,
      bgColor: 'bg-edu-green',
      iconColor: '#10b981',
      xp: 500,
      level: 'Niveau débutant',
      chapters: [
        {
          id: 'l1',
          title: 'Greetings & Introductions',
          titleEn: 'Greetings & Introductions',
          type: 'text',
          duration: '10 min',
          completed: true,
          content: 'Apprenez à saluer et vous présenter en anglais :\n\n- Hello / Hi (Bonjour)\n- Good morning (Bonjour le matin)\n- What is your name? (Comment tu t\'appelles ?)\n- My name is Léa. (Je m\'appelle Léa.)\n- Nice to meet you! (Enchanté de te rencontrer !)',
          contentEn: 'Learn how to greet and introduce yourself in English:\n\n- Hello / Hi (Bonjour)\n- Good morning (Bonjour le matin)\n- What is your name? (Comment tu t\'appelles ?)\n- My name is Léa. (Je m\'appelle Léa.)\n- Nice to meet you! (Enchanté de te rencontrer !)'
        },
        {
          id: 'l2',
          title: 'Numbers & Colors',
          titleEn: 'Numbers & Colors',
          type: 'text',
          duration: '15 min',
          completed: true,
          content: 'Vocabulaire essentiel :\n\n- Chiffres : One (1), Two (2), Three (3), Four (4), Five (5), Six (6), Seven (7), Eight (8), Nine (9), Ten (10).\n- Couleurs : Red (rouge), Blue (bleu), Green (vert), Yellow (jaune), Orange (orange), Purple (violet), Pink (rose).',
          contentEn: 'Essential vocabulary:\n\n- Numbers: One (1), Two (2), Three (3), Four (4), Five (5), Six (6), Seven (7), Eight (8), Nine (9), Ten (10).\n- Colors: Red (rouge), Blue (bleu), Green (vert), Yellow (jaune), Orange (orange), Purple (violet), Pink (rose).'
        },
        {
          id: 'l3',
          title: 'My Daily Routine',
          titleEn: 'My Daily Routine',
          type: 'video',
          duration: '12 min',
          completed: true,
          content: 'Suivez la routine quotidienne de Tom en vidéo et apprenez des verbes comme "wake up" (se réveiller), "eat breakfast" (déjeuner), "go to school" (aller à l\'école).',
          contentEn: 'Follow Tom\'s daily routine on video and learn verbs like "wake up" (se réveiller), "eat breakfast" (déjeuner), "go to school" (aller à l\'école).',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
          id: 'l4',
          title: 'Quiz final - Anglais',
          titleEn: 'Final Quiz - English',
          type: 'quiz',
          duration: '10 min',
          completed: false,
          quizQuestions: [
            {
              id: 'lq1',
              text: 'Comment dit-on "pomme" en anglais ?',
              textEn: 'How do you say "apple" in English?',
              options: [
                { id: 'lo1_1', text: 'Banana', textEn: 'Banana', isCorrect: false },
                { id: 'lo1_2', text: 'Apple', textEn: 'Apple', isCorrect: true },
                { id: 'lo1_3', text: 'Grape', textEn: 'Grape', isCorrect: false },
                { id: 'lo1_4', text: 'Orange', textEn: 'Orange', isCorrect: false }
              ],
              explanation: '"Apple" signifie pomme en anglais.',
              explanationEn: '"Apple" means apple in English.'
            },
            {
              id: 'lq2',
              text: 'Choisissez la bonne traduction : "I have a dog."',
              textEn: 'Choose the correct translation: "I have a dog."',
              options: [
                { id: 'lo2_1', text: 'J\'ai un chat', textEn: 'I have a cat', isCorrect: false },
                { id: 'lo2_2', text: 'J\'ai un chien', textEn: 'I have a dog', isCorrect: true },
                { id: 'lo2_3', text: 'Tu as un chien', textEn: 'You have a dog', isCorrect: false },
                { id: 'lo2_4', text: 'Il a un chat', textEn: 'He has a cat', isCorrect: false }
              ],
              explanation: '"I" = Je, "have" = ai, "a dog" = un chien.',
              explanationEn: '"I" = Je, "have" = ai, "a dog" = un chien.'
            },
            {
              id: 'lq3',
              text: 'Quel est le pluriel de "child" ?',
              textEn: 'What is the plural of "child"?',
              options: [
                { id: 'lo3_1', text: 'Childs', textEn: 'Childs', isCorrect: false },
                { id: 'lo3_2', text: 'Children', textEn: 'Children', isCorrect: true },
                { id: 'lo3_3', text: 'Childrens', textEn: 'Childrens', isCorrect: false }
              ],
              explanation: 'Le mot "child" a un pluriel irrégulier en anglais : "children".',
              explanationEn: 'The word "child" has an irregular plural in English: "children".'
            }
          ]
        }
      ]
    },
    {
      id: '4',
      title: 'Histoire Vivante',
      category: 'Histoire',
      description: "Voyage dans le temps : Égypte, Rome, Moyen Âge et plus encore.",
      rating: 4.6,
      students: 980,
      progress: 30,
      bgColor: 'bg-edu-orange',
      iconColor: '#f97316',
      xp: 400,
      level: 'Niveau intermédiaire',
      chapters: [
        {
          id: 'h1',
          title: 'L\'Égypte des Pharaons',
          titleEn: 'Egypt of the Pharaohs',
          type: 'text',
          duration: '14 min',
          completed: true,
          content: 'L\'Égypte ancienne s\'est développée le long du Nil. Les pharaons étaient les rois d\'Égypte, considérés comme des intermédiaires entre les dieux et les hommes. Ils ont fait construire de gigantesques pyramides pour servir de tombeaux.',
          contentEn: 'Ancient Egypt developed along the Nile. The pharaohs were the kings of Egypt, considered intermediaries between the gods and men. They had gigantic pyramids built to serve as tombs.'
        },
        {
          id: 'h2',
          title: 'L\'Empire Romain',
          titleEn: 'The Roman Empire',
          type: 'video',
          duration: '18 min',
          completed: false,
          content: 'Découvrez la vie à Rome, les gladiateurs, les aqueducs et la façon dont ce petit village italien est devenu l\'un des plus grands empires de l\'Histoire.',
          contentEn: 'Discover life in Rome, gladiators, aqueducts, and how this small Italian village became one of the greatest empires in History.',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
          id: 'h3',
          title: 'Quiz final - Histoire',
          titleEn: 'Final Quiz - History',
          type: 'quiz',
          duration: '10 min',
          completed: false,
          quizQuestions: [
            {
              id: 'hq1',
              text: 'Qui était le premier empereur romain ?',
              textEn: 'Who was the first Roman emperor?',
              options: [
                { id: 'ho1_1', text: 'Jules César', textEn: 'Julius Caesar', isCorrect: false },
                { id: 'ho1_2', text: 'Auguste', textEn: 'Augustus', isCorrect: true },
                { id: 'ho1_3', text: 'Néron', textEn: 'Nero', isCorrect: false },
                { id: 'ho1_4', text: 'Charlemagne', textEn: 'Charlemagne', isCorrect: false }
              ],
              explanation: 'Bien que Jules César fût dictateur, son fils adoptif Auguste (Octave) fut le tout premier empereur romain.',
              explanationEn: 'Although Julius Caesar was dictator, his adopted son Augustus (Octavian) was the very first Roman emperor.'
            },
            {
              id: 'hq2',
              text: 'En quelle année a eu lieu la Révolution Française ?',
              textEn: 'In what year did the French Revolution take place?',
              options: [
                { id: 'ho2_1', text: '1492', textEn: '1492', isCorrect: false },
                { id: 'ho2_2', text: '1515', textEn: '1515', isCorrect: false },
                { id: 'ho2_3', text: '1789', textEn: '1789', isCorrect: true },
                { id: 'ho2_4', text: '1914', textEn: '1914', isCorrect: false }
              ],
              explanation: 'La Révolution Française a débuté en 1789 avec la prise de la Bastille le 14 juillet.',
              explanationEn: 'The French Revolution began in 1789 with the storming of the Bastille on July 14.'
            }
          ]
        }
      ]
    },
    {
      id: '5',
      title: 'Code Créatif',
      titleEn: 'Creative Coding',
      category: 'Informatique',
      categoryEn: 'Computer Science',
      description: 'Apprends les bases de la programmation en créant tes premiers jeux.',
      descriptionEn: 'Learn programming basics by creating your first games.',
      rating: 4.8,
      students: 1560,
      progress: 15,
      bgColor: 'bg-edu-orange',
      iconColor: '#d97706',
      xp: 600,
      level: 'Niveau débutant',
      levelEn: 'Beginner level',
      chapters: [
        {
          id: 'c1',
          title: 'Qu\'est-ce que coder ?',
          titleEn: 'What is Coding?',
          type: 'text',
          duration: '10 min',
          completed: false,
          content: 'Coder ou programmer consiste à donner des instructions précises à un ordinateur dans un langage qu\'il comprend. Les ordinateurs ne sont pas "intelligents" par eux-mêmes, ils exécutent simplement ce qu\'on leur demande étape par étape.',
          contentEn: 'Coding or programming consists of giving precise instructions to a computer in a language it understands. Computers are not "intelligent" by themselves, they simply execute what is asked of them step by step.'
        },
        {
          id: 'c2',
          title: 'Algorithmes et instructions',
          titleEn: 'Algorithms and Instructions',
          type: 'text',
          duration: '15 min',
          completed: false,
          content: 'Un algorithme est une suite d\'instructions logiques pour résoudre un problème. Par exemple, une recette de cuisine est un algorithme ! En code, on utilise des notions comme les variables (boîtes de stockage), les boucles (répéter des actions) et les conditions (si... alors...).',
          contentEn: 'An algorithm is a sequence of logical instructions to solve a problem. For example, a recipe is an algorithm! In code, we use concepts like variables (storage boxes), loops (repeating actions), and conditions (if... then...).'
        },
        {
          id: 'c3',
          title: 'Quiz final - Code',
          titleEn: 'Final Quiz - Code',
          type: 'quiz',
          duration: '12 min',
          completed: false,
          quizQuestions: [
            {
              id: 'cq1',
              text: 'Quelle balise HTML est utilisée pour insérer un titre principal ?',
              textEn: 'Which HTML tag is used to insert a main heading?',
              options: [
                { id: 'co1_1', text: '<p>', textEn: '<p>', isCorrect: false },
                { id: 'co1_2', text: '<h1>', textEn: '<h1>', isCorrect: true },
                { id: 'co1_3', text: '<title>', textEn: '<title>', isCorrect: false },
                { id: 'co1_4', text: '<div>', textEn: '<div>', isCorrect: false }
              ],
              explanation: '<h1> définit le titre le plus important (Heading 1) d\'une page web.',
              explanationEn: '<h1> defines the most important heading (Heading 1) of a web page.'
            },
            {
              id: 'cq2',
              text: 'Quel mot-clé en Javascript permet de déclarer une variable constante ?',
              textEn: 'Which keyword in Javascript declares a constant variable?',
              options: [
                { id: 'co2_1', text: 'var', textEn: 'var', isCorrect: false },
                { id: 'co2_2', text: 'let', textEn: 'let', isCorrect: false },
                { id: 'co2_3', text: 'const', textEn: 'const', isCorrect: true }
              ],
              explanation: '"const" permet de déclarer une constante dont la valeur ne peut pas être réaffectée.',
              explanationEn: '"const" declares a constant whose value cannot be reassigned.'
            }
          ]
        }
      ]
    },
    {
      id: '6',
      title: "L'Art en Couleurs",
      titleEn: 'Art in Colors',
      category: 'Arts',
      categoryEn: 'Arts',
      description: "Découvre la peinture, la sculpture et les grands maîtres de l'art.",
      descriptionEn: 'Discover painting, sculpture, and the great masters of art.',
      rating: 4.5,
      students: 720,
      progress: 0,
      bgColor: 'bg-edu-rose',
      iconColor: '#f43f5e',
      xp: 300,
      level: 'Niveau débutant',
      levelEn: 'Beginner level',
      chapters: [
        {
          id: 'a1',
          title: 'Léonard de Vinci, le génie',
          titleEn: 'Leonardo da Vinci, the Genius',
          type: 'text',
          duration: '12 min',
          completed: false,
          content: 'Léonard de Vinci était un peintre, inventeur, ingénieur et scientifique de la Renaissance italienne. Il est le créateur de chefs-d\'œuvre absolus comme la Joconde (Mona Lisa) et la Cène. Il a popularisé la technique du Sfumato (effet vaporeux pour adoucir les contours).',
          contentEn: 'Leonardo da Vinci was a painter, inventor, engineer, and scientist of the Italian Renaissance. He created absolute masterpieces like the Mona Lisa and The Last Supper. He popularized the Sfumato technique (a hazy effect to soften contours).'
        },
        {
          id: 'a2',
          title: 'L\'Impressionnisme',
          titleEn: 'Impressionism',
          type: 'text',
          duration: '15 min',
          completed: false,
          content: 'L\'Impressionnisme est un mouvement artistique du XIXe siècle né en France. Les peintres impressionnistes (Monet, Renoir, Degas) préféraient peindre à l\'extérieur, capturant la lumière changeante et les impressions fugitives avec des coups de pinceau rapides et visibles.',
          contentEn: 'Impressionism is an artistic movement of the 19th century born in France. Impressionist painters (Monet, Renoir, Degas) preferred to paint outdoors, capturing changing light and fleeting impressions with quick, visible brushstrokes.'
        },
        {
          id: 'a3',
          title: 'Quiz final - Art',
          titleEn: 'Final Quiz - Art',
          type: 'quiz',
          duration: '10 min',
          completed: false,
          quizQuestions: [
            {
              id: 'aq1',
              text: 'Qui a peint la célèbre Joconde (Mona Lisa) ?',
              textEn: 'Who painted the famous Mona Lisa?',
              options: [
                { id: 'ao1_1', text: 'Claude Monet', textEn: 'Claude Monet', isCorrect: false },
                { id: 'ao1_2', text: 'Vincent van Gogh', textEn: 'Vincent van Gogh', isCorrect: false },
                { id: 'ao1_3', text: 'Léonard de Vinci', textEn: 'Leonardo da Vinci', isCorrect: true },
                { id: 'ao1_4', text: 'Pablo Picasso', textEn: 'Pablo Picasso', isCorrect: false }
              ],
              explanation: 'Léonard de Vinci a peint la Joconde au début du XVIe siècle.',
              explanationEn: 'Leonardo da Vinci painted the Mona Lisa in the early 16th century.'
            },
            {
              id: 'aq2',
              text: 'Quel peintre est célèbre pour sa nuit étoilée et ses tournesols ?',
              textEn: 'Which painter is famous for Starry Night and sunflowers?',
              options: [
                { id: 'ao2_1', text: 'Claude Monet', textEn: 'Claude Monet', isCorrect: false },
                { id: 'ao2_2', text: 'Vincent van Gogh', textEn: 'Vincent van Gogh', isCorrect: true },
                { id: 'ao2_3', text: 'Pablo Picasso', textEn: 'Pablo Picasso', isCorrect: false }
              ],
              explanation: 'Le peintre néerlandais Vincent van Gogh a peint "La Nuit étoilée" en 1889.',
              explanationEn: 'Dutch painter Vincent van Gogh painted "The Starry Night" in 1889.'
            }
          ]
        }
      ]
    }
  ];

  // === STATE ===
  const courses = ref<Course[]>([]);
  const currentCourseId = ref<string | null>(null);
  const activeChapterId = ref<string | null>(null);
  const quizScores = ref<Record<string, number>>({});

  // Initialize state from Master Data & LocalStorage
  function init() {
    const saved = localStorage.getItem('curio_courses_progress');
    if (saved) {
      try {
        courses.value = JSON.parse(saved);
      } catch (e) {
        courses.value = JSON.parse(JSON.stringify(initialCourses));
      }
    } else {
      courses.value = JSON.parse(JSON.stringify(initialCourses));
      saveToStorage();
    }
  }

  // Helper to persist state
  function saveToStorage() {
    localStorage.setItem('curio_courses_progress', JSON.stringify(courses.value));
  }

  // Call init immediately
  init();

  // === GETTERS ===
  const currentCourse = computed(() => {
    const course = courses.value.find(c => c.id === currentCourseId.value) || null;
    if (!course) return null;
    return getLocalizedCourse(course);
  });

  const activeChapter = computed(() => {
    return currentCourse.value?.chapters.find(c => c.id === activeChapterId.value) || null;
  });

  const progressPercentage = computed(() => {
    if (!currentCourse.value || currentCourse.value.chapters.length === 0) return 0;
    const completedChapters = currentCourse.value.chapters.filter(c => c.completed).length;
    return Math.round((completedChapters / currentCourse.value.chapters.length) * 100);
  });

  const isCourseFullyCompleted = computed(() => {
    return progressPercentage.value === 100;
  });

  // === ACTIONS ===
  function setCourseActive(courseId: string) {
    currentCourseId.value = courseId;
    activeChapterId.value = null; // Reset when changing course
  }

  // legacy support
  function setCourse(course: any) {
    const existing = courses.value.find(c => c.id === course.id);
    if (existing) {
      currentCourseId.value = existing.id;
    } else {
      // Add custom course if not existing
      courses.value.push(course);
      currentCourseId.value = course.id;
    }
  }

  function setActiveChapter(chapterId: string) {
    activeChapterId.value = chapterId;
  }

  function markChapterCompleted(chapterId: string) {
    if (currentCourseId.value) {
      const course = courses.value.find(c => c.id === currentCourseId.value);
      if (course) {
        const chapter = course.chapters.find(c => c.id === chapterId);
        if (chapter && !chapter.completed) {
          chapter.completed = true;
          // recalculate course progress
          const completed = course.chapters.filter(c => c.completed).length;
          course.progress = Math.round((completed / course.chapters.length) * 100);
          saveToStorage();
        }
      }
    }
  }

  function saveQuizScore(chapterId: string, score: number) {
    quizScores.value[chapterId] = score;
    // Auto-complete if score is >= 50%
    if (score >= 50) {
      markChapterCompleted(chapterId);
    }
  }

  return {
    locale,
    courses,
    currentCourseId,
    currentCourse,
    activeChapterId,
    activeChapter,
    quizScores,
    progressPercentage,
    isCourseFullyCompleted,
    setLocale,
    setCourseActive,
    setCourse,
    setActiveChapter,
    markChapterCompleted,
    saveQuizScore
  };
});
