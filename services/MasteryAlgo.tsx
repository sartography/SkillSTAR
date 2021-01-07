import { ChainQuestionnaire } from "../types/CHAIN/ChainQuestionnaire";
import { ChainSession, ChainSessionType } from "../types/CHAIN/ChainSession";
import { MasteryInfo } from "../types/CHAIN/MasteryLevel";
import {
	ChainStepPromptLevel,
	ChainStepStatus,
	StepAttempt,
} from "../types/CHAIN/StepAttempt";

class MasteryAlgo {
	PROBE_MAX_CONSECUTIVE_INCOMPLETE = 2;
	TRAINING_MAX_CONSECUTIVE_INCOMPLETE = 3;
	incompleteCount = 0;
	static currentSessionType = ChainSessionType;
	static currentSessionNumber = 0;
	promptHierarchy = [
		ChainStepPromptLevel.full_physical,
		ChainStepPromptLevel.full_physical,
		ChainStepPromptLevel.full_physical,
		ChainStepPromptLevel.partial_physical,
		ChainStepPromptLevel.partial_physical,
		ChainStepPromptLevel.partial_physical,
		ChainStepPromptLevel.shadow,
		ChainStepPromptLevel.shadow,
		ChainStepPromptLevel.shadow,
		ChainStepPromptLevel.none,
		ChainStepPromptLevel.none,
		ChainStepPromptLevel.none,
	];
	constructor() {}

	/** WHAT ARE THE DEFINING CRITERIA FOR A FOCUS-STEP? */
	// 1. (GIVEN: No prior sessions.)
	// 2. (GIVEN: No prior step_attempts.)
	// 3. Prior count of step_attempt[index] at prompt-level < MAX_REQUIRED_ATTEMPTS_AT_PROMPT_LEVEL.
	// 4. Step_attempt[index - 1] is mastered at current prompt-level.
	// 5. Step_attempt[index] was previously mastered, but required add'l prompting
	// 6. Step_attempt[index] completed 3-times WITHOUT add'l prompt NOR severe CB
	// 7.
	// 8.

	/** WHAT DEFINES A FOCUS STEP_ATTEMPT'S MASTERY? */
	// 3x attempt WITHOUT:
	// 1. additional prompting needed
	// 2. interfering CB

	/** GET STEP COMPLETION */
	// -- IF: (prior_session.step_attempt[index].needed_addl_prompting === true)
	// ---- THEN: return false
	// -- IF: (prior_session.step_attempt[index].cb_severity > MAX_ALLOWED_SEVERITY)
	// ---- THEN: return false
	// -- ELSE:
	// ---- THEN: return true

	/** GET SESSION TYPE */
	// -- get last session (sessions[index-1]
	// -- IF ((prior session_type === "probe" && prior session === incomplete) || prior session count < REQUIRED_PROBE_COUNT ):
	// -------- RETURN: "Probe"
	// ------ ELSE:
	// -------- RETURN: "Training"
	// -- IF (prior session_type === "training"):
	// ----- RETURN: "Training"
	static _determineAndSetSessionType(chainData: ChainQuestionnaire) {
		console.log(chainData);
		if (chainData && chainData.sessions.length < 1) {
			this.currentSessionType = "Probe";
			this._setCurrentSessionNumber(0);
		} else {
			this.currentSessionType =
				chainData.sessions[chainData.sessions.length - 1].session_type;
			this._setCurrentSessionNumber(chainData.sessions.length);
		}
	}

	/** GET CURRENT SESSION NUMBER */
	// total sessions.length + 1
	static _setCurrentSessionNumber(sessionsLength: number) {
		this.currentSessionNumber = sessionsLength + 1;
	}

	/** GET STEP_ATTEMPT PROMPT LEVEL */
	// -- IF: (prior session != complete)
	// ---- THEN: return prior_session.step_attempt[index].prompt_level
	// -- ELSE:

	/** FOCUS STEP ALGO */
	// **
	// check for completion of last session's step_attempts
	// -- IF: (a step_attempt was incomplete && (total qty of sessions >= MAX_CONSEC_INCOMPLETE))
	// -- THEN: get prior 3 sessions _AND THEN_ check step_attempt[index] against prior_session.step_attempt[index]
	// ------- IF: (prior_session.step_attempt[index] ALSO incomplete)
	// ----------- THEN: incompleteCount += 1
	// ------- ELSE:
	// ----------- THEN: incompleteCount = 0
	// -- IF: (incompleteCount >= MAX_CONSEC_INCOMPLETE)
	// ----------- THEN: FOCUS_STEP = next_session.step_attempt[index]
	// ----------- RETURN: FOCUS_STEP
	// -- ELSE:
	// ----------- FOCUS_STEP = next_session.step_attempt[index+1]
	// ----------- RETURN: FOCUS_STEP
}