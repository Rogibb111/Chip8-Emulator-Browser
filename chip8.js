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
            instruction(opcode, this.state);
        }

        window.requestAnimationFrame(this.run);
    }

}

function getInstruction(opcode) {
    switch(opcode & 0xF000) {
        
    }
}

const instructionMap = {
    // 0x0nnn - SYS addr
    0x0: (opcode, { pc }) => {
        pc = opcode;
    },
    // 0x1nnn - JP addr
    0x1: (opcode, { pc }) => {
        pc = opcode & 0x0FFF;
    },
    // 0x2nnn - CALL addr 
    0x2: (opcode, { pc, stack, sp }) => {
        stack[sp] = pc;
        sp += 1;
        pc = opcode & 0x0FFF;
    },
    // 0x3xkk - SE Vx, byte
    0x3: (opcode, { v, pc }) => {
        const register = opcode & 0x0F00;
        const compareVal = opcode & 0x00FF; 
        
        if (v[register] === compareVal) {
            pc += 2;
        }
    },
    // 0x4xkk SNE Vx, byte
    0x4: (opcode, { v, pc }) => {
        const register = opcode & 0x0F00;
        const compareVal = opcode & 0x00FF; 
        
        if (v[register] !== compareVal) {
            pc += 2;
        }
    },
    // 0x5xy0 SNE Vx, byte
    0x5: (opcode, { v, pc }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0; 
        
        if (x === y) {
            pc += 2;
        }
    }
};