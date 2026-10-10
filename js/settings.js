const SETTINGS_KEY = "algorithmVisualizerSettings";

document.addEventListener("DOMContentLoaded", () => {

    const settingsButton = document.getElementById("settingsBtn");
    const settingsPanel = document.getElementById("settingsPanel");
    const settingsOverlay = document.getElementById("settingsOverlay");
    const settingsCloseBtn = document.getElementById("settingsCloseBtn");
    const settingsResetBtn = document.getElementById("settingsResetBtn");

    const themeOptions = document.querySelectorAll(".theme-option");

    const defaultSpeedInput = document.getElementById("defaultSpeedInput");
    const defaultSpeedValue = document.getElementById("defaultSpeedValue");

    const reduceMotionToggle = document.getElementById("reduceMotionToggle");

    const defaultDatasetRangeInput = document.getElementById('defaultDatasetSizeInput');
    const defaultDatasetRangeValue = document.getElementById('defaultDatasetSizeValue');
    const usetMaxDatasetToggle = document.getElementById('useMaxDatasetToggle');

    function saveSettings() {
        const settings = { 
            defaultSpeed: Number(defaultSpeedInput.value),
            defaultTheme: document.documentElement.getAttribute("data-theme") || "dark",
            motionState: reduceMotionToggle.checked,
            defaultDatasetRange: Number(defaultDatasetRangeInput.value)
        };

        localStorage.setItem( SETTINGS_KEY, JSON.stringify(settings));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);

        if (!savedSettings) {
            return;
        }

        const settings = JSON.parse(savedSettings);

        if (settings.defaultSpeed !== undefined) {
            defaultSpeedInput.value = settings.defaultSpeed;
            defaultSpeedValue.textContent = `${settings.defaultSpeed}×`;

            speedInput.value = settings.defaultSpeed;
            speedValue.textContent = `${settings.defaultSpeed}×`;
        }

        if(settings.defaultDatasetRange !== undefined) {
            defaultDatasetRangeInput.value = settings.defaultDatasetRange;
            defaultDatasetRangeValue.textContent = defaultDatasetRangeInput.value;

            sizeInput.value = settings.defaultDatasetRange;
            sizeValue.textContent = sizeInput.value;

            handleSizeChange();
        }

        if(settings.defaultTheme !== undefined) {
            if(settings.defaultTheme === "light") {
                document.documentElement.setAttribute("data-theme", "light");
            }

            else {
                document.documentElement.removeAttribute("data-theme");
            }

            themeOptions.forEach(option => {
                const isSelected =
                    option.dataset.themeValue === settings.defaultTheme;

                   option.classList.toggle("is-active", isSelected);
                   option.setAttribute("aria-checked", String(isSelected));
            });
        }

        if(settings.motionState !== undefined) {
            reduceMotionToggle.checked = settings.motionState;

            if (settings.motionState) {
                document.body.classList.add("reduce-motion");
            } 
            else {
                document.body.classList.remove("reduce-motion");
            }
        }
    }

    function openSettings() {
        userMenu.classList.remove("is-open");
        userChipTrigger.setAttribute("aria-expanded", "false");
    
        settingsPanel.classList.add("is-open");
        settingsOverlay.classList.add("is-open");
    
        settingsPanel.setAttribute("aria-hidden", "false");
    }

    function closeSettings() {
        settingsPanel.classList.remove("is-open");
        settingsOverlay.classList.remove("is-open");

        settingsPanel.setAttribute("aria-hidden", "true");
    }

    function handleDefaultSpeedChange() {
        defaultSpeedValue.textContent = `${defaultSpeedInput.value}×`;

        speedInput.value = defaultSpeedInput.value;
        speedValue.textContent = `${speedInput.value}×`;

        saveSettings();
    }

    function handleThemeChange(event) {
        const selectedTheme = event.currentTarget.dataset.themeValue;

        if (selectedTheme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
        } 

        else {
            document.documentElement.removeAttribute( "data-theme");
        }

        themeOptions.forEach(option => {
            option.classList.remove("is-active");
            option.setAttribute("aria-checked", "false");
        });

        event.currentTarget.classList.add("is-active");
        event.currentTarget.setAttribute("aria-checked", "true");

        saveSettings();
    }

    function handleChartMotion() {
        if (reduceMotionToggle.checked) {
            document.body.classList.add("reduce-motion");
        } 
        
        else {
            document.body.classList.remove("reduce-motion");
        }

        saveSettings();
    }

    function handleDefaultDatasetRangeChange() {
        defaultDatasetRangeValue.textContent = defaultDatasetRangeInput.value;

        sizeInput.value =  defaultDatasetRangeInput.value;
        sizeValue.textContent = sizeInput.value;

        handleSizeChange();

        saveSettings();
    }

    function resetSettings(shouldSave = true) {
        defaultSpeedInput.value = '5';
        defaultSpeedValue.textContent = '5×';

        speedInput.value = defaultSpeedInput.value;
        speedValue.textContent = `${speedInput.value}×`;

        reduceMotionToggle.checked = false;
        document.body.classList.remove("reduce-motion");

        document.documentElement.removeAttribute("data-theme");

        themeOptions.forEach(uiTheme => {
            if(uiTheme.dataset.themeValue === 'dark') {
                uiTheme.classList.add("is-active");
                uiTheme.setAttribute("aria-checked", "true");
            }
            else {
                uiTheme.classList.remove("is-active");
                uiTheme.setAttribute("aria-checked", "false");
            }
        });

        defaultDatasetRangeInput.value = "10";
        defaultDatasetRangeValue.textContent = defaultDatasetRangeInput.value;

        sizeInput.value = defaultDatasetRangeInput.value;
        sizeValue.textContent = sizeInput.value;

        handleSizeChange();

        if (shouldSave) {
            saveSettings();
        }
    }

    settingsButton.addEventListener("click", openSettings);
    settingsCloseBtn.addEventListener("click", closeSettings);
    settingsOverlay.addEventListener("click", closeSettings);

    defaultSpeedInput.oninput = handleDefaultSpeedChange;

    reduceMotionToggle.onchange = handleChartMotion;

    themeOptions.forEach(option => {
        option.addEventListener(
            "click",
            handleThemeChange
        );
    });

    settingsResetBtn.addEventListener("click", resetSettings);

    defaultDatasetRangeInput.oninput = handleDefaultDatasetRangeChange;

    loadSettings();
});