/* only mvp realisation, then TODO loading whole section from this file
    1. rename .cardBenefit. this name is valid only in landing
    2. generate layout with innerHTML right here
    3. organize borders also linked to innerWidth
*/

document.addEventListener('DOMContentLoaded', () => {
    const cardsSection = document.querySelector('.cardsSection') || document.querySelector('#allFeautures');

    const allBenefitCards = cardsSection.querySelectorAll('.cardBenefit');
    const allBenefitCardsArray = Array.from(allBenefitCards);

    const allEmptyCards = cardsSection.querySelectorAll('.emptyCard');
    const horEmptyCards = cardsSection.querySelectorAll('.horizontal.emptyCard');
    const verEmptyCards = cardsSection.querySelectorAll('.vertical.emptyCard');

    const allEmptyAndBenefitCards = cardsSection.querySelectorAll('.emptyCard, .cardBenefit');

    function layoutBuilder() {
        const paddingWidth = (((parseFloat(getComputedStyle(document.querySelector('header')).paddingLeft)) + (parseFloat(getComputedStyle(document.querySelector('header')).paddingRight))) / 2) + 'px';
        document.querySelectorAll('.headerPadding').forEach(hpBlocks => {
            hpBlocks.style.paddingLeft = paddingWidth; hpBlocks.style.paddingRight = paddingWidth;
        });

        if (window.innerWidth > 1080 && !cardsSection.querySelector('section.flex.jc-se.ai-c.w-100')) {
            // empty cards handler and padding regulator
            allEmptyCards.forEach(emptyCard => emptyCard.style.display = 'flex'); cardsSection.style.padding = '0';
            verEmptyCards.forEach(verEmptyCard => verEmptyCard.style.minWidth = paddingWidth);

            // border regulation
            allBenefitCards.forEach(benefitCard => {
                benefitCard.classList.contains('bordt') && benefitCard.classList.remove('bordt', 'solidBord');
            }); allBenefitCardsArray.slice(-4).forEach(fourLastBenefitCard => {
                fourLastBenefitCard.classList.contains('bordb') && fourLastBenefitCard.classList.remove('bordb');
            }); allBenefitCardsArray.forEach((benefitCard, cardIndex) => {
                if (cardIndex % 4 === 0 && benefitCard.classList.contains('bordl')) benefitCard.classList.remove('bordl');
                if (cardIndex % 4 === 3 && benefitCard.classList.contains('bordl')) benefitCard.classList.remove('bordr');
            });

            // horizont cards height settings
            const horEmptyCardsArray = Array.from(horEmptyCards);
            [...horEmptyCardsArray.slice(0, 3), ...horEmptyCardsArray.slice(-3)].forEach(horEmptyNoAnimCard => {
                horEmptyNoAnimCard.style.minHeight = '0'; horEmptyNoAnimCard.style.height = ((parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--px')) * 24) * 2) + 'px';
            });
        } else if (window.innerWidth <= 1080 && !cardsSection.querySelector('section.flex.jc-se.ai-c.w-100')) {
            // empty cards handler and padding regulator
            allEmptyCards.forEach(emptyCard => emptyCard.style.display = 'none');
            verEmptyCards.forEach(verEmptyCard => verEmptyCard.style.minWidth = '0');
            cardsSection.style.padding = paddingWidth;

            if (window.innerWidth > 768) {
                // border and layout direction regulation
                allBenefitCards.forEach(benefitCard => {
                    if (benefitCard.parentElement.classList.contains('fd-c')) benefitCard.parentElement.classList.remove('fd-c'); benefitCard.parentElement.classList.add('fd-r');
                    if (!benefitCard.classList.contains('borderForCard')) benefitCard.classList.add('borderForCard');

                    !benefitCard.classList.contains('bordt') && benefitCard.classList.add('bordt', 'solidBord');
                }); allBenefitCardsArray.slice(-4).forEach(threeLastBenefitCard => {
                    !threeLastBenefitCard.classList.contains('bordb') && threeLastBenefitCard.classList.add('bordb');
                }); allBenefitCardsArray.forEach((benefitCard, cardIndex) => {
                    if (cardIndex % 4 === 0 && !benefitCard.classList.contains('bordl')) benefitCard.classList.add('bordl');
                    if (cardIndex % 4 === 3 && !benefitCard.classList.contains('bordl')) benefitCard.classList.add('bordr');
                });
            } else if (window.innerWidth <= 768) {
                allBenefitCards.forEach(benefitCard => {
                    if (benefitCard.parentElement.classList.contains('fd-r')) benefitCard.parentElement.classList.remove('fd-r'); benefitCard.parentElement.classList.add('fd-c');
                    if (benefitCard.classList.contains('borderForCard')) benefitCard.classList.remove('borderForCard');
                });

                allEmptyAndBenefitCards.forEach(eabCard => {
                    eabCard.classList.remove('bordt', 'bordb', 'bordr', 'bordl');
                });
            }
        }
    } layoutBuilder(); window.addEventListener('resize', layoutBuilder);
});