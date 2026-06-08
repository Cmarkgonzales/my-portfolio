import { ref } from 'vue';

const pendingIntent = ref(null);

export function useContactPrefill() {
    function setIntent(intent) {
        pendingIntent.value = intent;
    }

    function consumeIntent() {
        const value = pendingIntent.value;
        pendingIntent.value = null;
        return value;
    }

    function clearIntent() {
        pendingIntent.value = null;
    }

    return { pendingIntent, setIntent, consumeIntent, clearIntent };
}
