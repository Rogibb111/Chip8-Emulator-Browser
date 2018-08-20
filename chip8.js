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
        this.state.stack[0] = 0;
    }

    reset() {
        this.state = JSON.parse(JSON.stringify(state));
        this.state.stack[0] = 0;
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
    // 00E0 - CLS
    0x00E0: () => {
        // clear the display
    },
    // 0x00EE - RET
    0x00EE: (opcode, { pc, stack, sp }) => {
        pc = stack[sp];
        sp -= 1;
    },
    // 0x1nnn - JP addr
    0x1: (opcode, { pc }) => {
        pc = opcode & 0x0FFF;
    },
    // 0x2nnn - CALL addr 
    0x2: (opcode, { pc, stack, sp }) => {
        sp += 1;
        stack[sp] = pc;
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
    },
    // 0x6xkk - LD Vx, byte
    0x6: (opcode, { v }) => {
        const data = opcode & 0x00FF;
        const register = opcode & 0x0F00;

        v[register] = data;
    },
    // 0x7xkk - ADD Vx, byte
    0x7: (opcode, { v }) => {
        const data = opcode & 0x00FF;
        const register = opcode & 0x0F00;

        v[register] += data;
    },
    // 8xy0 - LD Vx, Vy
    0x8000: (opcode, { v }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0;
        
        v[x] = v[y];
    },
    // 8xy1 - OR Vx, Vy
    0x8001: (opcode, { v }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0;
        
        v[x] = v[x] | v[y];
    },
    // 8xy2 - AND Vx, Vy
    0x8002: (opcode, { v }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0;
        
        v[x] = v[x] & v[y];
    },
    // 8xy3 - XOR Vx, Vy
    0x8003: (opcode, { v }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0;
        
        v[x] = v[x] | v[y];
    },
    // 8xy4 - ADD Vx, Vy
    0x8004: (opcode, { v }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0;
        
        v[x] = v[x] | v[y];
    },

};