import { CalendarCheck, Plus, Save, Trash2, Sparkles } from "lucide-react";
import { useState } from "react";
import { getTodayDate } from "../utils/progressUtils";

const actionOptions = [
  "Cleaned",
  "Bath",
  "Washed hands",
  "Changed clothes",
  "Checked surface",
  "Custom",
];

function createFeedback(entry) {
  const totalActions = entry.actions.reduce(
    (sum, action) => sum + Number(action.count || 0),
    0
  );

  const repeatedActions = entry.actions.filter(
    (action) => Number(action.count || 0) >= 2
  );

  const mostRepeatedAction =
    repeatedActions.length > 0
      ? repeatedActions.sort((a, b) => Number(b.count) - Number(a.count))[0]
      : null;

  const wins = [];

  if (entry.delayMinutes > 0) {
    wins.push(
      `You paused for ${entry.delayMinutes} minute${
        entry.delayMinutes > 1 ? "s" : ""
      } before acting. That pause is progress.`
    );
  } else {
    wins.push(
      "You noticed and recorded what happened today. Awareness itself is progress."
    );
  }

  if (entry.mood === "Proud" || entry.mood === "Calm") {
    wins.push(`You ended with a ${entry.mood.toLowerCase()} feeling. Keep that moment in mind.`);
  }

  const patterns = [];

  if (totalActions > 0) {
    patterns.push(`You recorded ${totalActions} repeated action${totalActions > 1 ? "s" : ""} today.`);
  }

  if (mostRepeatedAction) {
    patterns.push(
      `${mostRepeatedAction.type} happened ${mostRepeatedAction.count} times. This may be a pattern to gently observe.`
    );
  }

  if (entry.anxietyLevel >= 7) {
    patterns.push(
      "Anxiety was high today. On high-anxiety days, the goal can be smaller: pause, breathe, and delay one repetition."
    );
  }

  const suggestions = [];

  if (mostRepeatedAction) {
    suggestions.push(
      `Tomorrow, try delaying only the second ${mostRepeatedAction.type.toLowerCase()} by 2 minutes. Do not force big change.`
    );
  } else {
    suggestions.push(
      "Tomorrow, try writing the trigger first before acting. This builds a small gap between urge and action."
    );
  }

  if (entry.delayMinutes < 2) {
    suggestions.push(
      "Start with a tiny pause: 30 seconds to 2 minutes before repeating an action."
    );
  } else {
    suggestions.push(
      "Since you already paused today, try keeping the same pause tomorrow instead of increasing too fast."
    );
  }

  suggestions.push(
    "Use Calm Mode before repeating an action. One breathing cycle is enough to begin."
  );

  return {
    wins,
    patterns,
    suggestions,
  };
}

function DailyCheckIn({ onAddEntry }) {
  const [actions, setActions] = useState([
    {
      id: Date.now(),
      type: "Cleaned",
      customType: "",
      count: 1,
      minutes: 0,
      reason: "",
    },
  ]);

  const [feedback, setFeedback] = useState(null);

  function addAction() {
    setActions((currentActions) => [
      ...currentActions,
      {
        id: Date.now(),
        type: "Bath",
        customType: "",
        count: 1,
        minutes: 0,
        reason: "",
      },
    ]);
  }

  function updateAction(actionId, field, value) {
    setActions((currentActions) =>
      currentActions.map((action) =>
        action.id === actionId ? { ...action, [field]: value } : action
      )
    );
  }

  function deleteAction(actionId) {
    setActions((currentActions) =>
      currentActions.filter((action) => action.id !== actionId)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const cleanedActions = actions
      .map((action) => ({
        id: action.id,
        type:
          action.type === "Custom"
            ? action.customType.trim() || "Custom action"
            : action.type,
        count: Number(action.count || 0),
        minutes: Number(action.minutes || 0),
        reason: action.reason.trim(),
      }))
      .filter((action) => action.count > 0);

    const totalActionMinutes = cleanedActions.reduce(
      (sum, action) => sum + Number(action.minutes || 0),
      0
    );

    const newEntry = {
      id: Date.now(),
      date: form.date.value,
      urgeLevel: Number(form.urgeLevel.value),
      anxietyLevel: Number(form.anxietyLevel.value),
      trigger: form.trigger.value,
      cleaningMinutes: Number(form.cleaningMinutes.value),
      delayMinutes: Number(form.delayMinutes.value),
      mood: form.mood.value,
      note: form.note.value,
      actions: cleanedActions,
      totalActionMinutes,
    };

    onAddEntry(newEntry);
    setFeedback(createFeedback(newEntry));

    form.reset();
    form.date.value = getTodayDate();

    setActions([
      {
        id: Date.now(),
        type: "Cleaned",
        customType: "",
        count: 1,
        minutes: 0,
        reason: "",
      },
    ]);
  }

  return (
    <section className="section" id="tracker">
      <div className="section-title">
        <span>
          <CalendarCheck size={18} /> Daily Reflection
        </span>

        <h2>How did today feel?</h2>

        <p>
          Track repeated actions gently, understand patterns, and choose one
          small improvement for tomorrow.
        </p>
      </div>

      <div className="reflection-layout">
        <form className="tracker-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Date
              <input type="date" name="date" defaultValue={getTodayDate()} />
            </label>

            <label>
              Urge intensity
              <input
                type="number"
                name="urgeLevel"
                min="1"
                max="10"
                required
                placeholder="1 to 10"
              />
            </label>

            <label>
              Anxiety level
              <input
                type="number"
                name="anxietyLevel"
                min="1"
                max="10"
                required
                placeholder="1 to 10"
              />
            </label>

            <label>
              What triggered it?
              <input
                type="text"
                name="trigger"
                required
                placeholder="Dust, clothes, touch, kitchen..."
              />
            </label>

            <label>
              Cleaning time
              <input
                type="number"
                name="cleaningMinutes"
                min="0"
                required
                placeholder="Minutes"
              />
            </label>

            <label>
              Pause before action
              <input
                type="number"
                name="delayMinutes"
                min="0"
                required
                placeholder="Minutes"
              />
            </label>

            <label>
              How do you feel now?
              <select name="mood" required>
                <option value="">Choose one</option>
                <option value="Proud">Proud</option>
                <option value="Calm">Calm</option>
                <option value="Okay">Okay</option>
                <option value="Tired">Tired</option>
                <option value="Anxious">Anxious</option>
              </select>
            </label>
          </div>

          <div className="action-tracker-card">
            <div className="action-tracker-head">
              <div>
                <h3>Repeated actions</h3>
                <p>Add what happened today, even if it happened many times.</p>
              </div>

              <button type="button" className="add-action-btn" onClick={addAction}>
                <Plus size={17} />
                Add
              </button>
            </div>

            <div className="actions-list">
              {actions.map((action, index) => (
                <div className="action-row" key={action.id}>
                  <div className="action-row-top">
                    <span>Action {index + 1}</span>

                    {actions.length > 1 && (
                      <button
                        type="button"
                        className="delete-action-btn"
                        onClick={() => deleteAction(action.id)}
                        aria-label="Delete action"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="action-grid">
                    <label>
                      Action type
                      <select
                        value={action.type}
                        onChange={(event) =>
                          updateAction(action.id, "type", event.target.value)
                        }
                      >
                        {actionOptions.map((option) => (
                          <option value={option} key={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    {action.type === "Custom" && (
                      <label>
                        Custom action
                        <input
                          type="text"
                          value={action.customType}
                          onChange={(event) =>
                            updateAction(
                              action.id,
                              "customType",
                              event.target.value
                            )
                          }
                          placeholder="Example: cleaned phone"
                        />
                      </label>
                    )}

                    <label>
                      How many times?
                      <input
                        type="number"
                        min="1"
                        value={action.count}
                        onChange={(event) =>
                          updateAction(action.id, "count", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Time spent
                      <input
                        type="number"
                        min="0"
                        value={action.minutes}
                        onChange={(event) =>
                          updateAction(action.id, "minutes", event.target.value)
                        }
                        placeholder="Minutes"
                      />
                    </label>

                    <label>
                      Reason / trigger
                      <input
                        type="text"
                        value={action.reason}
                        onChange={(event) =>
                          updateAction(action.id, "reason", event.target.value)
                        }
                        placeholder="Touch, doubt, dirt, outside..."
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label>
            Private note
            <textarea
              name="note"
              rows="4"
              placeholder="Write one small thing you noticed today..."
            ></textarea>
          </label>

          <button className="primary-btn form-btn" type="submit">
            <Save size={18} />
            Save Reflection
          </button>
        </form>

        <aside className="feedback-card">
          <div className="feedback-icon">
            <Sparkles size={22} />
          </div>

          <h3>Overall feedback</h3>

          {!feedback ? (
            <p>
              Save today’s reflection to see gentle feedback, repeated patterns,
              and one small next step.
            </p>
          ) : (
            <div className="feedback-content">
              <div>
                <h4>What went well</h4>
                {feedback.wins.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>

              <div>
                <h4>Pattern noticed</h4>
                {feedback.patterns.length > 0 ? (
                  feedback.patterns.map((item) => <p key={item}>{item}</p>)
                ) : (
                  <p>No repeated pattern strongly noticed today.</p>
                )}
              </div>

              <div>
                <h4>Try next</h4>
                {feedback.suggestions.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default DailyCheckIn;