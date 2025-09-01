import { Workspace, Page } from '../lib/types';
import { generatePageId, createEmptyBlock, createHeadingBlock, createListBlock, createCalloutBlock } from '../lib/editor-utils';
import { templates } from './templates';

export function createSampleWorkspace(): Workspace {
  const welcomePageId = generatePageId();
  const gettingStartedId = generatePageId();
  const teamProjectId = generatePageId();
  const personalNotesId = generatePageId();

  const welcomePage: Page = {
    id: welcomePageId,
    title: 'Welcome to Your Workspace',
    blocks: [
      createHeadingBlock(1, 'Welcome to Your Productivity Workspace! 🎉'),
      createCalloutBlock(
        'This is your personal productivity workspace. Create pages, organize your thoughts, and build your knowledge base.',
        'info'
      ),
      createHeadingBlock(2, 'Getting Started'),
      {
        ...createEmptyBlock('paragraph'),
        content: 'This workspace comes pre-configured with some sample pages to help you get started. Feel free to explore, edit, or delete these pages as you build your own workspace.',
      },
      createHeadingBlock(2, 'Key Features'),
      createListBlock('bulletList', [
        'Block-based editor with drag and drop functionality',
        'Hierarchical page organization',
        'Rich text editing with markdown shortcuts',
        'Search across all your pages',
        'Templates for common use cases',
        'Local data persistence with export/import'
      ]),
      createHeadingBlock(2, 'Quick Tips'),
      createListBlock('numberedList', [
        'Type "/" to open the block menu and add different content types',
        'Use "Ctrl+/" or "Cmd+/" to search across all pages',
        'Drag blocks by their handle to reorder them',
        'Click the "+" button next to any page to create a sub-page',
        'Star pages to add them to your favorites for quick access'
      ]),
      createCalloutBlock(
        'Start by creating your first page using the "New Page" button in the sidebar, or try one of our templates!',
        'success'
      ),
    ],
    properties: {
      icon: '👋',
      isFavorite: true,
      tags: ['welcome', 'getting-started'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const gettingStartedPage: Page = {
    id: gettingStartedId,
    title: 'Getting Started Guide',
    blocks: [
      createHeadingBlock(1, 'Getting Started with Your Workspace'),
      createHeadingBlock(2, 'Creating Your First Page'),
      {
        ...createEmptyBlock('paragraph'),
        content: 'Creating a new page is simple. Click the "New Page" button in the sidebar or use the keyboard shortcut Ctrl+N (Cmd+N on Mac).',
      },
      createHeadingBlock(2, 'Understanding Blocks'),
      {
        ...createEmptyBlock('paragraph'),
        content: 'Everything in your workspace is made up of blocks. Each piece of content - whether it\'s text, a heading, a list, or an image - is a separate block that you can move, edit, and format independently.',
      },
      createHeadingBlock(3, 'Block Types'),
      createListBlock('bulletList', [
        'Text blocks for paragraphs and basic content',
        'Heading blocks (H1, H2, H3) for structure',
        'List blocks (bulleted, numbered, and check lists)',
        'Quote blocks for highlighting important content',
        'Code blocks for technical documentation',
        'Callout blocks for important notes and warnings'
      ]),
      createHeadingBlock(2, 'Organizing Your Content'),
      {
        ...createEmptyBlock('paragraph'),
        content: 'Use the sidebar to organize your pages. You can create nested pages, move pages around, and use favorites to keep important pages easily accessible.',
      },
      createCalloutBlock(
        'Pro Tip: Use the search feature (Ctrl+/ or Cmd+/) to quickly find any page or content in your workspace.',
        'info'
      ),
    ],
    parentId: welcomePageId,
    properties: {
      icon: '🚀',
      tags: ['guide', 'tutorial'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const teamProjectPage: Page = {
    id: teamProjectId,
    title: 'Q4 Team Project Planning',
    blocks: [
      createHeadingBlock(1, 'Q4 Team Project Planning 📋'),
      createCalloutBlock(
        'Project timeline: October - December 2024',
        'info'
      ),
      createHeadingBlock(2, 'Project Overview'),
      {
        ...createEmptyBlock('paragraph'),
        content: 'This quarter we\'re focusing on improving our product\'s user experience and implementing new features based on customer feedback.',
      },
      createHeadingBlock(2, 'Team Members'),
      createListBlock('bulletList', [
        'Sarah Johnson - Project Manager',
        'Mike Chen - Lead Developer', 
        'Emma Williams - UX Designer',
        'David Rodriguez - QA Engineer',
        'Lisa Park - DevOps Engineer'
      ]),
      createHeadingBlock(2, 'Key Milestones'),
      createListBlock('checkList', [
        'Requirements gathering and analysis - Week 1-2',
        'Design mockups and user testing - Week 3-4', 
        'Development phase 1 - Week 5-8',
        'Development phase 2 - Week 9-10',
        'QA testing and bug fixes - Week 11-12',
        'Production deployment - Week 13'
      ]),
      createHeadingBlock(2, 'Success Metrics'),
      createListBlock('numberedList', [
        'Reduce user onboarding time by 30%',
        'Increase user engagement by 25%',
        'Improve customer satisfaction score to 4.5/5',
        'Achieve 99.9% uptime during launch period'
      ]),
      createCalloutBlock(
        'Remember: Weekly check-ins every Friday at 2 PM to review progress and address blockers.',
        'warning'
      ),
    ],
    properties: {
      icon: '📊',
      tags: ['project', 'team', 'planning', 'Q4'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const personalNotesPage: Page = {
    id: personalNotesId,
    title: 'Personal Development Notes',
    blocks: [
      createHeadingBlock(1, 'Personal Development Journey 🌱'),
      createHeadingBlock(2, 'Current Focus Areas'),
      createListBlock('bulletList', [
        'Improving public speaking skills',
        'Learning advanced React patterns',
        'Building better work-life balance',
        'Developing leadership capabilities'
      ]),
      createHeadingBlock(2, 'Recent Learnings'),
      {
        ...createEmptyBlock('paragraph'),
        content: 'This week I completed an online course on effective communication. Key takeaway: Active listening is just as important as clear speaking.',
      },
      createHeadingBlock(2, 'Books to Read'),
      createListBlock('checkList', [
        'The Pragmatic Programmer - Andy Hunt',
        'Atomic Habits - James Clear',
        'The Manager\'s Path - Camille Fournier',
        'Deep Work - Cal Newport'
      ]),
      createHeadingBlock(2, 'Goals for Next Month'),
      createListBlock('numberedList', [
        'Give a presentation at the team meeting',
        'Finish the React advanced patterns course',
        'Start mentoring a junior developer',
        'Implement one new productivity technique'
      ]),
      createCalloutBlock(
        'Remember: Progress over perfection. Small consistent steps lead to big changes.',
        'success'
      ),
    ],
    properties: {
      icon: '🎯',
      isFavorite: true,
      tags: ['personal', 'development', 'goals'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    id: 'workspace_default',
    name: 'My Workspace',
    pages: [welcomePage, gettingStartedPage, teamProjectPage, personalNotesPage],
    recentPages: [welcomePageId, teamProjectId],
    favoritePages: [welcomePageId, personalNotesId],
    templates,
  };
}