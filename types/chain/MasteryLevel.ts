import { ChainStepStatus } from './StepAttempt';

export interface MasteryStatus {
  stepStatus: ChainStepStatus;
  label: string;
  icon: string;
  color: string;
}

export interface MasteryInfo {
  chainStepId: number;
  stepStatus: ChainStepStatus;
  dateIntroduced?: Date;
  dateMastered?: Date;
  dateBoosterInitiated?: Date;
  dateBoosterMastered?: Date;
  numAttemptsSince: MasteryInfoNumAttemptsSince;
}

export interface MasteryInfoNumAttemptsSince {
  firstIntroduced: number;
  firstCompleted: number;
  lastCompleted: number;
  lastCompletedWithoutChallenge: number;
  lastCompletedWithoutPrompt: number;
  lastProbe: number;
  firstMastered: number;
  boosterInitiated: number;
  boosterMastered: number;
}

export interface MasteryInfoMap {
  [key: string]: MasteryInfo;
}