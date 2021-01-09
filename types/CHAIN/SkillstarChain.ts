import { ChainSession } from './ChainSession';
import { StepAttempt } from './StepAttempt';

export interface SkillstarChain {
  id?: number;
  last_updated?: Date;
  participant_id: number;
  user_id?: number;
  time_on_task_ms?: number;
  sessions: ChainSession[];

  // TODO: Add the group?
}

export class ChainData {
  id?: number;
  last_updated?: Date;
  participant_id: number;
  user_id?: number;
  time_on_task_ms?: number;
  sessions: ChainSession[];

  constructor(skillstarChain: SkillstarChain) {
    this.id = skillstarChain.id;
    this.last_updated = skillstarChain.last_updated;
    this.participant_id = skillstarChain.participant_id;
    this.user_id = skillstarChain.user_id;
    this.time_on_task_ms = skillstarChain.time_on_task_ms;
    this.sessions = skillstarChain.sessions;
  }

  /**
   * Updates the specific chain step attempt with the given data
   * @param sessionId: The id of the session
   * @param chainStepId: The chain_step_id in the step attempt
   * @param newStep: Data to update the step with
   */
  updateStep(sessionId: number, chainStepId: number, newStep: StepAttempt) {
    this.sessions.forEach((session, i) => {
      if (session.id === sessionId) {
        session.step_attempts.forEach((stepAttempt, j) => {
          if (chainStepId === stepAttempt.chain_step_id) {
            this.sessions[i].step_attempts[j] = newStep;
          }
        });
      }
    });
  }

  /**
   * Updates a specific session with the given data
   * @param sessionId: The id of the session
   * @param newSession: Data to update the session with
   */
  updateSession(sessionId: number, newSession: ChainSession) {
    this.sessions.forEach((session, i) => {
      if (session.id === sessionId) {
        this.sessions[i] = newSession;
      }
    });
  }

  /**
   * Returns a specific step within a specific session
   * @param sessionId
   * @param chainStepId
   */
  getStep(sessionId: number, chainStepId: number) {
    for (const session of this.sessions) {
      if (session.id === sessionId) {
        for (const step of session.step_attempts) {
          if (chainStepId === step.chain_step_id) {
            return step;
          }
        }
      }
    }
  }
}