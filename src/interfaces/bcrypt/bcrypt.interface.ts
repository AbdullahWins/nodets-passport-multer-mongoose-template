// Interface for input to compareString function
export interface IComparePasswordInput {
  normalPassword: string;
  hashedPassword: string;
}

// Interface for output from compareString function
export interface IComparePasswordOutput {
  isMatched: boolean;
}

// Interface for input to hashString function
export interface IHashPasswordInput {
  string: string;
}

// Interface for output from hashString function
export interface IHashPasswordOutput {
  hashedString: string;
}
