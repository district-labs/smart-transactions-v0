import { IntentBatchManager } from './intent-batch-manager';
import { IntentModule } from './types' 
import { encodeAbiParameters } from 'viem'

export class IntentBatchFactory {
    modules: IntentModule[];


    constructor(modules:IntentModule[]) {
        this.modules = modules;
    }

    create(root: `0x${string}`) {
        return new IntentBatchManager(this, root);
    }

    target(name: string) {
        const module = this.modules.find(m => m.name === name);
        if (!module) {
            throw new Error(`Module not found: ${name}`);
        }

        return module.target;
    }

    encode(name: string, args: string[]) {
        const module = this.modules.find(m => m.name === name);
        if (!module) {
            throw new Error(`Module not found: ${name}`);
        }

        return encodeAbiParameters(
            module.args,
            args
        )
    }


}