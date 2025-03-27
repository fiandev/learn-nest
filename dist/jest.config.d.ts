declare const _default: {
  preset: string;
  testEnvironment: string;
  moduleFileExtensions: string[];
  rootDir: string;
  testRegex: string;
  transform: {
    '^.+\\.(t|j)s$': string;
  };
  moduleNameMapper:
    | {
        [key: string]: string | string[];
      }
    | undefined;
  modulePaths: string[];
};
export default _default;
