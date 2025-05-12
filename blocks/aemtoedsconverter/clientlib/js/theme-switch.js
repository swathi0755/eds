function loadThemeSwitch(){
  /* Themes magic */
    const themeSwitch = document.createElement("button");
    themeSwitch.textContent = "🌙";
    themeSwitch.id = "theme-toggle";
    themeSwitch.className = "theme-toggle";
    const body = document.querySelector("header");
    document.body.classList.add("light-theme");
    body.append(themeSwitch);
    const actbody = document.body;
    const themes = ["light-theme", "dark-theme","yellow-theme", "grey-theme","round-theme"];

    // Load last saved theme from localStorage
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme && themes.includes(savedTheme)) {
      actbody.className = savedTheme;
      themeSwitch.textContent = getThemeIcon(savedTheme);
    }

    // Function to get the icon based on theme
   function getThemeIcon(theme) {
     switch (theme) {
       case "light-theme":
         return "🌙"; // Moon for dark mode switch
       case "dark-theme":
         return "☀️"; // Sun for light mode switch
       case "grey-theme":
         return "⚫"; // Black circle for grey theme
       case "round-theme":
         return "🔵"; // Blue circle for round theme
       case "yellow-theme":
         return "🟡"; // Yellow circle for yellow theme
       default:
         return "🔘"; // Default icon
     }
   }


    let currentThemeIndex = themes.indexOf(actbody.className);
    if (currentThemeIndex === -1) currentThemeIndex = 0; // Default to light-theme if no match

    themeSwitch.addEventListener("click", () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const newTheme = themes[currentThemeIndex];
      actbody.className = newTheme;

      // Store theme in localStorage
      localStorage.setItem("selectedTheme", newTheme);

      // Update toggle button icon
      themeSwitch.textContent = getThemeIcon(newTheme);
    });
}

  export { loadThemeSwitch };
