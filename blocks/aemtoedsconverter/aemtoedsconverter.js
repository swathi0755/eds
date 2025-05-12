import { getConfigValue } from '../../scripts/configs.js';
import {loadCodeMirror} from '../../blocks/aemtoedsconverter/clientlib/js/loadCodeMirror.js';
import {showRatingPopup} from '../../blocks/aemtoedsconverter/clientlib/js/ratingPopUp.js';
import {loadThemeSwitch} from '../../blocks/aemtoedsconverter/clientlib/js/theme-switch.js';
import {createProgressBar, showProgressBar, hideProgressBar} from '../../blocks/aemtoedsconverter/clientlib/js/progressBar.js';
import { showPopup } from '../../scripts/popup-msg.js';
import { googleAnalytics } from '../../scripts/googleAnalytics.js';

async function initializeAPIEndpoints() {
    return {
        'Content-Type': 'application/json',
        'edsDocumentDropdownEndpoint': await getConfigValue('edsDocumentDropdownEndpoint'),
        'aemCmpDropdownEndpoint': await getConfigValue('aemCmpDropdownEndpoint'),
        'aemToEdsMigrationEndpoint': await getConfigValue('aemToEdsMigrationEndpoint'),
        'downloadZipEndpoint': await getConfigValue('downloadZipEndpoint')
    };
}

export default async function decorate(block) {

    const API_END_POINTS = await initializeAPIEndpoints();

  //googleAnalytics();
  loadCodeMirror();


  const CONSTANTS ={
    cmpPath :extractData('cmpPath'),
    ratingDescription: extractData("ratingDescription")
  }

  const modeDropdownContainer = document.createElement("div");
  const modeLabel = document.createElement("label");
  modeLabel.textContent = "Mode of html Extraction";
  modeLabel.setAttribute("for", "mode-of-extraction");

  const modeDropdown = document.createElement("select");
  modeDropdown.id = "mode-of-extraction";
  modeDropdown.innerHTML = `
    <option value="Automated">Automated</option>
    <option value="Manual">Manual</option>
  `;

  modeDropdownContainer.append(modeLabel, modeDropdown);

  const aemComponentDropdown = document.getElementById("aem-component");
  const codeMirrorBlock = document.createElement("div");
  codeMirrorBlock.id = "editor-container";
  codeMirrorBlock.className = "editor-container";
  codeMirrorBlock.style.display = "none";

  let editor = null;
  modeDropdown.addEventListener("change", (event) => {
     const aemComponentDropdownEl = aemComponentDropdown ? aemComponentDropdown :block.querySelector('#aem-component').parentElement;
    if (event.target.value === "Manual") {
      if (aemComponentDropdownEl) {
        aemComponentDropdownEl.closest("div").style.display = "none";
      }
      codeMirrorBlock.style.display = "block";
       // Initialize CodeMirror editor
       // Clear existing editor instance before initializing a new one
           if (editor) {
              editor.getWrapperElement().remove(); // This removes CodeMirror instance
             editor = null;
           }
            if (typeof CodeMirror !== "undefined") {
              editor = CodeMirror(codeMirrorBlock, {
                  mode: 'htmlmixed',
                  htmlMode: true,
                  theme: 'dracula',
                  extraPlugins: 'codemirror',
                  autoFormatOnModeChange: true,
                  lineNumbers: true,
                  tabSize: 2
              });
               // Create and style the floating label
                var label = block.querySelector('#code-mirror-editor-label') ? block.querySelector('#code-mirror-editor-label') :document.createElement("label");
                label.textContent = "HTML Editor";
                label.id = "code-mirror-editor-label";
                label.style.top = "10px";
                label.style.left = "10px";
                label.style.fontSize = "12px";
                label.style.color = "white";
                label.style.pointerEvents = "none";

                // Append label inside the CodeMirror wrapper
                editor.getWrapperElement().style.position = "relative";
                codeMirrorBlock.prepend(label);
            }


    } else {
      if (aemComponentDropdownEl) {
        aemComponentDropdownEl.closest("div").style.display = "block";
      }
      codeMirrorBlock.style.display = "none";
      // Clear the editor instance when switching away from "Manual"
          if (editor) {
           editor.getWrapperElement().remove();
            editor = null;
          }
    }
  });
  function extractData(propName) {

    const rows = block.children;
    let data = {};

    for (let row of rows) {
        const keyElement = row.querySelector(':scope > div:first-child p');
        const valueElement = row.querySelector(':scope > div:last-child');

        if (keyElement && valueElement && keyElement.textContent.trim() === propName) {
            const paragraphs = valueElement.querySelectorAll('p');

            data[propName] = (paragraphs && paragraphs.length > 1 || paragraphs.length == 0)
                ? keyElement.parentElement.nextElementSibling  // Return array if multiple paragraphs
                : paragraphs.length === 1
                ? paragraphs[0].textContent.trim()  // Return single value if one paragraph
                : valueElement.textContent.trim();  // Default fallback

            break; // Exit loop once found
        }
    }

    return data[propName] || null;
}

 /** Multifield Input Section */
   const createMultifield = (labelText, fieldClass) => {
     const multifieldContainer = document.createElement("div");
     multifieldContainer.className = "multifield-container";

     const label = document.createElement("label");
     label.textContent = labelText;
     label.className = "multifield-label";

     const addButton = document.createElement("button");
     addButton.textContent = "+ Add";
     addButton.className = "multifield-add-button";
     addButton.type = "button";

     const fieldList = document.createElement("div");
     fieldList.className = `multifield-list ${fieldClass}`;

     const addNewField = () => {
       const fieldWrapper = document.createElement("div");
       fieldWrapper.className = "multifield-item";

       const input = document.createElement("input");
       input.type = "text";
       input.type = "text"+fieldClass;
       input.placeholder = `Enter ${labelText}`;
       input.className = `multifield-input ${fieldClass}`;

       const fileInput = document.createElement("input");
       fileInput.type = "file";
       fileInput.name = "file"+fieldClass;
       fileInput.className = `multifield-file ${fieldClass}-file`;

       const removeButton = document.createElement("button");
       removeButton.textContent = "❌";
       removeButton.className = "remove-field";
       removeButton.type = "button";

       removeButton.addEventListener("click", () => {
         fieldWrapper.remove();
       });

       fieldWrapper.append(input, fileInput, removeButton);
       fieldList.appendChild(fieldWrapper);
     };

     addButton.addEventListener("click", addNewField);
     addNewField(); // Add first field by default

     multifieldContainer.append(label, fieldList, addButton);
     return multifieldContainer;
   };



  createProgressBar();

  loadThemeSwitch();

  const createDropdown = (labelText, id) => {
    const container = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = labelText;
    label.setAttribute("for", id);
    const dropdown = document.createElement("select");
    dropdown.id = id;
    dropdown.required = true;
    dropdown.name = id;
    container.append(label, dropdown);
    return { container, dropdown };
  };

  const createInputField = (labelText, id, placeholder, onBlurCallback) => {
    const container = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = labelText;
    label.setAttribute("for", id);
    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.name = id;
    input.required = true;
    input.placeholder = placeholder;
    input.addEventListener("blur", onBlurCallback);
    container.append(label, input);
    return container;
  };

  const createButton = (type,text, id) => {
    const button = document.createElement(type);
    button.id = id;
    button.textContent = text;
    button.className = "button";
    return button;
  };

  const { container: edsDropdownContainer, dropdown: edsDropdown } = createDropdown("Select EDS document:", "eds-dropdown");

  const fetchOptions = (url, dropdown, keyText, keyValue, wrapperKey = null) => {
    fetch(url, { headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' } })
      .then(response => response.json())
      .then(data => {
         if(wrapperKey ==null){
           dropdown.innerHTML = "<option value=''>Select document</option>";
         }else{
             dropdown.innerHTML = "<option value=''>Select component</option>";
         }
        const items = wrapperKey ? data[wrapperKey] : data;
        // Sort items alphabetically
          items.sort((a, b) => a[keyText].localeCompare(b[keyText]));

        items.forEach(item => {
          let opt = document.createElement("option");
          opt.value = item[keyValue];
          opt.textContent = item[keyText];
          dropdown.appendChild(opt);
        });
      })
      .catch(error => console.error(`Error fetching options from ${url}:`, error));
  };

  const fetchButtonLabels = (documentValue) => {
    const apiUrl = `${API_END_POINTS.edsDocumentDropdownEndpoint}?document=${encodeURIComponent(documentValue)}`;
    return fetch(apiUrl, { headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' } })
      .then(response => response.json())
      .then(data => ({
        convertLabel: data.find(item => item.value === "convert")?.text || "Convert to EDS",
        downloadLabel: data.find(item => item.value === "download")?.text || "Download EDS Blocks"
      }))
      .catch(error => {
        console.error("Error fetching button labels:", error);
        return { convertLabel: "Convert to EDS", downloadLabel: "Download EDS Blocks" };
      });
  };

  const onEdsDocumentBlur = () => {
    const edsDocumentInput = document.getElementById("eds-document");
    const documentValue = edsDocumentInput.value.trim();
    if (documentValue) {
      fetchButtonLabels(documentValue).then(labels => {
        convertButton.textContent = labels.convertLabel;
        downloadButton.textContent = labels.downloadLabel;
      });
      const apiUrl = `${API_END_POINTS.edsDocumentDropdownEndpoint}?document=${encodeURIComponent(documentValue)}`;
      fetchOptions(apiUrl, edsDropdown, "text", "value");
    }
  };

  const inputContainer = createInputField("EDS Document Link:", "eds-document", "Enter EDS Document URL", onEdsDocumentBlur);
  const { container: aemDropdownContainer, dropdown: aemDropdown } = createDropdown("Choose AEM Component:", "aem-component");

  fetchOptions(`${API_END_POINTS.aemCmpDropdownEndpoint}?cmpPath=${CONSTANTS.cmpPath}`, aemDropdown, "title", "path", "components");

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  const convertButton = createButton("button","Convert to EDS", "convert-button");
  const downloadButton = createButton("a","Download EDS Blocks", "download-button");
  buttonContainer.append(convertButton, downloadButton);

  // Event Listener for Download Button
  downloadButton.addEventListener("click", (e) => {
    const edsResponse = localStorage.getItem("edsResponse");

    if (!edsResponse) {
      e.preventDefault();
    }
    try {
      const responseJson = JSON.parse(edsResponse);
      const blocksPath = responseJson.edsBlockPath;
      showRatingPopup(CONSTANTS.ratingDescription);

      if (!blocksPath) {
        //alert("No blocksPath found in stored EDS response.");
        showPopup("No blocksPath found in stored EDS response.", "error");
        return;
      }

      const apiUrl = `${API_END_POINTS.downloadZipEndpoint}?filePath=${encodeURIComponent(blocksPath)}`;
      downloadButton.href = apiUrl;
    } catch (error) {
      console.error("Error parsing EDS response:", error);
      showPopup("Invalid EDS response in local storage.","error");
    }
  });


  // Event Listener for Convert Button
  convertButton.addEventListener("click", () => {

   let htmlContent = "";
    if (editor && modeDropdown.value === "Manual") {
      htmlContent = editor.getValue();
    }


      const cssFiles = [...document.querySelectorAll(".cssFiles .multifield-input")]
        .map((input) => input.value.trim())
        .filter((val) => val !== ""); // Remove empty values

      const jsFiles = [...document.querySelectorAll(".jsFiles .multifield-input")]
        .map((input) => input.value.trim())
        .filter((val) => val !== ""); // Remove empty values

      const selectedCmp = document.querySelector("#aem-component")?.value || "";
      const documentUrl = document.querySelector("#eds-document")?.value.trim() || "";
      const selectedEdsDoc = document.querySelector("#eds-dropdown")?.value || "";

      if (!documentUrl || !selectedEdsDoc || !modeDropdown ||
          (modeDropdown.value === "Manual" && !htmlContent) ||
          (modeDropdown.value !== "Manual" && !selectedCmp)) {
        //alert("Please fill in all required fields.");
        showPopup("Please fill in all required fields.", "warning");
        return;
      }
      convertButton.disabled = true;
      convertButton.textContent = "Processing...";
      showProgressBar();
      const payload = {
        cmpPath: selectedCmp,
        mode: modeDropdown.value,
        htmlContent: htmlContent,
        documentUrl,
        edsDocument: selectedEdsDoc,
        cssFiles,
        jsFiles,
      };
      const formData = new FormData();
        formData.append('cmpPath', selectedCmp);
        formData.append('documentUrl', documentUrl);
        formData.append('edsDocument', selectedEdsDoc);
        formData.append('mode', modeDropdown.value);
        formData.append('htmlContent', htmlContent);

       // Collect CSS Files
          document.querySelectorAll(".cssFiles .multifield-item").forEach((item) => {
            const input = item.querySelector(".multifield-input");
            const file = item.querySelector(".multifield-file").files[0];
            if (input.value.trim()) formData.append("cssFiles", input.value.trim());
            if (file) formData.append("cssFileUploads", file);
          });

          // Collect JS Files
          document.querySelectorAll(".jsFiles .multifield-item").forEach((item) => {
            const input = item.querySelector(".multifield-input");
            const file = item.querySelector(".multifield-file").files[0];
            if (input.value.trim()) formData.append("jsFiles", input.value.trim());
            if (file) formData.append("jsFileUploads", file);
          });

          console.log("Sending Data:", Array.from(formData.entries()));



      fetch(`${API_END_POINTS.aemToEdsMigrationEndpoint}`, {
        method: "POST",
        headers: {
          "Authorization": "Basic YWRtaW46YWRtaW4="
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Conversion successful:", data);
          showPopup("Conversion successful!", "success");
          if(data){
             localStorage.setItem("edsResponse", JSON.stringify(data));
          }
        })
        .catch((error) => {
          console.error("Error converting component:", error);
          //alert("Conversion Failed!");
          showPopup("Conversion Failed!", "error");
        })
        .finally(() => {
          convertButton.disabled = false;
          convertButton.textContent = "Convert to EDS";
          hideProgressBar();
        });
    });

  block.innerHTML = "";

  block.append(inputContainer,modeDropdownContainer, aemDropdownContainer,codeMirrorBlock, edsDropdownContainer,
  createMultifield("JS Files", "jsFiles"),createMultifield("CSS Files", "cssFiles"),buttonContainer);
}