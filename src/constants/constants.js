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
    experience: `I'm a Full Stack Developer with 3+ years of experience delivering scalable, high-performance web applications in fast-paced, collaborative environments. Proficient in both frontend and backend development, with expertise in API integration, performance optimization, debugging, and writing reliable, testable code. Currently exploring the intersection of AI and web development to build smarter, next-generation digital experiences.`,
    mindset: `I focus on clean, maintainable code and user-centered solutions that deliver real business value. Collaborative, adaptable, and driven to build products that perform and scale.`,
    hobbies: `In my free time, I enjoy building personal tech projects, playing online games and staying active through sports.`,
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
        company: 'HQZen.com',
        duration: '2022 – Present',
        responsibilities: [
            'Developed scalable features using Vue.js and Django, improving performance and reducing page load times by 30%.',
            'Optimized RESTful APIs and database queries in PostgreSQL to enhance backend efficiency.',
            'Implemented structured metadata and schema.org to boost SEO rankings.',
            'Collaborated cross-functionally in an Agile team to deliver timely feature roll-outs.',
        ]
    },
    {
        title: 'Junior Frontend Developer',
        company: 'BPOSeats.com',
        duration: '2021 – 2022',
        responsibilities: [
            'Built reusable UI components using Vue.js and Vuex, improving front-end maintainability.',
            'Fixed critical UI bugs, resulting in a 25% reduction in customer support tickets.',
            'Participated in unit test writing and code reviews to uphold code quality standards.',
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
                level: 'Advanced',
                bar: 90
            },
            {
                name: 'Vue.js',
                level: 'Advanced',
                bar: 90
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
                name: 'Python',
                level: 'Advanced',
                bar: 90
            },
            {
                name: 'Django',
                level: 'Advanced',
                bar: 85
            },
            {
                name: 'Java',
                level: 'Intermediate',
                bar: 75
            },
            {
                name: 'PostgreSQL',
                level: 'Intermediate',
                bar: 80
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
                level: 'Basic',
                bar: 65
            },
            {
                name: 'Docker',
                level: 'Basic',
                bar: 65
            },
            {
                name: 'CI/CD Pipelines',
                level: 'Basic',
                bar: 65
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

const myProjects = [
    {
        name: 'TaskFlow',
        type: 'Web App',
        description: 'A task management app that helps users organize and prioritize their work efficiently.',
        technologies: ['React', 'Tailwind CSS', 'Java', 'Spring Boot', 'PostgreSQL'],
        demoLink: 'https://task-flow-phi-pied.vercel.app/',
        githubLink: 'https://github.com/Cmarkgonzales/task-flow',
        image: '/taskflow_demo.png'
    }
]

const contactDetails = {
    infos: [
        {
            key: 'Email',
            value: 'cmarkgonzales.17@gmail.com',
            icon: 'envelope',
        },
        {
            key: 'Phone',
            value: '+63 9081122600',
            icon: 'phone'
        },
        {
            key: 'Location',
            value: 'Cebu City, Philippines',
            icon: 'map-marker-alt',
        }
    ],
    emailCredentials: {
        serviceID: 'service_3q9u0ed',
        templateID: 'template_wud8dqf',
        userID: 'LWhREJ7Dl5XTeqp_6'
    }
}

export {
    navLinks,
    socialLinks,
    aboutMe,
    experiences,
    mainSkills,
    additionalSkills,
    myProjects,
    contactDetails
};
