import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
;
// Import individual icons
import {
    faBars, faXmark, faDownload, faClock,
    faDesktop, faServer, faGear, faExternalLinkAlt,
    faEnvelope, faPhone, faMapMarkerAlt,
    faSpinner, faArrowUp, faPaperPlane
} from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'

// Add icons to the library
library.add(
    faBars,
    faXmark,
    faDownload,
    faDesktop,
    faServer,
    faGear,
    faExternalLinkAlt,
    faClock,
    faArrowUp,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faSpinner,
    faPaperPlane,
    faGithub,
    faLinkedin
)

export default (app) => {
  app.component('font-awesome-icon', FontAwesomeIcon)
};
