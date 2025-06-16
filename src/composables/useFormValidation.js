import { reactive } from 'vue'

export function useFormValidation() {
    const errors = reactive({})

    const validate = (fields) => {
        errors.value = {}

        // Name validation
        if (!fields.name.trim()) {
            errors.value.name = 'Name is required'
        }

        // Email validation
        if (!fields.email.trim()) {
            errors.value.email = 'Email is required'
        } else if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
            errors.value.email = 'Invalid email format'
        }

        // Subject validation
        if (!fields.subject.trim()) {
            errors.value.subject = 'Subject is required'
        }

        // Message validation
        if (!fields.message.trim()) {
            errors.value.message = 'Message is required'
        }

        return Object.keys(errors.value).length === 0
    }

    return {
        errors,
        validate,
    }
}
