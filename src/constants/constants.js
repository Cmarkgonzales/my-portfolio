const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
];

const aboutMe = {
    experience: `I'm a Full Stack Developer with 3+ years of experience building and maintaining scalable web applications in fast-paced, team-driven environments. Skilled in both frontend and backend development, API integration, performance tuning, bug fixing, and writing test cases to ensure code reliability.`,
    mindset: `I focus on clean, maintainable code and user-centered solutions that deliver real business value. Collaborative, adaptable, and driven to build products that perform and scale.`,
    hobbies: `In my free time, I enjoy building personal tech projects, playing online games, staying active through sports, and hiking to unwind and recharge.`,
    personalInfo: [
        { label: 'Name', value: 'Christian Mark Gonzales' },
        { label: 'From', value: 'Cebu City, Cebu, Philippines' },
        { label: 'Education', value: 'Bachelor of Science in Computer Science' },
        { label: 'Availability', value: 'Full-time | Part-time | Freelance' }
    ]
};


const experiences = [
    {
        title: 'Full Stack Developer',
        company: 'BPOSeats.com',
        duration: 'Aug 2022 – Present',
        responsibilities: [
            'Maintain and enhance platform using Vue.js, Node.js, and PostgreSQL.',
            'Launch new features through cross-functional team collaboration.',
            'Boost SEO performance with optimized metadata and structured data.',
            'Improve API and query efficiency for faster load times.',
        ]
    },
    {
        title: 'Junior Frontend Developer',
        company: 'BPOSeats.com',
        duration: 'June 2021 – July 2022',
        responsibilities: [
            'Promoted from intern to junior role for strong technical growth.',
            'Built and refined UI features with Vue.js and Vuex.',
            'Resolved bugs and ensured UI consistency across the platform.',
            'Wrote unit tests and participated in code reviews.',
        ]
    }
]

export { navLinks, aboutMe, experiences };
