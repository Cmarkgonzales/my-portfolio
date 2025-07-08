import { reactive } from 'vue';

export const constantsStore = reactive({
    navLinks: [],
    homeSection: {},
    socialLinks: [],
    aboutMe: {},
    resumeLink: '/my-portfolio/resume.pdf', // Default resume link
    experiences: [],
    projects: [],
    mainSkills: [],
    additionalSkills: [],
    contact: {},
});
