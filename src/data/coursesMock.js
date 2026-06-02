export const courses = [
  {
    id: 1,
    title: "Introduction au Développement Web",
    description: "Apprenez les bases du HTML, CSS et JavaScript.",
    progress: 35, // On met 35% pour tester visuellement la barre !
    certified: false,
    chapters: [
      {
        id: "ch1",
        title: "1. Les bases du HTML5",
        content: "Le HTML (HyperText Markup Language) est le squelette de toutes les pages web...",
        isCompleted: true
      },
      {
        id: "ch2",
        title: "2. Styliser avec CSS3",
        content: "Le CSS (Cascading Style Sheets) permet de mettre en forme et de designer votre site...",
        isCompleted: false
      }
    ],
    quiz: {
      id: "q1",
      questions: [
        {
          id: "q1_1",
          questionText: "Que signifie HTML ?",
          options: [
            "HyperText Markup Language",
            "High Technical Modern Language",
            "Hyperlinks Text Management Language"
          ],
          correctAnswer: "HyperText Markup Language"
        },
        {
          id: "q1_2",
          questionText: "Quelle propriété CSS change la couleur du texte ?",
          options: ["background-color", "color", "font-style"],
          correctAnswer: "color"
        }
      ]
    }
  }
];