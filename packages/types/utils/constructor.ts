export type Arguments<T = any[]> = T extends any[] ? T : [T];

// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor<T = any, U = any[]> = {
  prototype: T;
  new(...args: Arguments<U>): T;
};
