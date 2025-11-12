export class ApplicationContext {
  constructor(public currentUserId?: number) {}
}

export const createApplicationContext = ({ currentUserId }: { currentUserId?: number }) => {
  return new ApplicationContext(currentUserId);
};
