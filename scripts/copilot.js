javascript:(async function(){
  if(document.getElementById("copilotPanel")){
    document.getElementById("copilotPanel").remove();
    document.getElementById("copilotToggle").remove();
    return;
  }
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  document.head.appendChild(s);
  await new Promise(r => s.onload = r);

  const css = `
    #copilotPanel {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 360px;
      max-height: 90%;
      background: #fff;
      box-shadow: -2px 0 10px rgba(0,0,0,0.1);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      font-family: 'Segoe UI', sans-serif;
      padding: 16px;
      overflow-y: auto;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    #copilotPanel h3 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #copilotPrompt {
      display: flex;
      gap: 10px;
      flex-direction: column;
    }
    #copilotPrompt input[type="text"] {
      flex: 1;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 14px;
    }
    #copilotPrompt .file-upload-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #copilotFile {
      display: none;
    }
    .file-upload-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e0e0e0;
      cursor: pointer;
      font-size: 22px;
      color: #333;
      transition: background 0.3s ease;
    }
    .file-upload-label:hover {
      background: #d0d0d0;
    }
    #copilotPreview {
      max-width: 100%;
      max-height: 100px;
      object-fit: contain;
      border: 1px solid #ccc;
      border-radius: 6px;
      margin-top: 6px;
    }
    #copilotPrompt .button-row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    #copilotPrompt button {
      padding: 10px 14px;
      background: linear-gradient(to right,#4b6cb7,#182848);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      flex: 1;
    }
    .secondary-btn {
      background: #f5f5f5 !important;
      color: #333 !important;
      border: 1px solid #ccc;
    }
    #copilotToggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #0a84ff;
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 50%;
      font-size: 20px;
      z-index: 10000;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    #copilotStatus {
      font-size: 12px;
      color: #666;
      margin: 4px 0 0;
    }
    #copilotClose {
      cursor: pointer;
      font-size: 18px;
      color: #888;
    }
    #copilotClose:hover {
      color: #000;
    }
  `;

  const st = document.createElement("style");
  st.textContent = css;
  document.body.insertAdjacentElement('afterend',st);

  const p = document.createElement("div");
  p.id = "copilotPanel";
  p.innerHTML = `
    <h3>Copilot <span id="copilotClose">❌</span></h3>
    <div id="copilotPrompt">
      <button id="copilotNewChat" class="secondary-btn">🔄 New Chat</button>
      <input id="copilotInput" type="text" placeholder="Enter your prompt here" />
      <div class="file-upload-wrapper">
        <label for="copilotFile" class="file-upload-label" title="Attach image">+</label>
        <input id="copilotFile" type="file" accept="image/*" />
      </div>
      <img id="copilotPreview" style="display:none;" />
      <div class="button-row">
        <button id="copilotExecute">🛠 Execute</button>
        <button id="copilotClearImage" class="secondary-btn">🗑 Clear</button>
      </div>
      <div id="copilotStatus"></div>
    </div>
  `;

  const t = document.createElement("button");
  t.id = "copilotToggle";
  t.innerText = "☰";
  t.onclick = () => {
    p.style.display = p.style.display === "none" ? "flex" : "none";
  };

  document.body.insertAdjacentElement('afterend',p);
  document.body.insertAdjacentElement('afterend',t);


  const fileInput = document.getElementById("copilotFile");
  const previewImg = document.getElementById("copilotPreview");
  const promptInput = document.getElementById("copilotInput");
  const status = document.getElementById("copilotStatus");

  document.getElementById("copilotClose").onclick = () => {
    document.getElementById("copilotPanel").remove();
    document.getElementById("copilotToggle").remove();
  };

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        previewImg.src = reader.result;
        previewImg.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImg.style.display = "none";
    }
  });

  document.getElementById("copilotClearImage").onclick = () => {
    fileInput.value = "";
    previewImg.src = "";
    previewImg.style.display = "none";
    status.innerText = "🗑 Image cleared.";
  };

  document.getElementById("copilotNewChat").onclick = () => {
    fileInput.value = "";
    previewImg.src = "";
    previewImg.style.display = "none";
    promptInput.value = "";
    status.innerText = "";
    const links = document.getElementById("copilotLinks");
    if (links) links.remove();
  };

  document.getElementById("copilotExecute").onclick = async () => {
    status.innerText = "Processing...";
    try {
      const html = document.body.outerHTML;
      const css = Array.from(document.styleSheets).slice(0, -1).map(s => {
        try { return Array.from(s.cssRules || []).map(r => r.cssText).join("\n"); } catch(e) { return ""; }
      }).join("\n");
      const js = Array.from(document.scripts).map(s => s.src ? s.src : "inline:" + s.textContent.slice(0, 200)).join("\n");
      const fonts = Array.from(document.querySelectorAll("link[rel~='stylesheet'],style")).map(e => e.outerHTML).join("\n");
      const images = Array.from(document.images).map(img => img.src);
      const icons = Array.from(document.querySelectorAll("link[rel*='icon']")).map(link => link.href);
      const canvas = await html2canvas(document.body, { useCORS: true });
      const screenshot = canvas.toDataURL("image/png");

      let externalUrl = document.querySelector('meta[property="hlx:proxyUrl"]')?.content ||
                        document.querySelector('link[rel="canonical"]')?.href ||
                        location.href;

      const formData = new FormData();
      formData.append("url", location.href);
      formData.append("externalUrl", externalUrl);
      formData.append("html", html);
      formData.append("css", css);
      formData.append("js", js);
      formData.append("fonts", fonts);
      formData.append("icons", JSON.stringify(icons));
      formData.append("images", JSON.stringify(images));
      formData.append("prompt", promptInput.value);
      formData.append("screenshot", screenshot);

      if (fileInput.files.length > 0) {
        formData.append("imageFile", fileInput.files[0]);
      }

      const response = await fetch("http://localhost:4502/content/aem-eds/us/en/jcr:content.copilotStyle.json", {
        method: "POST",
        headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' },
        body: formData
      });

      const data = await response.json();
      console.log("Conversion successful:", data);
      if (data.status === 'ok') {
        status.innerText = "✅ Success!";
        const existingLinks = document.getElementById("copilotLinks");
        if (existingLinks) existingLinks.remove();
        const linkSection = document.createElement("div");
        linkSection.id = "copilotLinks";
        linkSection.style.margin = "10px 0";
        let fileName;
        if(fileInput.files[0]){
          fileName = fileInput.files[0].name;
        }
        const gitMsg = "Added new theme for the provided figma designs :"+fileName;
        const link = document.createElement("a");
        link.href = "http://localhost:4502/content/aem-eds/us/en/jcr:content.copilotStyle.json?cmd=preview&gitMsg=" + gitMsg;
        link.textContent = "Preview";
        link.style.display = "block";
        linkSection.appendChild(link);
        const promptContainer = document.getElementById("copilotPrompt");
        const executeBtn = document.getElementById("copilotExecute");
        promptContainer.insertBefore(linkSection, executeBtn);
      } else {
        status.innerText = "❌ Error: " + (data.message || "Unknown issue");
      }
    } catch (err) {
      console.error(err);
      status.innerText = "❌ Failed to send. Check console.";
    }
  };
})();
