import { CalendarCheck, Save } from "lucide-react";
import { getTodayDate } from "../utils/progressUtils";

function DailyCheckIn({ onAddEntry }) {
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;

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
    };

    onAddEntry(newEntry);
    form.reset();
    form.date.value = getTodayDate();
  }

  return (
    <section className="section" id="tracker">
      <div className="section-title">
        <span>
          <CalendarCheck size={18} /> Daily Tracker
        </span>
        <h2>Track today’s cleaning urge</h2>
        <p>
          Record what happened today. Even a small delay or honest check-in is a
          win.
        </p>
      </div>

      <form className="tracker-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Date
            <input type="date" name="date" defaultValue={getTodayDate()} />
          </label>

          <label>
            Urge Level: 1 to 10
            <input
              type="number"
              name="urgeLevel"
              min="1"
              max="10"
              required
              placeholder="Example: 7"
            />
          </label>

          <label>
            Anxiety Level: 1 to 10
            <input
              type="number"
              name="anxietyLevel"
              min="1"
              max="10"
              required
              placeholder="Example: 8"
            />
          </label>

          <label>
            Trigger
            <input
              type="text"
              name="trigger"
              required
              placeholder="Dust, clothes, bathroom..."
            />
          </label>

          <label>
            Cleaning Minutes
            <input
              type="number"
              name="cleaningMinutes"
              min="0"
              required
              placeholder="Example: 30"
            />
          </label>

          <label>
            Delay Minutes
            <input
              type="number"
              name="delayMinutes"
              min="0"
              required
              placeholder="Example: 5"
            />
          </label>

          <label>
            Mood After
            <select name="mood" required>
              <option value="">Choose mood</option>
              <option value="Proud">Proud</option>
              <option value="Calm">Calm</option>
              <option value="Okay">Okay</option>
              <option value="Tired">Tired</option>
              <option value="Anxious">Anxious</option>
            </select>
          </label>
        </div>

        <label>
          Private Note
          <textarea
            name="note"
            rows="4"
            placeholder="What happened? What small win happened today?"
          ></textarea>
        </label>

        <button className="primary-btn form-btn" type="submit">
          <Save size={18} />
          Save Check-in
        </button>
      </form>
    </section>
  );
}

export default DailyCheckIn;