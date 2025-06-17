<template>
    <div
        class="flex flex-col items-center mb-16"
        data-aos="fade-down"
    >
        <span :class="['text-sm font-medium uppercase tracking-wider mb-2', titleColor]">
            {{ title }}
        </span>
        <h2 :class="['text-3xl md:text-4xl font-bold mb-4 text-center', subTitleColor]">
            {{ subTitle }}
        </h2>
        <div class="w-16 h-1 bg-chinese-bronze rounded-full"></div>
    </div>
</template>

<script setup>
    defineProps({
        title: {
            type: String,
            required: true
        },

        subTitle: {
            type: String,
            required: true
        },

        titleColor: {
            type: String,
            default: 'text-sky-cyan'
        },

        subTitleColor: {
            type: String,
            default: 'text-oxford-blue'
        }
    })
</script>
