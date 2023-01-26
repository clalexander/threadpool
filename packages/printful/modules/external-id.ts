export const makeIdExternal = (id: number | string) => `@${id}`;

export const maybeIdAsExternal = (
  id: number | string,
  isExternal: boolean,
) => (isExternal ? makeIdExternal(id) : id);
