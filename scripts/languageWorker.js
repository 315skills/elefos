// languageWorker.js

export function getPhrases(lang) {
    if (lang === 'RU') {
        return {
            defaultBenefits: [
                " чтобы сохранять проекты",
                " чтобы поддержать разраба",
                " чтобы развернуть код",
                " чтобы делиться с другими",
                " чтобы стать свободнее",
                " чтобы получить все плюсы",
                " чтобы разрабатывать быстрее",
                " чтобы открыть возможности",
                " чтобы синхронизировать данные",
                " доступными методами"
            ],
            extendedBenefits: [
                " просто так! =D",
                " прямо сейчас",
                " пожалуйста",
                " и этих надписей не будет",
                " и кстати я из чувашии",
                " ведь это легко"
            ],
            signUp: "зарегистрируйтесь",
            logIn: "войдите",
            unavailableText: "нам очень жаль, но мы пока не работаем в вашем регионе... помогите нам исправить это (локализация данных, перевод сайта и тп). свяжитесь с нами: 315@spacetrue.ru"
        };
    }
    if (lang === 'BG') {
        return {
            defaultBenefits: [
                " да запазите проекта си",
                " да подкрепите разработчика",
                " да разположите кода си",
                " да споделяте с други",
                " да станете по-свободни",
                " да получите всички предимства",
                " да получите простотата",
                " да отключите функциите",
                " да синхронизирате данните си"
            ],
            extendedBenefits: [
                " просто така! =D",
                " и никога не се отказвайте!",
                "... просто. го. направи.",
                "... хайде!",
                "... всичко е до теб",
                " да продължиш да се занимаваш"
            ],
            signUp: "регистрирайте се",
            logIn: "влезте",
            unavailableText: "съжаляваме, но все още не работим във вашия регион... помогнете ни да поправим това (локализация, превод и т.н.). имейл: 315@spacetrue.ru"
        };
    }
    return {
        defaultBenefits: [
            " to save ur project",
            " to support the dev",
            " to deploy ur code",
            " to share with others",
            " to become freer",
            " to get all the pros",
            " to get de simplicity",
            " to unlock the feats",
            " to sync ur data"
        ],
        extendedBenefits: [
            " just like that! =D",
            " and never give up!",
            "... just. do. it.",
            "... come on!",
            "... it's all up2u",
            " to go on geekin'",
            ". it's all up to u"
        ],
        signUp: "sign up",
        logIn: "log in",
        unavailableText: "sorry, we don't work with ur region yet... help us fix that (legal, localization, translation, etc). email us: 315@spacetrue.ru"
    };
}

export function applyLanguage(lang) {
    document.querySelectorAll('[langEN]').forEach(el => {
        const translation = el.getAttribute(`lang${lang}`);
        if (translation) el.textContent = translation;
    });
}