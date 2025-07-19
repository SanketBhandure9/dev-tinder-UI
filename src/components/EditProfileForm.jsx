import React from "react";

const EditProfileForm = ({
  fields,
  setFields,
  skills,
  setSkills,
  skillInput,
  setSkillInput,
  skillError,
  addSkill,
  removeSkill,
  handleSkillInputKeyDown,
  error,
  saveProfile,
}) => (
  <div className="bg-white rounded-xl shadow-xl p-4 border border-gray-300 w-full max-w-3xl">
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        {/* Skills Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-800 text-sm font-semibold">
              Skills
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="input input-md bg-white border border-gray-400 text-gray-900"
              placeholder="Add a skill and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillInputKeyDown}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm h-[40px] px-4"
              style={{ minHeight: "40px" }}
              onClick={addSkill}
            >
              Add
            </button>
          </div>
          {skillError && (
            <span className="text-xs text-red-500 mt-1">{skillError}</span>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {(skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="badge badge-lg px-3 py-1 bg-blue-100 text-primary border border-blue-300"
              >
                {skill}
                <button
                  type="button"
                  className="ml-1 text-xs text-red-500"
                  onClick={() => removeSkill(idx)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        {(fields || []).map((field, idx) => (
          <div key={field.name} className="form-control">
            <label className="label">
              <span className="label-text text-gray-800 text-sm font-semibold">
                {field.label}
              </span>
            </label>
            {field.type === "textarea" ? (
              <>
                <textarea
                  className="textarea textarea-md bg-white border border-gray-400 text-gray-900 resize-none"
                  placeholder={field.placeholder}
                  value={field.value}
                  maxLength={field.maxLength}
                  rows={4}
                  onChange={(e) =>
                    setFields((prev) =>
                      prev.map((f, i) =>
                        i === idx ? { ...f, value: e.target.value } : f
                      )
                    )
                  }
                />
                <span className="text-xs text-gray-500 text-right">
                  {field.value.length}/{field.maxLength}
                </span>
              </>
            ) : (
              <input
                type={field.type}
                className="input input-md bg-white border border-gray-400 text-gray-900"
                placeholder={field.placeholder}
                value={field.value}
                min={field.min}
                max={field.max}
                onChange={(e) =>
                  setFields((prev) =>
                    prev.map((f, i) =>
                      i === idx ? { ...f, value: e.target.value } : f
                    )
                  )
                }
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        {fields.find((f) => f.name === "photoUrl")?.value.startsWith("http") ? (
          <img
            src={fields.find((f) => f.name === "photoUrl")?.value}
            alt="Preview"
            className="w-48 h-60 object-cover rounded-2xl shadow-lg border-2 border-primary"
          />
        ) : (
          <div className="w-48 h-60 flex items-center justify-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400">
            No Photo
          </div>
        )}
      </div>
    </form>
    {error && (
      <p className="text-red-500 text-center text-sm animate-pulse font-semibold mt-4">
        {error}
      </p>
    )}
    <div className="flex justify-center mt-5">
      <button
        className="btn btn-primary px-6"
        onClick={saveProfile}
        type="button"
      >
        Save Profile
      </button>
    </div>
  </div>
);

export default EditProfileForm;
