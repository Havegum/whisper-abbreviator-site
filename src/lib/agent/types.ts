export enum CommandType {
  Think = 'think',
  Permission = 'permission',
}

export type CommandPayload = {
  [CommandType.Think]: string;
  [CommandType.Permission]: {
    id: string;
    granted: boolean;
  };
};
export interface Command<T extends CommandType> {
  type: T;
  payload: CommandPayload[T];
}
