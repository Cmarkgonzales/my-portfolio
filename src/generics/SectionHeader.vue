<template>
    <div
        class="flex flex-col items-center mb-14 md:mb-[4.5rem] lg:mb-20 px-2"
        data-reveal="fade-up"
    >
        <span :class="['text-xs md:text-sm font-semibold uppercase tracking-[0.18em] mb-3', titleColor]">
            {{ title }}
        </span>
        <h2 :class="['text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-center leading-tight', subTitleColor]">
            {{ subTitle }}
        </h2>
        <div class="w-20 h-1 bg-chinese-bronze rounded-full"></div>
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
