const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
];

const socialLinks = [
    { icon: 'github', url: 'https://github.com/Cmarkgonzales' },
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/christian-mark-gonzales-8290b8347/' }
];

const aboutMe = {
    experience: `I'm a Full Stack Developer with 3+ years of experience building and maintaining scalable web applications in fast-paced, team-driven environments. Skilled in both frontend and backend development, API integration, performance tuning, bug fixing, and writing test cases to ensure code reliability.`,
    mindset: `I focus on clean, maintainable code and user-centered solutions that deliver real business value. Collaborative, adaptable, and driven to build products that perform and scale.`,
    hobbies: `In my free time, I enjoy building personal tech projects, playing online games, staying active through sports, and hiking to unwind and recharge.`,
    personalInfo: [
        { label: 'Name', value: 'Christian Mark Gonzales' },
        { label: 'From', value: 'Cebu City, Philippines' },
        { label: 'Education', value: 'Bachelor of Science in Computer Science' },
        { label: 'Availability', value: 'Full-time | Part-time | Freelance' }
    ]
};

const experiences = [
    {
        title: 'Full Stack Developer',
        company: 'BPOSeats.com',
        duration: '2022 – Present',
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
        duration: '2021 – 2022',
        responsibilities: [
            'Promoted from intern to junior role for strong technical growth.',
            'Built and refined UI features with Vue.js and Vuex.',
            'Resolved bugs and ensured UI consistency across the platform.',
            'Wrote unit tests and participated in code reviews.',
        ]
    }
]

const mainSkills = [
    {
        category: 'Frontend Development',
        icon: 'desktop',
        color: 'sky-cyan',
        skills: [
            {
                name: 'JavaScript',
                level: 'Expert',
                bar: 95
            },
            {
                name: 'Vue.js',
                level: 'Expert',
                bar: 95
            },
            {
                name: 'React.js',
                level: 'Intermediate',
                bar: 75
            },
            {
                name: 'Tailwind CSS',
                level: 'Intermediate',
                bar: 80
            },
        ]
    },
    {
        category: 'Backend Development',
        icon: 'server',
        color: 'ncs-blue',
        skills: [
            {
                name: 'Node.js',
                level: 'Advanced',
                bar: 90
            },
            {
                name: 'Python',
                level: 'Advanced',
                bar: 90
            },
            {
                name: 'PostgreSQL',
                level: 'Intermediate',
                bar: 75
            },
            {
                name: 'Django',
                level: 'Advanced',
                bar: 85
            },
        ]
    },
    {
        category: 'DevOps & Tools',
        icon: 'gear',
        color: 'ocean-blue',
        skills: [
            {
                name: 'Git & GitHub',
                level: 'Expert',
                bar: 95
            },
            {
                name: 'AWS',
                level: 'Intermediate',
                bar: 75
            },
            {
                name: 'Postman',
                level: 'Intermediate',
                bar: 80
            },
            {
                name: 'CI/CD Pipelines',
                level: 'Intermediate',
                bar: 75
            },
        ]
    }
]

const additionalSkills = [
    {
        name: 'Responsive Design',
        color: 'ocean-blue',
    },
    {
        name: 'Search Engine Optimization (SEO)',
        color: 'ncs-blue',
    },
    {
        name: 'Unit Testing',
        color: 'sky-cyan',
    },
    {
        name: 'RESTful APIs',
        color: 'light-cyan',
    },
    {
        name: 'API Optimization',
        color: 'chinese-bronze',
    },
    {
        name: 'Cross-Functional Collaboration',
        color: 'ocean-blue',
    },
    {
        name: 'Adaptive Learning',
        color: 'ncs-blue',
    },
    {
        name: 'Problem Solving',
        color: 'sky-cyan'
    }
]

export { navLinks, socialLinks, aboutMe, experiences, mainSkills, additionalSkills };
