import {
  loadScript,
  loadCSS
} from '../../../../scripts/aem.js';
function loadCodeMirror(){
   // Load required styles and scripts sequentially
       loadScript('blocks/aemtoedsconverter/clientlib/js/codemirror.min.js');
       loadCSS('blocks/aemtoedsconverter/clientlib/css/codemirror.min.css');
       loadCSS('blocks/aemtoedsconverter/clientlib/css/dracula.min.css');

       loadScript('blocks/aemtoedsconverter/clientlib/js/xml.min.js');
       loadScript('blocks/aemtoedsconverter/clientlib/js/javascript.min.js');
       loadScript('blocks/aemtoedsconverter/clientlib/js/css.min.js');
       loadScript('blocks/aemtoedsconverter/clientlib/js/htmlmixed.min.js');
}
export{
  loadCodeMirror
}