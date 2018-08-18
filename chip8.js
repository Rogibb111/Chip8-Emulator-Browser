const state = {
        // Program counter
        pc: 0,

        // Memory
        memory: new Array(4096),

        // Stack
        stack: new Array(16),

        // Stack Pointer
        sp: 0,

        // "V" registers
        v: new Array(16),

        // "I" register
        i: 0,

        // Delay timer
        delayTimer: 0,

        // Sound timer
        soundTimer: 0
};

class chip8 {

    constructor() {
        this.state = JSON.parse(JSON.stringify(state));
    }

    reset() {
        this.state = JSON.parse(JSON.stringify(state));
    }

    run() {
        for(let x = 0; x < 10; x+=1) {
            const { memory, pc } = this.state;
            const opcode = memory[pc] << 8 | memory[pc + 1];
            const instruction = getInstruction(opcode);
            instruction(this.state);
        }

        window.requestAnimationFrame(this.run);
    }

}

function getInstruction(opcode) {
    switch(opcode & 0xF000) {
        
    }
}