import { ChainSession } from './ChainSession';
import { StepAttempt } from './StepAttempt';

export interface SkillstarChain {
  id?: number;
  last_updated?: Date;
  participant_id: number;
  user_id?: number;
  time_on_task_ms?: number;
  sessions: ChainSession[];
}

export class ChainData implements SkillstarChain {
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
    this.sessions = this.sortSessions(skillstarChain);
  }

  get numSessions(): number {
    return this.sessions.length;
  }

  get lastSession(): ChainSession {
    return this.sessions[this.sessions.length - 1];
  }

  /**
   * Updates the specific chain step attempt with the given data
   * @param sessionId: The id of the session
   * @param chainStepId: The chain_step_id in the step attempt
   * @param newStep: Data to update the step with
   */
  updateStep(sessionId: number, chainStepId: number, newStep: StepAttempt): void {
    console.log('SkillstarChain.ts > ChainData > updateStep ***');
    console.log('sessionId', sessionId);
    console.log('chainStepId', chainStepId);
    console.log('newStep', newStep);
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
  updateSession(sessionId: number, newSession: ChainSession): void {
    console.log('SkillstarChain.ts > ChainData > updateSession ***');
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
  getStep(sessionId: number, chainStepId: number): StepAttempt | undefined {
    for (const session of this.sessions) {
      if (session.id === sessionId) {
        for (const stepAttempt of session.step_attempts) {
          if (chainStepId === stepAttempt.chain_step_id) {
            return stepAttempt;
          }
        }
      }
    }
  }

  /**
   * Returns all step attempts across all sessions that match the given chainStepId
   * @param chainStepId
   */
  getAllStepAttemptsForChainStep(chainStepId: number): StepAttempt[] {
    const stepAttempts: StepAttempt[] = [];
    this.sessions.forEach(session => {
      session.step_attempts.forEach(stepAttempt => {
        if (stepAttempt.chain_step_id === chainStepId) {
          stepAttempts.push(stepAttempt);
        }
      });
    });
    return stepAttempts;
  }

  /**
   * Given a SkillstarChain, returns a list of sessions, sorted by date in ascending order (from past to present).
   * @param skillstarChain
   * @private
   */
  private sortSessions(skillstarChain: SkillstarChain): ChainSession[] {
    return skillstarChain.sessions
      .slice() // Make a copy of the array first, so the sort doesn't mutate the original.
      .sort((a, b) => {
        if (a && b && a.date && b.date) {
          return a.date.getTime() - b.date.getTime();
        } else {
          return 0;
        }
      });
  }
}
