window.addEventListener('load', () => {
    const windowHeight = window.innerHeight;
    const allFeaturesContainer = document.getElementById('allFeatures');

    // ==============================================
    // ==================== GRID ANIMATION AND LAYOUT
    // ==============================================
    allFeaturesContainer?.addEventListener('mouseover', (e) => {
        const target = e.target.closest('.mainAxis, .crossAxis');
        if (!target) return;

        if (target.classList.contains('mainAxis')) {
            allFeaturesContainer.querySelectorAll('.spacePlace.mainAxis').forEach(el => {
                el.querySelectorAll('span').forEach(elChild => {
                    elChild.style.opacity = '0.9';
                });
                el.querySelectorAll('svg').forEach(svg => {
                    svg.style.opacity = '0.611';
                });
            });
            allFeaturesContainer.querySelectorAll('.spacePlace.bordr').forEach(el => el.style.borderRightColor = 'var(--grey-4)');
            allFeaturesContainer.querySelectorAll('.spacePlace.bordl').forEach(el => el.style.borderLeftColor = 'var(--grey-4)');
        } else if (target.classList.contains('crossAxis')) {
            allFeaturesContainer.querySelectorAll('.spacePlace.crossAxis').forEach(el => {
                el.querySelectorAll('span').forEach(elChild => {
                    elChild.style.opacity = '0.9';
                });
                el.querySelectorAll('svg').forEach(svg => {
                    svg.style.opacity = '0.611';
                });
            });
            allFeaturesContainer.querySelectorAll('.spacePlace.bordb').forEach(el => el.style.borderBottomColor = 'var(--grey-4)');
            allFeaturesContainer.querySelectorAll('.spacePlace.bordt').forEach(el => el.style.borderTopColor = 'var(--grey-4)');
        }
    }); allFeaturesContainer?.addEventListener('mouseout', (e) => {
        const target = e.target.closest('.mainAxis, .crossAxis');
        if (!target) return;

        if (target.classList.contains('mainAxis')) {
            allFeaturesContainer.querySelectorAll('.spacePlace.mainAxis').forEach(el => {
                el.querySelectorAll('span').forEach(elChild => {
                    elChild.style.opacity = '0.5';
                });
                el.querySelectorAll('svg').forEach(svg => {
                    svg.style.opacity = '0.25';
                });
            });
            allFeaturesContainer.querySelectorAll('.spacePlace.bordr').forEach(el => el.style.borderRightColor = '');
            allFeaturesContainer.querySelectorAll('.spacePlace.bordl').forEach(el => el.style.borderLeftColor = '');
        } else if (target.classList.contains('crossAxis')) {
            allFeaturesContainer.querySelectorAll('.spacePlace.crossAxis').forEach(el => {
                el.querySelectorAll('span').forEach(elChild => {
                    elChild.style.opacity = '0.5';
                });
                el.querySelectorAll('svg').forEach(svg => {
                    svg.style.opacity = '0.25';
                });
            });
            allFeaturesContainer.querySelectorAll('.spacePlace.bordb').forEach(el => el.style.borderBottomColor = '');
            allFeaturesContainer.querySelectorAll('.spacePlace.bordt').forEach(el => el.style.borderTopColor = '');
        }
    });

    const gapRows = [
        { selector: '.firstGap', minHeight: '31.5vh' }
    ];let ticking = false; let isMinReached = false;
    window.addEventListener('scroll', () => {
        if (!ticking && !isMinReached) {
            requestAnimationFrame(() => {
                gapRows.forEach(row => {
                    const gaps = document.querySelectorAll(row.selector);
                    if (gaps.length === 0) return;
                    const firstGap = gaps[0];
                    const rect = firstGap.getBoundingClientRect();
                    const startPoint = windowHeight / 2;
                    const endPoint = 100;
                    
                    let progress = (startPoint - rect.top) / (startPoint - endPoint);
                    progress = Math.max(0, Math.min(progress, 1));
                    
                    const minValue = 0;
                    const maxValue = 31.5;
                    let newMinHeight = maxValue - (progress * (maxValue - minValue));
                    
                    if (newMinHeight <= minValue) {
                        newMinHeight = minValue;
                        isMinReached = true;
                    }
                    
                    gaps.forEach(gap => {
                        gap.style.minHeight = newMinHeight + 'vh';
                        if (newMinHeight <= 1) {
                            gap.style.borderTopColor = 'transparent';
                            setTimeout(() => {
                                gap.classList.remove('bordt');
                            }, 315);
                        } else {
                            gap.style.borderTopColor = '';
                            setTimeout(() => {
                                gap.classList.add('bordt');
                            }, 315);
                        }
                    });
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // PARALLAX NODEPS BENEFIT
    window.addEventListener('scroll', () => document.querySelector('#noDeps .c-tc').style.transform = document.querySelector('#noDeps').getBoundingClientRect().top < windowHeight && document.querySelector('#noDeps').getBoundingClientRect().bottom > 0 ? `translate(${window.pageYOffset * -0.0611}px, ${window.pageYOffset * 0.00611}px)` : 'none');

    // TERMINAL TYPE TEXTWRITER NO RUNTIME
    const noRuntimeAnimPlace = document.getElementById('noRuntimeAnimation');
    const noRuntimeAnimationCodeFieldLayout = document.getElementById('noRuntimeAnimationCodeFieldLayout');
    const noRuntimeAnimationCodeField = document.getElementById('noRuntimeAnimationCodeField');
    const noRuntimeAnimationOriginalText = noRuntimeAnimationCodeField.textContent;
    const noRuntimeAnimationCursor = document.createElement('span');
    let noRuntimeAnimationIsDeleting = true;
    let noRuntimeAnimationPosition = noRuntimeAnimationOriginalText.length;
    let noRuntimeAnimationHasTriggered = false;

    noRuntimeAnimationCodeField.style.cssText = `
        font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
        display: inline-block;
    `;
    noRuntimeAnimationCursor.textContent = '▋';
    noRuntimeAnimationCursor.style.cssText = `
        margin-left: var(--xxs);
        width: var(--s);
        animation: blink 1s step-end infinite;
    `;
    noRuntimeAnimationCodeField.appendChild(noRuntimeAnimationCursor);

    function noRuntimeAnimationTypeEffect() {
        const rect = noRuntimeAnimationCodeField.getBoundingClientRect();
        const windowCenter = windowHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const isAtCenter = Math.abs(elementCenter - windowCenter) < 50;
        
        if (isAtCenter && !noRuntimeAnimationHasTriggered) {
            noRuntimeAnimationHasTriggered = true;
            
            const interval = setInterval(() => {
                if (noRuntimeAnimationIsDeleting) {
                    noRuntimeAnimationPosition--;
                    noRuntimeAnimationCodeField.textContent = noRuntimeAnimationOriginalText.substring(0, noRuntimeAnimationPosition);
                    noRuntimeAnimationCodeField.appendChild(noRuntimeAnimationCursor);
                    
                    if (noRuntimeAnimationPosition === 0) {
                        clearInterval(interval);
                        
                        noRuntimeAnimationCodeFieldLayout.style.transition = 'opacity 0.315s ease, transform 0.315s ease';
                        noRuntimeAnimationCodeFieldLayout.style.opacity = '0';
                        noRuntimeAnimationCodeFieldLayout.style.transform = 'translateY(calc(var(--m) * -1))';
                        
                        setTimeout(() => {
                            noRuntimeAnimationCodeFieldLayout.remove();
                            
                            const noRuntimeAnimNewCont = document.createElement('span');
                            noRuntimeAnimNewCont.innerHTML = /Mac/i.test(navigator.userAgent) ? '⌘ Cmd + C → ⌘ Cmd + V' : /iPhone|iPad|Android/i.test(navigator.userAgent) ? 'Copy & Paste' : 'Ctrl + C → Ctrl + V';
                            noRuntimeAnimNewCont.style.cssText = `
                                opacity: 0; transform: translateY(var(--m));
                                transition: opacity 0.315s ease, transform 0.315s ease;
                            `; noRuntimeAnimPlace.appendChild(noRuntimeAnimNewCont);
                            
                            setTimeout(() => {
                                noRuntimeAnimNewCont.style.opacity = '1';
                                noRuntimeAnimNewCont.style.transform = 'translateY(0)';
                            }, 50);
                        }, 350);
                    }
                }
            }, 100);
        }
    }

    window.addEventListener('scroll', noRuntimeAnimationTypeEffect);
    noRuntimeAnimationTypeEffect();

    // NO UPDATES ANIMATION
    const noUpdatesContainerParent = document.getElementById('noUpdatesAnimPlace');
    const noUpdatesContainer = document.getElementById('downloadingsOrganizerAnim');
    const noUpdatesList = [
        'Framework 16.3',
        'Update and rewrite',
        'Framework 2026 update',
        'New update (800KB)',
        'Framework v2.2.5',
        'Critical security patch',
        'Runtime optimization',
        'Dependency injection fix',
        'Framework radical update',
        'Memory leak resolved'
    ]; noUpdatesContainer.innerHTML = ''; const noUpdatesItems = [];
    const noUpdatesAnimationConfigs = noUpdatesList.map((noUpdatesText, noUpdatesIndex) => ({
        text: noUpdatesText,
        duration: 1.5 + (noUpdatesIndex * 0.3),
        strokeOffset: 30 + (noUpdatesIndex * 25)
    }));

    noUpdatesAnimationConfigs.forEach(({ text: noUpdatesText, duration: noUpdatesAnimationDuration, strokeOffset: noUpdatesStrokeOffset }) => {
        const noUpdatesItemDiv = document.createElement('div');
        noUpdatesItemDiv.className = 'flex ai-c p-m fd-r jc-fs gap-m';
        
        noUpdatesItemDiv.innerHTML = `
            <svg class="noUpdatesLoadingSVG" height="1rem" width="1rem" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="z-index: 3; opacity: 0.9">
                <circle cx="32" cy="32" r="28" fill="var(--theme-color)" stroke="var(--theme-color)" stroke-width="2"/>
                <line x1="20" y1="20" x2="44" y2="44" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <line x1="44" y1="20" x2="20" y2="44" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <circle cx="32" cy="32" r="28" stroke="white" stroke-width="2" stroke-dasharray="175" stroke-dashoffset="${noUpdatesStrokeOffset}" fill="none">
                    <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="${noUpdatesAnimationDuration}s" repeatCount="indefinite"/>
                </circle>
            </svg>
            <span class="noUpdatesItemText">${noUpdatesText}</span>
        `;
        
        noUpdatesContainer.appendChild(noUpdatesItemDiv);
        noUpdatesItems.push(noUpdatesItemDiv);
    });

    let noUpdAnimInterval = null;
    function noUpdAnimEndListener() {
        if (Array.from(noUpdatesContainer.children).every(child => getComputedStyle(child).maxHeight === '0px')) {
            noUpdatesContainerParent.style.borderColor = 'transparent';
            noUpdatesContainerParent.style.maxHeight = '0'; noUpdatesContainer.style.opacity = '0'; noUpdatesContainerParent.style.pointerEvents = 'none'; 

            function startEasterEgg() {
                setTimeout(() => {
                    noUpdatesContainer.innerHTML = `
                        <div class="w-100 fd-r ta-c" style="opacity: 0.8;"><span style="font-weight: 700; font-family: 'Times\ New\ Roman', Georgia, serif;" class="w-100">The Limes</span></div>
                        <div class="w-100 fd-r p-s" style="padding-top: 0; border: none; opacity: 0.8;">
                            <div class="w-100 fd-c gap-m" style="border: none;">
                                <span class="w-100 iflex jc-sb">
                                    <span style="font-weight: 600; font-family: 'Times\ New\ Roman', Georgia, serif;">
                                        Bigtechs on brink of second bailout for frameworks
                                    </span>
                                    <small class="ws-nw" style="font-size: 0.5em; font-family: 'Times\ New\ Roman', Georgia, serif;">03/Jan/2029</small>
                                </span>
                                <span class="w-100 iflex jc-sb">
                                    <span style="font-family: 'Times\ New\ Roman', Georgia, serif;">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                                    </span>
                                </span>
                            </div>
                        </div>
                    `; setTimeout(() => {
                        noUpdatesContainer.style.opacity = '1';
                    }, 315);
                }, 315);

                noUpdatesContainerParent.style.borderColor = 'var(--grey-2)';
                noUpdatesContainerParent.style.maxHeight = '25vh';
            } setTimeout(startEasterEgg, 611);
            if (noUpdAnimInterval) clearInterval(noUpdAnimInterval);
            return true;
        }
        return false;
    }

    noUpdatesItems.forEach(nucLine => {
        const svgNucLine = nucLine.querySelector('svg');
        svgNucLine.style.pointerEvents = 'auto'; svgNucLine.style.cursor = 'pointer';
        svgNucLine.addEventListener('click', () => {
            nucLine.style.opacity = '0'; nucLine.style.fontSize = '0';
            nucLine.style.maxHeight = '0'; nucLine.style.padding = '0';
            
            if (!noUpdAnimInterval) {
                noUpdAnimInterval = setInterval(() => {
                    noUpdAnimEndListener();
                }, 1000);
            }
        });
    });

    // EASY SYNTAX
    const easySyntaxAnimPlace = document.getElementById('easySyntaxAnimation');
    const easySyntaxAnimTags = ['Container', 'Button', 'Link', 'Query', 'Function', 'Class', 'Text', 'Elefos Lang', 'Go to Documentation'];
    let easySyntaxAnimIndex = 0; let easySyntaxAnimPlaying = false;
    let easySyntaxAnimInterval = null; let easySyntaxAnimRestartBtn = null;

    function easySyntaxAnimBuild() {
        easySyntaxAnimPlace.innerHTML = '';
        easySyntaxAnimTags.forEach((tagWord, tagIdx) => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'w-100 p-a p-l ta-c';
            tagSpan.textContent = tagWord;
            if (tagWord === 'Go to Documentation') {
                tagSpan.style.cursor = 'pointer';
                tagSpan.style.textDecoration = 'underline';
                tagSpan.style.opacity = '0';
                tagSpan.style.right = '-100%';
                
                tagSpan.addEventListener('click', () => {
                    // TODO: CHANGE REDIRECT LINK ADDRESS
                    window.open('/docs', '_blank');
                });
            } else if (tagIdx === 0) {
                tagSpan.style.opacity = '1';
                tagSpan.style.right = '0';
            } else {
                tagSpan.style.opacity = '0';
                tagSpan.style.right = '-100%';
            }
            easySyntaxAnimPlace.appendChild(tagSpan);
        });
    }

    function easySyntaxAnimNext() {
        const tagSpans = easySyntaxAnimPlace.querySelectorAll('span');
        if (easySyntaxAnimIndex >= tagSpans.length - 1) return;
        
        const currentSpan = tagSpans[easySyntaxAnimIndex];
        const nextSpan = tagSpans[easySyntaxAnimIndex + 1];
        
        currentSpan.style.transition = 'opacity 0.315s ease, right 0.315s ease';
        nextSpan.style.transition = 'opacity 0.315s ease, right 0.315s ease';
        currentSpan.style.opacity = '0';
        currentSpan.style.right = '100%';
        nextSpan.style.opacity = '1';
        nextSpan.style.right = '0';
        
        easySyntaxAnimIndex++;
    }

    function easySyntaxAnimStartLoop() {
        if (easySyntaxAnimInterval) clearInterval(easySyntaxAnimInterval);
        
        easySyntaxAnimInterval = setInterval(() => {
            if (easySyntaxAnimIndex >= easySyntaxAnimTags.length - 2) {
                clearInterval(easySyntaxAnimInterval);
                easySyntaxAnimShowRestartBtn();
                return;
            }
            easySyntaxAnimNext();
        }, 611);
    }

    function easySyntaxAnimShowRestartBtn() {
        if (easySyntaxAnimRestartBtn) return;
        easySyntaxAnimRestartBtn = document.createElement('div');
        easySyntaxAnimRestartBtn.className = 'easySyntaxRestartBtn';
        easySyntaxAnimRestartBtn.style.cssText = 'position: absolute; bottom: 1rem; right: 1rem; cursor: pointer; z-index: 100; opacity: 0; transition: opacity 0.315s ease;';
        easySyntaxAnimRestartBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.364 3.05762C18.7782 3.05762 19.114 3.3934 19.114 3.80762V8.05026C19.114 8.46447 18.7782 8.80026 18.364 8.80026H14.1213C13.7071 8.80026 13.3713 8.46447 13.3713 8.05026C13.3713 7.63604 13.7071 7.30026 14.1213 7.30026H16.4817C13.6363 5.05718 9.4987 5.24825 6.87348 7.87348C4.04217 10.7048 4.04217 15.2952 6.87348 18.1265C9.70478 20.9578 14.2952 20.9578 17.1265 18.1265C19.0234 16.2297 19.6504 13.5428 19.0039 11.1219C18.897 10.7217 19.1348 10.3106 19.535 10.2038C19.9352 10.0969 20.3462 10.3347 20.4531 10.7349C21.2321 13.6518 20.478 16.8964 18.1872 19.1872C14.7701 22.6043 9.2299 22.6043 5.81282 19.1872C2.39573 15.7701 2.39573 10.2299 5.81282 6.81282C9.04483 3.5808 14.1762 3.40576 17.614 6.28768V3.80762C17.614 3.3934 17.9497 3.05762 18.364 3.05762Z" fill="var(--text-color)"/></svg>`;
        easySyntaxAnimRestartBtn.addEventListener('mouseenter', () => easySyntaxAnimRestartBtn.style.opacity = '0.8');
        easySyntaxAnimRestartBtn.addEventListener('mouseleave', () => easySyntaxAnimRestartBtn.style.opacity = '0.5');
        easySyntaxAnimRestartBtn.addEventListener('click', () => {
            if (easySyntaxAnimInterval) clearInterval(easySyntaxAnimInterval);
            easySyntaxAnimIndex = 0;
            easySyntaxAnimBuild();
            easySyntaxAnimStartLoop();
            if (easySyntaxAnimRestartBtn) {
                easySyntaxAnimRestartBtn.remove();
                easySyntaxAnimRestartBtn = null;
            }
        });
        easySyntaxAnimPlace.appendChild(easySyntaxAnimRestartBtn);
        
        setTimeout(() => {
            easySyntaxAnimRestartBtn.style.opacity = '0.5';
        }, 50);
    }

    easySyntaxAnimPlace.addEventListener('mouseenter', () => {
        const tagSpans = easySyntaxAnimPlace.querySelectorAll('span');
        if (easySyntaxAnimIndex === easySyntaxAnimTags.length - 2) {
            if (easySyntaxAnimInterval) clearInterval(easySyntaxAnimInterval);
            const currentSpan = tagSpans[easySyntaxAnimIndex];
            const nextSpan = tagSpans[easySyntaxAnimIndex + 1];
            currentSpan.style.transition = 'opacity 0.315s ease, right 0.315s ease';
            nextSpan.style.transition = 'opacity 0.315s ease, right 0.315s ease';
            currentSpan.style.opacity = '0';
            currentSpan.style.right = '100%';
            nextSpan.style.opacity = '1';
            nextSpan.style.right = '0';
            easySyntaxAnimIndex++;
        }
    });

    easySyntaxAnimPlace.addEventListener('mouseleave', () => {
        const tagSpans = easySyntaxAnimPlace.querySelectorAll('span');
        if (easySyntaxAnimIndex === easySyntaxAnimTags.length - 1) {
            const currentSpan = tagSpans[easySyntaxAnimIndex];
            const prevSpan = tagSpans[easySyntaxAnimIndex - 1];
            currentSpan.style.transition = 'opacity 0.315s ease, right 0.315s ease';
            prevSpan.style.transition = 'opacity 0.315s ease, right 0.315s ease';
            currentSpan.style.opacity = '0';
            currentSpan.style.right = '100%';
            prevSpan.style.opacity = '1';
            prevSpan.style.right = '0';
            easySyntaxAnimIndex--;
            easySyntaxAnimStartLoop();
        }
    });

    let easySyntaxAnimBuilt = false;
    window.addEventListener('scroll', () => {
        const animRect = easySyntaxAnimPlace.getBoundingClientRect();
        
        if (!easySyntaxAnimBuilt && animRect.top < window.innerHeight * 0.99) {
            easySyntaxAnimBuild();
            easySyntaxAnimBuilt = true;
        }
        
        if (easySyntaxAnimBuilt && !easySyntaxAnimPlaying && animRect.top < window.innerHeight / 3) {
            easySyntaxAnimPlaying = true;
            easySyntaxAnimStartLoop();
        }
    });
    



    // ==============================================
    // ======================= TAGS LANDING ANIMATION
    // ==============================================
    const approximationAnimationActionPlace = document.getElementById('approximationEffect');

    let approximationAnimationState = false;
    let tagCreationInterval = null;

    if (approximationAnimationActionPlace) {
        window.addEventListener('scroll', () => {
            const actionPlaceRect = approximationAnimationActionPlace.getBoundingClientRect();
            const triggerPoint = windowHeight / 2;
            
            if (approximationAnimationState === false) {
                if (actionPlaceRect.top <= triggerPoint && actionPlaceRect.bottom >= triggerPoint) {
                    startContinuousTagCreation();
                }
            } else if (approximationAnimationState === true) {
                if (actionPlaceRect.top > triggerPoint || actionPlaceRect.bottom < triggerPoint) {
                    stopContinuousTagCreation();
                }
            }
        });
    }

    function startContinuousTagCreation() {
        if (tagCreationInterval) return;
        approximationAnimationState = true;
        
        let tags = [
            '<html>', '<body>', '<main>', '<head>', 'fetch', 'async', 'await',
            '<footer>', '<meta>', '<link>', '<a>', '<section>', '<div>',
            '<button>', 'onclick=', 'addEventListener', '<img>', '<svg>',
            '<nav>', '<picture>', 'getElementById', 'querySelector', 'forEach()',
            '<script>', '<style>', '<article>', '<span>', '<p>', '<small>'
        ];
        
        function createOneTag() {
            const tagText = tags[Math.floor(Math.random() * tags.length)];
            const tag = document.createElement('span');
            tag.textContent = tagText;
            tag.className = 'floating-tag';
            
            const x = (Math.random() - 0.5) * 800;
            const y = (Math.random() - 0.5) * 80;
            
            tag.style.cssText = `
                pointer-events: none;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translate(0, 0) scale(0);
                opacity: 1;
                color: var(--text-color);
                white-space: nowrap;
                z-index: 1000;
                animation: tagAppear 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            `;
            
            tag.style.setProperty('--x', `${x}px`);
            tag.style.setProperty('--y', `${y}px`);
            approximationAnimationActionPlace.appendChild(tag);
            
            setTimeout(() => {
                if (tag && tag.remove) tag.remove();
            }, 2800);
        }
        
        tagCreationInterval = setInterval(createOneTag, 100);
    }

    function stopContinuousTagCreation() {
        if (tagCreationInterval) {
            clearInterval(tagCreationInterval);
            tagCreationInterval = null;
        }
        approximationAnimationState = false;
        const existingTags = approximationAnimationActionPlace.querySelectorAll('.floating-tag');
        existingTags.forEach(tag => tag.remove());
    }

    // ==============================================
    // ============================== WHEEL ANIMATION
    // ==============================================
    let angle = 0;
    let interval;
    const svg = document.getElementById('wheelStructure');
    const stops = [0, 60, 120, 180, 240, 300];
    let stopIndex = 0;

    function snapToStop(targetDeg) {
        let delta = targetDeg - (angle % 360);
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        
        let startAngle = angle;
        let startTime = null;
        const duration = 400;
        
        function animateSnap(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = Math.min(1, elapsed / duration);
            const ease = 1 - Math.pow(1 - t, 3);
            angle = startAngle + delta * ease;
            svg.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            
            if (t < 1) {
                requestAnimationFrame(animateSnap);
            } else {
                angle = targetDeg;
                svg.style.transform = `translateX(-50%) rotate(${angle}deg)`;
                setTimeout(() => {
                    stopIndex = (stopIndex + 1) % stops.length;
                    startSpin();
                }, 1500);
            }
        }
        
        requestAnimationFrame(animateSnap);
    } function startSpin() {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            angle = (angle + 2) % 360;
            // svg.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            
            if (Math.abs(angle % 360 - stops[stopIndex]) < 1) {
                clearInterval(interval);
                interval = null;
                snapToStop(stops[stopIndex]);
            }
        }, 30);
    } startSpin(); console.log('TOFIX: 539 line');

    // ==============================================
    // ====================== SPEED BENEFIT ANIMATION
    // ==============================================
    const speedBenefit = document.getElementById('speedBenefit');
    const speedBenefitAnimationPlace = document.getElementById('speedBenefitActionPlace');
    const h2Defaultly = speedBenefit.querySelector('h2 #sBh2Defaultly');
    const h2Ours = speedBenefit.querySelector('h2 #sBh2Ours');
    let speedBenefitAnimationActive = false;
    function defaultFilling() {
        speedBenefitAnimationPlace.innerHTML = `
            <span class="pe-n pr-xl iflex ai-c ta-c o-h text"
            id="spanSpeedBenefitDownload"></span>
            <span class="pe-n f1 iflex jc-sb ai-c o-h arrow">
                <span class="f1 br-m arrowStart"></span>
                <span class="br-m arrowEnd">></span>
            </span>
            <span class="pe-n pr-xl iflex ai-c o-h text"
            id="spanSpeedBenefitSetup"></span>
            <span class="pe-n f1 iflex jc-sb ai-c o-h arrow">
                <span class="f1 br-m arrowStart"></span>
                <span class="br-m arrowEnd">></span>
            </span>
            <span class="pe-n pr-xl iflex ai-c o-h text"
            id="spanSpeedBenefitCode"></span>
            <span class="pe-n f1 iflex jc-sb ai-c o-h arrow">
                <span class="f1 br-m arrowStart"></span>
                <span class="br-m arrowEnd">></span>
            </span>
            <span class="pe-n pr-xl iflex ai-c o-h text"
            id="spanSpeedBenefitBuildup"></span>
            <span class="pe-n f1 iflex jc-sb ai-c o-h arrow">
                <span class="f1 br-m arrowStart">
                </span><span class="br-m arrowEnd">></span>
            </span>
            <span class="pe-n pr-xl iflex ai-c o-h text"
            id="spanSpeedBenefitSee"></span>
        `;
    } function sbapDefaultly() {
        if (speedBenefitAnimationActive) return; defaultFilling(); let sbapDelay = 0; 
        h2Defaultly.style.opacity = '1'; h2Ours.style.opacity = '0.5';
        speedBenefitAnimationPlace.querySelectorAll('span.text, span.arrow').forEach(sbapEl => {
            sbapEl.style.animation = `rightSlide 0.611s ${sbapDelay}s ease forwards`; sbapDelay += 0.315;
        }); speedBenefitAnimationActive = true; setTimeout(() => { speedBenefitAnimationActive = false; }, 2000);
    }

    function oursFilling() {
        speedBenefitAnimationPlace.innerHTML = `
            <span class="pr-xl pe-n iflex ai-c ta-c"
            id="spanSpeedBenefitOursCode"></span>
            <span class="pe-n f1 iflex jc-sb ai-c arrow">
                <span class="f1 br-m arrowStart"></span>
                <span class="br-m arrowEnd">></span>
            </span>
            <span class="pr-l pe-n iflex ai-c"
            id="spanSpeedBenefitOursSee"></span>
        `;
    } function sbapOurs() {
        if (speedBenefitAnimationActive) return; oursFilling(); let sbapDelay = 0;
        h2Defaultly.style.opacity = '0.5'; h2Ours.style.opacity = '1';
        speedBenefitAnimationPlace.querySelectorAll('span.text, span.arrow').forEach(sbapEl => {
            if (sbapEl.classList.contains('arrow')) {
                sbapEl.querySelectorAll('span').forEach(spanSwitchColor => {
                    if (spanSwitchColor.classList.contains('arrowStart')) {
                        spanSwitchColor.style.background = 'var(--theme-color)';
                    } else if (spanSwitchColor.classList.contains('arrowEnd')) {
                        spanSwitchColor.style.color = 'var(--theme-color)';
                    }});
                sbapEl.style.transformOrigin = 'left';
                sbapEl.style.transform = 'scaleX(0.1)';
                sbapEl.style.animation = `toRightSlide 0.611s ${sbapDelay}s ease forwards`; sbapDelay += 1;
            } else if (sbapEl.classList.contains('text')) {
                sbapEl.style.animation = `rightSlide 0.5s ${sbapDelay}s ease forwards`; sbapDelay += 1;
            } speedBenefitAnimationActive = true; setTimeout(() => { speedBenefitAnimationActive = false; }, 2000);
        });
    }
    
    speedBenefit.querySelector('h2 span#sBh2Defaultly').addEventListener('click', sbapDefaultly);
    speedBenefit.querySelector('h2 span#sBh2Ours').addEventListener('click', sbapOurs);
    window.addEventListener('scroll', () => {
        const actionPlaceRect = speedBenefitAnimationPlace.getBoundingClientRect();
        if (speedBenefitAnimationActive === false) {
            if (actionPlaceRect.top <= windowHeight) {
                sbapDefaultly();
                setTimeout(() => {
                    sbapOurs();
                }, 4500);
            }
        } else { return; }
    });

    // ==============================================
    // =============== PRIVACY SEC TRACKING ANIMATION
    // ==============================================
    const sPrivacyParent = document.getElementById('privacy');
    const sPrivacy = document.getElementById('privacyCont');

    function getNaturalHeight() {
        sPrivacy.style.maxHeight = 'none';
        let startHeight = sPrivacy.scrollHeight * 1.33;
        sPrivacy.style.maxHeight = startHeight + 'px';
        return startHeight;
    } let startHeight = getNaturalHeight();

    function privacySectionHeightOperator() {
        const rect = sPrivacy.getBoundingClientRect();
        const windowHeight = window.innerHeight / 2;
        const styles = getComputedStyle(document.documentElement);
        const offset = parseFloat(styles.getPropertyValue('--xxl'));
        let progress = (windowHeight - rect.top + offset) / windowHeight;
        progress = Math.min(Math.max(progress, 0), 1);
        const acceleratedProgress = Math.pow(progress, 1.5);
        const newMaxHeight = startHeight * (1 - acceleratedProgress);
        
        sPrivacy.style.transition = 'max-height 0.05s linear';
        sPrivacy.style.maxHeight = newMaxHeight + 'px';
        sPrivacy.style.overflow = 'hidden';

        if (progress >= 0.99) { sPrivacyParent.style.padding = '0'; } else { sPrivacyParent.style.padding = ''; }
    } document.addEventListener('scroll', privacySectionHeightOperator);

    // ==============================================
    // ======================================= FOOTER
    // ==============================================
    const hoverablesInFooter = document.querySelectorAll('footer .hoverable');
    hoverablesInFooter.forEach(hoverableInFooter => {
        hoverableInFooter.onmouseenter = () => {
            hoverablesInFooter.forEach(otherHoverable => {
                otherHoverable.style.opacity = otherHoverable === hoverableInFooter ? '' : '0.315';
            });
        }; hoverableInFooter.onmouseleave = () => {
            hoverablesInFooter.forEach(otherHoverable => {
                otherHoverable.style.opacity = '';
            });
        };
    });
});