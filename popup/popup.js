const OPTIONS_PAGE = "OptionsPage";
const OptionsPageButton = document.getElementById(OPTIONS_PAGE);

if (OptionsPageButton) {
    OptionsPageButton.onclick = function() {
        chrome.runtime.openOptionsPage();
    }
}