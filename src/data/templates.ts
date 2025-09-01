import { Template } from '../lib/types';

export const templates: Template[] = [
  {
    id: 'template_meeting_notes',
    name: 'Meeting Notes',
    description: 'Structured template for meeting documentation',
    category: 'meeting',
    properties: {
      icon: '📋',
      tags: ['meeting', 'notes'],
    },
    blocks: [
      {
        type: 'heading1',
        content: 'Meeting Notes',
        properties: { level: 1 },
      },
      {
        type: 'heading2',
        content: 'Meeting Details',
        properties: { level: 2 },
      },
      {
        type: 'bulletList',
        content: '',
        properties: {
          listItems: [
            { id: 'item1', content: 'Date: ', indentLevel: 0 },
            { id: 'item2', content: 'Time: ', indentLevel: 0 },
            { id: 'item3', content: 'Attendees: ', indentLevel: 0 },
            { id: 'item4', content: 'Location: ', indentLevel: 0 },
          ],
        },
      },
      {
        type: 'heading2',
        content: 'Agenda',
        properties: { level: 2 },
      },
      {
        type: 'numberedList',
        content: '',
        properties: {
          listItems: [
            { id: 'agenda1', content: 'Item 1', indentLevel: 0 },
            { id: 'agenda2', content: 'Item 2', indentLevel: 0 },
            { id: 'agenda3', content: 'Item 3', indentLevel: 0 },
          ],
        },
      },
      {
        type: 'heading2',
        content: 'Notes',
        properties: { level: 2 },
      },
      {
        type: 'paragraph',
        content: 'Meeting discussion notes...',
        properties: {},
      },
      {
        type: 'heading2',
        content: 'Action Items',
        properties: { level: 2 },
      },
      {
        type: 'checkList',
        content: '',
        properties: {
          listItems: [
            { id: 'action1', content: 'Task 1 - Assigned to:', checked: false, indentLevel: 0 },
            { id: 'action2', content: 'Task 2 - Assigned to:', checked: false, indentLevel: 0 },
          ],
        },
      },
    ],
  },
  {
    id: 'template_project_planning',
    name: 'Project Planning',
    description: 'Comprehensive project planning and tracking template',
    category: 'project',
    properties: {
      icon: '🚀',
      tags: ['project', 'planning'],
    },
    blocks: [
      {
        type: 'heading1',
        content: 'Project Plan',
        properties: { level: 1 },
      },
      {
        type: 'callout',
        content: 'Project overview and key objectives',
        properties: { calloutType: 'info' },
      },
      {
        type: 'heading2',
        content: 'Project Overview',
        properties: { level: 2 },
      },
      {
        type: 'bulletList',
        content: '',
        properties: {
          listItems: [
            { id: 'overview1', content: 'Project Name: ', indentLevel: 0 },
            { id: 'overview2', content: 'Start Date: ', indentLevel: 0 },
            { id: 'overview3', content: 'End Date: ', indentLevel: 0 },
            { id: 'overview4', content: 'Project Manager: ', indentLevel: 0 },
            { id: 'overview5', content: 'Team Members: ', indentLevel: 0 },
          ],
        },
      },
      {
        type: 'heading2',
        content: 'Goals & Objectives',
        properties: { level: 2 },
      },
      {
        type: 'numberedList',
        content: '',
        properties: {
          listItems: [
            { id: 'goal1', content: 'Primary objective', indentLevel: 0 },
            { id: 'goal2', content: 'Secondary objective', indentLevel: 0 },
            { id: 'goal3', content: 'Success metrics', indentLevel: 0 },
          ],
        },
      },
      {
        type: 'heading2',
        content: 'Timeline & Milestones',
        properties: { level: 2 },
      },
      {
        type: 'checkList',
        content: '',
        properties: {
          listItems: [
            { id: 'milestone1', content: 'Phase 1: Planning - Week 1-2', checked: false, indentLevel: 0 },
            { id: 'milestone2', content: 'Phase 2: Development - Week 3-6', checked: false, indentLevel: 0 },
            { id: 'milestone3', content: 'Phase 3: Testing - Week 7-8', checked: false, indentLevel: 0 },
            { id: 'milestone4', content: 'Phase 4: Deployment - Week 9', checked: false, indentLevel: 0 },
          ],
        },
      },
      {
        type: 'heading2',
        content: 'Resources & Budget',
        properties: { level: 2 },
      },
      {
        type: 'paragraph',
        content: 'Resource allocation and budget details...',
        properties: {},
      },
    ],
  },
  {
    id: 'template_daily_journal',
    name: 'Daily Journal',
    description: 'Personal daily reflection and planning template',
    category: 'personal',
    properties: {
      icon: '📝',
      tags: ['journal', 'daily', 'personal'],
    },
    blocks: [
      {
        type: 'heading1',
        content: 'Daily Journal - [Date]',
        properties: { level: 1 },
      },
      {
        type: 'heading2',
        content: 'Today\'s Priorities',
        properties: { level: 2 },
      },
      {
        type: 'checkList',
        content: '',
        properties: {
          listItems: [
            { id: 'priority1', content: 'Most important task', checked: false, indentLevel: 0 },
            { id: 'priority2', content: 'Second priority', checked: false, indentLevel: 0 },
            { id: 'priority3', content: 'Third priority', checked: false, indentLevel: 0 },
          ],
        },
      },
      {
        type: 'heading2',
        content: 'Reflections',
        properties: { level: 2 },
      },
      {
        type: 'paragraph',
        content: 'What went well today?',
        properties: {},
      },
      {
        type: 'paragraph',
        content: 'What could be improved?',
        properties: {},
      },
      {
        type: 'paragraph',
        content: 'Key learnings or insights:',
        properties: {},
      },
      {
        type: 'heading2',
        content: 'Tomorrow\'s Goals',
        properties: { level: 2 },
      },
      {
        type: 'bulletList',
        content: '',
        properties: {
          listItems: [
            { id: 'tomorrow1', content: 'Goal 1', indentLevel: 0 },
            { id: 'tomorrow2', content: 'Goal 2', indentLevel: 0 },
            { id: 'tomorrow3', content: 'Goal 3', indentLevel: 0 },
          ],
        },
      },
    ],
  },
  {
    id: 'template_knowledge_base',
    name: 'Knowledge Base Article',
    description: 'Structured template for documentation and knowledge sharing',
    category: 'knowledge',
    properties: {
      icon: '📚',
      tags: ['documentation', 'knowledge', 'guide'],
    },
    blocks: [
      {
        type: 'heading1',
        content: 'Knowledge Base Article',
        properties: { level: 1 },
      },
      {
        type: 'callout',
        content: 'Brief overview of what this article covers',
        properties: { calloutType: 'info' },
      },
      {
        type: 'heading2',
        content: 'Overview',
        properties: { level: 2 },
      },
      {
        type: 'paragraph',
        content: 'Provide a clear overview of the topic...',
        properties: {},
      },
      {
        type: 'heading2',
        content: 'Prerequisites',
        properties: { level: 2 },
      },
      {
        type: 'bulletList',
        content: '',
        properties: {
          listItems: [
            { id: 'prereq1', content: 'Prerequisite 1', indentLevel: 0 },
            { id: 'prereq2', content: 'Prerequisite 2', indentLevel: 0 },
          ],
        },
      },
      {
        type: 'heading2',
        content: 'Step-by-Step Guide',
        properties: { level: 2 },
      },
      {
        type: 'numberedList',
        content: '',
        properties: {
          listItems: [
            { id: 'step1', content: 'First step description', indentLevel: 0 },
            { id: 'step2', content: 'Second step description', indentLevel: 0 },
            { id: 'step3', content: 'Third step description', indentLevel: 0 },
          ],
        },
      },
      {
        type: 'heading2',
        content: 'Code Example',
        properties: { level: 2 },
      },
      {
        type: 'code',
        content: '// Example code snippet\nfunction example() {\n  console.log("Hello, World!");\n}',
        properties: { language: 'javascript' },
      },
      {
        type: 'heading2',
        content: 'Best Practices',
        properties: { level: 2 },
      },
      {
        type: 'bulletList',
        content: '',
        properties: {
          listItems: [
            { id: 'practice1', content: 'Best practice 1', indentLevel: 0 },
            { id: 'practice2', content: 'Best practice 2', indentLevel: 0 },
          ],
        },
      },
      {
        type: 'callout',
        content: 'Important note or warning about this topic',
        properties: { calloutType: 'warning' },
      },
    ],
  },
  {
    id: 'template_blank',
    name: 'Blank Page',
    description: 'Start with a clean slate',
    category: 'general',
    properties: {
      icon: '📄',
      tags: ['blank', 'empty'],
    },
    blocks: [
      {
        type: 'paragraph',
        content: '',
        properties: {},
      },
    ],
  },
];