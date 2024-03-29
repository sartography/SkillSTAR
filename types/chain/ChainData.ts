import { deepClone } from '../../_util/deepClone';
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
    this.sessions = this.sortSessionsInChain(skillstarChain);
  }

  get numSessions(): number {
    return this.sessions.length;
  }

  get lastSession(): ChainSession {
    return this.sessions[this.sessions.length - 1];
  }

  /**
   * Updates a specific session with the given data
   * @param sessionId: The id of the session
   * @param newSession: Data to update the session with
   */
  updateSession(sessionId: number, newSession: ChainSession): void {
    this.sessions.forEach((session, i) => {
      if (session.id !== undefined && session.id === sessionId) {
        this.sessions[i] = newSession;
      }
    });

    this.sortSessions();
  }

  /**
   * Adds or updates a given session in the chain data sessions array.
   * @param newSession: Data to update the session with
   */
  upsertSession(newSession: ChainSession): void {
    if (newSession.id !== undefined && newSession.id !== null) {
      this.updateSession(newSession.id, newSession);
    } else {
      this.sessions.push(newSession);
    }

    this.sortSessions();
  }

  /**
   * Returns all step attempts across all sessions that match the given chainStepId
   * @param chainStepId
   */
  getAllStepAttemptsForChainStep(chainStepId: number): StepAttempt[] {
    const stepAttempts: StepAttempt[] = [];
    this.sessions.forEach((session) => {
      session.step_attempts.forEach((stepAttempt) => {
        if (stepAttempt.chain_step_id === chainStepId) {
          stepAttempts.push(stepAttempt);
        }
      });
    });
    return stepAttempts;
  }

  clone(): ChainData {
    const clonedObject = deepClone<ChainData>(this);
    return new ChainData(clonedObject);
  }

  /**
   * Given a SkillstarChain, returns a list of sessions, sorted by date in ascending order (from past to present).
   * @param skillstarChain
   * @private
   */
  private sortSessionsInChain(skillstarChain?: SkillstarChain): ChainSession[] {
    const sessionsToSort = skillstarChain ? skillstarChain.sessions : this.sessions;
    return this.sortSessionDates(this.convertSessionDates(sessionsToSort)).map((s, i) => {
      s.session_number = i + 1;
      s.step_attempts.forEach((sa) => (sa.session_number = s.session_number));
      return s;
    });
  }

  /**
   * Sorts this instance's list of sessions, sorted by date in ascending order (from past to present).
   * @private
   */
  private sortSessions() {
    this.sessions = this.sortSessionsInChain();
  }

  /**
   * Returns the given list of sessions, with all dates converted to Date instances.
   * @param sessions
   */
  private convertSessionDates(sessions: ChainSession[]): ChainSession[] {
    // Make sure all the dates are actually dates
    return sessions.map((s) => {
      if (!s.date) {
        throw new Error('session date is not populated.');
      } else {
        s.date = new Date(s.date);
      }

      // Convert all step attempt dates to strings
      s.step_attempts = s.step_attempts.map((sa) => {
        if (!sa.date) {
          throw new Error('step attempt date is not populated.');
        } else {
          sa.date = new Date(sa.date);
        }
        sa.last_updated = sa.last_updated ? new Date(sa.last_updated) : new Date();
        return sa;
      });
      return s;
    });
  }

  /**
   * Returns the given list of sessions, with all sessions sorted by date.
   * @param sessions
   */
  private sortSessionDates(sessions: ChainSession[]): ChainSession[] {
    return sessions.sort((a, b) => {
      if (a && b && a.date && b.date) {
        return a.date.getTime() - b.date.getTime();
      } else {
        return 0;
      }
    });
  }
}
