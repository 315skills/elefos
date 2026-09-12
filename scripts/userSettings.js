// 0 = Guest (never registered)
// 1 = Registered (logged in)
// 2 = Signed out (has account, but logged out)
// 3 = Subscribed (premium user)

const registeredFlag = 0;

function getUserStatus() {
    return registeredFlag;
}

function getOfferPhrase() {
    if (registeredFlag === 0) return 'Sign up';
    if (registeredFlag === 2) return 'Log in';
    return '';
}

function isRegistered() {
    return registeredFlag === 1 || registeredFlag === 3;
}

function isSubscribed() {
    return registeredFlag === 3;
}

function isGuest() {
    return registeredFlag === 0 || registeredFlag === 2;
}

function showConstitutionArticle() {
    console.log(`
Статья 29 Конституции РФ
    1. Каждому гарантируется свобода мысли и слова.
    2. Не допускаются пропаганда или агитация, возбуждающие социальную, расовую, национальную или религиозную ненависть и вражду. Запрещается пропаганда социального, расового, национального, религиозного или языкового превосходства.
    3. Никто не может быть принужден к выражению своих мнений и убеждений или отказу от них.
    4. Каждый имеет право свободно искать, получать, передавать, производить и распространять информацию любым законным способом. Перечень сведений, составляющих государственную тайну, определяется федеральным законом.
    5. Гарантируется свобода массовой информации. Цензура запрещается.
    `);
}

window.registeredFlag = registeredFlag;
window.getUserStatus = getUserStatus;
window.getOfferPhrase = getOfferPhrase;
window.isRegistered = isRegistered;
window.isSubscribed = isSubscribed;
window.isGuest = isGuest;
window.showConstitutionArticle = showConstitutionArticle;

window.addEventListener('DOMContentLoaded', () => {
    if (registeredFlag === 1 || registeredFlag === 3) {
        function getAnimSets() {
            const lSanimations = localStorage.getItem('userAnimations');
            if (lSanimations !== null && lSanimations === 'false' &&
            !document.body.classList.contains('noAnims')) {
                document.body.classList.add('noAnims');
            } else if (lSanimations === 'true' || lSanimations == null) {
                if (document.body.classList.contains('noAnims')) {
                    document.body.classList.remove('noAnims');
                }
            }
        }

        function getThemeSets() {
            const lStheme = localStorage.getItem('userTheme');
            if (lStheme !== null) {
                document.documentElement.style.setProperty('--theme-color', `var(--theme-${lStheme})`);
                document.documentElement.style.setProperty('--theme-color-agent-sel', `var(--theme-${lStheme}-sel)`);
            }
        }

        document.getElementById('headerEnd').addEventListener('click', () => {
            setTimeout(() => {
                document.getElementById('animChoice').addEventListener('change', getAnimSets);
                document.getElementById('themeChoice').addEventListener('change', getThemeSets);
            }, 100);
        }); getAnimSets(); getThemeSets();
    }
});