import { IntentModule } from "@district-labs/intentify-intent-batch";

export class IntentBatchFactory {
  modules: IntentModule[]

  constructor(modules: IntentModule[]) {
    this.modules = modules
  }

}