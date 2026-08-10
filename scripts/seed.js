// Peuple la base avec un compte enseignant de démo et les cours d'exemple.
// Usage : npm run seed
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const connectDB = require('../config/db')
const User = require('../models/User')
const Course = require('../models/Course')

const demoCourses = [
    {
        title: 'Maths Magiques',
        category: 'Mathématiques',
        description: "Apprends les fractions, géométrie et calcul mental en t'amusant.",
        rating: 4.8,
        bgColor: 'bg-edu-lavender',
        iconColor: '#7c3aed',
        xp: 450,
        level: 'Niveau intermédiaire',
        chapters: [
            {
                title: 'Les fractions, c\'est facile',
                titleEn: 'Fractions Made Easy',
                type: 'text',
                duration: '12 min',
                content: 'Les fractions représentent des parties d\'un tout. Par exemple, si vous coupez une pizza en 4 parts égales, chaque part représente 1/4 de la pizza. Si vous mangez 3 parts, vous avez mangé 3/4 de la pizza.\n\nPour additionner des fractions de même dénominateur, il suffit d\'additionner les numérateurs entre eux : 1/4 + 2/4 = 3/4.',
                contentEn: 'Fractions represent parts of a whole. For example, if you cut a pizza into 4 equal slices, each slice represents 1/4 of the pizza. If you eat 3 slices, you\'ve eaten 3/4 of the pizza.\n\nTo add fractions with the same denominator, simply add the numerators together: 1/4 + 2/4 = 3/4.'
            },
            {
                title: 'Géométrie en folie',
                titleEn: 'Geometry Madness',
                type: 'video',
                duration: '18 min',
                content: 'Regardez cette vidéo animée pour comprendre la différence entre un carré, un rectangle, un triangle et un cercle. Vous apprendrez également les formules magiques pour calculer le périmètre (le tour) et l\'aire (la surface) de chaque figure !',
                contentEn: 'Watch this animated video to understand the difference between a square, rectangle, triangle, and circle. You\'ll also learn the magical formulas to calculate the perimeter (the outline) and area (the surface) of each shape!',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            },
            {
                title: 'Le calcul mental rapide',
                titleEn: 'Quick Mental Math',
                type: 'text',
                duration: '15 min',
                content: 'Voici des astuces magiques pour calculer plus vite que votre ombre :\n\n1. Pour ajouter 9 : ajoutez 10, puis enlevez 1. Exemple : 35 + 9 -> 45 - 1 = 44.\n2. Pour multiplier par 5 : multipliez par 10, puis divisez par 2. Exemple : 24 x 5 -> 240 / 2 = 120.\n3. Pour multiplier par 11 : écartez les deux chiffres et placez leur somme au milieu. Exemple : 13 x 11 -> 143.',
                contentEn: 'Here are some magical tricks to calculate faster than your shadow:\n\n1. To add 9: add 10, then subtract 1. Example: 35 + 9 -> 45 - 1 = 44.\n2. To multiply by 5: multiply by 10, then divide by 2. Example: 24 x 5 -> 240 / 2 = 120.\n3. To multiply by 11: spread the two digits and place their sum in the middle. Example: 13 x 11 -> 143.'
            },
            {
                title: 'Les pourcentages au quotidien',
                titleEn: 'Percentages in Daily Life',
                type: 'text',
                duration: '14 min',
                content: 'Un pourcentage (%) est simplement une fraction dont le dénominateur est 100. Par exemple, 50% représente 50 sur 100, soit la moitié d\'une quantité.\n\n- 10% d\'une valeur s\'obtient en la divisant par 10.\n- 20% représente le double de 10%.\n- 25% équivaut à diviser par 4.\n- 75% représente les trois quarts.',
                contentEn: 'A percentage (%) is simply a fraction with a denominator of 100. For example, 50% represents 50 out of 100, which is half of a quantity.\n\n- 10% of a value is obtained by dividing it by 10.\n- 20% represents double 10%.\n- 25% is equivalent to dividing by 4.\n- 75% represents three quarters.'
            },
            {
                title: 'Quiz final - Maths',
                titleEn: 'Final Quiz - Math',
                type: 'quiz',
                duration: '10 min',
                quizQuestions: [
                    {
                        text: 'Combien font 3/4 + 1/4 ?',
                        textEn: 'What is 3/4 + 1/4?',
                        options: [
                            { text: '1/2', textEn: '1/2', isCorrect: false },
                            { text: '1', textEn: '1', isCorrect: true },
                            { text: '4/8', textEn: '4/8', isCorrect: false },
                            { text: '2/4', textEn: '2/4', isCorrect: false }
                        ],
                        explanation: '3/4 + 1/4 = (3 + 1)/4 = 4/4 = 1. Additionner les numérateurs quand le dénominateur est identique.',
                        explanationEn: '3/4 + 1/4 = (3 + 1)/4 = 4/4 = 1. Add the numerators when the denominator is the same.'
                    },
                    {
                        text: 'Quelle est l\'aire d\'un rectangle de 5 cm de long et 3 cm de large ?',
                        textEn: 'What is the area of a rectangle 5 cm long and 3 cm wide?',
                        options: [
                            { text: '8 cm²', textEn: '8 cm²', isCorrect: false },
                            { text: '15 cm²', textEn: '15 cm²', isCorrect: true },
                            { text: '16 cm²', textEn: '16 cm²', isCorrect: false },
                            { text: '10 cm²', textEn: '10 cm²', isCorrect: false }
                        ],
                        explanation: 'L\'aire d\'un rectangle se calcule en multipliant la longueur par la largeur. Donc 5 x 3 = 15 cm².',
                        explanationEn: 'The area of a rectangle is length x width. So 5 cm x 3 cm = 15 cm².'
                    },
                    {
                        text: 'Combien font 20% de 50 ?',
                        textEn: 'What is 20% of 50?',
                        options: [
                            { text: '10', textEn: '10', isCorrect: true },
                            { text: '5', textEn: '5', isCorrect: false },
                            { text: '20', textEn: '20', isCorrect: false },
                            { text: '15', textEn: '15', isCorrect: false }
                        ],
                        explanation: '10% de 50 = 5. Donc 20% représente le double, soit 2 x 5 = 10.',
                        explanationEn: '10% of 50 = 5. So 20% is double that, which is 2 x 5 = 10.'
                    }
                ]
            }
        ]
    },
    {
        title: "L'Univers Fascinant",
        category: 'Sciences',
        description: 'Explore les planètes, étoiles et galaxies de notre système solaire.',
        rating: 4.9,
        bgColor: 'bg-edu-sky',
        iconColor: '#0ea5e9',
        xp: 350,
        level: 'Niveau débutant',
        chapters: [
            {
                title: 'Notre système solaire',
                titleEn: 'Our Solar System',
                type: 'text',
                duration: '15 min',
                content: 'Notre système solaire est composé d\'une étoile centrale, le Soleil, et de 8 planètes qui tournent autour. Dans l\'ordre : Mercure, Vénus, la Terre, Mars, puis Jupiter, Saturne, Uranus, Neptune.',
                contentEn: 'Our solar system is composed of a central star, the Sun, and 8 planets that orbit around it. In order: Mercury, Venus, Earth, Mars, then Jupiter, Saturn, Uranus, Neptune.'
            },
            {
                title: 'La Lune, notre satellite',
                titleEn: 'The Moon, Our Satellite',
                type: 'video',
                duration: '10 min',
                content: 'La Lune tourne autour de la Terre en environ 28 jours, créant les différentes phases de la Lune visibles depuis notre planète.',
                contentEn: 'The Moon orbits Earth in about 28 days, creating the different phases of the Moon visible from our planet.',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            },
            {
                title: 'Les étoiles et constellations',
                titleEn: 'Stars and Constellations',
                type: 'text',
                duration: '12 min',
                content: 'Une étoile est une boule géante de gaz chaud qui produit sa propre lumière. Les constellations sont des groupes d\'étoiles formant des dessins imaginaires dans le ciel nocturne.',
                contentEn: 'A star is a giant ball of hot gas that produces its own light. Constellations are groups of stars forming imaginary patterns in the night sky.'
            },
            {
                title: 'Quiz final - L\'Univers',
                titleEn: 'Final Quiz - The Universe',
                type: 'quiz',
                duration: '10 min',
                quizQuestions: [
                    {
                        text: 'Quelle est la planète la plus proche du Soleil ?',
                        textEn: 'Which planet is closest to the Sun?',
                        options: [
                            { text: 'Vénus', textEn: 'Venus', isCorrect: false },
                            { text: 'Terre', textEn: 'Earth', isCorrect: false },
                            { text: 'Mercure', textEn: 'Mercury', isCorrect: true },
                            { text: 'Mars', textEn: 'Mars', isCorrect: false }
                        ],
                        explanation: 'Mercure est la première planète du système solaire, la plus proche du Soleil.',
                        explanationEn: 'Mercury is the first planet in the solar system, closest to the Sun.'
                    },
                    {
                        text: 'Quelle planète est surnommée la Planète Rouge ?',
                        textEn: 'Which planet is nicknamed the Red Planet?',
                        options: [
                            { text: 'Jupiter', textEn: 'Jupiter', isCorrect: false },
                            { text: 'Mars', textEn: 'Mars', isCorrect: true },
                            { text: 'Saturne', textEn: 'Saturn', isCorrect: false },
                            { text: 'Neptune', textEn: 'Neptune', isCorrect: false }
                        ],
                        explanation: 'Mars doit sa couleur rouge à la présence d\'oxyde de fer sur sa surface.',
                        explanationEn: 'Mars gets its red color from the presence of iron oxide on its surface.'
                    }
                ]
            }
        ]
    },
    {
        title: 'Anglais Aventure',
        category: 'Langues',
        description: "Maîtrise les bases de l'anglais à travers des histoires interactives.",
        rating: 4.7,
        bgColor: 'bg-edu-green',
        iconColor: '#10b981',
        xp: 500,
        level: 'Niveau débutant',
        chapters: [
            {
                title: 'Greetings & Introductions',
                titleEn: 'Greetings & Introductions',
                type: 'text',
                duration: '10 min',
                content: 'Apprenez à saluer et vous présenter en anglais :\n\n- Hello / Hi (Bonjour)\n- What is your name? (Comment tu t\'appelles ?)\n- My name is Léa. (Je m\'appelle Léa.)\n- Nice to meet you! (Enchanté !)',
                contentEn: 'Learn how to greet and introduce yourself in English:\n\n- Hello / Hi\n- What is your name?\n- My name is Léa.\n- Nice to meet you!'
            },
            {
                title: 'Numbers & Colors',
                titleEn: 'Numbers & Colors',
                type: 'text',
                duration: '15 min',
                content: 'Vocabulaire essentiel :\n\n- Chiffres : One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten.\n- Couleurs : Red, Blue, Green, Yellow, Orange, Purple, Pink.',
                contentEn: 'Essential vocabulary:\n\n- Numbers: One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten.\n- Colors: Red, Blue, Green, Yellow, Orange, Purple, Pink.'
            },
            {
                title: 'Quiz final - Anglais',
                titleEn: 'Final Quiz - English',
                type: 'quiz',
                duration: '10 min',
                quizQuestions: [
                    {
                        text: 'Comment dit-on "pomme" en anglais ?',
                        textEn: 'How do you say "pomme" in English?',
                        options: [
                            { text: 'Banana', textEn: 'Banana', isCorrect: false },
                            { text: 'Apple', textEn: 'Apple', isCorrect: true },
                            { text: 'Grape', textEn: 'Grape', isCorrect: false },
                            { text: 'Orange', textEn: 'Orange', isCorrect: false }
                        ],
                        explanation: '"Apple" signifie pomme en anglais.',
                        explanationEn: '"Apple" means pomme in English.'
                    },
                    {
                        text: 'Quel est le pluriel de "child" ?',
                        textEn: 'What is the plural of "child"?',
                        options: [
                            { text: 'Childs', textEn: 'Childs', isCorrect: false },
                            { text: 'Children', textEn: 'Children', isCorrect: true },
                            { text: 'Childrens', textEn: 'Childrens', isCorrect: false }
                        ],
                        explanation: 'Le mot "child" a un pluriel irrégulier en anglais : "children".',
                        explanationEn: 'The word "child" has an irregular plural in English: "children".'
                    }
                ]
            }
        ]
    },
    {
        title: 'Histoire Vivante',
        category: 'Histoire',
        description: "Voyage dans le temps : Égypte, Rome, Moyen Âge et plus encore.",
        rating: 4.6,
        bgColor: 'bg-edu-orange',
        iconColor: '#f97316',
        xp: 400,
        level: 'Niveau intermédiaire',
        chapters: [
            {
                title: 'L\'Égypte des Pharaons',
                titleEn: 'Egypt of the Pharaohs',
                type: 'text',
                duration: '14 min',
                content: 'L\'Égypte ancienne s\'est développée le long du Nil. Les pharaons étaient les rois d\'Égypte, considérés comme des intermédiaires entre les dieux et les hommes.',
                contentEn: 'Ancient Egypt developed along the Nile. The pharaohs were the kings of Egypt, considered intermediaries between the gods and men.'
            },
            {
                title: 'L\'Empire Romain',
                titleEn: 'The Roman Empire',
                type: 'video',
                duration: '18 min',
                content: 'Découvrez la vie à Rome, les gladiateurs, les aqueducs et la façon dont ce petit village italien est devenu l\'un des plus grands empires de l\'Histoire.',
                contentEn: 'Discover life in Rome, gladiators, aqueducts, and how this small Italian village became one of the greatest empires in History.',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            },
            {
                title: 'Quiz final - Histoire',
                titleEn: 'Final Quiz - History',
                type: 'quiz',
                duration: '10 min',
                quizQuestions: [
                    {
                        text: 'Qui était le premier empereur romain ?',
                        textEn: 'Who was the first Roman emperor?',
                        options: [
                            { text: 'Jules César', textEn: 'Julius Caesar', isCorrect: false },
                            { text: 'Auguste', textEn: 'Augustus', isCorrect: true },
                            { text: 'Néron', textEn: 'Nero', isCorrect: false },
                            { text: 'Charlemagne', textEn: 'Charlemagne', isCorrect: false }
                        ],
                        explanation: 'Bien que Jules César fût dictateur, son fils adoptif Auguste fut le tout premier empereur romain.',
                        explanationEn: 'Although Julius Caesar was dictator, his adopted son Augustus was the very first Roman emperor.'
                    },
                    {
                        text: 'En quelle année a eu lieu la Révolution Française ?',
                        textEn: 'In what year did the French Revolution take place?',
                        options: [
                            { text: '1492', textEn: '1492', isCorrect: false },
                            { text: '1515', textEn: '1515', isCorrect: false },
                            { text: '1789', textEn: '1789', isCorrect: true },
                            { text: '1914', textEn: '1914', isCorrect: false }
                        ],
                        explanation: 'La Révolution Française a débuté en 1789 avec la prise de la Bastille le 14 juillet.',
                        explanationEn: 'The French Revolution began in 1789 with the storming of the Bastille on July 14.'
                    }
                ]
            }
        ]
    },
    {
        title: 'Code Créatif',
        titleEn: 'Creative Coding',
        category: 'Informatique',
        categoryEn: 'Computer Science',
        description: 'Apprends les bases de la programmation en créant tes premiers jeux.',
        descriptionEn: 'Learn programming basics by creating your first games.',
        rating: 4.8,
        bgColor: 'bg-edu-orange',
        iconColor: '#d97706',
        xp: 600,
        level: 'Niveau débutant',
        levelEn: 'Beginner level',
        chapters: [
            {
                title: 'Qu\'est-ce que coder ?',
                titleEn: 'What is Coding?',
                type: 'text',
                duration: '10 min',
                content: 'Coder consiste à donner des instructions précises à un ordinateur dans un langage qu\'il comprend. Les ordinateurs exécutent simplement ce qu\'on leur demande, étape par étape.',
                contentEn: 'Coding consists of giving precise instructions to a computer in a language it understands. Computers simply execute what is asked of them, step by step.'
            },
            {
                title: 'Algorithmes et instructions',
                titleEn: 'Algorithms and Instructions',
                type: 'text',
                duration: '15 min',
                content: 'Un algorithme est une suite d\'instructions logiques pour résoudre un problème. En code, on utilise des variables, des boucles et des conditions.',
                contentEn: 'An algorithm is a sequence of logical instructions to solve a problem. In code, we use variables, loops, and conditions.'
            },
            {
                title: 'Quiz final - Code',
                titleEn: 'Final Quiz - Code',
                type: 'quiz',
                duration: '12 min',
                quizQuestions: [
                    {
                        text: 'Quelle balise HTML est utilisée pour insérer un titre principal ?',
                        textEn: 'Which HTML tag is used to insert a main heading?',
                        options: [
                            { text: '<p>', textEn: '<p>', isCorrect: false },
                            { text: '<h1>', textEn: '<h1>', isCorrect: true },
                            { text: '<title>', textEn: '<title>', isCorrect: false },
                            { text: '<div>', textEn: '<div>', isCorrect: false }
                        ],
                        explanation: '<h1> définit le titre le plus important d\'une page web.',
                        explanationEn: '<h1> defines the most important heading of a web page.'
                    },
                    {
                        text: 'Quel mot-clé en Javascript permet de déclarer une variable constante ?',
                        textEn: 'Which keyword in Javascript declares a constant variable?',
                        options: [
                            { text: 'var', textEn: 'var', isCorrect: false },
                            { text: 'let', textEn: 'let', isCorrect: false },
                            { text: 'const', textEn: 'const', isCorrect: true }
                        ],
                        explanation: '"const" permet de déclarer une constante dont la valeur ne peut pas être réaffectée.',
                        explanationEn: '"const" declares a constant whose value cannot be reassigned.'
                    }
                ]
            }
        ]
    },
    {
        title: "L'Art en Couleurs",
        titleEn: 'Art in Colors',
        category: 'Arts',
        categoryEn: 'Arts',
        description: "Découvre la peinture, la sculpture et les grands maîtres de l'art.",
        descriptionEn: 'Discover painting, sculpture, and the great masters of art.',
        rating: 4.5,
        bgColor: 'bg-edu-rose',
        iconColor: '#f43f5e',
        xp: 300,
        level: 'Niveau débutant',
        levelEn: 'Beginner level',
        chapters: [
            {
                title: 'Léonard de Vinci, le génie',
                titleEn: 'Leonardo da Vinci, the Genius',
                type: 'text',
                duration: '12 min',
                content: 'Léonard de Vinci était un peintre, inventeur, ingénieur et scientifique de la Renaissance italienne, créateur de la Joconde et de la Cène.',
                contentEn: 'Leonardo da Vinci was a painter, inventor, engineer, and scientist of the Italian Renaissance, creator of the Mona Lisa and The Last Supper.'
            },
            {
                title: 'L\'Impressionnisme',
                titleEn: 'Impressionism',
                type: 'text',
                duration: '15 min',
                content: 'L\'Impressionnisme est un mouvement artistique du XIXe siècle né en France. Monet, Renoir et Degas peignaient à l\'extérieur, capturant la lumière changeante.',
                contentEn: 'Impressionism is an artistic movement of the 19th century born in France. Monet, Renoir, and Degas painted outdoors, capturing changing light.'
            },
            {
                title: 'Quiz final - Art',
                titleEn: 'Final Quiz - Art',
                type: 'quiz',
                duration: '10 min',
                quizQuestions: [
                    {
                        text: 'Qui a peint la célèbre Joconde (Mona Lisa) ?',
                        textEn: 'Who painted the famous Mona Lisa?',
                        options: [
                            { text: 'Claude Monet', textEn: 'Claude Monet', isCorrect: false },
                            { text: 'Vincent van Gogh', textEn: 'Vincent van Gogh', isCorrect: false },
                            { text: 'Léonard de Vinci', textEn: 'Leonardo da Vinci', isCorrect: true },
                            { text: 'Pablo Picasso', textEn: 'Pablo Picasso', isCorrect: false }
                        ],
                        explanation: 'Léonard de Vinci a peint la Joconde au début du XVIe siècle.',
                        explanationEn: 'Leonardo da Vinci painted the Mona Lisa in the early 16th century.'
                    },
                    {
                        text: 'Quel peintre est célèbre pour sa nuit étoilée et ses tournesols ?',
                        textEn: 'Which painter is famous for Starry Night and sunflowers?',
                        options: [
                            { text: 'Claude Monet', textEn: 'Claude Monet', isCorrect: false },
                            { text: 'Vincent van Gogh', textEn: 'Vincent van Gogh', isCorrect: true },
                            { text: 'Pablo Picasso', textEn: 'Pablo Picasso', isCorrect: false }
                        ],
                        explanation: 'Le peintre néerlandais Vincent van Gogh a peint "La Nuit étoilée" en 1889.',
                        explanationEn: 'Dutch painter Vincent van Gogh painted "The Starry Night" in 1889.'
                    }
                ]
            }
        ]
    }
]

async function seed() {
    await connectDB()

    let teacher = await User.findOne({ email: 'prof@curio.app' })
    if (!teacher) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash('curio2026', salt)
        teacher = await User.create({
            nom: 'Professeur Curio',
            email: 'prof@curio.app',
            password: hashedPassword,
            role: 'enseignant'
        })
        console.log('Compte enseignant de démo créé : prof@curio.app / curio2026')
    } else {
        console.log('Compte enseignant de démo déjà existant')
    }

    let created = 0
    for (const data of demoCourses) {
        const exists = await Course.findOne({ title: data.title, teacher: teacher._id })
        if (exists) continue
        await Course.create({ ...data, teacher: teacher._id })
        created++
    }
    console.log(`${created} cours créés (${demoCourses.length - created} déjà présents).`)

    await mongoose.connection.close()
    process.exit(0)
}

seed().catch(err => {
    console.error('Erreur lors du seed :', err)
    process.exit(1)
})
