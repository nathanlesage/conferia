import { Conferia } from './conferia'

// Attach the class to the window object
window.Conferia = Conferia

// Also export the class so that consumers can also `import` the library
// explicitly. (This way you can choose to either `import url` or
// `import Conferia from url` depending on semantics.)
export default Conferia
