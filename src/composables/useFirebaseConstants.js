// src/composables/useFirebaseConstants.js
import { ref } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { constantsStore } from '@/store';

const isLoading = ref(true);
const error = ref(null);

const fetchConstants = async () => {
  if (!isLoading.value) return; // prevent multiple fetches if already loaded

  try {
    const docRef = doc(db, 'siteData/constants');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      constantsStore.navLinks = data.navLinks || [];
      constantsStore.homeSection = data.homeSection || {};
      constantsStore.socialLinks = data.socialLinks || [];
      constantsStore.aboutMe = data.aboutMe || {};
      constantsStore.experiences = data.experiences || [];
      constantsStore.projects = data.myProjects || [];
      constantsStore.mainSkills = data.mainSkills || [];
      constantsStore.additionalSkills = data.additionalSkills || [];
      constantsStore.contact = data.contactDetails || {};
    } else {
      throw new Error('Constants document not found.');
    }
  } catch (err) {
    console.error("Failed to fetch constants:", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

export function useFirebaseConstants() {
  return { fetchConstants, isLoading, error };
}
