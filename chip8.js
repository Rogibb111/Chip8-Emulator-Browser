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
    // 0nnn - SYS addr
    0x0: (opcode, { pc }) => {
        pc = opcode;
    },
    // 00E0 - CLS
    0x00E0: () => {
        // clear the display
    },
    // 00EE - RET
    0x00EE: (opcode, { pc, stack, sp }) => {
        pc = stack[sp];
        sp -= 1;
    },
    // 1nnn - JP addr
    0x1: (opcode, { pc }) => {
        pc = opcode & 0x0FFF;
    },
    // 2nnn - CALL addr 
    0x2: (opcode, { pc, stack, sp }) => {
        sp += 1;
        stack[sp] = pc;
        pc = opcode & 0x0FFF;
    },
    // 3xkk - SE Vx, byte
    0x3: (opcode, { v, pc }) => {
        const register = opcode & 0x0F00;
        const compareVal = opcode & 0x00FF; 
        
        if (v[register] === compareVal) {
            pc += 2;
        }
    },
    // 4xkk SNE Vx, byte
    0x4: (opcode, { v, pc }) => {
        const register = opcode & 0x0F00;
        const compareVal = opcode & 0x00FF; 
        
        if (v[register] !== compareVal) {
            pc += 2;
        }
    },
    // 5xy0 SNE Vx, byte
    0x5: (opcode, { v, pc }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0; 
        
        if (x === y) {
            pc += 2;
        }
    },
    // 6xkk - LD Vx, byte
    0x6: (opcode, { v }) => {
        const data = opcode & 0x00FF;
        const register = opcode & 0x0F00;

        v[register] = data;
    },
    // 7xkk - ADD Vx, byte
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
        
        v[x] ^= v[y];
    },
    // 8xy4 - ADD Vx, Vy
    0x8004: (opcode, { v }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0;
        let result = x + y;
        v[0xF] = 0;

        if (result > 0xFF) {
            v[0xF] = 1;
            result &= 0xFF; 
        }
        
        v[x] = result;
    },
    // 8xy5 - SUB Vx, Vy
    0x8005: (opcode, { v }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0;
        v[0xF] = 0;

        if (x > y) {
            v[0xF] = 1;
        }
        
        v[x] -= v[y];
    },
    // 8xy6 - SHR Vx {, Vy}
    0x8006: (opcode, { v }) => {
        v[0xF] = 0x0001 & opcode;
        v[x] /= 2; 
    },
    // 8xy7 - SUBN Vx, Vy
    0x8007: () => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0;
        v[0xF] = 0;

        if (y > x) {
            v[0xF] = 1;
        }
        
        v[x] = v[y] - v[x];
    },
    // 8xyE - SHL Vx {, Vy}
    0x800E: (opcode, { v }) => {
        v[0xF] = 0x8000 & opcode;
        v[x] *= 2; 
    },
    // 9xy0 - SNE Vx, Vy
    0x9: (opcode, { v, pc }) => {
        const x = opcode & 0x0F00;
        const y = opcode & 0x00F0;

        if (v[x] !== v[y]) {
            pc +=2
        }
    },
    // Annn - LD I, addr
    0xA: (opcode, { i }) => {
        i = opcode & 0x0FFF;
    },
    // Bnnn - JP V0, addr
    0xB: (opcode, { v, pc }) => {
        pc = (0x0FFF & opcode) + v[0];
    },
    // Cxkk - RND Vx, byte
    0xC: (opcode, { v, pc }) => {
        const x = 0x0F00 & opcode;
        const rand = Math.floor(Math.random() * Math.floor(0xFF));

        v[x] = rand & (0xFF & opcode);
    },
    // Dxyn - DRW Vx, Vy, nibble
    0xD: (opcode, { v, i, memory }) => {
        const x = 0x0F00 & opcode;
        const y = 0x00F0 & opcode;
        const n = 0x000F & opcode;

        const sprite = memory.slice(i, n+1);
    }
};