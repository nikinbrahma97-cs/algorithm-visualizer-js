const openAuthModelButton = document.getElementById('loginBtn')
const authModelCloseButton = document.getElementById('authCloseBtn');

const loginButton = document.getElementById('loginTabBtn');
const signupButton = document.getElementById('signupTabBtn');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const loginBtn = document.getElementById("loginBtn");
const loginUsernameInput = document.getElementById('loginUsername');
const loginPasswordInput = document.getElementById('loginPassword');

const signupUsernameInput = document.getElementById('signupUsername');
const signupPasswordInput = document.getElementById('signupPassword');

const loginError = document.getElementById('loginError')
const signupError = document.getElementById('signupError');

const userChip = document.getElementById("userChip");
const userAvatar = document.getElementById("userAvatar");
const userNameLabel = document.getElementById("userNameLabel");

const myDataBtn = document.getElementById("myDataBtn");
const userDataPanel = document.getElementById("userDataPanel");
const userDataOverlay = document.getElementById("userDataOverlay");
const userDataCloseBtn = document.getElementById("userDataCloseBtn");

const userDataUsername = document.getElementById('userDataUsername');
const userDataJoined = document.getElementById('userDataJoined');
const userDataJSON = document.getElementById('userDataJson');

const authModal = document.getElementById("authModal");
const authOverlay = document.getElementById("authOverlay");

const userChipTrigger = document.getElementById("userChipTrigger");
const userMenu = document.getElementById("userMenu");

const exportDataBtn = document.getElementById('exportDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');

const deleteAccountBtn = document.getElementById('deleteAccountBtn');

const logoutBtn = document.getElementById("logoutBtn");

function openAuthModel() {
    authModal.classList.add("is-open");
    authOverlay.classList.add("is-open");

    authModal.setAttribute("aria-hidden", "false");
}

function closeAuthModal() {
    authModal.classList.remove("is-open");
    authOverlay.classList.remove("is-open");

    authModal.setAttribute("aria-hidden", "true");
}

function displayLoginForm() {
    loginForm.hidden = false;
    signupForm.hidden = true;

    loginButton.classList.add("is-active");
    signupButton.classList.remove("is-active");

    loginButton.setAttribute("aria-selected", "true");
    signupButton.setAttribute("aria-selected", "false");
}

function displaySignupForm() {
    loginForm.hidden = true;
    signupForm.hidden = false;

    loginButton.classList.remove("is-active");
    signupButton.classList.add("is-active");

    loginButton.setAttribute("aria-selected", "false");
    signupButton.setAttribute("aria-selected", "true");
}

function handleLoginSubmit() {
    try {
        loginError.textContent = "";
        loginError.hidden = true;

        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value;

        if(username === "") {
            throw new Error("Username cannot be empty");
        }

        if(password === "") {
            throw new Error("Password cannot be empty");
        }

        if(password.length < 8) {
            throw new Error("Password cannot have less than 8 characters")
        }

        const storedAccounts = localStorage.getItem("algorithmVisualizerAccounts");

        if (storedAccounts === null) {
            throw new Error("Account not found");
        }

        const accounts = JSON.parse(storedAccounts);

        const account = accounts.find(account => account.username === username);

        if (!account) {
            throw new Error("Account not found");
        }

        if(account.password !== password) {
            throw new Error("Incorrect Password");
        }

        setCurrentUser(username);
        updateLoggedInUI(username);
        closeAuthModal();
    }
    catch(error) {
        loginError.textContent = error.message;
        loginError.hidden = false;
    }
}

function setCurrentUser(username) {
    localStorage.setItem("algorithmVisualizerCurrentUser", username);
}

function updateLoggedInUI(username) {
    loginBtn.hidden = true;
    userChip.hidden = false;

    userNameLabel.textContent = username;
    userAvatar.textContent = username.charAt(0).toUpperCase();
}

function handleSignupSubmit() {
    try {
        signupError.textContent = "";
        signupError.hidden = true;

        const username = signupUsernameInput.value.trim();
        const password = signupPasswordInput.value;

        if(username === "") {
            throw new Error("Username cannot be empty");
        }

        if(password === "") {
            throw new Error("Password cannot be empty");
        }

        if(password.length < 8) {
            throw new Error("Password cannot have less than 8 Characters");
        }

        const storedAccounts = localStorage.getItem("algorithmVisualizerAccounts")
        let accounts;

        if(storedAccounts !== null) {
            accounts = JSON.parse(storedAccounts);
            const account = accounts.find(account => account.username === username);

            if(account) {
                throw new Error("Account already exists");
            }
        }

        else {
            accounts = [];
        }

        const newAccount = {
            username: username, 
            password: password,
            joined: new Date().toISOString()
        };

        accounts.push(newAccount);

        localStorage.setItem("algorithmVisualizerAccounts", JSON.stringify(accounts));

        setCurrentUser(username);
        updateLoggedInUI(username);
        closeAuthModal();
    }
    catch(error) {
        signupError.textContent = error.message;
        signupError.hidden = false;
    }
}

function handleLogout() {
    localStorage.removeItem("algorithmVisualizerCurrentUser");

    userMenu.classList.remove("is-open");
    userChipTrigger.setAttribute("aria-expanded", false);

    userChip.hidden = true;
    loginBtn.hidden = false;
}

function restoreCurrentUser() {
    const currentUser = localStorage.getItem("algorithmVisualizerCurrentUser");

    if(currentUser !== null) {
        updateLoggedInUI(currentUser);
    }
}

function toggleUserMenu() {
    const isOpen = userMenu.classList.toggle("is-open");

    userChipTrigger.setAttribute("aria-expanded", String(isOpen));
}

function openUserData() {
    userMenu.classList.remove("is-open");

    userChipTrigger.setAttribute("aria-expanded", "false");

    userDataPanel.classList.add("is-open");
    userDataOverlay.classList.add("is-open");

    userDataPanel.setAttribute("aria-hidden", "false");

    loadUserData();
}

function closeUserData() {
    userDataPanel.classList.remove("is-open");
    userDataOverlay.classList.remove("is-open");

    userDataPanel.setAttribute("aria-hidden", "true");
}

function loadUserData() {
    try {
        const currentUser = localStorage.getItem("algorithmVisualizerCurrentUser");

        if(!currentUser) {
            return
        }
        
        const accountData = localStorage.getItem("algorithmVisualizerAccounts");

        if(!accountData) {
            return;
        }

        const accounts = JSON.parse(accountData);

        const account = accounts.find(account => account.username === currentUser);

        if(!account) {
            throw new Error("Account data not found");
        }

        const safeAccountData = {
            username: account.username,
            userJoined: account.joined,
        };

        userDataUsername.textContent = safeAccountData.username;
        userDataJoined.textContent = safeAccountData.userJoined;

        const settingsData = localStorage.getItem(SETTINGS_KEY);

        if(!settingsData) {
            userDataJSON.textContent = "No saved preferences.";
            return;
        }

        const settings = JSON.parse(settingsData);

        const readableSettings = JSON.stringify(settings, null, 2);

        userDataJSON.textContent = readableSettings;
    }
    catch(error) {
        console.log("Error:", error.message);
    }
}

function exportUserData() {
    const currentUserData = localStorage.getItem("algorithmVisualizerCurrentUser");

    const accountsData = localStorage.getItem("algorithmVisualizerAccounts");
    const accounts = JSON.parse(accountsData);

    const account = accounts.find(account => account.username === currentUserData);

    const safeAccountData = {
        username: account.username,
        userJoined: account.joined,
    };

    const settingsData = localStorage.getItem(SETTINGS_KEY);
    const readableSettings = JSON.parse(settingsData);

    const exportData = {
        account: safeAccountData,
        settings: readableSettings
    };

    const jsonData = JSON.stringify(exportData, null, 2);

    const blob = new Blob([jsonData], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "algorithm-visualizer-data.json";

    link.click();

    URL.revokeObjectURL(url);
}

function clearUserData() {
    localStorage.removeItem(SETTINGS_KEY);
}

function deleteUserAccount() {
    try {
        const currentUser = localStorage.getItem("algorithmVisualizerCurrentUser");

        console.log(currentUser);
        
        if(!currentUser) {
            throw new Error("User not found");
        }

        const accountsData = localStorage.getItem("algorithmVisualizerAccounts");
        const accounts = JSON.parse(accountsData);
        const accountIndex = accounts.findIndex(account => account.username === currentUser);

        if(accountIndex === -1) {
            throw new Error("Account not found");
        }

        accounts.splice(accountIndex, 1);

        localStorage.setItem("algorithmVisualizerAccounts", JSON.stringify(accounts));
        localStorage.removeItem("algorithmVisualizerCurrentUser");
        localStorage.removeItem(SETTINGS_KEY);

        userChip.hidden = true;
        loginBtn.hidden = false;

        closeUserData();
    }
    catch(error) {
        console.log("Error:", error.message);
    }
}

openAuthModelButton.addEventListener("click", openAuthModel);
authModelCloseButton.addEventListener("click", closeAuthModal);

signupButton.addEventListener("click", displaySignupForm);
loginButton.addEventListener("click", displayLoginForm);

signupForm.addEventListener("submit", (event) => { 
    event.preventDefault();
    handleSignupSubmit();
});
loginForm.addEventListener("submit", (event) => { 
    event.preventDefault();
    handleLoginSubmit();
});

userChipTrigger.addEventListener("click", toggleUserMenu);

myDataBtn.addEventListener("click", openUserData);
userDataCloseBtn.addEventListener("click", closeUserData);
userDataOverlay.addEventListener("click", closeUserData);

exportDataBtn.addEventListener("click", exportUserData);
clearDataBtn.addEventListener("click", clearUserData);

deleteAccountBtn.addEventListener("click", deleteUserAccount);

logoutBtn.addEventListener("click", handleLogout);

restoreCurrentUser();