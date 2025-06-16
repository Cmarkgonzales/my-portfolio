<template>
    <div class="flex flex-col">
        <label
            :for="id"
            class="block text-sm font-medium mb-2"
        >
            {{ label }}
        </label>
        <input
            :id="id"
            :type="type"
            :placeholder="placeholder"
            class="w-full px-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 text-white"
            :class="[
                error ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-chinese-bronze'
            ]"
            :value="modelValue"
            @input="onInput"
        />
        <p
            v-if="error"
            class="text-sm text-red-400 mt-1"
        >
            {{ error }}
        </p>
    </div>
</template>

<script setup>
    defineProps({
        id: { type: String, required: true },
        label: { type: String, required: true },
        modelValue: { type: String, required: true },
        type: { type: String, default: 'text' },
        placeholder: { type: String, default: '' },
        error: { type: String, default: '' },
    })

    const emit = defineEmits(['update:modelValue', 'clearError'])

    const onInput = (e) => {
        emit('update:modelValue', e.target.value)
        emit('clearError')
    }
</script>
