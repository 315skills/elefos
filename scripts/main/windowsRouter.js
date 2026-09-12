document.addEventListener('DOMContentLoaded', () => {
    const originalPlace = document.getElementById('main');
    originalPlace.innerHTML = `
        <div class="br-m o-h h-100 w-100 flex" id="mainWindow">
            <div id="codeEditingPart" class="o-a"></div>
            <div id="codeResult" class="o-a fd-c"></div>
            <div id="resultPart" class="flex fd-c o-a f1">
                <iframe class="h-100" id="resultFrame"></iframe>
            </div>
        </div>
    `;

    let editor = null;
    let webEditor = null;
    let kotlinEditor = null;
    let swiftEditor = null;
    let resultFrame = null;
    let isRequestPending = false;
    let debounceTimer = null;
    let previousCode = '';
    let inspectMode = false;
    let inspectOverlay = null;
    let inspectTooltip = null;

    let themeChangeListener = null;

    function createInspector() {
        inspectOverlay = document.createElement('div');
        inspectOverlay.style.cssText = 'position:fixed;pointer-events:none;z-index:999999;display:none';
        
        inspectTooltip = document.createElement('div');
        inspectTooltip.style.cssText = 'position:fixed;background:#000;color:#fff;padding:4px 8px;font-size:11px;font-family:monospace;z-index:1000000;pointer-events:none;display:none;border-radius:3px';
        
        document.body.appendChild(inspectOverlay);
        document.body.appendChild(inspectTooltip);
    }

    function enableInspectMode() {
        inspectMode = true;
        document.body.style.cursor = 'crosshair';
    }

    function disableInspectMode() {
        inspectMode = false;
        document.body.style.cursor = '';
        if (inspectOverlay) inspectOverlay.style.display = 'none';
        if (inspectTooltip) inspectTooltip.style.display = 'none';
    }

    function toggleInspectMode() {
        if (inspectMode) {
            disableInspectMode();
        } else {
            enableInspectMode();
        }
    }

    function checkBalancedBraces(code) {
        let balance = 0;
        for (let char of code) {
            if (char === '{') balance++;
            if (char === '}') balance--;
            if (balance < 0) return false;
        }
        return balance === 0;
    }

    function checkQuotes(code) {
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let inBacktick = false;
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const prevChar = i > 0 ? code[i - 1] : '';
            
            if (prevChar !== '\\') {
                if (char === "'" && !inDoubleQuote && !inBacktick) inSingleQuote = !inSingleQuote;
                else if (char === '"' && !inSingleQuote && !inBacktick) inDoubleQuote = !inDoubleQuote;
                else if (char === '`' && !inSingleQuote && !inDoubleQuote) inBacktick = !inBacktick;
            }
        }
        
        return !inSingleQuote && !inDoubleQuote && !inBacktick;
    }

    function checkAssignmentQuotes(code) {
        const lines = code.split('\n');
        
        for (let line of lines) {
            const equalsIndex = line.indexOf('=');
            if (equalsIndex === -1) continue;
            
            const afterEquals = line.substring(equalsIndex + 1).trim();
            if (afterEquals.length === 0) continue;
            
            const firstChar = afterEquals[0];
            if (firstChar === "'" || firstChar === '"' || firstChar === '`') {
                let closingFound = false;
                let escaped = false;
                
                for (let i = 1; i < afterEquals.length; i++) {
                    if (escaped) {
                        escaped = false;
                        continue;
                    }
                    if (afterEquals[i] === '\\') {
                        escaped = true;
                        continue;
                    }
                    if (afterEquals[i] === firstChar) {
                        closingFound = true;
                        break;
                    }
                }
                
                if (!closingFound) return false;
            }
        }
        
        return true;
    }

    function shouldSend(code) {
        if (!checkBalancedBraces(code)) return false;
        if (!checkQuotes(code)) return false;
        if (!checkAssignmentQuotes(code)) return false;
        return true;
    }

    function stripDebugAttributes(html) {
        return html.replace(/\s+data-dsl-line="[^"]*"/g, '')
                   .replace(/\s+data-dsl-col="[^"]*"/g, '')
                   .replace(/\s+data-dsl-tag="[^"]*"/g, '');
    }

    function updateEditorTheme() {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = isDark ? 'vs-dark' : 'vs-light';
        monaco.editor.setTheme(theme);
    }

    function rebuildCodeEditors(webCode, androidCode, swiftCode) {
        const codeResult = document.getElementById('codeResult');
        codeResult.innerHTML = '';
        
        let editors = [];
        let editorCount = 0;
        
        const cleanWebCode = stripDebugAttributes(webCode);
        
        if (cleanWebCode && cleanWebCode.trim() !== '') editorCount++;
        if (androidCode && androidCode.trim() !== '') editorCount++;
        if (swiftCode && swiftCode.trim() !== '') editorCount++;
        
        if (editorCount === 0) return;
        
        const heightPercent = 100 / editorCount;
        
        if (cleanWebCode && cleanWebCode.trim() !== '') {
            const webContainer = document.createElement('div');
            webContainer.style.height = `${heightPercent}%`;
            webContainer.style.borderBottom = '1px solid #ccc';
            webContainer.style.resize = 'vertical';
            webContainer.style.overflow = 'hidden';
            webContainer.id = 'webEditor';
            codeResult.appendChild(webContainer);
            editors.push({ id: 'webEditor', code: cleanWebCode, language: 'html' });
        }
        
        if (androidCode && androidCode.trim() !== '') {
            const androidContainer = document.createElement('div');
            androidContainer.style.height = `${heightPercent}%`;
            if (editors.length > 0) androidContainer.style.borderBottom = '1px solid #ccc';
            androidContainer.style.resize = 'vertical';
            androidContainer.style.overflow = 'hidden';
            androidContainer.id = 'kotlinEditor';
            codeResult.appendChild(androidContainer);
            editors.push({ id: 'kotlinEditor', code: androidCode, language: 'kotlin' });
        }
        
        if (swiftCode && swiftCode.trim() !== '') {
            const swiftContainer = document.createElement('div');
            swiftContainer.style.height = `${heightPercent}%`;
            if (editors.length > 0) swiftContainer.style.borderBottom = '1px solid #ccc';
            swiftContainer.style.resize = 'vertical';
            swiftContainer.style.overflow = 'hidden';
            swiftContainer.id = 'swiftEditor';
            codeResult.appendChild(swiftContainer);
            editors.push({ id: 'swiftEditor', code: swiftCode, language: 'swift' });
        }
        
        const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const editorTheme = isDarkTheme ? 'vs-dark' : 'vs-light';

        editors.forEach(ed => {
            let editorInstance = null;
            if (ed.id === 'webEditor') editorInstance = webEditor;
            else if (ed.id === 'kotlinEditor') editorInstance = kotlinEditor;
            else if (ed.id === 'swiftEditor') editorInstance = swiftEditor;
            
            if (editorInstance) editorInstance.dispose();
            
            const newEditor = monaco.editor.create(document.getElementById(ed.id), {
                value: ed.code,
                language: ed.language,
                theme: editorTheme,
                readOnly: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 11,
                automaticLayout: true
            });
            
            if (ed.id === 'webEditor') webEditor = newEditor;
            else if (ed.id === 'kotlinEditor') kotlinEditor = newEditor;
            else if (ed.id === 'swiftEditor') swiftEditor = newEditor;
        });
    }

    async function sendCode() {
        if (isRequestPending) return;
        if (!editor) return;
        
        const code = editor.getValue();
        if (code === previousCode) return;
        if (!shouldSend(code)) return;
        
        isRequestPending = true;
        previousCode = code;
        
        try {
            const response = await fetch('http://localhost:315/fetch', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: code
            });
            
            if (response.ok) {
                const result = await response.text();
                const parts = result.split('\n[DIVIDER_5e7f8a3b]\n');
                const webCode = parts[0] || '';
                const androidCode = parts[1] || '';
                const swiftCode = parts[2] || '';
                
                rebuildCodeEditors(webCode, androidCode, swiftCode);
                
                let htmlContent = webCode || '<html><body>Error</body></html>';
                
                const htmlEndIndex = htmlContent.toLowerCase().indexOf('</html>');
                if (htmlEndIndex !== -1) {
                    htmlContent = htmlContent.substring(0, htmlEndIndex + 7);
                }
                
                const iframeDoc = resultFrame.contentDocument || resultFrame.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(htmlContent);
                iframeDoc.close();
                
                setTimeout(() => {
                    const iframeWindow = resultFrame.contentWindow;
                    const elements = iframeWindow.document.querySelectorAll('[data-dsl-line]');
                    
                    elements.forEach(el => {
                        const currentLine = el.getAttribute('data-dsl-line');
                        const currentCol = el.getAttribute('data-dsl-col');
                        
                        el.style.cursor = 'pointer';
                        
                        el.addEventListener('mouseenter', (e) => {
                            if (inspectMode && inspectOverlay && inspectTooltip) {
                                const iframeWin = resultFrame.contentWindow;
                                const computedStyle = iframeWin.getComputedStyle(el);
                                const flexDirection = computedStyle.flexDirection;
                                const justifyContent = computedStyle.justifyContent;
                                const alignItems = computedStyle.alignItems;
                                const boxSizing = computedStyle.boxSizing;
                                const rect = el.getBoundingClientRect();
                                const iframeRect = resultFrame.getBoundingClientRect();
                                
                                let paddingLeft = parseFloat(computedStyle.paddingLeft);
                                let paddingRight = parseFloat(computedStyle.paddingRight);
                                let paddingTop = parseFloat(computedStyle.paddingTop);
                                let paddingBottom = parseFloat(computedStyle.paddingBottom);
                                const gap = parseFloat(computedStyle.gap);
                                let marginLeft = parseFloat(computedStyle.marginLeft);
                                let marginRight = parseFloat(computedStyle.marginRight);
                                let marginTop = parseFloat(computedStyle.marginTop);
                                let marginBottom = parseFloat(computedStyle.marginBottom);
                                
                                const borderLeft = parseFloat(computedStyle.borderLeftWidth);
                                const borderRight = parseFloat(computedStyle.borderRightWidth);
                                const borderTop = parseFloat(computedStyle.borderTopWidth);
                                const borderBottom = parseFloat(computedStyle.borderBottomWidth);
                                
                                const innerWidth = rect.width - borderLeft - borderRight;
                                const innerHeight = rect.height - borderTop - borderBottom;
                                
                                if (boxSizing === 'border-box') {
                                    paddingLeft = Math.max(0, paddingLeft - borderLeft);
                                    paddingRight = Math.max(0, paddingRight - borderRight);
                                    paddingTop = Math.max(0, paddingTop - borderTop);
                                    paddingBottom = Math.max(0, paddingBottom - borderBottom);
                                }

                                inspectOverlay.style.display = 'block';
                                inspectOverlay.style.top = (iframeRect.top + rect.top) + 'px';
                                inspectOverlay.style.left = (iframeRect.left + rect.left) + 'px';
                                inspectOverlay.style.width = rect.width + 'px';
                                inspectOverlay.style.height = rect.height + 'px';
                                inspectOverlay.style.border = '2px solid #ff4444';
                                inspectOverlay.style.background = 'rgba(255,68,68,0.05)';
                                inspectOverlay.style.position = 'fixed';
                                inspectOverlay.style.overflow = 'visible';
                                inspectOverlay.style.boxSizing = 'border-box';

                                let linesHtml = '';

                                if (paddingLeft > 0) {
                                    const fontSize = Math.min(12, Math.max(8, paddingLeft / 3));
                                    linesHtml += `<div style="position:absolute;left:${borderLeft}px;top:${borderTop}px;width:${paddingLeft}px;height:${innerHeight - paddingTop - paddingBottom}px;background:rgba(255,136,0,0.1);border-right:1px dashed #ff8800;"></div>`;
                                    linesHtml += `<div style="position:absolute;left:${borderLeft + paddingLeft/2}px;top:50%;transform:translate(-50%,-50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(paddingLeft)}</div>`;
                                }
                                if (paddingRight > 0) {
                                    const fontSize = Math.min(12, Math.max(8, paddingRight / 3));
                                    linesHtml += `<div style="position:absolute;right:${borderRight}px;top:${borderTop}px;width:${paddingRight}px;height:${innerHeight - paddingTop - paddingBottom}px;background:rgba(255,136,0,0.1);border-left:1px dashed #ff8800;"></div>`;
                                    linesHtml += `<div style="position:absolute;right:${borderRight + paddingRight/2}px;top:50%;transform:translate(50%,-50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(paddingRight)}</div>`;
                                }
                                if (paddingTop > 0) {
                                    const fontSize = Math.min(12, Math.max(8, paddingTop / 3));
                                    linesHtml += `<div style="position:absolute;left:${borderLeft}px;top:${borderTop}px;width:${innerWidth - paddingLeft - paddingRight}px;height:${paddingTop}px;background:rgba(255,136,0,0.1);border-bottom:1px dashed #ff8800;"></div>`;
                                    linesHtml += `<div style="position:absolute;left:50%;top:${borderTop + paddingTop/2}px;transform:translate(-50%,-50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(paddingTop)}</div>`;
                                }
                                if (paddingBottom > 0) {
                                    const fontSize = Math.min(12, Math.max(8, paddingBottom / 3));
                                    linesHtml += `<div style="position:absolute;left:${borderLeft}px;bottom:${borderBottom}px;width:${innerWidth - paddingLeft - paddingRight}px;height:${paddingBottom}px;background:rgba(255,136,0,0.1);border-top:1px dashed #ff8800;"></div>`;
                                    linesHtml += `<div style="position:absolute;left:50%;bottom:${borderBottom + paddingBottom/2}px;transform:translate(-50%,50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(paddingBottom)}</div>`;
                                }

                                if (marginLeft > 0) {
                                    const fontSize = Math.min(12, Math.max(8, marginLeft / 3));
                                    linesHtml += `<div style="position:absolute;left:-${marginLeft}px;top:0px;width:${marginLeft}px;height:${rect.height}px;background:rgba(0,255,0,0.05);border-right:1px solid #00ff00;"></div>`;
                                    linesHtml += `<div style="position:absolute;left:-${marginLeft/2}px;top:50%;transform:translate(-50%,-50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(marginLeft)}</div>`;
                                }
                                if (marginRight > 0) {
                                    const fontSize = Math.min(12, Math.max(8, marginRight / 3));
                                    linesHtml += `<div style="position:absolute;right:-${marginRight}px;top:0px;width:${marginRight}px;height:${rect.height}px;background:rgba(0,255,0,0.05);border-left:1px solid #00ff00;"></div>`;
                                    linesHtml += `<div style="position:absolute;right:-${marginRight/2}px;top:50%;transform:translate(50%,-50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(marginRight)}</div>`;
                                }
                                if (marginTop > 0) {
                                    const fontSize = Math.min(12, Math.max(8, marginTop / 3));
                                    linesHtml += `<div style="position:absolute;left:0px;top:-${marginTop}px;width:${rect.width}px;height:${marginTop}px;background:rgba(0,255,0,0.05);border-bottom:1px solid #00ff00;"></div>`;
                                    linesHtml += `<div style="position:absolute;left:50%;top:-${marginTop/2}px;transform:translate(-50%,-50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(marginTop)}</div>`;
                                }
                                if (marginBottom > 0) {
                                    const fontSize = Math.min(12, Math.max(8, marginBottom / 3));
                                    linesHtml += `<div style="position:absolute;left:0px;bottom:-${marginBottom}px;width:${rect.width}px;height:${marginBottom}px;background:rgba(0,255,0,0.05);border-top:1px solid #00ff00;"></div>`;
                                    linesHtml += `<div style="position:absolute;left:50%;bottom:-${marginBottom/2}px;transform:translate(-50%,50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(marginBottom)}</div>`;
                                }

                                if (gap > 0 && flexDirection === 'row') {
                                    const children = Array.from(el.children);
                                    for (let i = 0; i < children.length - 1; i++) {
                                        const childRect = children[i].getBoundingClientRect();
                                        const nextChildRect = children[i+1].getBoundingClientRect();
                                        const gapX = childRect.right - rect.left;
                                        const gapWidth = nextChildRect.left - childRect.right;
                                        const fontSize = Math.min(12, Math.max(8, gapWidth / 3));
                                        linesHtml += `<div style="position:absolute;left:${gapX}px;top:${borderTop + paddingTop}px;width:${gapWidth}px;height:${innerHeight - paddingTop - paddingBottom}px;background:rgba(255,136,0,0.15);"></div>`;
                                        linesHtml += `<div style="position:absolute;left:${gapX + gapWidth/2}px;top:50%;transform:translate(-50%,-50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(gap)}</div>`;
                                    }
                                } else if (gap > 0 && flexDirection === 'column') {
                                    const children = Array.from(el.children);
                                    for (let i = 0; i < children.length - 1; i++) {
                                        const childRect = children[i].getBoundingClientRect();
                                        const nextChildRect = children[i+1].getBoundingClientRect();
                                        const gapY = childRect.bottom - rect.top;
                                        const gapHeight = nextChildRect.top - childRect.bottom;
                                        const fontSize = Math.min(12, Math.max(8, gapHeight / 3));
                                        linesHtml += `<div style="position:absolute;left:${borderLeft + paddingLeft}px;top:${gapY}px;width:${innerWidth - paddingLeft - paddingRight}px;height:${gapHeight}px;background:rgba(255,136,0,0.15);"></div>`;
                                        linesHtml += `<div style="position:absolute;left:50%;top:${gapY + gapHeight/2}px;transform:translate(-50%,-50%);color:#000;font-size:${fontSize}px;font-family:monospace;background:transparent;white-space:nowrap;font-weight:bold;">${Math.round(gap)}</div>`;
                                    }
                                }

                                const hasFlexDir = flexDirection === 'row' || flexDirection === 'column';
                                
                                if (hasFlexDir) {
                                    let arrowHtml = '';
                                    if (justifyContent === 'center') {
                                        arrowHtml += `<div style="position:absolute;left:50%;top:-18px;transform:translateX(-50%);color:#ff4444;font-size:16px;">⇔</div>`;
                                    } else if (justifyContent === 'flex-start') {
                                        arrowHtml += `<div style="position:absolute;left:10px;top:-18px;color:#ff4444;font-size:16px;">→</div>`;
                                    } else if (justifyContent === 'flex-end') {
                                        arrowHtml += `<div style="position:absolute;right:10px;top:-18px;color:#ff4444;font-size:16px;">←</div>`;
                                    } else if (justifyContent === 'space-between') {
                                        arrowHtml += `<div style="position:absolute;left:10px;top:-18px;color:#ff4444;font-size:16px;">←→</div>`;
                                    }

                                    if (alignItems === 'center' && flexDirection === 'row') {
                                        arrowHtml += `<div style="position:absolute;left:-18px;top:50%;transform:translateY(-50%);color:#ff4444;font-size:16px;">⇅</div>`;
                                    } else if (alignItems === 'flex-start' && flexDirection === 'row') {
                                        arrowHtml += `<div style="position:absolute;left:-18px;top:10px;color:#ff4444;font-size:16px;">↑</div>`;
                                    } else if (alignItems === 'flex-end' && flexDirection === 'row') {
                                        arrowHtml += `<div style="position:absolute;left:-18px;bottom:10px;color:#ff4444;font-size:16px;">↓</div>`;
                                    }
                                    
                                    inspectOverlay.innerHTML = linesHtml + arrowHtml;
                                } else {
                                    inspectOverlay.innerHTML = linesHtml;
                                }
                                
                                const dslTag = el.getAttribute('data-dsl-tag') || '';
                                const elId = el.id ? `#${el.id}` : '';
                                const elClasses = el.className ? `.${el.className.split(' ').join('.')}` : '';
                                const htmlTag = el.tagName.toLowerCase();
                                
                                let displayName = dslTag;
                                if (elId || elClasses) {
                                    displayName = `${dslTag}${elId}${elClasses}`;
                                }
                                if (htmlTag !== 'div' && htmlTag !== 'span') {
                                    displayName = `${displayName}<${htmlTag}>`;
                                }
                                
                                const lineNum = el.getAttribute('data-dsl-line') || '?';
                                const colNum = el.getAttribute('data-dsl-col') || '?';
                                
                                inspectTooltip.style.display = 'block';
                                inspectTooltip.style.top = (iframeRect.top + rect.top - 25) + 'px';
                                inspectTooltip.style.left = (iframeRect.left + rect.left) + 'px';
                                inspectTooltip.style.background = '#000';
                                inspectTooltip.style.color = '#fff';
                                inspectTooltip.style.padding = '4px 8px';
                                inspectTooltip.style.fontSize = '11px';
                                inspectTooltip.style.fontFamily = 'monospace';
                                inspectTooltip.style.borderRadius = '3px';
                                inspectTooltip.style.whiteSpace = 'nowrap';
                                
                                let directionText = '';
                                if (hasFlexDir) {
                                    if (flexDirection === 'row') {
                                        directionText = ' | →';
                                    } else if (flexDirection === 'column') {
                                        directionText = ' | ↓';
                                    }
                                }
                                
                                inspectTooltip.textContent = `${displayName} @ ${lineNum}:${colNum}${directionText}`;
                            }
                        });
                        
                        el.addEventListener('mouseleave', () => {
                            if (inspectOverlay) inspectOverlay.style.display = 'none';
                            if (inspectTooltip) inspectTooltip.style.display = 'none';
                        });
                        
                        el.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            if (inspectMode && currentLine && editor) {
                                const dslCode = editor.getValue();
                                const lines = dslCode.split('\n');
                                const targetLine = lines[currentLine - 1];
                                
                                let quoteChar = null;
                                let startQuote = -1;
                                let endQuote = -1;
                                
                                for (let i = 0; i < targetLine.length; i++) {
                                    const ch = targetLine[i];
                                    if (ch === '\'' || ch === '"' || ch === '`') {
                                        if (quoteChar === null) {
                                            quoteChar = ch;
                                            startQuote = i;
                                        } else if (ch === quoteChar) {
                                            endQuote = i;
                                            break;
                                        }
                                    }
                                }
                                
                                if (startQuote !== -1 && endQuote !== -1 && endQuote > startQuote + 1) {
                                    editor.setSelection({
                                        startLineNumber: parseInt(currentLine),
                                        startColumn: startQuote + 2,
                                        endLineNumber: parseInt(currentLine),
                                        endColumn: endQuote + 1
                                    });
                                    editor.focus();
                                }
                                
                                disableInspectMode();
                            }
                        });
                    });
                }, 100);
            } else {
                const iframeDoc = resultFrame.contentDocument || resultFrame.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(`<html><body style="color: red; padding: 20px;">Error: ${response.status}</body></html>`);
                iframeDoc.close();
            }
        } catch (error) {
            const iframeDoc = resultFrame.contentDocument || resultFrame.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`<html><body style="color: red; padding: 20px;">Connection error: ${error.message}</body></html>`);
            iframeDoc.close();
        } finally {
            isRequestPending = false;
        }
    }

    const debouncedSend = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            sendCode();
        }, 500);
    };

    setTimeout(() => {
        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});
        
        require(['vs/editor/editor.main'], function() {
            editor = monaco.editor.create(document.getElementById('codeEditingPart'), {
                value: `Cont {\n    tag = 'main'\n\n    Text {\n        text = 'Hello Elefos DSL!'\n    }\n}`,
                language: 'plaintext',
                theme: 'vs-light',
                automaticLayout: true
            });
            
            editor.onDidChangeModelContent(debouncedSend);
        });

        function detectWidthForME() {
            const mainWindowSizePx = originalPlace.getBoundingClientRect();
            document.querySelector('body').style.setProperty('--dslEditorWidth', (mainWindowSizePx.width - (parseFloat(getComputedStyle(originalPlace).paddingLeft) + parseFloat(getComputedStyle(originalPlace).paddingRight))) + 'px');
        } 
        detectWidthForME(); 
        window.addEventListener('resize', detectWidthForME);
        
        createInspector();
        
        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyC') {
                e.preventDefault();
                toggleInspectMode();
            }
            
            if (e.code === 'Escape' && inspectMode) {
                disableInspectMode();
            }
        });
        
        if (themeChangeListener) {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', themeChangeListener);
        }
        themeChangeListener = updateEditorTheme;
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeChangeListener);
        updateEditorTheme();
    }, 50);

    setTimeout(() => {
        resultFrame = document.getElementById('resultFrame');
    }, 50);
});