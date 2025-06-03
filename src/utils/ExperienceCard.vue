<template>
    <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <span class="inline-block bg-sky-cyan/10 text-sky-cyan px-3 py-1 rounded-full text-sm font-medium mb-3">
            {{ item.duration }}
        </span>
        <h3 class="text-xl font-bold text-oxford-blue mb-2">{{ item.title }}</h3>
        <h4 class="text-chinese-bronze font-medium mb-4">{{ item.company }}</h4>
        <ul class="text-gray-700 space-y-2 list-disc list-inside">
            <li
                v-for="(responsibility, index) in item.responsibilities"
                :key="`res-${index}`"
            >
                {{ responsibility }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            item: Object
        }
    }
</script>
