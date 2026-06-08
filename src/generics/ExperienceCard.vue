<template>
    <div
        class="surface-glass border border-border-subtle p-6 rounded-xl shadow-soft-dark hover:shadow-[0_0_0_1px_rgba(4,138,191,0.28),0_12px_32px_rgba(2,10,18,0.55)] transition-shadow"
        :data-reveal="index % 2 === 0 ? 'fade-right' : 'fade-left'"
        :style="{ '--reveal-delay': `${100 + index * 100}ms` }"
    >
        <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 class="text-base font-semibold text-chinese-bronze mb-1">
                {{ item.company }}
            </h4>
            <span
                class="inline-block bg-sky-cyan/10 text-sky-cyan px-3 py-1 rounded-full text-xs font-medium tracking-wide border border-sky-cyan/20"
            >
                {{ item.duration }}
            </span>
        </div>
        <h3 class="text-lg sm:text-xl font-bold text-text-primary mb-2 leading-snug">
            {{ item.position }}
        </h3>
        <a
            v-if="item.project"
            :href="item.project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 mb-4 bg-sky-cyan/5 text-sky-cyan px-3 py-1 rounded-md text-xs font-medium hover:bg-sky-cyan/10 transition focus-ring"
        >
            <font-awesome-icon icon="fas fa-link" />
            {{ item.project.name }}
        </a>

        <div
            v-if="stackChips.length"
            class="flex flex-wrap gap-1.5 mb-4"
        >
            <span
                v-for="tech in stackChips"
                :key="`stack-${tech}`"
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium border border-sky-cyan/30 bg-ncs-blue/20 text-sky-cyan"
            >
                {{ tech }}
            </span>
        </div>

        <ul class="text-text-secondary list-disc list-inside space-y-2 text-sm leading-relaxed">
            <li
                v-for="(responsibility, respIndex) in limitedResponsibilities"
                :key="`res-${respIndex}`"
            >
                {{ responsibility }}
            </li>
        </ul>
        <button
            v-if="item.responsibilities.length > maxResponsibilities"
            type="button"
            class="mt-3 text-sky-cyan text-sm font-medium hover:underline focus-ring rounded-md"
            @click="showAll = !showAll"
        >
            {{ showAll ? 'Show less' : 'Show more' }}
        </button>
    </div>
</template>

<script setup>
    import { ref, computed } from "vue";

    const props = defineProps({
        item: { type: Object, required: true },
        index: { type: Number, required: true }
    });

    const showAll = ref(false);
    const maxResponsibilities = 3;

    const stackChips = computed(() => {
        const technologies = props.item.technologies ?? [];
        const stack = props.item.stack ?? [];
        return [...technologies, ...stack];
    });

    const limitedResponsibilities = computed(() =>
        showAll.value
            ? props.item.responsibilities
            : props.item.responsibilities.slice(0, maxResponsibilities)
        );
</script>
