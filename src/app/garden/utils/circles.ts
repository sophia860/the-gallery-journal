// Circles system for The Garden
import { storage } from './storage';

export interface Circle {
  id: string;
  name: string;
  description: string;
  members: string[]; // array of user IDs
  maxMembers: number;
  createdBy: string;
  createdAt: string;
}

const CIRCLES_KEY = 'garden_circles';

export const circlesService = {
  // Get all circles
  getAllCircles: (): Circle[] => {
    return storage.get<Circle[]>(CIRCLES_KEY) || [];
  },

  // Get circles where user is a member
  getUserCircles: (userId: string): Circle[] => {
    const allCircles = circlesService.getAllCircles();
    return allCircles.filter(circle => circle.members.includes(userId));
  },

  // Get circle by ID
  getCircleById: (circleId: string): Circle | null => {
    const allCircles = circlesService.getAllCircles();
    return allCircles.find(circle => circle.id === circleId) || null;
  },

  // Create new circle
  createCircle: (
    name: string,
    description: string,
    createdBy: string,
    maxMembers: number = 12
  ): Circle => {
    const allCircles = circlesService.getAllCircles();

    const newCircle: Circle = {
      id: `circle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      members: [createdBy], // Creator is automatically a member
      maxMembers,
      createdBy,
      createdAt: new Date().toISOString()
    };

    allCircles.push(newCircle);
    storage.set(CIRCLES_KEY, allCircles);

    return newCircle;
  },

  // Add member to circle
  addMember: (circleId: string, userId: string): { success: boolean; error?: string } => {
    const allCircles = circlesService.getAllCircles();
    const circleIndex = allCircles.findIndex(circle => circle.id === circleId);

    if (circleIndex === -1) {
      return { success: false, error: 'Circle not found' };
    }

    const circle = allCircles[circleIndex];

    if (circle.members.includes(userId)) {
      return { success: false, error: 'User already in circle' };
    }

    if (circle.members.length >= circle.maxMembers) {
      return { success: false, error: 'Circle is full' };
    }

    circle.members.push(userId);
    storage.set(CIRCLES_KEY, allCircles);

    return { success: true };
  },

  // Remove member from circle
  removeMember: (circleId: string, userId: string): boolean => {
    const allCircles = circlesService.getAllCircles();
    const circleIndex = allCircles.findIndex(circle => circle.id === circleId);

    if (circleIndex === -1) return false;

    const circle = allCircles[circleIndex];
    circle.members = circle.members.filter(id => id !== userId);
    
    storage.set(CIRCLES_KEY, allCircles);
    return true;
  },

  // Delete circle
  deleteCircle: (circleId: string): boolean => {
    const allCircles = circlesService.getAllCircles();
    const filteredCircles = allCircles.filter(circle => circle.id !== circleId);

    if (filteredCircles.length === allCircles.length) return false;

    storage.set(CIRCLES_KEY, filteredCircles);
    return true;
  }
};
