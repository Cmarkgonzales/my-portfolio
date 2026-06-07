const LEVEL_MAP = {
    Expert: 92,
    Advanced: 84,
    Intermediate: 68,
    Beginner: 45,
};

const CATEGORY_COLORS = {
    'ncs-blue': '#048ABF',
    'ocean-blue': '#013A63',
    'chinese-bronze': '#D98032',
    'sky-cyan': '#07B2D9',
    'dark-bronze': '#BB5F09',
};

const SKILL_BRAND_PATTERNS = [
    [/vue/i, '#42b883'],
    [/react/i, '#61dafb'],
    [/node\.?js/i, '#3c873a'],
    [/typescript/i, '#3178c6'],
    [/javascript/i, '#f7df1e'],
    [/python/i, '#3776ab'],
    [/firebase/i, '#ffca28'],
    [/tailwind/i, '#38bdf8'],
    [/vite/i, '#646cff'],
    [/nest/i, '#e0234e'],
    [/mongo/i, '#47a248'],
    [/postgres|mysql|sql/i, '#336791'],
    [/git/i, '#f05032'],
    [/docker/i, '#2496ed'],
    [/aws/i, '#ff9900'],
    [/html/i, '#e34c26'],
    [/css/i, '#1572b6'],
    [/figma/i, '#a259ff'],
    [/java\b/i, '#ed8b00'],
    [/php/i, '#777bb4'],
    [/express/i, '#808080'],
    [/graphql/i, '#e535ab'],
    [/redis/i, '#dc382d'],
];

export function resolveProficiency(item) {
    return item.proficiency ?? LEVEL_MAP[item.level] ?? 60;
}

export function resolveCategoryColor(colorKey) {
    return CATEGORY_COLORS[colorKey] ?? '#07B2D9';
}

export function resolveSkillAccentColor(skillName, categoryColor) {
    for (const [pattern, color] of SKILL_BRAND_PATTERNS) {
        if (pattern.test(skillName)) return color;
    }
    return categoryColor;
}

export function flattenSkillsForGalaxy(mainSkills) {
    if (!Array.isArray(mainSkills)) return [];

    return mainSkills.flatMap((group) => {
        const categoryColor = resolveCategoryColor(group.color);

        return (group.skills ?? []).map((item) => ({
            name: item.name,
            level: item.level,
            proficiency: resolveProficiency(item),
            category: group.category,
            categoryColor,
            accentColor: resolveSkillAccentColor(item.name, categoryColor),
        }));
    });
}

export function flattenAdditionalSkillsForGalaxy(additionalSkills) {
    if (!Array.isArray(additionalSkills)) return [];

    return additionalSkills.map((item, index) => {
        const name = typeof item === 'string' ? item : item.name;
        const accentColor = resolveSkillAccentColor(name, '#07B2D9');

        return {
            name,
            category: 'Additional Skills',
            categoryColor: '#07B2D9',
            accentColor,
            showProficiency: false,
            nodeScale: 0.068 + (index % 3) * 0.014,
        };
    });
}
