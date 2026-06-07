<template>
    <div
        class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        :data-reveal="index % 2 === 0 ? 'fade-right' : 'fade-left'"
        :style="{ '--reveal-delay': `${100 + index * 100}ms` }"
    >
        <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 class="text-base font-semibold text-dark-bronze mb-1">
                {{ item.company }}
            </h4>
            <span
                class="inline-block bg-sky-cyan/10 text-sky-cyan px-3 py-1 rounded-full text-xs font-medium tracking-wide"
            >
                {{ item.duration }}
            </span>
        </div>
        <h3 class="text-lg sm:text-xl font-bold text-oxford-blue mb-2 leading-snug">
            {{ item.position }}
        </h3>
        <a
            v-if="item.project"
            :href="item.project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block mb-4 bg-sky-cyan/5 text-sky-cyan px-3 py-1 rounded-md text-xs font-medium hover:bg-sky-cyan/10 transition"
        >
            🔗 {{ item.project.name }}
        </a>
        <ul class="text-gray-600 list-disc list-inside space-y-2 text-sm leading-relaxed">
            <li
                v-for="(responsibility, index) in limitedResponsibilities"
                :key="`res-${index}`"
            >
                {{ responsibility }}
            </li>
        </ul>
        <button
            v-if="item.responsibilities.length > maxResponsibilities"
            @click="showAll = !showAll"
            class="mt-3 text-sky-cyan text-sm font-medium hover:underline"
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

    const limitedResponsibilities = computed(() =>
        showAll.value
            ? props.item.responsibilities
            : props.item.responsibilities.slice(0, maxResponsibilities)
        );
</script>
