import React, { useState, useEffect } from 'react';
import { type Task, type CreateTaskInput } from '../../types/task.types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ColorPicker } from '../ui/ColorPicker';
import { validateTaskTitle, validateTaskTime, validateDescription } from '../../utils/validationUtils';
import './TaskForm.css';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: CreateTaskInput) => Promise<void>;
  initialData?: Task | null;
  defaultStartTime?: string;
  date: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultStartTime = '09:00',
  date,
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setDescription(initialData.description || '');
      setColor(initialData.color);
    } else if (defaultStartTime) {
      setStartTime(defaultStartTime);
      // Calculate end time as 1 hour after start
      const [hours, minutes] = defaultStartTime.split(':').map(Number);
      const endHour = (hours + 1) % 24;
      setEndTime(`${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    }
  }, [initialData, defaultStartTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    const titleValidation = validateTaskTitle(title);
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.message!;
    }

    const timeValidation = validateTaskTime(startTime, endTime);
    if (!timeValidation.isValid) {
      newErrors.time = timeValidation.message!;
    }

    const descriptionValidation = validateDescription(description);
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.message!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title,
        startTime,
        endTime,
        description: description || undefined,
        color,
        date,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setStartTime(defaultStartTime);
    setEndTime('10:00');
    setDescription('');
    setColor('#6366f1');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? 'Edit Task' : 'Create Task'}
    >
      <form onSubmit={handleSubmit} className="task-form">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          error={errors.title}
          maxLength={100}
        />

        <div className="task-form-row">
          <Input
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            error={errors.time}
          />
          <Input
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="input-container">
          <label className="input-label">Description (optional)</label>
          <textarea
            className="task-form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            maxLength={500}
            rows={3}
          />
          {errors.description && (
            <span className="input-error-message">{errors.description}</span>
          )}
        </div>

        <ColorPicker selectedColor={color} onChange={setColor} />

        <div className="task-form-actions">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
