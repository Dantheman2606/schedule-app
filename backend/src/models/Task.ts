import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  taskId: string;
  userId: mongoose.Types.ObjectId;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  color: string;
  icon?: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  taskId: {
    type: String,
    unique: true,
    index: true,
    default: function() {
      // Generate a unique taskId: userId_timestamp_random
      return `${this.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  color: {
    type: String,
    required: true,
    default: '#6366f1'
  },
  icon: {
    type: String
  },
  date: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

TaskSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export default mongoose.model<ITask>('Task', TaskSchema);
