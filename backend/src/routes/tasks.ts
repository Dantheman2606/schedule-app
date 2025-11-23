import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get tasks for a specific date
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const tasks = await Task.find({
      userId: req.userId,
      date: date as string
    }).sort({ startTime: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, startTime, endTime, description, color, icon, date } = req.body;

    console.log('POST /tasks called with:', req.body);

    // Validation
    if (!title || !startTime || !endTime || !date) {
      return res.status(400).json({ message: 'Title, start time, end time, and date are required' });
    }

    if (title.length > 100) {
      return res.status(400).json({ message: 'Title must be less than 100 characters' });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description must be less than 500 characters' });
    }

    // Check if end time is after start time
    if (endTime <= startTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Check for overlaps
    const overlappingTasks = await Task.find({
      userId: req.userId,
      date: date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    // Create task
    const task = new Task({
      userId: req.userId,
      title,
      startTime,
      endTime,
      description,
      color: color || '#6366f1',
      icon,
      date
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, startTime, endTime, description, color, icon } = req.body;

    console.log('PATCH /tasks/:id called with:', { id, body: req.body });

    // Check if id is a valid ObjectId or a taskId string
    let query;
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      // It's a valid MongoDB ObjectId
      query = { 
        $or: [{ _id: id }, { taskId: id }],
        userId: req.userId 
      };
    } else {
      // It's a taskId string
      query = { 
        taskId: id,
        userId: req.userId 
      };
    }

    // Find task and verify ownership
    const task = await Task.findOne(query);
    if (!task) {
      console.log('Task not found:', id);
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Found task to update:', task);

    // Validation
    if (title && title.length > 100) {
      return res.status(400).json({ message: 'Title must be less than 100 characters' });
    }

    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description must be less than 500 characters' });
    }

    if (startTime && endTime && endTime <= startTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Build update object with only provided fields
    const updateFields: any = { updatedAt: new Date() };
    if (title !== undefined) updateFields.title = title;
    if (startTime !== undefined) updateFields.startTime = startTime;
    if (endTime !== undefined) updateFields.endTime = endTime;
    if (description !== undefined) updateFields.description = description;
    if (color !== undefined) updateFields.color = color;
    if (icon !== undefined) updateFields.icon = icon;

    // Use findOneAndUpdate to avoid re-running default functions
    const updatedTask = await Task.findOneAndUpdate(
      query,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    console.log('Task updated successfully:', updatedTask);

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    console.log('DELETE /tasks/:id called with:', { id, userId: req.userId });

    // Check if id is a valid ObjectId or a taskId string
    let query;
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      // It's a valid MongoDB ObjectId
      query = { 
        $or: [{ _id: id }, { taskId: id }],
        userId: req.userId 
      };
    } else {
      // It's a taskId string
      query = { 
        taskId: id,
        userId: req.userId 
      };
    }

    // Use findOneAndDelete to find and delete in one operation
    const deletedTask = await Task.findOneAndDelete(query);

    if (!deletedTask) {
      console.log('Task not found for deletion:', id);
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task deleted successfully:', deletedTask._id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
