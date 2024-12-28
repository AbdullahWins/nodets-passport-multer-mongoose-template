//src/utils/helpers/db_finder.helper.ts

export const getDatabaseFromUid: (uid: string) => string = (uid: string) => {
  return `school_${uid}`;
};
