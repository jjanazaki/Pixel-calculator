document.addEventListener("DOMContentLoaded", () => {

    /* ======================
       TITLE BAR
    ====================== */

    const minBtn = document.getElementById("minBtn");
    const closeBtn = document.getElementById("closeBtn");

    if (minBtn) {
        minBtn.addEventListener("click", () => {
            window.electronAPI.minimize();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            window.electronAPI.close();
        });
    }

    /* ======================
       SCREEN & STATE
    ===================== */

    const screen = document.getElementById("screen");
    let expression = "";
    let clearOnNextInput = false; // Tracks if a fresh number should clear the old result

    function updateScreen(val) {
        screen.textContent = val || "0";
    }

    function add(val) {
        expression += val;
        updateScreen(expression);
    }

    /* ======================
       NUMBERS (0-9)
    ====================== */

    for (let i = 0; i <= 9; i++) {
        const btn = document.getElementById(String(i));

        if (btn) {
            btn.addEventListener("click", () => {
                // If a total was just calculated, clear it out for the new number
                if (clearOnNextInput) {
                    expression = "";
                    clearOnNextInput = false;
                }
                add(String(i));
            });
        }
    }

    /* ======================
       OPERATORS
    ====================== */

    const ops = {
        plus: "+",
        minus: "-",
        multiply: "*",
        divide: "/",
        dot: "."
    };

    Object.keys(ops).forEach(id => {
        const btn = document.getElementById(id);

        if (btn) {
            btn.addEventListener("click", () => {
                // If they press an operator after '=', they want to KEEP chain-calculating
                if (clearOnNextInput) {
                    clearOnNextInput = false; 
                }
                add(ops[id]);
            });
        }
    });

    /* ======================
       CLEAR
    ====================== */

    const clearBtn = document.getElementById("C");

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            expression = "";
            clearOnNextInput = false;
            updateScreen("0");
        });
    }

    /* ======================
       SAFE CALCULATION
    ====================== */

    const equalBtn = document.getElementById("equal");

    if (equalBtn) {
        equalBtn.addEventListener("click", () => {

            try {
                // prevent ending with operator
                if (/[+\-*/.]$/.test(expression)) {
                    expression = expression.slice(0, -1);
                }

                if (!expression) return; // Ignore if empty

                const result = Function("return " + expression)();

                expression = result.toString();
                updateScreen(expression);
                
                // Set the flag: typing a number next will wipe the screen
                clearOnNextInput = true; 

            } catch (err) {
                expression = "";
                clearOnNextInput = false;
                updateScreen("Error");
            }
        });
    }

});