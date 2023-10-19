export type IntentModuleArg = {
  name: string;
  type: string;
  indexed?: boolean;
}


export type IntentModule = {
  name: string;
  target: `0x${string}`;
  args: IntentModuleArg[];
}