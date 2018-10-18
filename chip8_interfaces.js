'use strict';

function  writeToSvg(screen) {
    for (let i = 0; i < SCREEN_HEIGHT; i += 1) {
        for (let j = 0; j <SCREEN_WIDTH; j += 1) {
            const pixel = document.getElementById(`${j}_${i}`);
            if (screen[i][j]) {
                if (pixel.getAttribute('fill') !== 'green') {
                    pixel.setAttribute('fill','green');
                }
            } else {
                if (pixel.getAttribute('fill') !== 'black') {
                    pixel.setAttribute('fill','black');
                }
            }
        }
    }
}

function keyDownCallback({ keyCode }) {
    if (!state.pressedKeys.includes(keyMap[keyCode])) {
        state.pressedKeys.push(keyMap[keyCode]);
    }

    if (state.haltForKeyPress) {
        state.v[state.haltForKeyPress] = keyMap[keyCode];
        state.haltForKeyPress = false;
    }
}

function keyUpCallback({ keyCode }) {
    state.pressedKeys = state.pressedKeys.filter((key) => {
        return key !== keyMap[keyCode];
    });
}

function attachKeyPressCallbacks() {
    const screen = document.getElementById("screen");
    document.addEventListener('keydown', keyDownCallback);
    document.addEventListener('keyup', keyUpCallback);
}

function removeKeyPressCallbacks() {
    const screen = document.getElementById("screen");
    screen.removeEventListener('keydown', keyDownCallback);
    screen.removeEventListener('keyup', keyUpCallback);
}

function loadRomToMemory(rom) {
    const reader = new FileReader();
     
    reader.onload = () => {
        const buffer = reader.result;
        const romIntArray = new Uint8Array(buffer)

        reset();
        state.memory.splice(0x200,romIntArray.length, ...romIntArray);
        run();
    };

    reader.readAsArrayBuffer(rom);
}

function printState(opcode, newState, currentPc) {
    if (debug === 'full') {
        console.log('________________________________');
        console.log(`PC:            ${currentPc.toString(16)}`);
        console.log(`Stack:         ${newState.stack}`);
        console.log(`Sp:            ${newState.sp}`);
        console.log(`V:             ${newState.v.map( r => r ? r.toString(16) : 'null')}`);
        console.log(`I:             ${newState.i.toString(16)}`);
        console.log(`DelayTimer:    ${newState.delayTimer}`);
        console.log(`SoundTimer:    ${newState.soundTimer}`);
        console.log(`Pressed Keys   ${newState.pressedKeys}`);
        console.log(`Opcode   ${opcode.toString(16)}`);
    } else if (debug === 'min') {
        console.log(`Opcode   ${opcode.toString(16)}`);
        console.log(`V[b]     ${newState.v[0xb]}`);
    }
}

function setDebug(state) {
    debug = state;
}


