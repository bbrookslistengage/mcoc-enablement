import {type ReactNode, useState, useEffect, useCallback} from 'react';

type CheckboxType = 'lesson' | 'assignment';

function storageKey(moduleSlug: string, type: CheckboxType): string {
  return `progress:${moduleSlug}:${type}`;
}

function readProgress(moduleSlug: string, type: CheckboxType): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(storageKey(moduleSlug, type)) === 'true';
}

function writeProgress(
  moduleSlug: string,
  type: CheckboxType,
  value: boolean,
): void {
  if (typeof window === 'undefined') return;
  if (value) {
    localStorage.setItem(storageKey(moduleSlug, type), 'true');
  } else {
    localStorage.removeItem(storageKey(moduleSlug, type));
  }
  window.dispatchEvent(new Event('progress-updated'));
}

interface ProgressCheckboxProps {
  moduleSlug: string;
}

export default function ProgressCheckbox({
  moduleSlug,
}: ProgressCheckboxProps): ReactNode {
  const [lessonDone, setLessonDone] = useState(false);
  const [assignmentDone, setAssignmentDone] = useState(false);

  useEffect(() => {
    setLessonDone(readProgress(moduleSlug, 'lesson'));
    setAssignmentDone(readProgress(moduleSlug, 'assignment'));
  }, [moduleSlug]);

  const toggleLesson = useCallback(() => {
    const next = !lessonDone;
    setLessonDone(next);
    writeProgress(moduleSlug, 'lesson', next);
  }, [lessonDone, moduleSlug]);

  const toggleAssignment = useCallback(() => {
    const next = !assignmentDone;
    setAssignmentDone(next);
    writeProgress(moduleSlug, 'assignment', next);
  }, [assignmentDone, moduleSlug]);

  return (
    <div className="module-footer__checkboxes">
      <label
        className={`module-footer__checkbox${lessonDone ? ' module-footer__checkbox--checked' : ''}`}
      >
        <input
          type="checkbox"
          checked={lessonDone}
          onChange={toggleLesson}
        />
        Lesson complete
      </label>
      <label
        className={`module-footer__checkbox${assignmentDone ? ' module-footer__checkbox--checked' : ''}`}
      >
        <input
          type="checkbox"
          checked={assignmentDone}
          onChange={toggleAssignment}
        />
        Assignment complete
      </label>
    </div>
  );
}

export {readProgress, writeProgress, storageKey};
export type {CheckboxType};
